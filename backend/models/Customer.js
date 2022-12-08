const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  gst: {
    type: String,
  },

  address: {
    type: String,
  },

  phno: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
  },
});

module.exports = mongoose.model("customer", customerSchema);
