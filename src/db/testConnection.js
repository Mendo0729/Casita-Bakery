require("dotenv").config();

const pool = require("../config/databaseClient");

async function testConnection() {
  try {
    const { rows } = await pool.query(`
      select id, nombre
      from productos
      where disponible = true
      order by orden asc
      limit 1
    `);

    console.log("PostgreSQL local connection test successful.");
    console.log(`Productos encontrados en prueba: ${rows.length}`);
  } catch (error) {
    console.error("PostgreSQL local connection test failed.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();
