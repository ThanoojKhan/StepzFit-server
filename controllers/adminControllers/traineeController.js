const userModel = require('../../models/userSideModels/userModel')
const nodemailer = require('nodemailer')


//////////////BLOCK/UNBLOCK///////////

const userStatus = async (req, res) => {
    try {
        const { userId, blocked } = req.body
        const user = await userModel.findOne({ _id: userId })

        if (blocked) {
            await userModel.updateOne({ _id: userId }, { $set: { isBlocked: false } })
            res.status(200).json({ message: 'User Unblocked' })

        } else {
            await userModel.updateOne({ _id: userId }, { $set: { isBlocked: true } })
            res.status(200).json({ message: 'User Blocked' })


            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'freshorgani@gmail.com',
                        pass: process.env.EMAILPASS
                    },
                });

                const mailOption = {
                    from: 'freshorgani@gmail.com',
                    to: user.email,
                    subject: 'Blocked by admin',
                    html: `<p>Hii ${user.name}, You are blocked by Admin.</p>`,
                };

                transporter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log('Email could not be sent', error.message)
                    } else {
                        console.log('Email has been sent:', info.response)
                    }
                })
            } catch (error) {
                console.log(error)
                console.log('Error occurred while sending email');
            }


        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

//////////////GET USERS/////////////////

const users = async (req, res) => {
    try {
        const users = await userModel.find({})
        res.status(200).json({ users })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}

module.exports = {
    userStatus,
    users,
}