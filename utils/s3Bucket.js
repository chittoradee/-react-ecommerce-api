const AWS = require('aws-sdk');

const uploadToS3 = async ( Key , Body , cb ) => {
        const s3 = new AWS.S3({
            accessKeyId : process.env.AWSAccessKeyId,
            secretAccessKey : process.env.AWSSecretKey
        });
        const params = {
            Bucket : process.env.AWSBucketName,
            Key ,
            Body,
            ContentType : 'image/jpg',
            ACL : 'public-read'
        }
        s3.upload(params, async(err,data) => {
           cb(err,data);
        });
}

const deleteFromS3 = async ( Key , cb ) => {
    
    const s3 = new AWS.S3({
        accessKeyId : process.env.AWSAccessKeyId,
        secretAccessKey : process.env.AWSSecretKey
    });
    

    const params = {
        Bucket : process.env.AWSBucketName,
        Key 
        // Body,
        // ContentType : 'image/jpg',
        // ACL : 'public-read'
    }

    s3.deleteObject(params, async(err,data) => {
       cb(err,data);
    });

}



module.exports = { uploadToS3 , deleteFromS3 };