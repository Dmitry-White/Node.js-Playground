import { EVENTS } from '../core/constants';

const messageHandler = (io, socket) => (chatMessage) => {
  console.log(
    `[io server] Message from ${socket.id} in ${io.name}: `,
    chatMessage,
  );

  io.in(chatMessage.data.room).emit(EVENTS.MESSAGE, chatMessage);
};

const disconnectHandler = (io, socket) => (reason) => {
  console.log(
    `[io server] User ${socket.id} in ${io.name} disconnected! Reason: `,
    reason,
  );

  const value = `User ${socket.id} disconnected`;

  const disconnectMessage = {
    id: socket.id,
    data: { value },
    timestamp: new Date(),
  };
  io.emit(EVENTS.MESSAGE, disconnectMessage);
};

const joinHandler = (io, socket) => (event) => {
  console.log(
    `[io server] User ${socket.id} in ${io.name} joined ${event.data.room}`,
  );

  const value = `User ${socket.id} joined`;

  socket.join(event.data.room);

  const joinMessage = {
    id: socket.id,
    data: { value },
    timestamp: new Date(),
  };
  io.in(event.data.room).emit(EVENTS.MESSAGE, joinMessage);
};

export { messageHandler, disconnectHandler, joinHandler };
