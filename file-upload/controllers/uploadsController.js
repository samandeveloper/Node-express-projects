//define one route to upload the image

//check the image:
//1. check if images file exists
//2. check format of the images
//3. check size of the images

const path = require("path"); 
const { StatusCodes } = require("http-status-codes"); 
const CusomError = require("../errors"); 
const cloudinary = require("cloudinary").v2; //MUST add v2 at the end of the cloudinary
//for removing "tmp" folder after uploading images on cloudinary
const fs = require("fs"); 

//way1:upload images in server
const uploadProductImageLocal = async (req, res) => {
  console.log(req.files); //see a huge object
  if (!req.files) {
    //1. check if images file exists
    throw new CusomError.BadRequestError("No file uploaded");
  }

  //sent the req.file.imagekeyname to the variable
  let productImage = req.files.image; //image is the key name of the image

  if (!productImage.mimetype.startsWith("image")) {
    //2. check format of the images
    throw new CusomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;
  if (!productImage.size > maxSize) {
    //3. check size of the images
    throw new CusomError.BadRequestError(
      "Please upload image smaller than 1KB"
    );
  }

  //use the path module to upload the image file on the server
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}` //Note: the / after uploads in necessary
  );
  //Then create a path that we need to pass in the move function. Which is .mv
  await productImage.mv(imagePath); 

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } }); //after uploading the image in the srver now in this line, we read the image file
};

//way2:upload images in cloud (cloudinary)
//in this way we don't need the upload folder (contains images) in the public folder-we can remove them
const uploadProductImage = async (req, res) => {
  //upload method first argument is the path for the image- the path is public>uploads so we get the images from server
  //in cloudinary package we still need the express-fileupload package since:
  // we need it to parse the images file and also for setup a temp directory so we can access it with cloudinary
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );

  //for removing the "tmp" we use fs build-in node module with the ublinkSync method
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage, 
};
