// IMPORTS
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRoute } from './routes/user.js';

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
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  console.log('im in the terminal!!');
  res.send("Hey we're in the browser now!");
});

app.use('/user', userRoute);

// LISTEN
app.listen(process.env.PORT || 8001);
