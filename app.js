const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        console.log(req.body);
        next();
    });
}
// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    }),
);

// middleWares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// handle unhandled routes
app.use('*', (req, res, next) => {
    console.log(res);
    next(
        new AppError(`Cannot find the following path ${req.originalUrl}`, 404),
    );
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
