-- OUR LITTLE FOREVER: Supabase setup
-- Chạy toàn bộ file này trong Supabase Dashboard > SQL Editor > New query.
-- Album được đọc công khai; chỉ tài khoản đã đăng nhập mới được thêm/xóa tệp.

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('image', 'video')),
  mime text,
  size bigint not null default 0,
  object_path text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.memories enable row level security;
alter table public.site_settings enable row level security;

grant select on public.memories to anon, authenticated;
grant insert, delete on public.memories to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;

 drop policy if exists "Anyone can view shared memories" on public.memories;
create policy "Anyone can view shared memories"
  on public.memories for select to anon, authenticated
  using (true);

drop policy if exists "Admin can add own memories" on public.memories;
create policy "Admin can add own memories"
  on public.memories for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Admin can delete own memories" on public.memories;
create policy "Admin can delete own memories"
  on public.memories for delete to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Anyone can read shared settings" on public.site_settings;
create policy "Anyone can read shared settings"
  on public.site_settings for select to anon, authenticated
  using (true);

drop policy if exists "Admin can add settings" on public.site_settings;
create policy "Admin can add settings"
  on public.site_settings for insert to authenticated
  with check (updated_by = (select auth.uid()));

drop policy if exists "Admin can update settings" on public.site_settings;
create policy "Admin can update settings"
  on public.site_settings for update to authenticated
  using ((select auth.uid()) is not null)
  with check (updated_by = (select auth.uid()));

-- Public bucket: visitors can view shared media. Upload/delete still require Storage RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'couple-memories',
  'couple-memories',
  true,
  52428800,
  array['image/*', 'video/*', 'audio/*']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admin uploads to own folder in couple album" on storage.objects;
create policy "Admin uploads to own folder in couple album"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'couple-memories'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Admin deletes own files in couple album" on storage.objects;
create policy "Admin deletes own files in couple album"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'couple-memories'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
