const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true
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

  pin:{
    type: String,
    
  },

  state:{
    type: String,
    
  },

  entity:{
    type: String,
    
  },

  deleted:{
      type: Boolean,
      default:false
  }
});

module.exports = mongoose.model("customer", customerSchema);
