create extension if not exists "vector" with schema "public" version '0.8.0';

create type "public"."role_type" as enum ('student', 'tutor', 'parent');

drop policy "ins_quizzes_tutor" on "public"."quizzes";

drop policy "sel_quizzes" on "public"."quizzes";

drop policy "upd_quizzes_student" on "public"."quizzes";

drop policy "sel_assignments_teacher" on "public"."assignments";

alter table "public"."profiles" drop constraint "profiles_email_key";

alter table "public"."profiles" drop constraint "profiles_onboarding_status_check";

alter table "public"."profiles" drop constraint "profiles_role_check";

alter table "public"."quizzes" drop constraint "quizzes_tutor_id_fkey";

alter table "public"."chat_logs" drop constraint "chat_logs_student_id_fkey";

alter table "public"."lessons" drop constraint "lessons_student_id_fkey";

alter table "public"."quizzes" drop constraint "quizzes_student_id_fkey";

alter table "public"."student_skills" drop constraint "student_skills_student_id_fkey";

alter table "public"."student_tracks" drop constraint "student_tracks_student_id_fkey";

alter table "public"."student_skills" drop constraint "student_skills_pkey";

alter table "public"."student_tracks" drop constraint "student_tracks_pkey";

drop index if exists "public"."profiles_email_key";

drop index if exists "public"."student_skills_pkey";

drop index if exists "public"."student_tracks_pkey";

create table "public"."parent_students" (
    "parent_id" uuid not null,
    "student_id" uuid not null,
    "assigned_at" timestamp with time zone default now()
);


alter table "public"."parent_students" enable row level security;

create table "public"."skills" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "track_id" uuid
);


alter table "public"."skills" enable row level security;

create table "public"."topics" (
    "id" uuid not null default gen_random_uuid(),
    "track_id" uuid,
    "title" text not null,
    "content" text,
    "embedding" vector(1536)
);


alter table "public"."topics" enable row level security;

create table "public"."tutor_students" (
    "tutor_id" uuid not null,
    "student_id" uuid not null,
    "assigned_at" timestamp with time zone default now()
);


alter table "public"."tutor_students" enable row level security;

create table "public"."user_gamification" (
    "user_id" uuid not null,
    "learning_style" text default 'visual'::text,
    "learning_goals" text[] default ARRAY['Improve understanding'::text]
);


create table "public"."user_roles" (
    "user_id" uuid not null,
    "role" role_type not null
);


alter table "public"."user_roles" enable row level security;

alter table "public"."chat_logs" alter column "created_at" drop not null;

alter table "public"."chat_logs" alter column "student_id" drop not null;

alter table "public"."homework" add column "description" text;

alter table "public"."homework" add column "documents" jsonb;

alter table "public"."homework" add column "due_date" timestamp with time zone;

alter table "public"."homework" add column "num_questions" integer;

alter table "public"."homework" add column "questions" jsonb;

alter table "public"."homework" add column "source_pdf_provided" boolean;

alter table "public"."homework" add column "subject" text not null;

alter table "public"."homework" add column "track_id" uuid;

alter table "public"."homework" add column "updated_at" timestamp with time zone not null default now();

alter table "public"."homework" alter column "created_at" set not null;

alter table "public"."homework" alter column "status" set default 'pending'::text;

alter table "public"."homework" alter column "status" set not null;

alter table "public"."homework" alter column "student_id" set not null;

alter table "public"."learning_tracks" add column "description" text;

alter table "public"."learning_tracks" add column "tutor_id" uuid;

alter table "public"."learning_tracks" alter column "created_at" drop not null;

alter table "public"."learning_tracks" enable row level security;

alter table "public"."lessons" add column "content" text;

alter table "public"."lessons" add column "notes" text;

alter table "public"."lessons" add column "resources" jsonb;

alter table "public"."lessons" add column "status" text not null default 'planned'::text;

alter table "public"."lessons" add column "track_id" uuid;

alter table "public"."lessons" alter column "subject" set not null;

alter table "public"."profiles" drop column "grade";

alter table "public"."profiles" drop column "learning_preferences";

alter table "public"."profiles" add column "full_name" text;

alter table "public"."profiles" alter column "email" set not null;

alter table "public"."profiles" alter column "id" drop default;

alter table "public"."profiles" alter column "is_staff" set not null;

alter table "public"."profiles" alter column "onboarding_status" set not null;

alter table "public"."profiles" alter column "role" set default 'student'::text;

alter table "public"."profiles" enable row level security;

alter table "public"."quizzes" drop column "tutor_id";

alter table "public"."quizzes" add column "answers" jsonb;

alter table "public"."quizzes" add column "questions" jsonb;

alter table "public"."quizzes" add column "score" numeric;

alter table "public"."quizzes" add column "subject" text not null;

alter table "public"."quizzes" add column "title" text not null;

alter table "public"."quizzes" add column "track_id" uuid;

alter table "public"."quizzes" alter column "quiz_json" set default '{}'::jsonb;

alter table "public"."student_skills" drop column "id";

alter table "public"."student_skills" drop column "updated_at";

alter table "public"."student_skills" add column "last_assessed" timestamp with time zone default now();

alter table "public"."student_skills" alter column "mastery_level" set default 0;

alter table "public"."student_skills" alter column "mastery_level" drop not null;

alter table "public"."student_skills" alter column "mastery_level" set data type double precision using "mastery_level"::double precision;

alter table "public"."student_tracks" drop column "created_at";

alter table "public"."student_tracks" drop column "deadline";

alter table "public"."student_tracks" drop column "id";

alter table "public"."student_tracks" add column "completed_at" timestamp with time zone;

alter table "public"."student_tracks" add column "progress" double precision default 0;

alter table "public"."student_tracks" add column "started_at" timestamp with time zone default now();

alter table "public"."student_tracks" enable row level security;

CREATE UNIQUE INDEX parent_students_pkey ON public.parent_students USING btree (parent_id, student_id);

CREATE UNIQUE INDEX skills_pkey ON public.skills USING btree (id);

CREATE UNIQUE INDEX topics_pkey ON public.topics USING btree (id);

CREATE UNIQUE INDEX tutor_students_pkey ON public.tutor_students USING btree (tutor_id, student_id);

CREATE UNIQUE INDEX user_gamification_pkey ON public.user_gamification USING btree (user_id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_id, role);

CREATE UNIQUE INDEX student_skills_pkey ON public.student_skills USING btree (student_id, skill_id);

CREATE UNIQUE INDEX student_tracks_pkey ON public.student_tracks USING btree (student_id, track_id);

alter table "public"."parent_students" add constraint "parent_students_pkey" PRIMARY KEY using index "parent_students_pkey";

alter table "public"."skills" add constraint "skills_pkey" PRIMARY KEY using index "skills_pkey";

alter table "public"."topics" add constraint "topics_pkey" PRIMARY KEY using index "topics_pkey";

alter table "public"."tutor_students" add constraint "tutor_students_pkey" PRIMARY KEY using index "tutor_students_pkey";

alter table "public"."user_gamification" add constraint "user_gamification_pkey" PRIMARY KEY using index "user_gamification_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."student_skills" add constraint "student_skills_pkey" PRIMARY KEY using index "student_skills_pkey";

alter table "public"."student_tracks" add constraint "student_tracks_pkey" PRIMARY KEY using index "student_tracks_pkey";

alter table "public"."homework" add constraint "homework_track_id_fkey" FOREIGN KEY (track_id) REFERENCES learning_tracks(id) not valid;

alter table "public"."homework" validate constraint "homework_track_id_fkey";

alter table "public"."learning_tracks" add constraint "learning_tracks_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."learning_tracks" validate constraint "learning_tracks_tutor_id_fkey";

alter table "public"."lessons" add constraint "lessons_track_id_fkey" FOREIGN KEY (track_id) REFERENCES learning_tracks(id) not valid;

alter table "public"."lessons" validate constraint "lessons_track_id_fkey";

alter table "public"."parent_students" add constraint "parent_students_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."parent_students" validate constraint "parent_students_parent_id_fkey";

alter table "public"."parent_students" add constraint "parent_students_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."parent_students" validate constraint "parent_students_student_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."quizzes" add constraint "quizzes_track_id_fkey" FOREIGN KEY (track_id) REFERENCES learning_tracks(id) not valid;

alter table "public"."quizzes" validate constraint "quizzes_track_id_fkey";

alter table "public"."skills" add constraint "skills_track_id_fkey" FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE not valid;

alter table "public"."skills" validate constraint "skills_track_id_fkey";

alter table "public"."student_skills" add constraint "student_skills_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE not valid;

alter table "public"."student_skills" validate constraint "student_skills_skill_id_fkey";

alter table "public"."topics" add constraint "topics_track_id_fkey" FOREIGN KEY (track_id) REFERENCES learning_tracks(id) ON DELETE CASCADE not valid;

alter table "public"."topics" validate constraint "topics_track_id_fkey";

alter table "public"."tutor_students" add constraint "tutor_students_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tutor_students" validate constraint "tutor_students_student_id_fkey";

alter table "public"."tutor_students" add constraint "tutor_students_tutor_id_fkey" FOREIGN KEY (tutor_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tutor_students" validate constraint "tutor_students_tutor_id_fkey";

alter table "public"."user_gamification" add constraint "user_gamification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_gamification" validate constraint "user_gamification_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."chat_logs" add constraint "chat_logs_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."chat_logs" validate constraint "chat_logs_student_id_fkey";

alter table "public"."lessons" add constraint "lessons_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) not valid;

alter table "public"."lessons" validate constraint "lessons_student_id_fkey";

alter table "public"."quizzes" add constraint "quizzes_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) not valid;

alter table "public"."quizzes" validate constraint "quizzes_student_id_fkey";

alter table "public"."student_skills" add constraint "student_skills_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."student_skills" validate constraint "student_skills_student_id_fkey";

alter table "public"."student_tracks" add constraint "student_tracks_student_id_fkey" FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."student_tracks" validate constraint "student_tracks_student_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_roles(user_id uuid)
 RETURNS TABLE(role role_type)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = get_user_roles.user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, NEW.raw_user_meta_data->>'role');
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."parent_students" to "anon";

grant insert on table "public"."parent_students" to "anon";

grant references on table "public"."parent_students" to "anon";

grant select on table "public"."parent_students" to "anon";

grant trigger on table "public"."parent_students" to "anon";

grant truncate on table "public"."parent_students" to "anon";

grant update on table "public"."parent_students" to "anon";

grant delete on table "public"."parent_students" to "authenticated";

grant insert on table "public"."parent_students" to "authenticated";

grant references on table "public"."parent_students" to "authenticated";

grant select on table "public"."parent_students" to "authenticated";

grant trigger on table "public"."parent_students" to "authenticated";

grant truncate on table "public"."parent_students" to "authenticated";

grant update on table "public"."parent_students" to "authenticated";

grant delete on table "public"."parent_students" to "service_role";

grant insert on table "public"."parent_students" to "service_role";

grant references on table "public"."parent_students" to "service_role";

grant select on table "public"."parent_students" to "service_role";

grant trigger on table "public"."parent_students" to "service_role";

grant truncate on table "public"."parent_students" to "service_role";

grant update on table "public"."parent_students" to "service_role";

grant delete on table "public"."skills" to "anon";

grant insert on table "public"."skills" to "anon";

grant references on table "public"."skills" to "anon";

grant select on table "public"."skills" to "anon";

grant trigger on table "public"."skills" to "anon";

grant truncate on table "public"."skills" to "anon";

grant update on table "public"."skills" to "anon";

grant delete on table "public"."skills" to "authenticated";

grant insert on table "public"."skills" to "authenticated";

grant references on table "public"."skills" to "authenticated";

grant select on table "public"."skills" to "authenticated";

grant trigger on table "public"."skills" to "authenticated";

grant truncate on table "public"."skills" to "authenticated";

grant update on table "public"."skills" to "authenticated";

grant delete on table "public"."skills" to "service_role";

grant insert on table "public"."skills" to "service_role";

grant references on table "public"."skills" to "service_role";

grant select on table "public"."skills" to "service_role";

grant trigger on table "public"."skills" to "service_role";

grant truncate on table "public"."skills" to "service_role";

grant update on table "public"."skills" to "service_role";

grant delete on table "public"."topics" to "anon";

grant insert on table "public"."topics" to "anon";

grant references on table "public"."topics" to "anon";

grant select on table "public"."topics" to "anon";

grant trigger on table "public"."topics" to "anon";

grant truncate on table "public"."topics" to "anon";

grant update on table "public"."topics" to "anon";

grant delete on table "public"."topics" to "authenticated";

grant insert on table "public"."topics" to "authenticated";

grant references on table "public"."topics" to "authenticated";

grant select on table "public"."topics" to "authenticated";

grant trigger on table "public"."topics" to "authenticated";

grant truncate on table "public"."topics" to "authenticated";

grant update on table "public"."topics" to "authenticated";

grant delete on table "public"."topics" to "service_role";

grant insert on table "public"."topics" to "service_role";

grant references on table "public"."topics" to "service_role";

grant select on table "public"."topics" to "service_role";

grant trigger on table "public"."topics" to "service_role";

grant truncate on table "public"."topics" to "service_role";

grant update on table "public"."topics" to "service_role";

grant delete on table "public"."tutor_students" to "anon";

grant insert on table "public"."tutor_students" to "anon";

grant references on table "public"."tutor_students" to "anon";

grant select on table "public"."tutor_students" to "anon";

grant trigger on table "public"."tutor_students" to "anon";

grant truncate on table "public"."tutor_students" to "anon";

grant update on table "public"."tutor_students" to "anon";

grant delete on table "public"."tutor_students" to "authenticated";

grant insert on table "public"."tutor_students" to "authenticated";

grant references on table "public"."tutor_students" to "authenticated";

grant select on table "public"."tutor_students" to "authenticated";

grant trigger on table "public"."tutor_students" to "authenticated";

grant truncate on table "public"."tutor_students" to "authenticated";

grant update on table "public"."tutor_students" to "authenticated";

grant delete on table "public"."tutor_students" to "service_role";

grant insert on table "public"."tutor_students" to "service_role";

grant references on table "public"."tutor_students" to "service_role";

grant select on table "public"."tutor_students" to "service_role";

grant trigger on table "public"."tutor_students" to "service_role";

grant truncate on table "public"."tutor_students" to "service_role";

grant update on table "public"."tutor_students" to "service_role";

grant delete on table "public"."user_gamification" to "anon";

grant insert on table "public"."user_gamification" to "anon";

grant references on table "public"."user_gamification" to "anon";

grant select on table "public"."user_gamification" to "anon";

grant trigger on table "public"."user_gamification" to "anon";

grant truncate on table "public"."user_gamification" to "anon";

grant update on table "public"."user_gamification" to "anon";

grant delete on table "public"."user_gamification" to "authenticated";

grant insert on table "public"."user_gamification" to "authenticated";

grant references on table "public"."user_gamification" to "authenticated";

grant select on table "public"."user_gamification" to "authenticated";

grant trigger on table "public"."user_gamification" to "authenticated";

grant truncate on table "public"."user_gamification" to "authenticated";

grant update on table "public"."user_gamification" to "authenticated";

grant delete on table "public"."user_gamification" to "service_role";

grant insert on table "public"."user_gamification" to "service_role";

grant references on table "public"."user_gamification" to "service_role";

grant select on table "public"."user_gamification" to "service_role";

grant trigger on table "public"."user_gamification" to "service_role";

grant truncate on table "public"."user_gamification" to "service_role";

grant update on table "public"."user_gamification" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

create policy "Students can view their chat logs"
on "public"."chat_logs"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Tutors can view student chat logs"
on "public"."chat_logs"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM tutor_students ts
  WHERE ((ts.tutor_id = auth.uid()) AND (ts.student_id = ts.student_id)))));


create policy "Users can create their own homework"
on "public"."homework"
as permissive
for insert
to public
with check ((auth.uid() = student_id));


create policy "Users can update their own homework"
on "public"."homework"
as permissive
for update
to public
using ((auth.uid() = student_id));


create policy "Users can view their own homework"
on "public"."homework"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Students can view tracks assigned to them"
on "public"."learning_tracks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM student_tracks st
  WHERE ((st.track_id = learning_tracks.id) AND (st.student_id = auth.uid())))));


create policy "Tutors can manage their tracks"
on "public"."learning_tracks"
as permissive
for all
to public
using ((auth.uid() = tutor_id));


create policy "Users can view their own lessons"
on "public"."lessons"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Parents can view their students"
on "public"."parent_students"
as permissive
for select
to public
using ((auth.uid() = parent_id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "user_can_delete_own_profile"
on "public"."profiles"
as permissive
for delete
to public
using ((auth.uid() = id));


create policy "user_can_insert_own_profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "user_can_select_own_profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "user_can_update_own_profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can view their own quizzes"
on "public"."quizzes"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Tutors can manage skills"
on "public"."skills"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM learning_tracks lt
  WHERE ((lt.id = skills.track_id) AND (lt.tutor_id = auth.uid())))));


create policy "Students can view their skills"
on "public"."student_skills"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Tutors can manage student skills"
on "public"."student_skills"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM tutor_students ts
  WHERE ((ts.tutor_id = auth.uid()) AND (ts.student_id = ts.student_id)))));


create policy "Students can view their tracks"
on "public"."student_tracks"
as permissive
for select
to public
using ((auth.uid() = student_id));


create policy "Tutors can manage student tracks"
on "public"."student_tracks"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM tutor_students ts
  WHERE ((ts.tutor_id = auth.uid()) AND (ts.student_id = ts.student_id)))));


create policy "Students can view topics in their tracks"
on "public"."topics"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (student_tracks st
     JOIN learning_tracks lt ON ((lt.id = st.track_id)))
  WHERE ((st.student_id = auth.uid()) AND (lt.id = st.track_id)))));


create policy "Tutors can manage topics in their tracks"
on "public"."topics"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM learning_tracks lt
  WHERE ((lt.id = topics.track_id) AND (lt.tutor_id = auth.uid())))));


create policy "Tutors can manage their students"
on "public"."tutor_students"
as permissive
for all
to public
using ((auth.uid() = tutor_id));


create policy "Tutors can view their students"
on "public"."tutor_students"
as permissive
for select
to public
using (((auth.uid() = tutor_id) OR (EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'tutor'::role_type))))));


create policy "Users can view their own roles"
on "public"."user_roles"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "sel_assignments_teacher"
on "public"."assignments"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'teacher'::text)))));



