const adminModel = require('../../models/adminSideModels/adminModel')
const { generateToken } = require('../../middlewares/auth')


//////////////ADMIN LOGIN///////////

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ $and: [{ email }, { password }] })
        if (admin) {
            const token = generateToken(admin._id, 'admin')
            res.status(200).json({ message: "Admin Loading", name: admin.name, adminId: admin._id, role: 'admin', token })
        } else {
            res.status(409).json({ errMsg: 'Unknown Admin Credentials' })
        }
    } catch (error) {
        res.status(500).json({ errMsg: "Server Error" })
    }
}


module.exports = {
    login
}