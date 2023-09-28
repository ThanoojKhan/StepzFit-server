const trainerModel = require('../../models/trainerSideModels/trainerModel')
const traineeModel = require('../../models/userSideModels/userModel')
const tasksModel = require('../../models/userSideModels/tasksModel')


const getDashBoard = async (req, res) => {
    try {
        const trainerId = req.payload.id
        const trainer = await trainerModel.findOne({ _id: trainerId })
        const trainees = await traineeModel.find({ trainerId }).select('-dashImage -username -password');
        const userCount = await traineeModel.countDocuments({ trainerId });
        const tasks = await tasksModel.find({ trainerId }).populate('traineeId', 'name age profileImage').sort({ date: -1 })
        const tasksCount = await tasksModel.find({ trainerId }).limit(10).countDocuments();

        res.status(200).json({ trainees, trainer, tasks, userCount, tasksCount })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

module.exports = {
    getDashBoard,
}