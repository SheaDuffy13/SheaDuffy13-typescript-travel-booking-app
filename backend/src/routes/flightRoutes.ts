import express from 'express';
import * as flightController from '../controllers/flightController';

const router = express.Router();

router.post('/', flightController.createFlight);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.put('/:id', flightController.updateFlightById);
router.delete('/:id', flightController.deleteFlightById);
router.get('/search', flightController.searchFlights);


export default router;
