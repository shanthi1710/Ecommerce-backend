import express,{Express,Request,Response} from "express"
import { PORT } from "./secrets"
import authRouter from './routes/auth.route';
import { json, urlencoded } from 'express';


const app:Express = express()

app.use(json());
app.use(urlencoded({ extended: true }));


app.use('/api/v1/auth', authRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})