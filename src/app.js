import express from 'express';
import cors from 'cors';
// import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './config/passport.js';

dotenv.config(
    {
        path: './.env'
    }
);

const app = express();

    // Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors( {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'none',
            secure: true,
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());


// Connect to DB
import connectDB from './config/db.js';
connectDB();

// Cart routes
import cartRouter from './routes/cart.routes.js';
app.use('/api/cart', cartRouter);

// Products routes
import productRouter from "./routes/product.routes.js"
app.use('/api/products', productRouter);

// google routes
import googleRouter from './routes/auth.routes.js';
app.use('/auth', googleRouter);

// Routes
import userRouter from './routes/user.routes.js';
app.use('/api/user', userRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
