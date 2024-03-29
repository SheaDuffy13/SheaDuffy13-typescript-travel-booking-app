// bookingRoutes.ts
import express from 'express';

import * as bookingController from '../controllers/bookingController';

const bookingRouter = express.Router();

bookingRouter.post('/', bookingController.createBooking);
bookingRouter.get('/:bookingId', bookingController.getBooking);

export default bookingRouter;
