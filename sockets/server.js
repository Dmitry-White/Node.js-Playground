import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const server = app.listen(PORT, () =>
  console.log('[app] Your server is running on port: ', PORT),
);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`[io server] User ${socket.id} connected!`);

  socket.on('message', (chatMessage) => {
    console.log(`[io server] Message from ${socket.id}: `, chatMessage);

    io.emit('message', chatMessage);
  });

  socket.on('disconnect', (reason) => {
    console.log(`[io server] User ${socket.id} disconnected! Reason: `, reason);

    const disconnectMessage = {
      id: Math.random(),
      data: `User ${socket.id} disconnected`,
      timestamp: new Date(),
    };
    io.emit('message', disconnectMessage);
  });
});
