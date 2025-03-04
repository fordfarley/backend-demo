require("dotenv").config();
const cron = require("node-cron");
const { createClient } = require("@supabase/supabase-js");

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Función para borrar mensajes antiguos
const clearOldMessages = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Ejecutando tarea programada: Limpiar mensajes antiguos");

    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("messages")
      .delete()
      .lt("created_at", cutoffTime);

    if (error) {
      console.error("Error al borrar mensajes antiguos:", error);
    } else {
      console.log("Mensajes antiguos eliminados correctamente");
    }
  });
};

// Exportar la función para usarla en el servidor
module.exports = clearOldMessages;
