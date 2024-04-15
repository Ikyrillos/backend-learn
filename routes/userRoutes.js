const express = require('express');

const userController = require('../controllers/userControllers');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
// after authentication
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me', userController.getMe, userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

// Restrict all the following routes for admin
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
