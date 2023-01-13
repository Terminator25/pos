const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({

    name:{
        type : String,
        required: true
    },
    
    deleted:{
        type: Boolean,
        default:false
    }

  });

  module.exports = mongoose.model('category', categorySchema)