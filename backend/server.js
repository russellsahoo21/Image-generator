import express from 'express';
import fluxroutes from './routes/imgRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app=express();

app.use(
  cors({
    origin: 'http://localhost:5173', // <-- your React app's URL (Vite default)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '50mb' }));

app.get('/',(req,res)=>{
    res.send("Hola Amigos");
})

app.use('/api/gen',fluxroutes);

app.listen(5000,()=>{
    console.log("App runing at 5000!");
})