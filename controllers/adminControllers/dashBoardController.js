const trainerModel = require('../../models/trainerSideModels/trainerModel')
const subscriptionModel = require('../../models/planModels/subscriptionModel')
const traineeModel = require('../../models/userSideModels/userModel')


const dashBoard = async (req, res) => {
    try {
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const trainer = await trainerModel.aggregate([
            { $sample: { size: 10 } },
            { $project: { password: 0 } }
        ])

        const user = await traineeModel.find().limit(10).populate('trainerId').select( '-password -dashImage');

        const subscriptions = await subscriptionModel.find()
            .populate({
                path: 'plan',
                select: '-imageSrc -description -features',
            })
            .populate({
                path: 'user',
                select: '-password -profileImage -dashImage',
            }).sort({ startDate: -1 }).limit(10)

        const planDetails = await subscriptionModel.aggregate([
            {
                $group: {
                    _id: '$plan',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'plans',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'planDetails',
                },
            },
            {
                $project: {
                    _id: 0,
                    name: { $arrayElemAt: ['$planDetails.name', 0] },
                    count: 1,
                },
            },
        ]);

        const userCounts = await traineeModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);
        res.status(200).json({ trainer, user, subscriptions, planDetails, userCounts })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}




module.exports = {
    dashBoard,
}