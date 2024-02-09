import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
const PORT = process.env.PORT || 5001;
import path from 'path'
import morgan from 'morgan'
import usersRoutes from './routes/usersRoutes.js'
import rootRoutes from './routes/rootRoutes.js'
import storiesRoutes from './routes/storiesRoutes.js'

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())

// logging
if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'))
}

app.use('/api/users', usersRoutes);
app.use('/api', rootRoutes);
app.use('/api/stories', storiesRoutes);

app.get('/', (req, res) =>{
        res.send('server is ready')
})

app.use(notFound);
app.use(errorHandler)

app.listen(PORT, () =>{
        console.log(`server started on port ${PORT}`)
})