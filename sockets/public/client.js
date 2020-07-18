const chatLogic = () => {
  const socket = io('http://localhost:3000'); // eslint-disable-line
  socket.on('message', (data) => {
    console.log('[io client] message: ', data);
    socket.emit('another event', { jeremy: "I'm great, thanks!" });
  });
};

chatLogic();
