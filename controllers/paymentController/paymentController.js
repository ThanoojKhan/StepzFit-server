
const Stripe = require('stripe')
require('dotenv').config()




const createCheckoute = async (req, res) => {
  try {

  
  } catch (error) {
    res.status(500).json({ errMsg: "Server Error" })
    console.log(error)
  }
}



module.exports = {
  createCheckoute
}