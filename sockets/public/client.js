const messageForm = document.querySelector('#message_form');
const messageInput = document.querySelector('#message_input');
const messageHistory = document.querySelector('#messages_history');
const incomingMessageTemplate = document.querySelector('#incoming_message');
const outgoingMessageTemplate = document.querySelector('#outgoing_message');

const socket = io(); // eslint-disable-line

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = {
    id: socket.id,
    data: messageInput.value,
    timestamp: new Date().toUTCString(),
  };

  socket.emit('message', message);

  messageInput.value = '';
});

const formatTime = (timestamp) => {
  const months = [
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
    months[dateObj.getMonth()]
  } ${dateObj.getDate()} ${dateObj.getFullYear()}`;
};

const updateMessageHistory = (message) => {
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

const chatLogic = () => {
  socket.on('message', (message) => {
    console.log('[io client] message: ', message);
    updateMessageHistory(message);
  });
};

chatLogic();
