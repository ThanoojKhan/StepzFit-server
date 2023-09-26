const express  = require('express')
const auth = require('../middlewares/auth')
const chatController = require('../controllers/chatController/chatController')
const router = express.Router()

router.post('/accessChat',auth.verifyChatToken,chatController.accessChat)
router.get('/traineeDetails',auth.verifyChatToken,chatController.getUsers)
router.get('/userChatList',auth.verifyChatToken,chatController.getUserChatList)
router.get('/allDetails',auth.verifyChatToken,chatController.getAllDetails)
router.post('/addMessage',auth.verifyChatToken,chatController.addMessage)


{/* new chat router */}
router.get('/userChatList',auth.verifyChatToken,chatController.getUserChatList)
router.get('/adminChatList',auth.verifyChatToken,chatController.getAdminChatList)
router.get('/trainerChatList',auth.verifyChatToken,chatController.getTrainerChatList)


module.exports = router