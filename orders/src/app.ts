import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';



import cookieSession from 'cookie-session';
import mongoose from "mongoose";
import { currentUser, errorHandler } from "@test_comp/common";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { createOrderRouter } from "./routes/new";

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
app.use(currentUser);
app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export {app};