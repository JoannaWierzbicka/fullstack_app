-- Properties table for hotel owners
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

-- Reservations adjustments
alter table public.reservations
  add column if not exists property_id uuid,
  add column if not exists room_id uuid;

alter table public.reservations
  add constraint reservations_property_fk foreign key (property_id)
  references public.properties(id) on delete set null;

alter table public.reservations
  add constraint reservations_room_fk foreign key (room_id)
  references public.rooms(id) on delete set null;

-- Ensure owner_id columns exist on supporting tables
alter table public.properties
  add column if not exists owner_id uuid;

alter table public.rooms
  add column if not exists owner_id uuid;

-- Indexes
create index if not exists properties_owner_idx on public.properties(owner_id);
create index if not exists rooms_owner_idx on public.rooms(owner_id);
create index if not exists rooms_property_idx on public.rooms(property_id);
create index if not exists reservations_property_idx on public.reservations(property_id);
create index if not exists reservations_room_idx on public.reservations(room_id);

-- Row level security setup
alter table public.properties enable row level security;
alter table public.rooms enable row level security;

create policy if not exists "Users manage own properties" on public.properties
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy if not exists "Users manage own rooms" on public.rooms
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Ensure reservations policy also checks owner across joins (manually adjust if needed)
