/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = 5;
    req.query.fields = 'name,summary,ratingsAverage,price';
    next();
};

exports.geAllTours = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'New tour created',
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: `Error: ${error}`,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            body: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            body: {
                tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};

exports.toursStats = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: 'Fail',
            message: error,
        });
    }
};
