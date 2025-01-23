const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {   //connect method on mongoose
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
