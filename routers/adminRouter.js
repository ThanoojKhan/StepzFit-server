const express = require('express')
const router = express.Router()
const loginController = require('../controllers/adminControllers/LoginController')
const traineeController = require('../controllers/adminControllers/traineeController')
const trainerController = require('../controllers/adminControllers/trainerController')
const planController = require('../controllers/adminControllers/planController')

const auth = require('../middlewares/auth')

{/* Admin*/}
router.post('/login',loginController.login)

{/* Trainee Tab*/}
router.get('/users',auth.verifyAdminToken,traineeController.users)
router.patch('/userStatus',auth.verifyAdminToken,traineeController.userStatus)

{/*Trainer Tab*/}
router.get('/trainers',auth.verifyAdminToken,trainerController.trainers)
router.get('/assignTrainer',auth.verifyAdminToken,trainerController.traineeTrainerDetails)
router.post('/assignTrainer',auth.verifyAdminToken,trainerController.assignTrainer)
router.get('/trainerDetails/:trainerId',auth.verifyAdminToken,trainerController.trainerDetails)
router.post('/addTrainer',auth.verifyAdminToken,trainerController.addTrainer)
router.delete('/deleteTrainer/:trainerId',auth.verifyAdminToken,trainerController.deleteTrainer)
router.patch('/updateTrainer/:trainerId',auth.verifyAdminToken,trainerController.updateTrainer)


{/*Plan Tab*/}
router.post('/addPlan',auth.verifyAdminToken,planController.addPlan)
router.get('/plans',auth.verifyAdminToken,planController.plans)
router.get('/planDetails/:planId',auth.verifyAdminToken,planController.planDetails)
router.delete('/deletePlan/:planId',auth.verifyAdminToken,planController.deletePlan)
router.patch('/planStatus',auth.verifyAdminToken,planController.planStatus)
router.patch('/updatePlan/:planId',auth.verifyAdminToken,planController.updatePlan)



module.exports = router