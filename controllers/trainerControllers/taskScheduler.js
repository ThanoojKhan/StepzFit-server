const tasksModel = require('../../models/userSideModels/tasksModel')
const traineeModel = require('../../models/userSideModels/userModel');
require('dotenv').config()



////////////////SCHEDULE TASK////////////

const scheduleTask = async (req, res) => {
  try {
    const { traineeId } = req.params;
    const { date, task } = req.body;
    const trainerId = req.payload.id;

    const existingTask = await tasksModel.findOne({ traineeId, date });

    if (existingTask) {
      return res.status(400).json({ errMsg: 'Task already scheduled for the same day' });
    }

    const scheduledTask = await tasksModel.create({ traineeId, date, task, trainerId });

    if (!scheduledTask) {
      return res.status(404).json({ errMsg: 'Failed to add task' });
    }

    res.json({ message: 'Task added successfully', task: scheduledTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

////////////////SCHEDULE TASK////////////

const getTasks = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const tasks = await tasksModel.find({ traineeId });
    const trainee = await traineeModel.findById(traineeId);

    res.json({ tasks, trainee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};


////////////////DELETE TASK////////////

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await tasksModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ errMsg: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { task } = req.body;

    const updatedTask = await tasksModel.findByIdAndUpdate(
      taskId,
      { task },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ errMsg: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

module.exports = {
    scheduleTask,
    getTasks,
    deleteTask,
    editTask,
}