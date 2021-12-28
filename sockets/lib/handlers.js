import { EVENTS } from '../core/constants';

const messageHandler = (io, socket) => (chatMessage) => {
  console.log(
    `[io server] Message from ${socket.id} in ${io.name}: `,
    chatMessage,
  );

  io.emit(EVENTS.MESSAGE, chatMessage);
};

const disconnectHandler = (io, socket) => (reason) => {
  console.log(
    `[io server] User ${socket.id} in ${io.name} disconnected! Reason: `,
    reason,
  );

  const disconnectMessage = {
    id: socket.id,
    data: `User ${socket.id} disconnected`,
    timestamp: new Date(),
  };
  io.emit(EVENTS.MESSAGE, disconnectMessage);
};

export { messageHandler, disconnectHandler };
