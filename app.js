const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        console.log(req.body);
        next();
    });
}

// middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.use('*', (req, res, next) => {
    console.log(res);
    next(
        new AppError(`Cannot find the following path ${req.originalUrl}`, 404),
    );
});

app.use(globalErrorHandler);

module.exports = app;
