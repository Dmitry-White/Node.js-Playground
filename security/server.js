import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import routes from './src/routes/crmRoutes';
import { logRequests, setupJWT } from './src/core/middlewares';

const app = express();
const PORT = 3000;

// Helmet setup
app.use(helmet());

// Rate Limit setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: 'Too many requests. Please try again later (in 15 minutes).',
});
app.use(limiter);

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request Logger setup
app.use(logRequests);

// JWT setup
app.use(setupJWT);

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.send('[app] Node and express server is running on port: ', PORT),
);

app.listen(PORT, () =>
  console.log('[app] Your server is running on port: ', PORT),
);
