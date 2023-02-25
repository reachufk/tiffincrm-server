import AWS from "aws-sdk"
import { environment } from "../config/environment.config"
const s3 = new AWS.S3({
      accessKeyId: environment.ACCESS_KEY_ID,
      secretAccessKey: environment.SECRET_ACCESS_KEY
})

export const uploadImageToS3 = async (imageData: any, collation: string) => {
      const { id, fileData, fileType } = imageData
      const params = {
            Bucket: environment.AWS_BUCKET_NAME as string,
            Key: `${collation}/${id}.${fileType}`,
            Body: fileData,
            ContentEncoding: 'base64',
            ContentType: `${fileType}`
      }
      try {
            const { Location } = await s3.upload(params).promise();
            if (!Location) {
                  return null
            }
            return Location;
      } catch (error) {
            console.log(error);
            throw error;
      }
}


export const deleteImageFromS3 = async (url: string, collation: string) => {
      const params = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: `${collation}/${url}`,
      }
      try {
            const isDeleted = await s3.deleteObject(params).promise();
            if (!isDeleted) {
                  return false;
            }
            return true;
      } catch (error) {
            throw error;
      }
}