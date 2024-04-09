/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = 5;
    req.query.fields = 'name,summary,ratingsAverage,price';
    next();
};

exports.geAllTours = catchAsync(async (req, res, next) => {
    const featuresQuery = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .fieldsLimiting()
        .paginate();

    /// Execute the query
    const tours = await featuresQuery.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        body: {
            tours,
        },
    });
});

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        message: 'New tour created',
        data: {
            tour: newTour,
        },
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        body: null,
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        body: {
            tour,
        },
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        body: {
            tour,
        },
    });
});

exports.getToursStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsAverage' },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        body: {
            stats,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    console.log(year);
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: {
                    $month: '$startDates',
                },
                numberOfTours: { $sum: 1 },
                tourNames: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                month: 1,
            },
        },
        // {
        //     $limit: 2,
        // },
    ]);
    res.status(200).json({
        status: 'success',
        body: {
            plan,
        },
    });
});
