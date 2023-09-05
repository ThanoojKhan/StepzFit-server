const mongoose = require('mongoose')
const BodyMetricsSchema = mongoose.Schema({
    date: {
        type: Date
    },
    traineeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    bodyWeight: {
        type: Number
    },
    height: {
        type: Number
    },
    waist: {
        type: Number
    },
    hip: {
        type: Number
    },
    chest: {
        type: Number
    },
    arm: {
        type: Number
    },
    forearm: {
        type: Number
    },
    calf: {
        type: Number
    },
    thighs: {
        type: Number
    },
    bmi: {
        type: Number
    },
});

module.exports = mongoose.model('BodyMetrics', BodyMetricsSchema)