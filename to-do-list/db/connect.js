//for connecting our database (mangodb) to our app we create a folder (db)

const mongoose = require('mongoose');

//solution:first connect to db then connect to server
const connectDB = (url) =>{
    mongoose.connect(url,{  
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB