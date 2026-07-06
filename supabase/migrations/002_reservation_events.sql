-- reservation_events audit log (staff actions only)
-- Guest requests and cancellations are tracked on reservations.
-- Uses text for status columns so this works even if reservations.status
-- was created as text instead of the reservation_status enum from 001.

do $do$ begin
  create type reservation_actor_type as enum (
    'staff',
    'customer',
    'system'
  );
exception
  when duplicate_object then null;
end $do$;

do $do$ begin
  create type reservation_event_action as enum (
    'created',
    'confirm',
    'cancel',
    'complete',
    'no_show',
    'customer_cancel'
  );
exception
  when duplicate_object then null;
end $do$;

create table if not exists reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  action reservation_event_action not null,
  from_status text check (
    from_status is null
    or from_status in (
      'pending',
      'confirmed',
      'cancelled_by_customer',
      'cancelled_by_restaurant',
      'completed',
      'no_show'
    )
  ),
  to_status text not null check (
    to_status in (
      'pending',
      'confirmed',
      'cancelled_by_customer',
      'cancelled_by_restaurant',
      'completed',
      'no_show'
    )
  ),
  actor_type reservation_actor_type not null,
  actor_id text,
  created_at timestamptz not null default now()
);

create index if not exists reservation_events_reservation_id_idx
  on reservation_events (reservation_id);

create index if not exists reservation_events_created_at_idx
  on reservation_events (created_at desc);

create index if not exists reservation_events_action_idx
  on reservation_events (action);
