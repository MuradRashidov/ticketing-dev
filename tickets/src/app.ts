import express, { NextFunction, Request, Response } from "express";
import 'express-async-errors';



import cookieSession from 'cookie-session';
import mongoose from "mongoose";
import { currentUser, errorHandler } from "@test_comp/common";
import { createTicketRoute } from "./routes/new";
import { showTicketRoute } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketRoute)
app.use(showTicketRoute)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export {app};