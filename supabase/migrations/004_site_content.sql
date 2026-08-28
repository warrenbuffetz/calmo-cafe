create table site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function set_site_content_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger site_content_updated_at
  before update on site_content
  for each row execute function set_site_content_updated_at();
