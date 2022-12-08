const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    name: {
      type: String,
    },
  
    gst: {
      type: String,
    },
  
    address: {
      type: String,
    },
  
    phno: {
      type: String,
    },
  
    email: {
      type: String,
    },
  });

const billSchema = new Schema({

    customer : customerSchema,

    products : [{pname : String, price : Number, quantity : Number}],

    total : {
        type: Number,
        default : 0
    },

    paymentmode:{
        type: String
    },

    billnumber:{
        type: String,
        unique: true
    },

    discount : {
        type: Number,
        default : 0
    },

    amount : {
        type: Number,
        default : 0
    },

    gst:{
        type: Number,
        default:0
    },

    time:{
        type: Date,
    }

  });

  module.exports = mongoose.model('bill', billSchema) || mongoose.model('customer', customerSchema);