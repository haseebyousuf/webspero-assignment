import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes

app.use('/user', userRoutes);

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log('db connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
