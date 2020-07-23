import { Server } from 'socket.io';

import { messageHandler, disconnectHandler } from './handlers';

const createSocket = (server) => {
  const io = new Server(server);

  const usersNamespace = io.of('/users');

  const connectionHandler = (socket) => {
    console.log(
      `[io server] User ${socket.id} in ${usersNamespace.name} connected!`,
    );

    socket.on('message', messageHandler(usersNamespace, socket));
    socket.on('disconnect', disconnectHandler(usersNamespace, socket));
  };

  usersNamespace.on('connection', connectionHandler);
};

export default createSocket;
