const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/:id')
    .get(
        authController.protect,
        doctorController.getDoctor
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        doctorController.updateDoctor
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        doctorController.deleteDoctor
    );

Router.route('/account')
    .get(authController.protect, doctorController.getMe)
    .patch(authController.protect, doctorController.updateMe)
	.delete(authController.protect, doctorController.deleteMe);

Router.route('/').get(doctorController.getAllDoctors);
Router.route('/post-dev-data').post(doctorController.saveDevData);
	

module.exports = Router;
