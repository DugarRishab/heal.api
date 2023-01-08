const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Doctor = require('../models/doctorModel');

exports.getAllDoctors = catchAsync(async (req, res, next) => {
    let query;

    // if (req.query) {
    //     query = req.query;
	// }
	
    // const { specialization, state, district, city } = req.query;

    const doctors = await Doctor.find(req.query);

    res.status(200).json({
        message: 'success',
        items: doctors.length,
        data: {
            doctors,
        },
    });
});
exports.updateDoctor = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    if (!doctor) {
        return next(new AppError('No such doctor found with id: ' + id, 404));
    }

    res.status(200).json({
        message: 'success',
        data: {
            doctor,
        },
    });
});
exports.getDoctor = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
        return next(new AppError('No such doctor found with id: ' + id, 404));
    }

    res.status(200).json({
        message: 'success',
        data: {
            doctor,
        },
    });
});
exports.deleteDoctor = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
        return next(new AppError('No such doctor found with id: ' + id, 404));
    }

    res.status(200).json({
        message: 'success',
    });
});
exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        message: 'success',
        data: {
            user: req.user,
        },
    });
});
exports.updateMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
    });

    if (!user) {
        return next(new AppError('No such user found with id: ' + id, 404));
    }

    res.status(200).json({
        message: 'success',
        data: {
            user,
        },
    });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
        return next(new AppError('No such user found with id: ' + id, 404));
    }

    res.status(200).json({
        message: 'success',
    });
});
exports.saveDevData = catchAsync(async (req, res, next) => {
    const doctors = req.body;
    // doctors.forEach(async (doctor) => {
    //     await Doctor.create(doctor);
    // });
    doctors.forEach(doc => {
        
        const specs = doc.specialization.split(",");
        doc.specialization = specs;
    })
    await Doctor.create(doctors);

    const savedDoctors = await Doctor.find();

    res.status(201).json({
        message: "succcess",
        data: {
            savedDoctors
        }
    })
});
