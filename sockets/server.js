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
  console.log('[io server] User connected!');

  const message = {
    id: Math.random(),
    data: 'hey, how are you?',
    timestamp: new Date(),
  };

  socket.emit('message', message);

  socket.on('message', (data) => {
    console.log('[io server] message: ', data);
    io.emit('message', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('[io server] User disconnected! Reason: ', reason);
  });
});
