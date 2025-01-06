const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {console.log("chap app start")});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  io.to(socket.id).emit("id", socket.id); 
  socketsConnected.add(socket.id);
  io.emit("total-users", socketsConnected.size);
  
  socket.on("disconnect", () => {
    socketsConnected.delete(socket.id);
    io.emit("total-users", socketsConnected.size);
  });
  
  socket.on("message", (msgObj) => {
    io.emit("newMessage", msgObj);
  })
  
  socket.on("typing", (obj) => {
    socket.broadcast.emit("typing", obj);
  })
  
  socket.on("noTyping", (id) => {
    io.emit("noTyping", id);
  })
}