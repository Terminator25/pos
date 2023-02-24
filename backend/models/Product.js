const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({

    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category'
    },

    sku:{
        type : String    
    },

    barcode:{
        type : String,
    },

    price:{
        type : Number,
        required : true
    },

    market_price:{
        type : Number,
        default : 0
    },

    pname:{
        type : String,
        required : true
    },

    shortname:{
        type : String
    },

    gstrate:{
        type : Number,
        default : 0
    },
    
    deleted:{
        type: Boolean,
        default:false
    }

  });

  module.exports = mongoose.model('product', productSchema)