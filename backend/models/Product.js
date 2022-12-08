const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({

    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category'
    },

    sku:{
        type : String,
        required: true
    },

    barcode:{
        type : String,
        required: true
    },

    price:{
        type : Number,
        required : true
    },

    pname:{
        type : String,
        required : true
    },

    shortname:{
        type : String
    }

  });

  module.exports = mongoose.model('product', productSchema)