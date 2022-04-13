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
    title: String,
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
    jobTitle: {
        type: String,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
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
    phone: String,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: "Job"
    }],
    relationship: {
        status: String,
        partner: {
            type: Schema.Types.ObjectId,
            ref: "Client"
        },
        
    },
});

    clientSchema.virtual('fullName')
    .get(function() {
        this.preferredName == false;
        let preferred = this.preferredName ? `(${this.preferredName}) ` : '';
        return `${this.title} ${this.firstName} ${preferred}${this.lastName}`;
    });

    clientSchema.virtual('name')
    .get(function() {
        this.preferredName == false;
        let preferred = this.preferredName ? `(${this.preferredName}) ` : '';
        return `${preferred} ${this.lastName}`;
    });

    clientSchema.virtual('home')
    .get(function() {
        return `${this.address.street}, ${this.address.suburb} ${this.address.state} ${this.address.postcode}`;
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

    clientSchema.virtual('shortDob')
    .get(function() {
        return this.dob.toLocaleDateString( 'en-gb', { year: 'numeric', month:
        'long', day: 'numeric' });
    });

    clientSchema.virtual('dateValue')
    .get(function() {
        let dateValue = this.dob.toLocaleDateString('en-GB').split('/').reverse().join('-');;
  
        return dateValue;
    });



    

module.exports =  mongoose.model('Client', clientSchema);