const supabase = require("../config/supabaseClient");

async function getAvailableProducts() {
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, imagen_url, disponible, orden, created_at")
    .eq("disponible", true)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching available products: ${error.message}`);
  }

  return data || [];
}

module.exports = {
  getAvailableProducts
};
