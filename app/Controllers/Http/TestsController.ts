import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Drive from '@ioc:Adonis/Core/Drive'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Application } from '@adonisjs/core/build/standalone';
import Post from 'App/Models/Post'
import User from "App/Models/User"
import { test } from '@japa/runner';
import Database from '@ioc:Adonis/Lucid/Database';


export default class TestsController {

    public async test1({ response, auth, }: HttpContextContract) {
        // check if user has loged in sessions
        // await auth.use('web').authenticate()
        // User is authenticated
        if (auth.user) {
            const profile = await auth.user.related('profile').query()
            return response.status(200).send(profile)
        } else {
            return response.status(401).send('You are not authenticated.')
        }
        //response.status(200).send('welcome,you are authenticated.')
        // User is not authenticated
        //response.status(401).send('You are not authenticated.')

    }


    public async test2({ request, response, auth, session }: HttpContextContract) {



        // convert data type from formData
        const metaPostcode = parseInt(request.input('metaPostCode'), 10);
        const metaBudget = parseInt(request.input('metaBudget'), 10);
        const publishInput = request.input('publish')
        const publish = publishInput == 'true' ? true : false;
        // imagesLink from s3
        const images: string[] = []

        //upload images
        const imagesInput = request.files('images')
        const putFile = Promise.allSettled(
            imagesInput.map(async (image) => {
                await image.moveToDisk('', {}, 's3');
                images.push(image.filePath!);
            })
        );
        // only upload if there's files
        if (images.length > 0) {
            await putFile
        }

        //  const commentsInput = request.input('comments')
        //  const comments = commentsInput == 'true' ? true : false;

        // assign the request.all() to const input
        const input = {
            title: request.input('title'), description: request.input('description'),
            metaType: request.input('metaType'), publish, // comments,
            metaSuburb: request.input('metaSuburb'), metaAddress: request.input('metaAddress')
            , metaPostcode, metaBudget, metaState: request.input('metaState'), images
        }

        //get user profile
        const user = await auth.use('web').authenticate()

        //create post
        const post = await user!.related('posts').create(input)

        console.log(post)


        // condition check request.data
        /*   const newPostSchema = schema.create({
                title: schema.string({ trim: true }),
                type: schema.string({ trim: true }),
                description: schema.string({ trim: true }),
                images: schema.array().members(schema.string({ trim: true })),
                budget: schema.number.optional(),
                address: schema.string({ trim: true }),
                state: schema.string({ trim: true }),
                postCode: schema.number(),
                status: schema.string({ trim: true })
            })
            //validate
            const payload = await request.validate({ schema: newPostSchema })
           
     
 
    */

        // Update the post's images column
        // await post.merge({ images: imagesUrl }).save();
    }



    /*      const {
              title, description, cover, metaType, publish,
              comments, metaTitle, metaSuburb, parseInt(request.input('metaPostCode'), 10);, metaBudget, metaState
      } = request.only([
              'title', 'description', 'cover', 'metaType',
              'publish', 'comments', 'metaTitle', 'metaSuburb', 'metaPostCode', 'metaBudget', 'metaState'
          ]);
      const posts = {
          title, description, cover, metaType, publish,
          comments, metaTitle, metaSuburb, metaPostCode, metaBudget, metaState
      }
    */




    //   return response.status(200).send(post)


}




