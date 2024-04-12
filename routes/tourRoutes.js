const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.geAllTours);

router.route('/tour-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.geAllTours)
    .post(tourController.createTour);

router.delete(
    '/:id',
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour);

module.exports = router;
