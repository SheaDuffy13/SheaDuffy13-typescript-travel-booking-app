import express from 'express';
import * as locationController from '../controllers/locationController';

const router = express.Router();

router.post('/', locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocationById);
router.delete('/:id', locationController.deleteLocationById);
// router.get('/search', locationController.searchLocations);


export default router;
