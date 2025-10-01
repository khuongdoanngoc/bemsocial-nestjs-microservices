import { Injectable } from '@nestjs/common'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage' // Import Upload class
import { config } from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

config()

@Injectable()
export class AwsS3Service {
    private readonly s3: S3Client
    private readonly bucket: string

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION || '',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        })
        this.bucket = process.env.AWS_S3_BUCKET_NAME || ''
    }

    async uploadFile(file: Express.Multer.File): Promise<string | null> {
        const uploadStartTime = Date.now()
        const key = `uploads/${uuidv4()}-${file.originalname}`

        try {
            // Validate file
            if (!file.buffer || file.buffer.length === 0) {
                console.error('❌ [AWS S3] Upload failed: Invalid file buffer')
                throw new Error('Invalid file buffer')
            }

            // Ensure buffer is properly formatted
            const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer)

            // Sử dụng Upload class và await kết quả
            const upload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: file.mimetype || 'application/octet-stream',
                },
            })

            // Chờ upload hoàn thành
            await upload.done()

            const fileUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
            return fileUrl
        } catch (error) {
            const uploadEndTime = Date.now()
            const uploadDuration = uploadEndTime - uploadStartTime

            console.error(`❌ [AWS S3] Upload failed after ${uploadDuration}ms`)
            console.error(`🔍 [AWS S3] Error details:`, {
                fileName: file.originalname,
                key: key,
                error: error.message,
                errorCode: error.code,
                duration: `${uploadDuration}ms`,
            })

            throw error
        }
    }

    async deleteFile(key: string): Promise<void> {
        try {
            await this.s3.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            )
        } catch (error) {
            console.log('S3 delete error:', error)
        }
    }
}
