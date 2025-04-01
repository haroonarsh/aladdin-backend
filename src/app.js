import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(
    {
        path: './.env'
    }
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(cookieParser());


// Connect to DB
import connectDB from './config/db.js';
connectDB();


// Routes
import userRouter from './routes/user.routes.js';
app.use('/api/user', userRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
