const tasksModel = require('../../models/userSideModels/tasksModel');
const userModel = require('../../models/userSideModels/userModel')
const adminModel = require('../../models/adminSideModels/adminModel')


require('dotenv').config()

/////////////////////GET TASKS ////////////////

const getTasks = async (req, res) => {
  const traineeId = req.payload.id;

  try {
    const tasks = await tasksModel.find({ traineeId: traineeId });
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

/////////////////////GET TRAINER DETAILS ////////////////

const getTrainerDetails = async (req, res) => {
  try {
    const trainer = await userModel.findOne({ _id: req.payload.id }).populate('trainerId').select('-password');;
    const admin = await adminModel.findOne().select('-password');
    res.json({ trainer, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};


/////////////////////MARK TASK DONE ////////////////

const markTaskAsDone = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    await tasksModel.updateOne({ _id: taskId }, { $set: { isDone: true } });
    res.json({ message: 'Task marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};


module.exports = {

  getTasks,
  markTaskAsDone,
  getTrainerDetails,
}