import { NotAuthorizedError, NotFoundError, requireAuth, ValidateRequest } from "@test_comp/common";
import express, { Request, Response }  from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put('/api/tickets/:id',requireAuth,[ 
    body('title').not().isEmpty().withMessage("title is required"),
    body('price').isFloat({gt:0}).withMessage("price must be greater than 0")
],ValidateRequest, async (req:Request,res:Response) => {
    console.log('Current user: ',req.currentUser);
    
    const { id } = req.params;
    const { title, price } = req.body;
    const  userId = req.currentUser!.id;
    const updatedTicket = await Ticket.findById(id);

    if(!updatedTicket) throw new NotFoundError();
    if (updatedTicket.userId !== userId) throw new NotAuthorizedError();
    
    updatedTicket.title = title;
    updatedTicket.price = price;
    await updatedTicket.save();
    res.send(updatedTicket);
});

export { router as updateTicketRouter }