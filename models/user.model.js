const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personal: {
        firstName: String,
        lastName: String,
        dateOfBirth: String,
        gender: {type: String, enum: [1, 2]},
        ssn: String,
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
            scan: String
        }
    },
    auth: {
        email: String,
        password: String
    },
    address: {
        city: String,
        zip: String,
        street: String,
        apt: String
    },
    mobilePhone: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;