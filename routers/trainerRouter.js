const express = require('express')
const router = express.Router()
const profileController = require('../controllers/trainerControllers/profileController')
const traineeController = require('../controllers/trainerControllers/traineeDataController')
const taskManagerController = require('../controllers/trainerControllers/taskScheduler')
const auth = require('../middlewares/auth')

{/* Profile*/}

router.post('/login',profileController.login)
router.post('/otpLogin',profileController.otpLogin)
router.get('/trainerDetails',auth.verifyTrainerToken,profileController.loadTrainerProfile)
router.patch('/editProfile',auth.verifyTrainerToken,profileController.editProfile)
router.post('/profileImageChange',auth.verifyTrainerToken,profileController.profileImageChange)

{/* Trainee Data*/}

router.get('/getTrainees',auth.verifyTrainerToken,traineeController.loadTrainees)
router.get('/bodyMetrics/:traineeId',auth.verifyTrainerToken,traineeController.loadBodyMetrics)
router.get('/getFoodIntake/:traineeId',auth.verifyTrainerToken,traineeController.loadFoodIntake)

{/* Task Scheduler*/}

router.get('/getTasks/:traineeId',auth.verifyTrainerToken,taskManagerController.getTasks)
router.post('/scheduleTask/:traineeId',auth.verifyTrainerToken,taskManagerController.scheduleTask)
router.put('/editTask/:taskId', auth.verifyTrainerToken, taskManagerController.editTask);
router.delete('/deleteTask/:taskId', auth.verifyTrainerToken, taskManagerController.deleteTask);



module.exports = router