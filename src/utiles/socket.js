const { Server } = require("socket.io");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("jointChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getRoomId(userId, targetUserId);
            socket.join(roomId);
            console.log(`${firstName} joined room: ${roomId}`);
        });

        socket.on("sendmessage", (message) => {
            const roomId = getRoomId(message.userId, message.targetUserId);
            socket.to(roomId).emit("receivemessage", message);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    function getRoomId(id1, id2) {
        return [id1, id2].sort().join("_");
    }
};

module.exports = initializeSocket;
