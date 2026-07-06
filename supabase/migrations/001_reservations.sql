create type reservation_status as enum (
  'pending',
  'confirmed',
  'cancelled_by_customer',
  'cancelled_by_restaurant',
  'completed',
  'no_show'
);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  party_size smallint not null check (party_size between 1 and 20),
  reservation_date date not null,
  reservation_time time not null,
  notes text,
  status reservation_status not null default 'pending',
  cancellation_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz
);

create index reservations_date_idx on reservations (reservation_date);
create index reservations_status_idx on reservations (status);
create index reservations_email_idx on reservations (customer_email);
create index reservations_token_idx on reservations (cancellation_token);

create or replace function set_reservations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reservations_updated_at
  before update on reservations
  for each row
  execute function set_reservations_updated_at();
