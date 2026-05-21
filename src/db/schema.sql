create extension if not exists "pgcrypto";

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(150) not null,
  descripcion text,
  precio numeric(10,2) not null,
  imagen_url text,
  disponible boolean default true,
  orden integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_productos_disponible
  on productos (disponible);

create index if not exists idx_productos_orden
  on productos (orden);
