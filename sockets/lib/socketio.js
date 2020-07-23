import { Server } from 'socket.io';

import { EVENTS, NAMESPACES } from '../core/constants';

import { messageHandler, disconnectHandler } from './handlers';

const createSocket = (server) => {
  const io = new Server(server);

  const usersNamespace = io.of(NAMESPACES.USERS);

  const connectionHandler = (socket) => {
    console.log(
      `[io server] User ${socket.id} in ${usersNamespace.name} connected!`,
    );

    socket.on(EVENTS.MESSAGE, messageHandler(usersNamespace, socket));
    socket.on(EVENTS.DISCONNECT, disconnectHandler(usersNamespace, socket));
  };

  usersNamespace.on(EVENTS.CONNECT, connectionHandler);
};

export default createSocket;
