
import express,{Express} from "express"
import { PORT } from "./secrets"
import authRouter from './routes/auth.route';
import { json, urlencoded } from 'express';
import { errorMiddleware } from "./middlewares/errors";


const app:Express = express()

app.use(json());
app.use(urlencoded({ extended: true }));


app.use('/api/v1/auth', authRouter);

app.use(errorMiddleware)
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})