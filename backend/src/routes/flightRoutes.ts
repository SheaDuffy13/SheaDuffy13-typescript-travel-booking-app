import express from 'express';
import * as flightController from '../controllers/flightController';

const router = express.Router();

router.get('/search', flightController.searchFlights);
router.post('/', flightController.createFlight);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.put('/:id', flightController.updateFlightById);
router.delete('/:id', flightController.deleteFlightById);

export default router;
