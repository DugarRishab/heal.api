const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'User must have a name'],
            trim: true,
            minLength: [4, 'Name must have atleat - 4 characters'],
        },
        email: {
            type: String,
            required: [true, 'Every User must have a unique email'],
            unique: [true, 'Email already in use'],
            validate: [validator.isEmail, 'Invalid Email'],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Every user must have a password'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please enter passwordConfirm'],
            validate: {
                validator: function (val) {
                    return val === this.password;
                },
                message: 'Passwords does not match',
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        joinedAt: {
            type: Date,
            default: Date.now(),
        },
        type: {
            type: String,
            default: 'doctor',
            enum: ['doctor', 'clinic', 'hospital'],
        },
        lat: {
            type: String,
            required: true,
        },
        lon: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
        },
        specialization: {
            type: [String],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
// MONGOOSE MIDDLEWARES ->>

// Password encryption ->
doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

doctorSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

doctorSchema.pre(/^find/, async function (next) {
    this.find({ active: { $ne: false } });

    next();
});

// doctorSchema functions ->>

doctorSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
doctorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        //console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }

    return false; // false means NOT changed.
};
doctorSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); // <- Crypto is pre-installed encryption library

    this.passwordResetToken = crypto // <- Crypto is not as strong as bcrypt,
        .createHash('sha256') //    but in this case we don't need such strong encryption.
        .update(resetToken)
        .digest('hex');

    //console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
