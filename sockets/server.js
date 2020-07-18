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
  socket.emit('message', { manny: 'hey, how are you?' });
  socket.on('another event', (data) => {
    console.log('[io server] another event: ', data);
  });
});
