const mongoose = require('mongoose')
const FoodIntakeSchema = mongoose.Schema({
    date: {
        type: Date
    },
    traineeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Foods',
    },
    quantity: {
        type: Number
    },
    time: {
        type: String
    }
});

module.exports = mongoose.model('FoodIntake', FoodIntakeSchema)