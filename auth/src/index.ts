import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.get('/', (req,res) => {
    res.send("OK");
});

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.all('*',async () => {
    throw new NotFoundError();
});
app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);
const start = async () => {
    try {
        mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to mongodb');
        
    } catch (error) {
        console.log(error);
    }
    app.listen(3000, () => {
        console.log("Auth service is running http://localhost:3000!")
    });
}
start();
