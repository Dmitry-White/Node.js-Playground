const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
};

const NAMESPACES = {
  USERS: '/users',
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

  messageBody.textContent = message.data;
  messageTimedate.textContent = formatTime(message.timestamp);

  messageHistory.append(messageContentClone);
};

const showConnectionToast = () => {
  console.log('[io client] connect: ', true);

  const toast = new bootstrap.Toast(connectionToast); // eslint-disable-line
  toast.show();
};

const sendMessage = (value) => {
  const message = {
    id: socket.id,
    data: value,
    timestamp: new Date().toUTCString(),
  };

  socket.emit(EVENTS.MESSAGE, message);
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  sendMessage(messageInput.value);

  messageInput.value = '';
});

const chatLogic = () => {
  socket.on(EVENTS.CONNECT, showConnectionToast);
  socket.on(EVENTS.MESSAGE, updateMessageHistory);
};

chatLogic();
