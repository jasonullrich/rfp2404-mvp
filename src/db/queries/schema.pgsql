create table if not exists times (
  id serial primary key,
  race_id text not null,
  time integer not null,
  player text not null
);