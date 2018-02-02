const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personal: {
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        gender: {type: String, enum: [1, 2]},
        ssn: String,
    },
    identification: {
        identificationType: {type: Number, enum: [1, 2, 3]},
        idCard: {
            number: String,
            issuedBy: String,
            dateOfIssue: String,
            validityDate: String
        },
        passport: {
            number: String,
            issuedBy: String,
            dateOfIssue: String,
            validityDate: String,
        }
    },
    auth: {
        email: String,
        password: String
    },
    additional: {
        province: String,
        city: String,
        address: String,
        other: String
    },
    request: {
        mobilePhone: String,
        description: String,
        amount: Number,
        status: {type: Number, enum: [1, 2, 3], default: 1},
        isEmployed: Boolean,
        hasHistory: Boolean,
        isDifficult: Boolean
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;