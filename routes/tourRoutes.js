const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

/// nested routes with reviews
router.use('/:tourId/reviews', reviewRoutes);
// router.param('id', tourController.checkID);

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/tour-stats')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getTourStats,
    );
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// GeoSpatial data
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour,
    );

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
