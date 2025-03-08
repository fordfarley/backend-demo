require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Guardar un mensaje en Supabase
const saveMessage = async (messageData) => {
  const { error } = await supabase
    .from("messages")
    .insert([messageData]);

  if (error) {
    console.error("Error al guardar en Supabase:", error.message);
  }
};

// Obtener el historial de mensajes
const getMessageHistory = async () => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error al obtener mensajes de Supabase:", error.message);
    return [];
  }
  return data;
};

module.exports = {
  saveMessage,
  getMessageHistory,
};
