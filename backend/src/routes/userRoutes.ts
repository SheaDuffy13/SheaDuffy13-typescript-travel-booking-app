import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/userController";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const userRouter = express.Router();

userRouter.get(
    "/",
    authMiddleware,
    adminMiddleware,
    userController.getAllUsers
);
userRouter.get("/:id", authMiddleware, userController.getUser);
userRouter.put("/:id", authMiddleware, userController.updateProfile);
userRouter.post(
    "/signup",
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 3 }),
    body("firstName").trim().escape(),
    body("lastName").trim().escape(),
    userController.signup
);
userRouter.post("/login", userController.login);
userRouter.get("/me", authMiddleware, userController.getMe);
userRouter.delete("/:id", authMiddleware, userController.deleteProfile);

export default userRouter;
