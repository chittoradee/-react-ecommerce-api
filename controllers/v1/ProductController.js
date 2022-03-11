const { Product } = require(`../../models/v1/Product`);
require('dotenv').config();
const { successResponse, errorResponse } = require('../../utils/responseFormat');
const paginate = require('../../utils/pagination');
/* const libHelper = require('../../utils/helper');
const helper = new libHelper(); */
const config = require('../../constants')()
const { uploadToS3, deleteFromS3 } = require('../../utils/s3Bucket');
const add = async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const category_id = req.body.category_id;
        const price = req.body.price;
        const rating = req.body.rating;
        if(typeof req.files === 'undefined' || Object.keys(req.files).length === 0) {
            return errorResponse(req, res, null, 'Please upload valid image');
        }    
        if(req.files.image && req.files['image'][0].originalname){
            const originalFilename = req.files['image'][0].originalname;
            const image = req.files['image'][0].buffer;
            const timestamp = new Date().getTime();
            let filename = 'product-images/' + timestamp + "_" + originalFilename;
            if (!originalFilename.match(/.(jpg|jpeg|png|gif)$/i)){
                return res.status(202).send({status:'error_image_toast',message:'Please upload valid image'})
            }else{
               // filename = helper.uploadFile(config.imagespath,req.files['image'][0]);
                uploadToS3(filename, image, async (err, data) => {
                    if (err) {
                        return errorResponse(req, res, null);
                    }
                    let uploadedFile = data.Key;
                    const imageM = new Product({
                        title: title,
                        //image: filename,
                        image: uploadedFile,
                        description: description,
                        category_id: category_id,
                        price: price,
                        rating: rating
                    });
                    await imageM.save();
                    imageM.image = config.s3BucketUrl + imageM.image;
                    return res.send({status:'success',message:'Product has been added successfully',data:imageM})
                });
            }
        }else{
            return  res.status(202).send({status:'error_image',message:'Please upload image'})
        }
    }
    catch (e) {
        console.log(e)
        return errorResponse(req, res, null);
    }
}   


const list = async (req, res) => {
    try {
        /* const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || config.pagingLimitPerPage;
        const name = req.query.name || ""; */
        //const result = await paginate(page, limit, name , Product, "getAllItems");
        const result = await Product.find().populate('category_id');
        if (!result){
            return errorResponse(req, res, null, 'Could not find items');
        }
        let retArray = [];
        if(result.length > 0){
            result.forEach(element => {
                retArray.push({
                    _id : element._id, 
                    title : element.title, 
                    description : element.description, 
                    category : element.category_id.name, 
                    image : config.s3BucketUrl+element.image,
                    rating:element.rating,
                    price:element.price
                });
            });
        }
        return successResponse(req, res, retArray);
    } catch (e) {
        return errorResponse(req, res, null);
    }
}


const detail = async (req, res) => {
    try {
        /* const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || config.pagingLimitPerPage;
        const name = req.query.name || ""; */
        //const result = await paginate(page, limit, name , Product, "getAllItems");
        const result = await Product.findById(req.params.id).populate('category_id');
        if (!result){
            return errorResponse(req, res, null, 'Could not find items');
        }
        let retArray = {
            _id : result._id, 
            title : result.title, 
            description : result.description, 
            category : result.category_id.name, 
            image : config.s3BucketUrl+result.image,
            rating:result.rating,
            price:result.price
        }
        return successResponse(req, res, retArray);
    } catch (e) {
        return errorResponse(req, res, null);
    }
}

module.exports = { add, list, detail };