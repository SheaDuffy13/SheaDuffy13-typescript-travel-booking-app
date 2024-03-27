import express from 'express';
import * as hotelController from '../controllers/hotelController';

const hotelRouter = express.Router();

hotelRouter.get('/', hotelController.getAllHotels);
hotelRouter.post('/', hotelController.createHotel);
hotelRouter.get('/:id', hotelController.getHotelById);
hotelRouter.put('/:id', hotelController.updateHotel);
hotelRouter.delete('/:id', hotelController.deleteHotel);

export default hotelRouter;
