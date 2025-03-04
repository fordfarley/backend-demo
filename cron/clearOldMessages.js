require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Función para borrar mensajes antiguos
const clearOldMessages = async () => {
  console.log("Ejecutando tarea programada: Limpiar mensajes antiguos");

  const { error } = await supabase
    .from("messages")
    .delete()
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    console.error("Error al borrar mensajes antiguos:", error);
  } else {
    console.log("Mensajes antiguos eliminados correctamente");
  }
};

// Ejecutar la función al llamar el script
clearOldMessages();
