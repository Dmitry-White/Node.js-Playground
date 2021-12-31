import express from 'express';
import path from 'path';

import createSocket from './lib/socketio';

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

const server = app.listen(PORT, () =>
  console.log('[app] Your server is running on port: ', PORT),
);

createSocket(server);
