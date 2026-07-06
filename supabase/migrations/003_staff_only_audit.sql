-- Staff-only audit log: remove guest rows and enforce constraints going forward.
-- Safe to run after 002_reservation_events.sql.
-- No enum changes required (unused enum values are harmless).

-- Optional: remove any guest/system rows logged before this change
delete from reservation_events
where actor_type::text <> 'staff'
   or action::text in ('created', 'customer_cancel');

alter table reservation_events
  drop constraint if exists reservation_events_staff_only;

alter table reservation_events
  add constraint reservation_events_staff_only
  check (actor_type::text = 'staff');

alter table reservation_events
  drop constraint if exists reservation_events_staff_actions;

alter table reservation_events
  add constraint reservation_events_staff_actions
  check (action::text in ('confirm', 'cancel', 'complete', 'no_show'));
