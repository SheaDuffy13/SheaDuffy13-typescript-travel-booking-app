import express from "express";
import { authMiddleware } from "../middleware/auth";
import * as bookingController from "../controllers/bookingController";

const bookingRouter = express.Router();

bookingRouter.post("/", authMiddleware, bookingController.createBooking);
bookingRouter.get("/:bookingId", authMiddleware, bookingController.getBooking);
bookingRouter.get("/user/:userId", authMiddleware, bookingController.getBookingsByUser);

export default bookingRouter;
