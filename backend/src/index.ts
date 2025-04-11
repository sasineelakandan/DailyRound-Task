import express from 'express';
import cors from 'cors'
import morgan from "morgan";
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import taskRoutes from './routes/taskRoutes';
const app = express()
dotenv.config()

    const corsOptions = {
        origin: process.env.CLIENT,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    };

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(authRoutes)
app.use(taskRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server started`)
})
const databaseurl =process.env.DATABASE_URL
mongoose.connect(databaseurl).then(() => console.log('Database connected')).catch(err=>console.log(err.message))
