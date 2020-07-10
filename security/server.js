import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import JWT_SECRET from './src/core/constants';
import routes from './src/routes/crmRoutes';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
  const isAuthReady =
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT';

  if (!isAuthReady) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      req.headers.authorization.split(' ')[1],
      JWT_SECRET,
    );

    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  return next();
});

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`),
);

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));
