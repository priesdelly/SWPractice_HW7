const Hospital = require('../models/Hospital');

//@desc     Get all hospitals
//@route    GET /api/v1/hospitals
//@access   Public
exports.getHospitals = async (req, res, next) => {

    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields = ['select', 'sort',];


    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = Hospital.find(JSON.parse(queryStr));

    //Select Fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    console.log(query);

    //Sort
    if(req.query.sort) {
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    console.log(query);

    try {
        // const hospitals = await Hospital.find();
        const hospitals = await query;
        res.status(200).json({success: true, count: hospitals.length, data: hospitals});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false});
    }
};

//@desc     Get single hospital
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: hospital});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false});
    }
};

//@desc     Create new hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({success: true, data: hospital});
    } catch (err) {
        console.log(err);
        return res.status(400).json({success: false});
    }
};

//@desc     Update hospital
//@route    PUT /api/v1/hospitals/:id
//@access   Private
exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: hospital});
    } catch (err) {
        console.log(err);
        return res.status(400).json({success: false});
    }
};

//@desc     Delete hospital
//@route    DELETE /api/v1/hospitals/:id
//@access   Private
exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(400).json({success: false});
        }
        return res.status(200).json({success: true, data: {}});
    } catch (err) {
        return res.status(400).json({success: false});
    }
};
