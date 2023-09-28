const trainerModel = require('../../models/trainerSideModels/trainerModel')
const traineeModel = require('../../models/userSideModels/userModel')


//////////////GET TRAINERS/////////////////

const trainers = async (req, res) => {
    try {
        const trainers = await trainerModel.find({})
        res.status(200).json({ trainers })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////GET TRAINERS AND TRAINEE DETAILS/////////////////

const traineeTrainerDetails = async (req, res) => {
    try {
        const trainers = await trainerModel.find({})
        const trainees = await traineeModel.find({})
        res.status(200).json({ trainers, trainees })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////GET TRAINER DETAILS/////////////////

const trainerDetails = async (req, res) => {
    try {
        const details = await trainerModel.findOne({ _id: req.params.trainerId })
        res.status(200).json({ details })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////ADD TRAINER/////////////////

const addTrainer = async (req, res) => {
    try {
        let { firstName, secondName, email, dob, gender, phone, department, certification, userName, password, addedDate } = req.body
        email = email.trim()
        password = password.trim()
        const trainer = await trainerModel.findOne({ $or: [{ email }, { phone }] })
        if (trainer) {
            return res.status(409).json({ errMsg: "Trainer already exist" })
        } else {
            await trainerModel.create({
                firstName, secondName, email, dob, gender, phone, department, certification, userName, password, addedDate
            })
            res.status(200).json({ message: `Trainer ${firstName} Added` })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////ASSIGN TRAINER/////////////////

const assignTrainer = async (req, res) => {
    try {
        let { selectedTrainee, selectedTrainer } = req.body
        await traineeModel.updateOne({ _id: selectedTrainee }, { $set: { trainerId: selectedTrainer } })
        res.status(200).json({ message: `Trainer Asssigned` })

    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////UPDATE TRAINER/////////////////

const updateTrainer = async (req, res) => {
    const { trainerId } = req.params;

    try {
        const trainer = await trainerModel.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ errMsg: 'Trainer not found' });
        }

        const updateFields = {};

        if (req.body.firstName) {
            updateFields.firstName = req.body.firstName;
        }
        if (req.body.secondName) {
            updateFields.secondName = req.body.secondName;
        }
        if (req.body.email) {
            updateFields.email = req.body.email;
        }
        if (req.body.d_o_b) {
            updateFields.d_o_b = req.body.d_o_b;
        }
        if (req.body.gender) {
            updateFields.gender = req.body.gender;
        }
        if (req.body.phone) {
            updateFields.phone = req.body.phone;
        }
        if (req.body.department) {
            updateFields.department = req.body.department;
        }
        if (req.body.certification) {
            updateFields.certification = req.body.certification;
        }
        if (req.body.userName) {
            updateFields.userName = req.body.userName;
        }
        if (req.body.password) {
            updateFields.password = req.body.password;
        }
        if (req.body.profileImage) {
            updateFields.profileImage = req.body.profileImage;
        }
        if (req.body.coverImage) {
            updateFields.coverImage = req.body.coverImage;
        }
        if (req.body.addedDate) {
            updateFields.addedDate = req.body.addedDate;
        }

        await trainerModel.updateOne({ _id: trainerId }, { $set: updateFields });

        return res.status(200).json({ message: 'Trainer updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: 'Internal server error' });
    }
};

//////////////UPDATE TRAINER/////////////////

const deleteTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;

        const isTrainerIdUsedInTrainee = await traineeModel.exists({ trainerId: trainerId });

        if (isTrainerIdUsedInTrainee) {
            return res.status(400).json({ errMsg: 'Trainer cannot be deleted as it is assigned to a trainee' });
        }

        const deletedTrainer = await trainerModel.findByIdAndDelete(trainerId);

        if (!deletedTrainer) {
            return res.status(404).json({ errMsg: 'Trainer not found' });
        }

        return res.status(200).json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: 'Internal server error' });
    }
};

module.exports = {
    addTrainer,
    trainers,
    trainerDetails,
    traineeTrainerDetails,
    assignTrainer,
    updateTrainer,
    deleteTrainer
}