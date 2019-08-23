const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    }
})

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})

adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = jwt.sign({_id: admin._id}, process.env.JWT_KEY)
    await admin.save()
    return token
}

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email} )
    if (!admin) {
        throw new Error( 'Invalid user credentials' )
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid password credentials' )
    }
    return admin
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin