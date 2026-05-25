create extension if not exists "pgcrypto";

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre varchar(150) not null,
  descripcion text,
  precio numeric(10,2) not null,
  imagen_url text,
  categoria text,
  disponible boolean default true,
  orden integer default 0,
  created_at timestamptz default now()
);

alter table productos
  add column if not exists categoria text;

create index if not exists idx_productos_disponible
  on productos (disponible);

create index if not exists idx_productos_orden
  on productos (orden);

create index if not exists idx_productos_disponible_orden
  on productos (disponible, orden);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  nombre_cliente text not null,
  telefono text not null,
  direccion text not null,
  notas text,
  estado text default 'pendiente',
  total numeric(10,2) not null,
  creado_en timestamptz default now()
);

create table if not exists pedido_detalle (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid references productos(id),
  nombre_producto text not null,
  precio_unitario numeric(10,2) not null,
  cantidad integer not null,
  subtotal numeric(10,2) not null,
  creado_en timestamptz default now()
);

create index if not exists idx_pedido_detalle_pedido_id
  on pedido_detalle (pedido_id);
