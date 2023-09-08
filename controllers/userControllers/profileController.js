const userModel = require('../../models/userSideModels/userModel')
const nodemailer = require('nodemailer')
const sha256 = require('js-sha256')
const { generateToken } = require('../../middlewares/auth')
require('dotenv').config()


///////////////SEND VERIFY MAIL/////////////

const sendVerifyMail = async (name, email, userId) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS
            },
        });

        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email verification',
            html: `<p>Hii ${name}, Click <a href="${process.env.FRONTENDURL}/emailVerify/${userId}">here</a> to verify your email.</p>`,
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error.message);
                console.log('Email could not be sent')
            } else {
                console.log('Email has been sent:', info.response)
            }
        });
    } catch (error) {
        console.log(error);
        console.log('Error occurred while sending email');
    }
};


////////////SEND FORGOTT PASSWORD MAIL//////////////

const sendForgottPasswordMail = async (email, name, userId) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS
            },
        });

        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Forgott password',
            html: `<p>Hii ${name}, Click <a href="${process.env.FRONTENDURL}/resetPassword/${userId}">here</a> to reset your password.</p>`,
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
};


/////////////////VERIFY MAIL///////////////

const verifyMail = async (req, res, next) => {
    try {
        const { userId } = req.params
        await userModel.updateOne({ _id: userId }, { $set: { isVerified: true } })
        res.status(200).json({ message: "Email verified successfully" })
    } catch (error) {
        console.log(error.message);
        next(error.message)
    }
}

///////////////USER REGISTER //////////////

const register = async (req, res) => {
    try {
        let { name, email, password, phone, city } = req.body
        email = email.trim()
        password = password.trim()
        const user = await userModel.findOne({ $or: [{ email }, { phone }] })
        if (user && !user.password) {
            return res.status(409).json({ errMsg: "User already exist, try Google Login" })
        } else if (user) {
            return res.status(409).json({ errMsg: "User already exist" })
        } else {
            const newUser = await userModel.create({
                name, email, phone, city, password: sha256(password + process.env.SALT)
            })
            sendVerifyMail(name, email, newUser._id)
            res.status(200).json({ message: 'Registration successfull. Verify your mail' })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }

}


//////////USER LOGIN////////////

const login = async (req, res) => {
    try {
        let { email, password, reMail } = req.body
        const user = await userModel.findOne({ $and: [{ email }, { password: sha256(password + process.env.SALT) }] })
        if (!user) {
            res.status(400).json({ errMsg: "Email/Password does not match" })
        } else if (user.isBlocked) {
            res.status(403).json({ errMsg: 'User is blocked by admin' })
        } else if (user && reMail) {
            sendVerifyMail(user.name, user.email, user._id)
        } else if (!user.isVerified) {
            res.status(401).json({ errMsg: "Email is not verified" })
        } else {
            const token = generateToken(user._id, 'user')
            res.status(200).json({ message: 'Login successful', name: user.name, token, userId: user._id, role: 'user' })
        }

    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


///////////OTP LOGIN/////////////

const otpLogin = async (req, res) => {
    try {
        const { phone } = req.body
        const user = await userModel.findOne({ phone })
        if (user) {
            const token = generateToken(user._id, 'user')
            const data = {
                token,
                name: user.name,
                userId: user._id,
                role: 'user'
            }
            res.status(200).json({ data })
        } else {
            res.status(404).json({ errMsg: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}

////////////////////FORGOT PASSWORD///////////////

const forgottPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (user) {
            sendForgottPasswordMail(email, user.name, user._id)
        } else {
            res.status(400).json({ errMsg: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


//////////////RESET PASSWORD///////////////////

const resetPassword = async (req, res) => {
    try {
        const { userId, password } = req.body
        await userModel.updateOne({ _id: userId }, { $set: { password: sha256(password + process.env.SALT) } })
        res.status(200).json({ message: "Password changed" })
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })

    }
}


/////////////////////GOOGLE LOGIN////////////////////

const googleLogin = async (req, res) => {
    try {
        let { profile } = req.body
        const email = profile?.email
        const name = profile?.name
        const profileImage = profile?.picture
        const user = await userModel.findOne({ email: email })
        if (!user) {
            const newUser = await userModel.create({ email, name, profileImage, isVerified: true })
            const token = generateToken(newUser._id, 'user')
            res.status(200).json({ message: "Registration successful", name: newUser.name, token, userId: newUser._id, role: 'user' })
        } else if (user.isBlocked) {
            res.status(403).json({ errMsg: 'Blocked by admin' })
        } else {
            if (!user.isVerified) {
                if (!user.profileImage) {
                    await userModel.updateOne({ email }, { $set: { profileImage, isVerified: true } })
                } else {
                    await userModel.updateOne({ _id: user._id }, { $set: { isVerified: true } })
                }
                const token = generateToken(user._id, 'user')
                res.status(200).json({ message: 'Login successful', name: user.name, token, userId: user._id, role: 'user' })
            } else {
                if (!user.profileImage) {
                    await userModel.updateOne({ email }, { $set: { profileImage } })
                }
                const token = generateToken(user._id, 'user')
                res.status(200).json({ message: 'Login successful', name: user.name, token, userId: user._id, role: 'user' })
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ errMsg: "Server Error" })
    }
}


////////////////GET PROFILE DETAILS////////////

const loadProfile = async (req, res) => {
    try {
        const id = req.payload.id
        const user = await userModel.findOne({ _id: id })
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


/////////////////////EDIT PROFILE ////////////////

const editProfile = async (req, res) => {
    try {
        let { name, profileImage, mobile } = req.body
        name = name.trim()
        if (mobile) {
            await userModel.updateOne({ _id: req.payload.id }, { $set: { name, profileImage, phone: mobile } })
        } else {
            await userModel.updateOne({ _id: req.payload.id }, { $set: { name, profileImage } })
        }
        res.status(200).json({ message: "Profile updated successfully" })
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


module.exports = {
    register,
    login,
    loadProfile,
    editProfile,
    verifyMail,
    googleLogin,
    forgottPassword,
    resetPassword,
    otpLogin
}