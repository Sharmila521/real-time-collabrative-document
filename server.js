const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

let documentContent = "";
let users = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("new-user", (username) => {
        users.push(username);
        io.emit("update-users", users);
    });

    socket.emit("text-update", documentContent);

    socket.on("text-update", (data) => {
        documentContent = data;
        socket.broadcast.emit("text-update", data);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user !== socket.username);
        io.emit("update-users", users);
        console.log("A user disconnected");
    });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
