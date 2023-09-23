const chatModel = require('../../models/chatModel/chatModel')
const messageModel = require('../../models/chatModel/messageModel')
const userModel = require('../../models/userSideModels/userModel')
const adminModel = require('../../models/adminSideModels/adminModel')
const trainerModel = require('../../models/trainerSideModels/trainerModel')


//////////////////ACCESS CHAT///////////////////

const accessChat = async (req, res) => {
    try {
        const userId = req.payload.id
        const { receiverId } = req.body
        const chat = await chatModel.findOne({
            $and: [
                { users: { $in: [userId] } },
                { users: { $in: [receiverId] } }
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
        res.status(200).json({ msg, chatId })
    } catch (error) {
        console.log(error)
        res.status(500).json({ errMsg: error.message })
    }
}












//////////////////GET USERS new chat controller///////////////////

const chat = async (req, res, next) => {
    try {
        const { client, freelancer, post_id } = req.body
        const obj = {}
        if (!client || !freelancer) {
            obj.status = false
            obj.message = "Something went wrong!"
        } else {
            const isChat = await chatSchema.findOne({
                $and: [{ users: { $elemMatch: { $eq: client } } }, { users: { $elemMatch: { $eq: freelancer } } }]
            }).populate("users", "-profile.password")

            if (isChat) {
                obj.status = true
                obj.chat = isChat
            } else {
                const chatObj = {
                    users: [client, freelancer],
                    displayName: "sender"
                }
                const createdChat = await chatSchema.create(chatObj)
                const fullChat = await chatSchema.findOne({ _id: createdChat._id }).populate("users", "-profile.password")
                obj.status = false
                obj.chat = fullChat
            }
            await postSchema.updateOne({ _id: new mongoose.Types.ObjectId(post_id) }, { $set: { selected: new mongoose.Types.ObjectId(freelancer) } })
            res.json(obj)
        }
    } catch (err) {
        res.json({ error: err.message })
    }
}


/////////////////// GET CHAT LIST/////////////

const getChatList = async (req, res, next) => {
    try {
        const user_id = req.params.user_id
        const fullChat = await chatSchema.find({ users: { $in: [user_id] } }).populate("users", "-profile.password").populate("lastMessage").sort({ updatedAt: -1 })
        res.json({ status: true, list: fullChat })
    } catch (err) {
        res.json({ error: err.message })
    }
}

///////////////////ADD MESSAGE/////////////

const sendMessage = async (req, res, next) => {
    try {
        const { sender, content, chat_id } = req.body.messageData
        const obj = {
            sender: new mongoose.Types.ObjectId(sender),
            content: content,
            chat_id: new mongoose.Types.ObjectId(chat_id)
        }
        let message = await messageSchema.create(obj)
        message = await message.populate("sender", "profile.full_name profile.image")
        message = await message.populate("chat_id")
        message = await message.populate("chat_id.users")
        await chatSchema.updateOne({ _id: new mongoose.Types.ObjectId(chat_id) }, { $set: { lastMessage: content } })
        res.json({ message })
    } catch (err) {
        res.json({ error: err.message })
    }
}

///////////////////GET ALL MESSAGES/////////////

const getAllMessages = async (req, res, next) => {
    try {
        let messages = await messageSchema.find({ chat_id: new mongoose.Types.ObjectId(req.params.chat_id) })
            .populate("sender", "profile.full_name profile.username profile.image")
            .populate("chat_id")
        res.json({ messages })
    } catch (err) {
        res.json({ error: err.message })
    }
}


///////////////////GET UNREAD MESSAGE/////////////

const unreadMessage = async (req, res, next) => {
    try {
        const { receiver, chat, setZero } = req.body
        const findChat = await chatSchema.findOne({ _id: new mongoose.Types.ObjectId(chat) })
        let setValue = setZero ? 0 : ((!findChat?.[receiver]) || isNaN(findChat?.[receiver])) ? 0 + 1 : findChat?.[receiver] + 1
        const setNow = setZero ? false : true
        await chatSchema.updateOne({ _id: new mongoose.Types.ObjectId(chat) }, { $set: { [receiver]: setValue } }, { timestamps: setNow })
        res.json({ status: true, unread: setValue })
    } catch (err) {
        res.json({ error: err.message })
    }
}


module.exports = {
    accessChat,
    getUsers,
    addMessage,
    getAllDetails, 
    chat, 
    getChatList, 
    sendMessage, 
    getAllMessages, 
    unreadMessage
}