import { NotAuthorizedError, NotFoundError, requireAuth, ValidateRequest } from "@test_comp/common";
import express, { Request, Response }  from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:     updatedTicket.id,
        price:  updatedTicket.price,
        title:  updatedTicket.title,
        userId: updatedTicket.userId
    })
    res.send(updatedTicket);
});

export { router as updateTicketRouter }