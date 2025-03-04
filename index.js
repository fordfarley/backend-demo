require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// Configurar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Permitir cualquier frontend (ajústalo luego)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const users = {}; // Guardará los nombres de los usuarios

// Evento de conexión de un cliente
io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Guardar el nombre del usuario cuando lo envíe
  socket.on("setUsername", (username) => {
    users[socket.id] = username; // Asociamos el ID con el nombre
    console.log(`Usuario ${socket.id} se llama ${username}`);
  });

  socket.on("message", async({message}) => {
    const messageData = {
      userId: socket.id,
      username: users[socket.id] || "Anónimo", // Si no tiene nombre, usa "Anónimo"
      message:message,
    };

     // Guardar el mensaje en Supabase
     const { error } = await supabase
     .from("messages")
     .insert([messageData]);

   if (error) {
     console.error("Error al guardar en Supabase:", error.message);
     return;
   }

    console.log("Mensaje recibido:", messageData);
    io.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en el puerto ${PORT}`);
});