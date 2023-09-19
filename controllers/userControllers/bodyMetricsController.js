const bodyMetricsModel = require('../../models/userSideModels/bodyMetricsModel')

require('dotenv').config()


/////////////////////ADD BODY METRICS ////////////////

const addBodyMetrics = async (req, res) => {
    try {
      const { bodyWeight, date, height, waist, hip, chest, arm, forearm, calf, thighs, bmi } = req.body;
  
      const currentDate = new Date();
      const fifteenDaysAgo = new Date(currentDate);
      fifteenDaysAgo.setDate(currentDate.getDate() - 15);
  
      const existingMetricsWithinLast15Days = await bodyMetricsModel.findOne({
        traineeId: req.payload.id,
        date: { $gte: fifteenDaysAgo, $lte: currentDate },
      });
  
      if (!existingMetricsWithinLast15Days) {
        const newBodyMetrics = await bodyMetricsModel.create({
          traineeId: req.payload.id,
          bodyWeight,
          height,
          waist,
          hip,
          chest,
          arm,
          forearm,
          calf,
          thighs,
          bmi,
          date,
        });
  
        res.status(200).json({ message: "Body metrics added successfully", newBodyMetrics });
      } else {
        res.status(400).json({ errMsg: "Body metrics data found within the last 15 days" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ errMsg: "Server Error" });
    }
  };
  

/////////////////////GET BODY METRICS ////////////////

const getBodyMetrics = async (req, res) => {
    try {
        const trainee_id = req.payload.id;
        const bodyMetrics = await bodyMetricsModel.find({ traineeId: trainee_id });
        if (!bodyMetrics) {
            return res.status(404).json({ errMsg: "Body metrics not found" });
        }

        res.status(200).json({ message: "Body metrics retrieved successfully", bodyMetrics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: "Server Error" });
    }
};

/////////////////////GET ALL BODY METRICS ////////////////

const getBodyMetricsDetails = async (req, res) => {
    try {
        const bodyMetricsId = req.params.id;
        const bodyMetrics = await bodyMetricsModel.findOne({_id : bodyMetricsId});

        if (!bodyMetrics) {
            return res.status(404).json({ errMsg: "Body metrics not found" });
        }

        res.status(200).json({ message: "Body metrics retrieved successfully", bodyMetrics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: "Server Error" });
    }
};


/////////////////////DELETE BODY METRICS ////////////////

const deleteBodyMetrics = async (req, res) => {
    try {
        const metricsId = req.params.id;
        const bodyMetrics = await bodyMetricsModel.findOne({ _id: metricsId });

        if (!bodyMetrics) {
            return res.status(404).json({ errMsg: "Body metrics not found" });
        }

        await bodyMetricsModel.deleteOne({ _id: metricsId });

        return res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errMsg: "Server Error" });
    }
};

/////////////////////EDIT BODY METRICS ////////////////

const editBodyMetrics = async (req, res) => {
    try {
        const bodyMetricsId = req.params.id;
        const {
            bodyWeight,
            date,
            height,
            waist,
            hip,
            chest,
            arm,
            forearm,
            calf,
            thighs,
            bmi,
        } = req.body;

        const updatedBodyMetrics = await bodyMetricsModel.findOneAndUpdate(
            { _id: bodyMetricsId },
            {
                bodyWeight,
                height,
                waist,
                hip,
                chest,
                arm,
                forearm,
                calf,
                thighs,
                bmi,
                date,
            },
            { new: true }
        );

        if (!updatedBodyMetrics) {
            return res.status(404).json({ errMsg: "Body metrics not found" });
        }

        res.status(200).json({
            message: "Body metrics updated successfully",
            updatedBodyMetrics,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errMsg: "Server Error" });
    }
};




module.exports = {

    addBodyMetrics,
    getBodyMetrics,
    deleteBodyMetrics,
    editBodyMetrics,
    getBodyMetricsDetails,
}