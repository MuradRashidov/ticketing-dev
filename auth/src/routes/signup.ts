import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { ValidateRequest } from '../middlewares/validate-request';


const router = express.Router();

router.post('/api/users/signup',[
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 char')
],ValidateRequest,async(req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(email,password);
    
    const excisedUser = await User.findOne({email});
    if (excisedUser) {
        throw new BadRequestError('Email is in use');
        
    }
    try {
        const user =  User.build({email,password});
        await user.save();
        const userJwt = jwt.sign({ id: user.id, email:user.email }, process.env.JWT_KEY!)
        req.session = { jwt: userJwt };
        res.status(201).send(user);

    } catch (error:any) {
        console.log(error.message);
        
    }
});

export { router as signupRouter }; 