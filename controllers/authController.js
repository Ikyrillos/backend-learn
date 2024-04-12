const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body, 'user xxx');

    const newUser = await User.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            newUser,
        },
    });
});
