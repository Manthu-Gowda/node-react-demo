const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    employeeName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
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
    updated_at: {
        type: Date
    }
});

employeeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Employee').countDocuments();
        this.id = count + 1;
    }
    next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
