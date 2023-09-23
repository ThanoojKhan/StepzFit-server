const jwt = require('jsonwebtoken')
require('dotenv').config()
const userModel = require('../models/userSideModels/userModel')


module.exports = {
    generateToken: (id, role) => {
        const token = jwt.sign({ id, role }, process.env.JWTSECRET)
        return token
    },

    verifyUserToken: async (req, res, next) => {
        try {
            let token = req.headers.authorization
            if (!token) {
                return res.status(403).json({ errMsg: "Access Denied" })
            }
            if (token.startsWith('Bearer')) {
                token = token.slice(7, token.length).trimLeft()
            }

            const verified = jwt.verify(token, process.env.JWTSECRET)
            const user = await userModel.findOne({ _id: verified.id })

            if (verified.role === 'user' && !user.isBlocked) {
                req.payload = verified
                next()
            } else {
                return res.status(403).json({ errMsg: "Access Denied" })
            }

        } catch (error) {
            res.status(500).json({ errMsg: "Server Error" })
        }
    },

    verifyTrainerToken: async (req, res, next) => {
        try {
            let token = req.headers.authorization
            if (!token) {
                return res.status(403).json({ errMsg: "Access Denied" })
            }
            if (token.startsWith('Bearer')) {
                token = token.slice(7, token.length).trimLeft()
            }

            const verified = jwt.verify(token, process.env.JWTSECRET)

            if (verified.role === 'trainer') {
                req.payload = verified
                next()
            } else {
                return res.status(403).json({ errMsg: "Access Denied" })
            }

        } catch (error) {
            res.status(500).json({ errMsg: "Server Error" })
        }
    },

    verifyAdminToken: async (req, res, next) => {
        try {
            let token = req.headers.authorization
            if (!token) {
                return res.status(403).json({ errMsg: "Access Denied" })
            }
            if (token.startsWith('Bearer')) {
                token = token.slice(7, token.length).trimLeft()
            }

            const verified = jwt.verify(token, process.env.JWTSECRET)

            if (verified.role === 'admin') {
                req.payload = verified
                next()
            } else {
                return res.status(403).json({ errMsg: "Access Denied" })
            }

        } catch (error) {
            res.status(500).json({ errMsg: "Server Error" })
        }
    },

    verifyChatToken: async (req, res, next) => {
        try {
            let token = req.headers.authorization
            if (!token) {
                return res.status(403).json({ errMsg: "Access Denied" })
            }
            if (token.startsWith('Bearer')) {
                token = token.slice(7, token.length).trimLeft()
            }

            const verified = jwt.verify(token, process.env.JWTSECRET)

            if (verified) {
                req.payload = verified
                next()
            } else {
                return res.status(403).json({ errMsg: "Access Denied" })
            }

        } catch (error) {
            res.status(500).json({ errMsg: "Server Error" })
        }
    }

}