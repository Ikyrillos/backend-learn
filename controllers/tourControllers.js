/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModel');

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

exports.geAllTours = async (req, res) => {
    try {
        // Get params
        const queryObject = { ...req.query };
        const excludeFilters = ['fields', 'sort', 'limit', 'page'];
        excludeFilters.forEach((el) => delete queryObject[el]);

        /// Advanced Filtering
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (match) => `$${match}`,
        );
        console.log(queryStr);
        let query = Tour.find(JSON.parse(queryStr));

        /// Advanced filtering (Sorting)
        if (req.query.sort) {
            const sortQuery = req.query.sort.split(',').join(' ');
            query = query.sort(sortQuery);
        } else {
            query = query.sort('-createdAt');
        }

        /// Advanced filtering (Field limiting)
        if (req.query.fields) {
            console.log(req.query.fields);
            const fieldsQuery = req.query.fields.split(',').join(' ');
            query = query.select(fieldsQuery);
        } else {
            query = query.select('__v');
        }
        /// Execute the query
        const tours = await query;

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
