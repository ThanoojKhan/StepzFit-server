const traineeModel = require('../../models/userSideModels/userModel')
const bodyMetricsModel = require('../../models/userSideModels/bodyMetricsModel')
const foodIntakeModel = require('../../models/userSideModels/foodIntakeModel')

require('dotenv').config()




////////////////GET PROFILE DETAILS////////////

const loadTrainees = async (req, res) => {
    try {
        const id = req.payload.id
        const trainee = await traineeModel.find({ trainerId: id })
        res.status(200).json({ trainee })
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}

////////////////GET BODY METRICS DETAILS////////////

const loadBodyMetrics = async (req, res) => {
    const traineeId = req.params.traineeId;
    try {
      const bodyMetrics = await bodyMetricsModel.find({ traineeId: traineeId });
      const trainee = await traineeModel.findOne({ _id: traineeId})
      if (!bodyMetrics) {
        return res.status(404).json({ errMsg: 'Data not found' });
      }
      res.json({ bodyMetrics, trainee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errMsg: 'Internal server error' });
    }
  };

  ////////////////GET FOOD INTAKE DETAILS////////////

const loadFoodIntake = async (req, res) => {
  const traineeId = req.params.traineeId;
  const trainee = await traineeModel.findOne({_id: traineeId})

  try {
    const foodIntake = await foodIntakeModel.find({ traineeId: traineeId }).populate('food');
    if (!foodIntake) {
      return res.status(404).json({ errMsg: 'Data not found' });
    }
    res.json({ foodIntake, trainee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};


////////////////SCHEDULE TASK////////////

const scheduleTask = async (req, res) => {
    const traineeId = req.params.traineeId;
    const { date, task } = req.body;
    try {
      const existingTask = await tasksModel.findOne({ trainerId: traineeId, date: date });
  
      if (existingTask) {
        return res.status(400).json({ errMsg: 'Task already scheduled for the same day' });
      }
  
      const newTask = await tasksModel.create({ trainerId: traineeId, date: date, task: task });
  
      if (!newTask) {
        return res.status(404).json({ errMsg: 'Failed to add task' });
      }
  
      res.json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ errMsg: 'Internal server error' });
    }
  };

  ////////////////SCHEDULE TASK////////////


module.exports = {
    loadTrainees,
    loadBodyMetrics,
    scheduleTask,
    loadFoodIntake,
}