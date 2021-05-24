// IMPORTS
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from 'morgan';
import { userRoute } from './routes/user.js';
import { authRoute } from './routes/auth.js';
import { authProtect } from './services/privateRoute.js';

dotenv.config();

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(res => {
    console.log('Successfully connected to DB!');
  })
  .catch(err => {
    console.log('error ======>', err);
  });

// Save something
// INITIALIZE
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(logger('dev'));
app.use(express.json());

// Auth Protect Middleware
app.use((req, res, next) => authProtect(req, res, next));

// ROUTES
app.get('/', (req, res) => {
  console.log('im in the terminal!!');
  res.send("Hey we're in the browser now!");
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);

// LISTEN
app.listen(process.env.PORT || 8001);
