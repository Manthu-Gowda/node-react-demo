const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const authSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

authSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Optional: Generate unique id using other methods or libraries
    }
    if (this.isModified('password')) {
        // Hash the password if it has been modified
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('Users', authSchema);

module.exports = User;