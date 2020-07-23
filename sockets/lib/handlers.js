const messageHandler = (io, socket) => (chatMessage) => {
  console.log(
    `[io server] Message from ${socket.id} in ${io.name}: `,
    chatMessage,
  );

  io.emit('message', chatMessage);
};

const disconnectHandler = (io, socket) => (reason) => {
  console.log(
    `[io server] User ${socket.id} in ${io.name} disconnected! Reason: `,
    reason,
  );

  const disconnectMessage = {
    id: Math.random(),
    data: `User ${socket.id} disconnected`,
    timestamp: new Date(),
  };
  io.emit('message', disconnectMessage);
};

export { messageHandler, disconnectHandler };
