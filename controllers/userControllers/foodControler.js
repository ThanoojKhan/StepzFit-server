const foodDBModel = require('../../models/userSideModels/foodDBModel')
const foodIntakeModel = require('../../models/userSideModels/foodIntakeModel')

require('dotenv').config()

/////////////////////GET FOODS ////////////////

const getFoodDB = async (req, res) => {

  try {
    const foods = await foodDBModel.find().select('name');
    res.json({ foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

/////////////////////GET FOOD INTAKE ////////////////

const getFoodIntake = async (req, res) => {

  try {
    const foodIntake = await foodIntakeModel.find({ traineeId: req.payload.id }).populate('food')
    res.json({ foodIntake });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};


/////////////////////ADD FOOD ////////////////

const addFood = async (req, res) => {
  const { food, quantity, time } = req.body;
  const traineeId = req.payload.id;
  const date = new Date();

  try {

    await foodIntakeModel.create({
      traineeId,
      food,
      quantity,
      time,
      date
    });

    res.status(200).json({ message: 'Food added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

/////////////////////ADD FOOD ////////////////

const deleteFoodIntake = async (req, res) => {
  const { id } = req.params;

  try {
    await foodIntakeModel.deleteOne({ _id: id });

    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errMsg: 'Internal server error' });
  }
};

module.exports = {

  getFoodDB,
  addFood,
  getFoodIntake,
  deleteFoodIntake,
}