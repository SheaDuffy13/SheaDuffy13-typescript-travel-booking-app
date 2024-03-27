import express from 'express';
import * as userController from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateProfile);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.delete('/:id', userController.deleteProfile);

export default userRouter;
