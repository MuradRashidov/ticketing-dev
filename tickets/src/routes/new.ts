import {requireAuth, ValidateRequest } from '@test_comp/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post('/api/tickets',
    requireAuth,
    [ 
        body('title').not().isEmpty().withMessage("title is required"),
        body('price').isFloat({gt:0}).withMessage("price must be greater than 0")
    ],ValidateRequest,
 async (req: Request, res: Response) => { 
      const { title, price } = req.body;
      const ticket = Ticket.build({ price, title, userId:req.currentUser!?.id});
      await ticket.save();
      //console.log('Ticket: ', ticket);
      await new TicketCreatedPublisher(client).publish({
        id:ticket.id,
        price:ticket.price,
        title:ticket.title,
        userId:ticket.userId
      })
      res.status(201).send(ticket);
});

export {router as createTicketRoute};