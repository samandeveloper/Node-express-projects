const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    //setup propertires and validations:
    name:{
        type:String,
        require:[true,'product name must be provided']  
    },
    price:{
        type:Number,
        require:[true,'product price must be provided'] 
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
        enum:{
            values: ['ikea','liddy','caressa','marcos'],
            message: '{VALUE} is not supported'  //this will access whatever user is providing
        }
    },
})

module.exports = mongoose.model('Product',productSchema)  //mongoose.model(name, variable)