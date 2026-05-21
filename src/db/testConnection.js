require("dotenv").config();

const supabase = require("../config/supabaseClient");

async function testConnection() {
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre")
    .limit(1);

  if (error) {
    console.error("Supabase connection test failed.");
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  console.log("Supabase connection test successful.");
  console.log(`Productos encontrados en prueba: ${data.length}`);
}

testConnection().catch((error) => {
  console.error("Unexpected Supabase connection test error.");
  console.error(error.message);
  process.exitCode = 1;
});
