//image security
const Clarifai = require('clarifai');
const app = new Clarifai.App({
apiKey: '5811f725850a45738d35b52dfbd00b7f'
// apiKey: process.env.API_CLARIFAI
});

const handleApiCall = (req,res)=>{
// 	   app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	
// 	app.models.predict('a403429f2ddf4b49b307e318f00e528b', req.body.input)
	
// 	app.models.predict({
// 	model_id: "a403429f2ddf4b49b307e318f00e528b",
// //      version: "34ce21a40cc24b6b96ffee54aabff139",
// 	version: "45fb9a671625463fa646c3523a3087d5"
// 	},
// 	req.body.input)	
	
// 	app.models.predict( {
//   model_id: "a403429f2ddf4b49b307e318f00e528b",
//   version: "c0c0ac362b03416da06ab3fa36fb58e3",
//      }, req.body.input  )
	
	app.models
      .predict(
        {
          id: 'face-detection',
          name: 'face-detection',
          version: "45fb9a671625463fa646c3523a3087d5",
          type: 'visual-detector',
        }, req.body.input)
	
	
      .then(data=>{
      	res.json(data);
      })
      .catch(err=>res.status(400).json('unable to work with API'))
    }
//image 
	const handleImage = (req,res,db)=>{
	const {id} = req.body;
	db('users')
	 .where('id','=',id)
	// .where({id:'id'})
	.increment('entries',1)
	.returning('entries')
	.then(entries=>{res.json(entries[0]);})

.catch(err=>res.status(400).json('unable to get entries'))
}
module.exports={
	handleImage:handleImage,
	handleApiCall:handleApiCall
};
