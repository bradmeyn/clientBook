const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account_model');
//client schema
const clientSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    clientId: String,
    salutation: String,
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    preferredName: {
        type: String,
        trim: true,
    },
    dob: Date,
    occupation: {
        type: String,
        trim: true,
    },
    employer: {
        type: String,
        trim: true,
    },
    relationshipStatus: {
        type: String,
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        street: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true
        },
        state: String,
        postcode: String,
    },
    mailAddress: {
        street: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true,
            uppercase: true
        },
        state: String,
        postcode: String,
    },
    phone: {
        number: {
            type: String
        },
        phoneType: String
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: "Job"
    }],
    related: [{
        client: {
            type: Schema.Types.ObjectId,
            ref: "Client"
        },
        relationship: String
    }]
});

clientSchema.virtual('fullName')
    .get(function() {
        this.preferredName == false;
        let preferred = this.preferredName ? `(${this.preferredName}) ` : '';
        return `${this.salutation} ${this.firstName} ${preferred}${this.lastName}`;
    });

    clientSchema.virtual('home')
    .get(function() {
        return `${this.address.street}, ${this.address.suburb} ${this.address.state} ${this.address.postcode}`;
    });

    clientSchema.virtual('mail')
    .get(function() {
        return `${this.mailAddress.street}, ${this.mailAddress.suburb} ${this.mailAddress.state} ${this.mailAddress.postcode}`;
    });


    clientSchema.virtual('age')
    .get(function() {
        let today = new Date();

        let age = today.getFullYear() - this.dob.getFullYear();
        let m = today.getMonth() - this.dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < this.dob.getDate())) {
            age--;
        }
        return age;
    });



    

module.exports =  mongoose.model('Client', clientSchema);