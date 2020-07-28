const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  JOIN: 'join',
};

const NAMESPACES = {
  USERS: '/users',
};

const ROOMS = {
  JAVASCRIPT: 'javascript',
  REACT: 'react',
};

const messageForm = document.querySelector('#message_form');
const messageInput = document.querySelector('#message_input');
const messageHistory = document.querySelector('#messages_history');
const incomingMessageTemplate = document.querySelector('#incoming_message');
const outgoingMessageTemplate = document.querySelector('#outgoing_message');
const connectionToast = document.querySelector('#connection-toast');

const socket = io(NAMESPACES.USERS); // eslint-disable-line

const formatTime = (timestamp) => {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dateObj = new Date(timestamp);
  return `${dateObj.getHours()}:${dateObj.getMinutes()} | ${
    MONTHS[dateObj.getMonth()]
  } ${dateObj.getDate()} ${dateObj.getFullYear()}`;
};

const showConnectionToast = () => {
  console.log('[io client] connect: ', true);

  const toast = new bootstrap.Toast(connectionToast); // eslint-disable-line
  toast.show();
};

const updateMessageHistory = (message) => {
  console.log('[io client] message: ', message);

  const messageTemplate =
    socket.id === message.id
      ? outgoingMessageTemplate
      : incomingMessageTemplate;

  const messageContentClone = messageTemplate.content.cloneNode(true);
  const messageBody = messageContentClone.querySelector('#message_body');
  const messageTimedate =
    messageContentClone.querySelector('.message_timedate');

  messageBody.textContent = message.data.value;
  messageTimedate.textContent = formatTime(message.timestamp);

  messageHistory.append(messageContentClone);
};

const sendMessage = (room, value) => {
  const message = {
    id: socket.id,
    data: { room, value },
    timestamp: new Date().toUTCString(),
  };

  socket.emit(EVENTS.MESSAGE, message);
};

const sendJoin = (room) => {
  const message = {
    id: socket.id,
    data: { room },
    timestamp: new Date().toUTCString(),
  };

  socket.emit(EVENTS.JOIN, message);
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  sendMessage(ROOMS.JAVASCRIPT, messageInput.value);

  messageInput.value = '';
});

const chatLogic = () => {
  socket.on(EVENTS.CONNECT, () => {
    showConnectionToast();
    sendJoin(ROOMS.JAVASCRIPT);
  });
  socket.on(EVENTS.MESSAGE, updateMessageHistory);
};

chatLogic();
