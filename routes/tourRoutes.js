const express = require('express');

const tourControllers = require('../controllers/tourControllers');

const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourControllers.aliasTopTours, tourControllers.geAllTours);

router.route('/tours-stats').get(tourControllers.toursStats);

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
