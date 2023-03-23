const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,   //Note: type of the image is string
    required: true,
  }
});

module.exports = mongoose.model('Product', ProductSchema)
