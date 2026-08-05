-- ============================================================
-- ULTRAMEDIA GRAPHIX — PROJECTS TABLE SETUP
-- Run this in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create the table
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users(id) not null,
  title text not null,
  status text not null default 'in-progress', -- 'in-progress', 'review', 'completed'
  status_label text not null default 'In Progress',
  created_at timestamp with time zone default now()
);

-- 2. Create a table for downloadable files attached to a project
create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  file_name text not null,
  file_url text not null,
  created_at timestamp with time zone default now()
);

-- 3. Turn on Row Level Security — WITHOUT this, any logged-in user
--    could read every row in the table, not just their own.
alter table projects enable row level security;
alter table project_files enable row level security;

-- 4. Policy: a client can only SELECT (read) their own projects
create policy "Clients can view their own projects"
on projects for select
using (auth.uid() = client_id);

-- 5. Policy: a client can only see files belonging to their own projects
create policy "Clients can view their own project files"
on project_files for select
using (
  exists (
    select 1 from projects
    where projects.id = project_files.project_id
    and projects.client_id = auth.uid()
  )
);

-- ============================================================
-- NOTE: these policies only allow READING (select). Inserting new
-- projects/files (as the admin) should be done by YOU, either
-- directly in the Supabase Table Editor UI, or later through an
-- admin-only page once you build one. Regular clients should never
-- have insert/update/delete permission on this table.
-- ============================================================
