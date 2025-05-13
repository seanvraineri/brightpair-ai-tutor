-- lessons table to store JSON package
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references auth.users on delete cascade,
  skill_id   uuid references skills(id),
  title      text,
  duration   int2,                        -- minutes 5-8
  lesson_json jsonb,
  created_at timestamptz default now()
);

-- Add RLS policies for lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own lessons
CREATE POLICY "Users can view own lessons"
  ON public.lessons
  FOR SELECT
  USING (auth.uid() = student_id);

-- Allow service role to insert lessons
CREATE POLICY "Service role can insert lessons"
  ON public.lessons
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = student_id);

-- lesson_results to score exit quiz
create table if not exists lesson_results (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references auth.users on delete cascade,
  skill_id   uuid references skills(id),
  difficulty text check (difficulty in ('easy','med','hard')),
  score int2,
  confidence int2,
  response_ms int4,
  created_at timestamptz default now()
);

-- Add RLS policies for lesson_results
ALTER TABLE public.lesson_results ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own lesson results
CREATE POLICY "Users can view own lesson results"
  ON public.lesson_results
  FOR SELECT
  USING (auth.uid() = student_id);

-- Allow users to insert their own lesson results
CREATE POLICY "Users can insert own lesson results"
  ON public.lesson_results
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- nightly mastery decay job helper
create or replace function decay_mastery() returns void language sql as $$
  update student_skills
  set mastery_level = greatest(0.01, mastery_level - 0.01)
  where mastery_level > 0.3;
$$;

-- RPC to update mastery
create or replace function update_student_skill(p_student uuid, p_skill uuid, p_delta numeric)
returns void language sql as $$
  insert into student_skills (student_id, skill_id, mastery_level)
  values (p_student, p_skill, 0.5 + p_delta)
  on conflict (student_id, skill_id)
  do update set mastery_level = greatest(0.01, least(0.99, student_skills.mastery_level + p_delta));
$$;

-- Function to build a snapshot of student data for the AI system
create or replace function build_student_snapshot(p_student uuid)
returns json language sql as $$
  select json_build_object(
    'student_id', u.id,
    'name', u.raw_user_meta_data->>'full_name',
    'learning_style', coalesce(g.learning_style, 'visual'),
    'goals', coalesce(g.learning_goals, array['Improve understanding']),
    'lowest_mastery', (
      select json_agg(json_build_object(
        'skill_id', s.id,
        'name', s.name,
        'mastery', ss.mastery_level
      ))
      from student_skills ss
      join skills s on ss.skill_id = s.id
      where ss.student_id = p_student
      order by ss.mastery_level asc
      limit 3
    ),
    'current_track', (
      select json_build_object(
        'id', lt.id,
        'name', lt.name
      )
      from learning_tracks lt
      join student_tracks st on lt.id = st.track_id
      where st.student_id = p_student
      limit 1
    ),
    'deadline_days', (
      select extract(day from (deadline - now()))::int
      from student_tracks
      where student_id = p_student
      limit 1
    )
  )
  from auth.users u
  left join user_gamification g on u.id = g.user_id
  where u.id = p_student;
$$;

-- Function to get topic passages for a skill
create or replace function topic_passages_for_skill(p_student uuid, p_skill uuid)
returns json language sql as $$
  select coalesce(
    json_agg(
      json_build_object(
        'title', tp.title,
        'content', tp.content
      )
    ),
    '[]'::json
  )
  from topic_passages tp
  join skills s on tp.skill_id = s.id
  where tp.skill_id = p_skill
  limit 5;
$$;

-- Function to get recent errors for a skill
create or replace function recent_errors(p_student uuid, p_skill uuid)
returns json language sql as $$
  select coalesce(
    json_agg(
      json_build_object(
        'question', q.stem,
        'answer', q.answer,
        'student_answer', qa.student_answer,
        'timestamp', qa.created_at
      )
    ),
    '[]'::json
  )
  from quiz_answers qa
  join quiz_questions q on qa.question_id = q.id
  where qa.student_id = p_student
    and q.skill_id = p_skill
    and qa.is_correct = false
  order by qa.created_at desc
  limit 3;
$$; 