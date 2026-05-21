# Casita Bakery Web

MVP de catalogo publico para una bakery de postres artesanales y personalizados. El proyecto usa Node.js, Express.js, EJS y Supabase/PostgreSQL para mostrar productos reales desde base de datos con una vista responsive basica.

## Stack Tecnologico

- Node.js
- Express.js
- EJS
- Supabase/PostgreSQL
- CSS
- JavaScript vanilla
- Render

## Estructura Del Proyecto

```text
casita-bakery/
|-- server.js
|-- render.yaml
|-- src/
|   |-- app.js
|   |-- config/
|   |-- controllers/
|   |-- db/
|   |-- middlewares/
|   |-- public/
|   |-- routes/
|   |-- services/
|   `-- views/
|-- .env.example
|-- package.json
`-- README.md
```

- `src/config`: configuracion de entorno, rutas internas y cliente de Supabase.
- `src/controllers`: controladores HTTP que reciben la request y renderizan respuestas.
- `src/routes`: definicion de rutas publicas de Express.
- `src/services`: logica de consulta y orquestacion, como lectura de productos.
- `src/db`: scripts SQL para schema, seed y policies de Supabase.
- `src/views`: plantillas EJS para el catalogo y paginas de error.
- `src/public`: archivos estaticos servidos por Express, como CSS, JS e imagenes.

## Instalacion Local

```bash
npm install
npm run dev
```

Por defecto la app corre en:

```text
http://localhost:3000
```

## Variables De Entorno

Crea un archivo `.env` local tomando como referencia `.env.example`.

```env
PORT=3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

- `PORT`: puerto local o de Render donde corre Express.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_ANON_KEY`: llave publica anon/publishable usada para leer el catalogo.

## Base De Datos

Los scripts SQL estan en `src/db`.

1. Abre tu proyecto en Supabase.
2. Entra al **SQL Editor**.
3. Ejecuta `src/db/schema.sql` para crear la tabla `productos` e indices.
4. Ejecuta `src/db/seed.sql` para insertar productos de ejemplo.
5. Ejecuta `src/db/policies.sql` para habilitar lectura publica de productos disponibles.

Para probar la conexion desde Node.js:

```bash
npm run db:test
```

## Endpoints Disponibles

```text
GET /
GET /health
```

- `GET /`: renderiza el catalogo publico con productos disponibles desde Supabase.
- `GET /health`: responde el estado basico del servicio.

## Deploy En Render

1. Crea un nuevo **Web Service** en Render.
2. Conecta el repositorio de GitHub del proyecto.
3. Selecciona la rama principal, por ejemplo `main`.
4. Configura el **Build Command**:

```bash
npm install
```

5. Configura el **Start Command**:

```bash
npm start
```

6. Agrega las variables de entorno en Render:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=
```

Render asigna `PORT` automaticamente, pero el codigo usa `process.env.PORT` para ser compatible con la plataforma.

7. Despliega el servicio.
8. Prueba el healthcheck:

```text
https://tu-app.onrender.com/health
```

9. Prueba la pagina principal:

```text
https://tu-app.onrender.com/
```

## Objetivo De La Fase 1

La Fase 1 construye el MVP del catalogo:

- catalogo dinamico
- productos leidos desde Supabase
- vista publica con EJS
- diseno responsive basico
- manejo simple de errores

## Futuras Fases

- pedidos
- panel admin
- notificaciones con Telegram
- autenticacion
- dashboard administrativo
- subida de imagenes
- analytics

## Scripts NPM

```bash
npm start
npm run dev
npm run db:test
```

- `start`: ejecuta el servidor con `node server.js`.
- `dev`: ejecuta el servidor local con `nodemon server.js`.
- `db:test`: valida la conexion y lectura de productos en Supabase.
