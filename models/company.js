const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const companySchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

companySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Company', companySchema );

