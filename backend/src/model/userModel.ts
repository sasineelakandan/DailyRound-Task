import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    displayName: {
        type: String,
        required: false
    },
    photoURL: {
        type: String,
        required: false
    },
    createdAt: { type: Date, default: Date.now }
})

const user = mongoose.model('Users', userSchema)

export default user