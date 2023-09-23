const cron = require('node-cron');
const subscriptionModel = require('./models/planModels/subscriptionModel');
const mongoose = require('mongoose')
require('dotenv').config()
|
mongoose.connect(process.env.MONGOCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const deleteExpiredSubscriptions = async () => {
    try {
        console.log('===cron working===');
        const currentDate = new Date();

        await subscriptionModel.updateMany({ endDate: { $lt: currentDate } }, { $set: { expired: true } });
    } catch (error) {
        console.error('Error deleting expired subscriptions:', error);
    }
};

cron.schedule('0 1 * * *', () => {
    deleteExpiredSubscriptions();
});
