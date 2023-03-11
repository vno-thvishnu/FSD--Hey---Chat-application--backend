import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import MessageRoute from './Routes/MessageRoute.js'

import ChatRoute from './Routes/ChatRoute.js'

//Routes
const app= express();

//Middleware
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(
    cors({
        // origin: "http://localhost:3000"
        origin: "https://fsd-hey-chat-application-frontend.vercel.app",
      })
)
dotenv.config()
const PORT=process.env.PORT

const CONNECTION = process.env.MONGO_DB

mongoose.connect(CONNECTION,
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>app.listen(PORT,()=>console.log(`Listening at ${PORT}`)))
.catch((error)=>console.log(`${error} did not connect`))

//usage of routes
app.use('/auth',AuthRoute)
app.use('/user',UserRoute)
app.use('/chat',ChatRoute)
app.use('/message',MessageRoute)

