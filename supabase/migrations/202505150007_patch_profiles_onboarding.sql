-- BrightPair · Add onboarding status fields

alter table public.profiles
  add column if not exists onboarding_status text default 'pending' check (onboarding_status in ('pending','consultation-scheduled','consultation-complete','onboarding-complete','active')),
  add column if not exists next_consultation_date timestamptz; 