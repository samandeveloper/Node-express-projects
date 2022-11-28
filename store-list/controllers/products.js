//write functions--use queries on model in the below functions: https://mongoosejs.com/docs/api.html#model_Model-find

//get the model
const Product = require('../models/product')
//testing route
const getAllProductsStatic = async (req,res) =>{
    // const search = 'a'
    // throw new Error('testing async errors')  //for testing asyncWrapper (express-async-errors) we need to throw Error instead of next()
    
    // const products = await Product.find({})  //find all the products
    //in the above line if we look for the product that for example has featured = true then:
    // const products = await Product.find({featured:true}) 

    // const products = await Product.find({
    // name: {$regex:search, $options:'i'}
    // }) //looking for a and case insensitive

    // const products = await Product.find({}).sort('-name price')  //Important: we use the SPACE between the properties in sort
    //the answer is name STARTS for z to a, but if we have two names start with w then the price between then is lower to higher

    const products = await Product.find({price:{$gt:30}}).sort('price').select('name price').limit(10).skip(1)  //means that our response in frontend/postman has two field of name and price
    //limit(10) shows that if the results are more than 10 show us only 10 of them
    //skip(1) means skip the first result and show from second result

    // res.status(200).json({msg:'products testing route'})
    // res.status(200).json({products})
    res.status(200).json({products, nbHits:products.length})
}


//way1:real route
// const getAllProducts = async (req,res) =>{
//     console.log(req.query)  //send the key value in the postman so we receive the answer of this line
//     //e.g. if in postman we have {{URL}}/products?featured=true then in terminal the answer>>{ featured: 'true' }
    
//     //Note: instead of what we did in the testing route (above function) we don't need to hardcode our search in find
//     const products = await Product.find(req.query)   //find all the properties that we ask as a key/value in the products
//     // res.status(200).json({msg:'products route'})
//     //after receiving the whole data using req.query we receive the products that we want using frontend search or in this project using postman key and feature.e.g. shows only the products that has the featured:true
//     res.status(200).json({products, nbHits:products.length})
// }


//way2:instead of above (passing req.query) we can write: >>this is a solution for when we receive a property like page that we don't have in the products >>we receive an empty array of products and we don't want it. 
const getAllProducts = async (req,res) =>{
    const{featured,company,name,sort,fields, numericFilters} = req.query  //filed is related to select method--WE NAME IT FIELD
    //note: anyname can be added in the above line not only the properties we have in the http://localhost:3000/api/v1/products 
    const queryObject = {}  //empty object
    if(featured){   //if fearured is true--if the property coming with the request (in frontend or postman) we add a new property on our query object and instead of passing query directly we pass the enire query object--this way we avoid receving empty array if we someone enters the property that we don't have (like page=2)
        //set new property in the queryObject
        queryObject.featured = featured === true ? 'true' : false
    }
    if(company){  
        queryObject.company = company  //queryObject.company = req.query.company
        //it should be equal to the company name that we pass in req.query
        //Note: if in postman we add company=bbb (which is not in the list of values) we receive products:[] 
    }
    if(name){
        // queryObject.name = name
        queryObject.name = {$regex:name, $options:'i'}   //if name exist we use regex instead
        //go to postman name:e  >>it gives all the name which has at least one e and case insensetive
    }
    if(numericFilters){
        // console.log(numericFilters)
        const operatorMap = {       //object and properties--upload the user frienly math signs and assign them to mongoose signs ($gt ,$gte,$eq,$lt,$lte)
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>  //if there is match exists get me that key then we replace the values 
            `-${operatorMap[match]}-`  //we add the hyphens purposely
        )
        console.log(filters)  //e.g. answer: price-$gt-40,rating-$gte-4  (so instead of > or < we receive mongoose values)
        const options = ['price','rating']  //these are the two properties in our products that use numericFilters
        filters = filters.split(',').forEach((item)=>{   //e.g. answer: price-$gt-40,rating-$gte-4
            const [field,operator,value] = item.split('-')  //omit the hyphen-- field is price and rating, operator is $gt and value is 40 and 4
            // console.log(field)  //price
            // console.log(operator)       //$gt
            // console.log(value)      //40
            //Important:
            if(options.includes(field)){
                // console.log(queryObject)
                queryObject[field] = {[operator]:Number(value)}   //{ price: { '$gt': 40 }, rating: { '$gte': 4 } }
            }
        })
        
    //in postman>>{{URL}}/products?numericFilters=price>40,rating>=4 in terminal you get:{ price: { '$gt': 40 }, rating: { '$gte': 4 } }
    }   
    console.log(queryObject)
    //Note: instead of what we did in the testing route (above function) we don't need to hardcode our search in find
    // const products = await Product.find(queryObject)   //instead of passing req.query we will pass the queryObject
    //instead of the above line:
    let result = Product.find(queryObject) 

    //NOTE: according to mongoose document (https://mongoosejs.com/docs/queries.html) .sort() only can happens after the find method so:
    if(sort){
        // console.log(sort)
        const sortList = sort.split(',').join(' ') //splits a string into an array of substrings with , and then join it (convert array to string) with space between them
        result = result.sort(sortList)  //means sort by anything user enters in frontend/postman like name,price 
        // products = products.sort()  //issue: of this line and const products = await Product.find(queryObject) is that we have await before the sort--> we should have await after chain of .find().sort()
    }else{
        result = result.sort('createAt')  //if user doesn't enter any sort then sort the result base on the date they are created
    }
    if(fields){  //WE CALLED IT FIELD--it's relatd to the select method
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    //send three values:page,limit,skip-->should be chain after .find()  and we don't add them in the destructure above--we use the req.query.value
    const page = Number(req.query.page) || 1 //means if the user does't add anything the page =1--also req.query.value is string and we need to convert it to NUmber
    const limit = Number(req.query.limit) || 10 // limit=10 if user doesn't add a limit--req.query.limit is a string we need to convert it to Number
    const skip = (page-1)*limit  //e.g. page=2 then skip the first 10 results

    result = result.skip(skip).limit(limit)

    const products = await result  //await must be added after chain of .find().sort()
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}

// Note: https://www.mongodb.com/docs/manual/reference/operator/query/  >>search for regex
//{ <field>: { $regex: /pattern/, $options: '<options>' } }
// { <field>: { $regex: 'pattern', $options: '<options>' } }
{/* { <field>: { $regex: /pattern/<options> } } */}

//for numeric filter we will filter the numbers like price, rating, etc.  e.g. http://localhost:3000/api/v1/products?numericFilters=price>30  => show the result for price>30
// e.g. http://localhost:3000/api/v1/products?numericFilters=price>30&sort=price  //price>30 and in asending order