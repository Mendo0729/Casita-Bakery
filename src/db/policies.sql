alter table public.productos enable row level security;

create policy "Allow public read access to available products"
  on public.productos
  for select
  to anon
  using (disponible = true);

grant usage on schema public to anon;
grant select on public.productos to anon;
