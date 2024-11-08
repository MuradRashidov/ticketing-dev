import { currentUser } from '@test_comp/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentuser',currentUser,(req:Request,res:Response) => { 
    res.send({currentUser: req.currentUser || 0});       
});

export { router as currentUserRouter }; 