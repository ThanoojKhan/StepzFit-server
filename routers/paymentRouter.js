const express  = require('express')
const paymentController = require('../controllers/paymentController/paymentController')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/subscribePlan',auth.verifyUserToken,paymentController.subscribePlan)
router.get('/paymentSuccess',auth.verifyUserToken,paymentController.paymentSuccess)
router.get('/paymentFailed',auth.verifyUserToken,paymentController.paymentFail)

module.exports = router