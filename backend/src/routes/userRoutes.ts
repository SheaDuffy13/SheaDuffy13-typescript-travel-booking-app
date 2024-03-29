import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateProfile);
userRouter.post('/signup', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 3 }),
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  userController.signup
);

userRouter.post('/login', userController.login);
userRouter.delete('/:id', userController.deleteProfile);
userRouter.get('/:id/bookings', userController.getBookings)

export default userRouter;
