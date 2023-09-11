const mongoose = require('mongoose')
const SubscriptionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plans',
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    expired: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('Subscription', SubscriptionSchema)