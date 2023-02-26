var AWS = require("aws-sdk");
require('dotenv').config({ path: "" })
const config = require('../../config/config')
const s3 = new AWS.S3({
      accessKeyId: config.BUCKET_USER_ACCESS_KEY,
      secretAccessKey: config.BUCKET_USER_SECRET_KEY
})

const UploadCatagoryImage = async ({ fileName, fileType, fileData }) => {
      const params = {
            Bucket: config.Aws_Bucket_Name,
            Key: `CataogryImages/${fileName+'.'+fileType}`,
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

const UploadBannerImage = async ({ fileName, fileType, fileData }) => {
      const params = {
            Bucket: config.Aws_Bucket_Name,
            Key: `BannerImages/${fileName+'.'+fileType}`,
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

const DeleteCatagoryImage = async (fileName) => {
      const params = {
            Bucket: config.Aws_Bucket_Name,
            Key: `CataogryImages/${fileName}`,
      }
      try {
            const isDeleted = await s3.deleteObject(params).promise();
            if (isDeleted){
                  return true
            }else{
                  return false
            }          
      } catch (error) {
            throw error;
      }
}

const DeleteBannerImage = async (fileName) => {
      const params = {
            Bucket: config.Aws_Bucket_Name,
            Key: `BannerImages/${fileName}`,
      }
      try {
            const isDeleted = await s3.deleteObject(params).promise();
            if (isDeleted){
                  return true
            }else{
                  return false
            }          
      } catch (error) {
            throw error;
      }
}

module.exports = { UploadCatagoryImage,DeleteCatagoryImage,UploadBannerImage,DeleteBannerImage }