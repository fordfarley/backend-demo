const { saveMessage } = require("../services/supabaseService");

module.exports = (io, socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Evento para manejar mensajes nuevos
  socket.on("message", async ({ username, message }) => {
    const messageData = {
      user_id: socket.id,
      username: username || "Anónimo",
      message: message,
    };

    await saveMessage(messageData);

    console.log("Mensaje recibido:", messageData);
    io.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
};
