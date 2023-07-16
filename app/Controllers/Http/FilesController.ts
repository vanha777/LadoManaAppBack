import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';





export default class FilesController {

    public async store({ request, response }: HttpContextContract) {
        try {
            const postSchema = schema.create({
                cover_image: schema.file({
                    size: '2mb',
                    extnames: ['jpg', 'gif', 'png', 'jpeg'],
                }),
            })

            const payload = await request.validate({ schema: postSchema })

            const result = await payload.cover_image.moveToDisk('', {}, 's3')
            console.log(result)

        } catch (e) {
            console.log(e)
        }
        return response.send("result")

    }




    public async store2({ request, response }: HttpContextContract) {

        request.multipart.onFile('files', {}, async (part) => {
            const ContentType = part.headers['content-type'];
            const ACL = 'public-read';
            const Key = `${(Math.random() * 100).toString(32)}-${part.filename}`;

            const s3Client = new S3Client({ region: 'ap-southeast-2' });
            const command = new PutObjectCommand({
                Bucket: 'adonis.js',
                Key,
                Body: part,
                ContentType,
                ACL,
            });

            try {
                const result = await s3Client.send(command);
                console.log(result);
            } catch (error) {
                console.error('Error uploading file to S3:', error);
            }
        });

        await request.multipart.process();
    }







}
