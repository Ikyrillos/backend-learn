const express = require('express');

const authController = require('../controllers/authController');
const tourControllers = require('../controllers/tourControllers');

const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourControllers.aliasTopTours, tourControllers.geAllTours);

router.route('/tours-stats').get(tourControllers.getToursStats);

router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router
    .route(`/`)
    .get(authController.protect, tourControllers.geAllTours)
    .post(tourControllers.createTour);

router
    .route(`/:id`)
    .get(tourControllers.getTour)
    .patch(tourControllers.updateTour)
    .delete(tourControllers.deleteTour);

module.exports = router;
