import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import sharp from 'sharp'
dotenv.config()

const s3 = new AWS.S3({accessKeyId: process.env.AWS_S3_ACCESS_KEY, secretAccessKey: process.env.AWS_S3_KEY_SECRET, region: process.env.AWS_S3_REGION})

const s3ImageUpload = async (file) => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const mimeType = file.split(';')[0].split('/')[1]
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: buffer,
        Key: Date.now() + '.' + mimeType,
        ContentType: `image/${mimeType}`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}

const s3SharpImageUpload = async (file) => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const data = sharp(buffer).resize(300).png({quality: 40})
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: data,
        Key: Date.now() + '.png',
        ContentType: `image/png`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}

const userProfileImage = async (file) => {
    const buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const data = sharp(buffer).resize(400).png({quality: 50})
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: data,
        Key: 'palz.png',
        ContentType: `image/png`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}

const s3VideoUpload = async (file) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: file.buffer,
        Key: Date.now() + '.mp4',
        ContentType: `video/mp4`,
        CreateBucketConfiguration: {
            LocationConstraint: process.env.AWS_S3_REGION
        }
    }
    return await s3Upload(params)
}

const s3Upload = async (params) => {
    try {
        let result = await s3.upload(params).promise()
        return result.Key
    } catch (e) {
        console.log('s3Upload error', e)
    }
}

const deleteImage = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName
    }
    try {
        return await s3.deleteObject(params).promise()
    } catch (err) {
        console.log('File not found. Error is: ' + err.message)
    }
}

//* for delete multiple image from S3 bucket
const deleteMultipleImage = async (fileName) => {
    let values = fileName?.map((e) => {
        return {Key: e}
    })
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: {
            Objects: values,
            Quiet: false
        }
    }

    try {
        let deletedData = await s3.deleteObjects(params).promise()
        console.log('deletedData', deletedData)
        return deletedData
    } catch (error) {
        console.log(error.message)
    }
}

export {s3VideoUpload, s3ImageUpload, deleteImage, s3SharpImageUpload, userProfileImage, deleteMultipleImage}
