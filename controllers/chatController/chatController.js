const chatModel = require('../../models/chatModel/chatModel')
const messageModel = require('../../models/chatModel/messageModel')
const userModel = require('../../models/userSideModels/userModel')
const adminModel = require('../../models/adminSideModels/adminModel')
const trainerModel = require('../../models/trainerSideModels/trainerModel')

const accessChat = async (req, res) => {
    try {
        const userId = req.payload.id
        const { receiverId } = req.body
        const chat = await chatModel.findOne({
            $and: [
                { users: { $in: [userId] } },
                {  users: { $in: [receiverId] } }
            ]
        }).populate('users').populate('latestMessage').sort({ updatedAt: -1 })
        if (chat) {
            const messages = await messageModel.find({ chatId: chat._id })
            res.status(200).json({ chat, messages })
        } else {
            const newChat = await chatModel.create({
                users: [userId, receiverId],
                latestMessage: null
            })

            const chat = await chatModel.findOne({ _id: newChat._id }).populate('users').populate('latestMessage')
            const messages = await messageModel.find({ chatId: chat._id })
            res.status(200).json({ chat, messages })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ errMsg: error.message })
    }
}


//////////////////GET USERS///////////////////

const getUsers = async (req, res) => {
    try {
        const trainees = await userModel.find({ trainerId: req.payload.id }).populate('trainerId');
        const admin = await adminModel.findOne()
        res.status(200).json({ trainees, admin })
    } catch (error) {
        console.log(error)
        res.status(500).json({ errMsg: error.message })
    }
}


//////////////////GET ALL DETAILS///////////////////

const getAllDetails = async (req, res) => {
    try {
        const trainees = await userModel.find();
        const trainers = await trainerModel.find();
        const admin = await adminModel.findOne()
        res.status(200).json({ trainees, admin, trainers })

    } catch (error) {
        console.log(error)
        res.status(500).json({ errMsg: error.message })
    }
}

///////////////////ADD MESSAGE/////////////

const addMessage = async (req, res) => {
    try {
        const { message, chatId, sender } = req.body
        const msg = await messageModel.create({ message, chatId, sender })
        await chatModel.updateOne({ _id: chatId }, { $set: { latestMessage: msg._id } })
        res.status(200).json({ msg,chatId })
    } catch (error) {
        console.log(error)
        res.status(500).json({ errMsg: error.message })
    }
}

module.exports = {
    accessChat,
    getUsers,
    addMessage,
    getAllDetails
}