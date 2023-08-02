import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    confirm: {
        type: Boolean,
        default: false
    },
    code: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLoggedIn:{
        type: Boolean,
        default: false
    },
    role:{
        type:String,
        default:'user'
    }

}, {
    timestamps: true
})

const userModel = new mongoose.model('User', userSchema)
export default userModel