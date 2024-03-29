import express from 'express';
import * as locationController from '../controllers/locationController';

const router = express.Router();

router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get('/search', locationController.searchLocations);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocationById);
router.delete('/:id', locationController.deleteLocationById);

export default router;
