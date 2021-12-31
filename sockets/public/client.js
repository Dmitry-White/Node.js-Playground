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
  JAVASCRIPT: 'js',
  REACT: 'react',
  CSS: 'css',
};

const messagesContainerTemplate = document.querySelector('#messages_container');
const incomingMessageTemplate = document.querySelector('#incoming_message');
const outgoingMessageTemplate = document.querySelector('#outgoing_message');
const chatRoomTemplate = document.querySelector('#chat_room');
const connectionToast = document.querySelector('#connection-toast');
const chatInbox = document.querySelector('.chat_inbox');
const chatRooms = document.querySelector('.chat_rooms');

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

const formatDate = (timestamp) => {
  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dateObj = new Date(timestamp);
  return `${MONTHS[dateObj.getMonth()]} ${dateObj.getDate()}`;
};

const showConnectionToast = () => {
  console.log('[io client] connect: ', true);

  const toast = new bootstrap.Toast(connectionToast); // eslint-disable-line
  toast.show();
};

const updateChatRooms = (message) => {
  if (!message.data.room) return;

  const targetRoom = Array.from(chatRooms.children).find(
    (room) => room.id === message.data.room,
  );

  const chatDate = targetRoom.querySelector('.chat_date');
  chatDate.textContent = formatDate(message.timestamp);

  const chatText = targetRoom.querySelector('.chat_text');
  chatText.textContent = message.data.value;
};

const updateMessageHistory = (message) => {
  console.log('[io client] message: ', message);
  const messageHistory = chatInbox.querySelector('#messages_history');
  if (!messageHistory) return;

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

const renderMessageHistory = (room) => {
  const oldMessagesContainer = chatInbox.querySelector('.messages_container');
  if (oldMessagesContainer) chatInbox.removeChild(oldMessagesContainer);

  const messagesContainerClone =
    messagesContainerTemplate.content.cloneNode(true);

  const messagesContainer = messagesContainerClone.querySelector(
    '.messages_container',
  );
  messagesContainer.id = room;

  const messageForm = messagesContainerClone.querySelector('#message_form');
  const messageInput = messagesContainerClone.querySelector('#message_input');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    sendMessage(room, messageInput.value);

    messageInput.value = '';
  });

  chatInbox.append(messagesContainerClone);
};

const renderChatRooms = () => {
  Object.entries(ROOMS).forEach(([key, value]) => {
    const chatRoomClone = chatRoomTemplate.content.cloneNode(true);
    const chatRoom = chatRoomClone.querySelector('.chat_room');
    const chatRoomName = chatRoomClone.querySelector('.chat_name');
    const chatRoomImage = chatRoomClone.querySelector('.chat_img');
    chatRoom.id = value;
    chatRoomName.textContent = key;
    chatRoomImage.alt = value;
    chatRoomImage.src = `https://img.icons8.com/small/16/000000/${value}.png`;
    chatRooms.append(chatRoomClone);
  });
};

const chatLogic = () => {
  socket.on(EVENTS.CONNECT, showConnectionToast);
  socket.on(EVENTS.MESSAGE, (message) => {
    updateMessageHistory(message);
    updateChatRooms(message);
  });
};

chatRooms.addEventListener('click', (e) => {
  if (!e.target.closest('.chat_room')) {
    return;
  }

  Array.from(chatRooms.children).forEach((room) => {
    room.classList.remove('active_chat');
  });

  const selectedRoom = e.target.closest('.chat_room');
  selectedRoom.classList.add('active_chat');

  renderMessageHistory(selectedRoom.id);
  sendJoin(selectedRoom.id);
});

chatLogic();
renderChatRooms();
