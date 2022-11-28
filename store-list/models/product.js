//define model and schema and queries (methods on models)--queries will use in controllers>>product.js
//Mongoose models provide several static helper functions for CRUD operations. Each of these functions returns a mongoose Query object.
//read: https://mongoosejs.com/docs/models.html

const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    //setup propertires and validations:
    name:{
        type:String,
        require:[true,'product name must be provided']  //first parameter is true/false and second parameter is custom error message
    },
    price:{
        type:Number,
        require:[true,'product price must be provided']  //first parameter is true/false and second parameter is custom error message
    },
    featured:{
        type:Boolean,
        default:false  //if we don't have featured in products.json so by default it's false
    },
    rating:{
        type:Number,
        default:4.5     //if the number is not provided then the default number is 4.5
    },
    createdAt:{         //date and time the product created
        type:Date,
        default:Date.now()
    },
    company:{              //name of the companies but we want to add some selected companies not any company (e.g. all,marcos,liddy,ikea,caressa)
        type:String,
        // enum:['ikea','liddy','caressa','marcos']         //for making it limited to the name of some companies we can use enum--read: https://mongoosejs.com/docs/schematypes.html
        //or instead of the above line we can add the error massage when our company name is not in the list
        enum:{
            values: ['ikea','liddy','caressa','marcos'],
            message: '{VALUE} is not supported'  //this will access whatever user is providing
        }
    },
})

module.exports = mongoose.model('Product',productSchema)  //mongoose.model(name, variable)