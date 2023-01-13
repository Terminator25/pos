const mongoose = require('mongoose');
const { Schema } = mongoose;

// const customerSchema = new Schema({
//     name: {
//       type: String,
//     },
  
//     gst: {
//       type: String,
//     },
  
//     address: {
//       type: String,
//     },
  
//     phno: {
//       type: String,
//     },
  
//     email: {
//       type: String,
//     },
//   });

const billSchema = new Schema({

    // customer : {
    //     type: String
    // },
    customer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        default: null
    },

    products : [{pname : String, price : Number, quantity : Number, gstrate : Number}],

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

    gstamount:{
        type: Number,
        default:0
    },

    time:{
        type: Date
    },

    deleted:{
        type: Boolean,
        default:false
    }

  });

  module.exports = mongoose.model('bill', billSchema)