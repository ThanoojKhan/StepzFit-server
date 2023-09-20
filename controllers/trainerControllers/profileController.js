const trainerModel = require('../../models/trainerSideModels/trainerModel')
const { generateToken } = require('../../middlewares/auth')
require('dotenv').config()



//////////LOGIN////////////

const login = async (req, res) => {
    try {
        console.log('herer');
        let { email, password } = req.body
        const trainer = await trainerModel.findOne({ $and: [{ email }, { password: password }] })
        if (!trainer) {
            res.status(401).json({ errMsg: "Email/Password does not match" })
        } else {
            const token = generateToken(trainer._id, 'trainer')
            res.status(200).json({ message: 'Login successful', name: trainer.name, token, trainerId: trainer._id, role: 'trainer' })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


///////////OTP LOGIN/////////////

const otpLogin = async (req, res) => {
    try {
        const { phone } = req.body
        const trainer = await trainerModel.findOne({ phone })
        if (trainer) {
            const token = generateToken(trainer._id, 'trainer')
            const data = {
                token,
                name: trainer.name,
                trainerId: trainer._id,
                role: 'trainer'
            }
            res.status(200).json({ data })
        } else {
            res.status(404).json({ errMsg: "Trainer not found" })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


////////////////GET PROFILE DETAILS////////////

const loadTrainerProfile = async (req, res) => {
    try {
        const details = await trainerModel.findOne({ _id: req.payload.id })
        res.status(200).json({ details })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}



/////////////////////EDIT PROFILE ////////////////

const editProfile = async (req, res) => {
    try {
        let { name, profileImage, mobile } = req.body
        name = name.trim()
        let trainer = null
        if (mobile) {
            trainer = await trainerModel.findOne({ phone: mobile })
        }
        if (trainer) {
            res.status(404).json({ errMsg: "Mobile number already exist" })
        } else {
            if (mobile) {
                await trainerModel.updateOne({ _id: req.payload.id }, { $set: { name, profileImage, phone: mobile } })
            } else {
                await trainerModel.updateOne({ _id: req.payload.id }, { $set: { name, profileImage } })
            }
            res.status(200).json({ message: "Profile updated successfully" })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}

/////////////////////EDIT PROFILE ////////////////

const profileImageChange = async (req, res) => {
    try {
        const { profileImage } = req.body
        await trainerModel.updateOne({ _id: req.payload.id }, { $set: { profileImage } })
        res.status(200).json({ message: "Profile updated successfully" })
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


module.exports = {
    login,
    loadTrainerProfile,
    editProfile,
    profileImageChange,
    otpLogin
}