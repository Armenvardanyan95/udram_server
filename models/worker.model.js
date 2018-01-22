const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    fullName: String,
    isAdmin: Boolean,
    email: String,
    password: String
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;