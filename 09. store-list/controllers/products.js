//get the model
const Product = require('../models/product')

//testing route
const getAllProductsStatic = async (req,res) =>{
    const products = await Product.find({price:{$gt:30}}).sort('price').select('name price').limit(10).skip(1)  //means that our response in frontend/postman has two field of name and price
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts = async (req,res) =>{
    const{featured,company,name,sort,fields, numericFilters} = req.query  //filed is related to select method
    //note: anyname can be added in the above line not only the properties we have in the http://localhost:3000/api/v1/products 
    const queryObject = {}  //empty object
    if(featured){   //if fearured is true
        //set new property in the queryObject
        queryObject.featured = featured === true ? 'true' : false
    }
    if(company){  
        queryObject.company = company  //queryObject.company = req.query.company
      
    }
    if(name){

        queryObject.name = {$regex:name, $options:'i'}   //if name exist we use regex instead
    }
    if(numericFilters){
        const operatorMap = {     //object and properties--upload the userfrienly math signs and assign them to mongoose signs ($gt ,$gte,$eq,$lt,$lte)
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
        const options = ['price','rating']  //these are the two properties in our products that use numericFilters
        filters = filters.split(',').forEach((item)=>{   //answer: price-$gt-40,rating-$gte-4
            const [field,operator,value] = item.split('-')  //omit the hyphen-- field is price and rating, operator is $gt and value is 40 and 4
 
            if(options.includes(field)){
                // console.log(queryObject)
                queryObject[field] = {[operator]:Number(value)}   //{ price: { '$gt': 40 }, rating: { '$gte': 4 } }
            }
        })
        
    }   
    //instead of the above line:
    let result = Product.find(queryObject) 

    if(sort){
        const sortList = sort.split(',').join(' ') //splits a string into an array of substrings with , and then join it (convert array to string) with space between them
        result = result.sort(sortList)  //means sort by anything user enters in frontend/postman like name,price 
    }else{
        result = result.sort('createAt')  //if user doesn't enter any sort then sort the result base on the date they are created
    }
    if(fields){  //WE CALLED IT FIELD--it's relatd to the select method
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    const page = Number(req.query.page) || 1 //means if the user does't add anything the page =1
    const limit = Number(req.query.limit) || 10 // limit=10 if user doesn't add a limit
    const skip = (page-1)*limit  //e.g. page=2 then skip the first 10 results

    result = result.skip(skip).limit(limit)

    const products = await result  //await must be added after chain of .find().sort()
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}
