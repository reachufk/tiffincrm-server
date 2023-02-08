var AWS = require("aws-sdk");
require('dotenv').config({ path: "../../config/.env" })
const s3 = new AWS.S3({
      accessKeyId: process.env.Aws_Access_Id_Key,
      secretAccessKey: process.env.Aws_Secret_Key
})

const UploadCatagoryImage = async ({ fileName, fileType, fileData }) => {
      const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `CataogryImages/${fileName}`,
            Body: fileData,
            ContentEncoding: 'base64',
            ContentType: `image/${fileType}`
      }
      try {
            const upload = await s3.upload(params).promise();
            return upload.Location
      } catch (error) {
            throw error;
      }
}

module.exports = UploadCatagoryImage