import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Post from 'App/Models/Post'
import User from "App/Models/User"
import Profile from "App/Models/Profile";
import Offer from 'App/Models/Offer';
import Database from '@ioc:Adonis/Lucid/Database';



export default class PostsController {


    //see Jobs Post
    public async index({ response, auth }: HttpContextContract) {

        //  if (auth.use('web').isAuthenticated) {
        // return all posts
        const result: object[] = [];
        const allPosts = await Post.all();

        for (const post of allPosts) {
            const profile = await Profile.query().where('user_id', post.userId).first()
            const offerCount = await Database.from('offers').where('post_id', post.id).count('* as total')
            result.push({ post, profile, offersCount: offerCount[0].total });
        }

        return response.send(result);


        //  } else {
        //  return response.send("failed to auhenticated")

        //  }


    }

    //User create their post jobs
    public async store({ request, response, auth, session }: HttpContextContract) {

        if (auth.use('web').isAuthenticated) {
            // validators
            const newPostSchema = schema.create({
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
            const payload = await request.validate({ schema: newPostSchema })
            const user = await auth.use('web').authenticate()
            const profile = await user.related('profile').query().first()
            //Create 
            const post = await user!.related('posts').create(payload)
            // Create the post and establish the relationship

            //const post = await user.related('posts').save(payload)
            return response.status(201).send(post)
        } else
        // If Maker- submit offers
        {
            return response.status(401).send('You are not authenticated.')
        }
    }


    //An exsisting Job Posts
    public async show({ request, params, response, auth }: HttpContextContract) {

        const postId = params.id
        //GET :id
        const getPost = await Post.find(postId);
        const getProfile = await Profile.query().where('userId', getPost!.userId).first();
        const offerCount = await Database.from('offers').where('post_id', postId).count('*')
        const offers = parseInt(offerCount[0].count, 10); // Convert the string to an integer


        const result = {
            post: getPost,
            profile: getProfile,
            offers: offers


        }

        return response.send(result)
    }

    // update specific jobs, update offers
    public async update({ params, request, response, auth }: HttpContextContract) {
        // if Users-update job post
        if (auth.use('web').isAuthenticated) {
            //Update
            const body = request.body();
            const user = await auth.use('web').authenticate()
            const post = await Post.findOrFail(params.id);
            console.log(post)
            //profile.firstName = body.firstName;
            //return post.save();
        } else
        // If Maker-update offers
        {

        }
        return response.send('you are not authorised')
    }

    // delete Job Posts,cancel Offer
    public async destroy({ params, response, request, auth }: HttpContextContract) {
        if (auth.use('web').isAuthenticated) {
            //Delete
            // const profile = await Profile.findOrFail(params.id);
            // return profile.delete();
        }
        return response.send('you are not authorised')
    }

}
