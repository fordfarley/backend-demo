module.exports = (io, socket) => {

    // Evento cuando un usuario está escribiendo
    socket.on("typing", (username) => {
      socket.broadcast.emit("typing", username);
    });
  
    // Evento cuando deja de escribir
    socket.on("stopTyping", () => {
      socket.broadcast.emit("stopTyping");
    });
  };
  