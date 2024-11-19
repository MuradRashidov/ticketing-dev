import { BadRequestError, NotFoundError, OrderStatus, requireAuth, ValidateRequest } from '@test_comp/common';
import express, { Request, Response }from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 15*60;

const rooter = express.Router();
rooter.post('/api/orders/',requireAuth,[
    body('ticketId')
    .not().isEmpty().custom((input:string) => mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId must be provided')
],ValidateRequest,async (req: Request, res:Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) throw new NotFoundError();
    const reserved = await ticket.isReserved();
    if(reserved) throw new BadRequestError('This ticket has been reserved');
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    
    const order = await Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    order.save();
    console.log('Expires At: ', order.expiresAt);
    
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price 
        }

    })
    res.status(201).send(order);
});

export { rooter as createOrderRouter }