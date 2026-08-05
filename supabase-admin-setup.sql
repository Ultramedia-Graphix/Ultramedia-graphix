-- ============================================================
-- ULTRAMEDIA GRAPHIX — ADMIN SETUP
-- Run this in Supabase → SQL Editor → New Query → Run
-- (Run this AFTER supabase-setup.sql)
-- ============================================================

-- 1. A small table listing who counts as an admin (you).
create table admins (
  user_id uuid primary key references auth.users(id)
);

alter table admins enable row level security;

-- Only admins can even see the admins table (prevents anyone from
-- checking who else is an admin).
create policy "Admins can view admin list"
on admins for select
using (auth.uid() in (select user_id from admins));

-- 2. Allow admins to SELECT every project (not just their own).
create policy "Admins can view all projects"
on projects for select
using (auth.uid() in (select user_id from admins));

-- 3. Allow admins to INSERT new projects for any client.
create policy "Admins can insert projects"
on projects for insert
with check (auth.uid() in (select user_id from admins));

-- 4. Allow admins to UPDATE any project (e.g. change status).
create policy "Admins can update projects"
on projects for update
using (auth.uid() in (select user_id from admins));

-- 5. Same three permissions, but for the project_files table.
create policy "Admins can view all project files"
on project_files for select
using (auth.uid() in (select user_id from admins));

create policy "Admins can insert project files"
on project_files for insert
with check (auth.uid() in (select user_id from admins));

create policy "Admins can delete project files"
on project_files for delete
using (auth.uid() in (select user_id from admins));

-- ============================================================
-- FINAL STEP (do this manually, not as SQL):
-- 1. Register your own account normally through register.html
-- 2. In Supabase → Table Editor → auth.users, find your account
--    and copy its "id" (a UUID)
-- 3. Go to Table Editor → admins → Insert row → paste that UUID
--    into "user_id" → Save
-- This makes YOUR account (and only yours) an admin.
-- ============================================================
