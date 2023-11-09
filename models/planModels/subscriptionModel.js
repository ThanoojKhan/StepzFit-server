const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const dateValidator = [
    validate({
        validator: 'isAfter',
        arguments: new Date(),
        message: 'Date must be after the current date',
    }),
];

const SubscriptionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plans',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        validate: dateValidator,
    },
    endDate: {
        type: Date,
        required: true,
        validate: dateValidator,
    },
    expired: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
