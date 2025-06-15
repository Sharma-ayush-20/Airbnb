import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authrouter from './routes/auth-routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './routes/user-routes.js';
import listingRoutes from './routes/listing-routes.js';
import bookingRoutes from './routes/booking-routes.js';
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
    origin: "https://airbnb-frontend-pknj.onrender.com",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}

//middlewares
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())
//routes
app.use("/api/auth", authrouter)
app.use("/api/user", userRoutes)
app.use("/api/listing", listingRoutes)
app.use("/api/booking", bookingRoutes)

//pahile database connect ho phir server start kar
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is Listening at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB. Server not started.");
});
