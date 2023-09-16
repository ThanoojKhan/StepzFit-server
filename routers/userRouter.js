const express = require('express')
const router = express.Router()
const userController = require('../controllers/userControllers/profileController')
const bodyMetricsController = require('../controllers/userControllers/bodyMetricsController')
const taskController = require('../controllers/userControllers/taskController')
const foodController = require('../controllers/userControllers/foodControler')
const planController = require('../controllers/adminControllers/planController')
const auth = require('../middlewares/auth')

{/* Profile*/}

router.post('/register',userController.register)
router.get('/verify/:userId',userController.verifyMail)
router.get('/plans',planController.plans)
router.get('/planDetails/:planId',planController.planDetails)
router.post('/login',userController.login)
router.post('/otpLogin',userController.otpLogin)
router.post('/resetPassword',userController.resetPassword)
router.post('/forgottPassword',userController.forgottPassword)
router.get('/profile',auth.verifyUserToken,userController.loadProfile)
router.post('/googleLogin',userController.googleLogin)
router.patch('/editProfile',auth.verifyUserToken,userController.editProfile)

{/* Dashboard*/}
router.get('/dashBoard',auth.verifyUserToken,userController.loadDashboard)
router.post('/setDashImage',auth.verifyUserToken,userController.setDashImage)

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
router.delete('/deleteFoodIntake/:id',auth.verifyUserToken,foodController.deleteFoodIntake)
router.post('/addFood',auth.verifyUserToken,foodController.addFood)

{/* Plan*/}

router.get('/myPlan',auth.verifyUserToken,planController.myPlan)

module.exports = router