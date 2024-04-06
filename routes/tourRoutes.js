const express = require('express');

const tourControllers = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', tourControllers.checkId);

router
    .route(`/`)
    .get(tourControllers.geAllTours)
    .post(tourControllers.createTour);

router
    .route(`/:id`)
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour);

module.exports = router;
