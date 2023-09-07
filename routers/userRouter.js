const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers/profileController')
const bodyMetricsController = require('../controllers/userControllers/bodyMetricsController')
const taskController = require('../controllers/userControllers/taskController')
const foodController = require('../controllers/userControllers/foodControler')

const auth = require('../middlewares/auth')

{/* Profile*/}

router.post('/register',userController.register)
router.get('/verify/:userId',userController.verifyMail)
router.post('/login',userController.login)
router.post('/otpLogin',userController.otpLogin)
router.post('/resetPassword',userController.resetPassword)
router.post('/forgottPassword',userController.forgottPassword)
router.get('/profile',auth.verifyUserToken,userController.loadProfile)
router.post('/googleLogin',userController.googleLogin)
router.patch('/editProfile',auth.verifyUserToken,userController.editProfile)

{/* Body Metrics*/}

router.post('/addBodyMetrics',auth.verifyUserToken,bodyMetricsController.addBodyMetrics)
router.patch('/editBodyMetrics/:id',auth.verifyUserToken,bodyMetricsController.editBodyMetrics)
router.get('/bodyMetrics',auth.verifyUserToken,bodyMetricsController.getBodyMetrics)
router.get('/bodyMetricsDetails/:id',auth.verifyUserToken,bodyMetricsController.getBodyMetricsDetails)
router.delete('/deleteBodyMetrics/:id',auth.verifyUserToken,bodyMetricsController.deleteBodyMetrics)

{/* Task Management*/}

router.get('/getTasks',auth.verifyUserToken,taskController.getTasks)
router.get('/trainerDetails',auth.verifyUserToken,taskController.getTrainerDetails)
router.post('/markTaskAsDone/:taskId', auth.verifyUserToken, taskController.markTaskAsDone);

{/* Food Tracker*/}

router.get('/foodDB',auth.verifyUserToken,foodController.getFoodDB)
router.get('/getFoodIntake',auth.verifyUserToken,foodController.getFoodIntake)
router.post('/addFood',auth.verifyUserToken,foodController.addFood)





module.exports = router