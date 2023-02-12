var AWS = require("aws-sdk");
require('dotenv').config({ path: "" })
const config = require('../../config/config')
const s3 = new AWS.S3({
      accessKeyId: config.Aws_Access_Key,
      secretAccessKey: config.Aws_Secret_Key
})

const UploadCatagoryImage = async ({ fileName, fileType, fileData }) => {
      const params = {
            Bucket: config.Aws_Bucket_Name,
            Key: `CataogryImages/${fileName}`,
            Body: fileData,
            ContentEncoding: 'base64',
            ContentType: `image/${fileType}`
      }
      try {
            const upload = await s3.upload(params).promise();
            if (upload.Location){
                  return upload.Location
            }else{
                  return false
            }          
      } catch (error) {
            throw error;
      }
}

module.exports = { UploadCatagoryImage }