import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@test_comp/common";


import cookieSession from 'cookie-session';
import mongoose from "mongoose";

const app = express();
app.set("trust proxy",true);
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !== "test"
}));
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

export {app};