const bcrypt = require('bcryptjs/dist/bcrypt');
const { default: mongoose } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password confirmation is required'],
        minlength: 8,
        validate: {
            /// works only on save and create
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not matching',
        },
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'email is not valid'],
    },
    photo: String,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
