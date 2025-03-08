require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const clearOldMessages = require("./cron/clearOldMessages");
const registerSocketEvents = require("./events");
const { getMessageHistory } = require("./services/supabaseService");

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

clearOldMessages();

io.on("connection", async (socket) => {
  // Enviar historial de mensajes al conectar
  const messages = await getMessageHistory();
  socket.emit("messageHistory", messages);

  // Registrar todos los eventos de Socket.io
  registerSocketEvents(io, socket);
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en el puerto ${PORT}`);
});