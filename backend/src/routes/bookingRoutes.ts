import express from "express";

import * as bookingController from "../controllers/bookingController";

const bookingRouter = express.Router();

bookingRouter.post("/", bookingController.createBooking);
bookingRouter.get("/:bookingId", bookingController.getBooking);
bookingRouter.get("/user/:userId", bookingController.getBookingsByUser);

export default bookingRouter;
