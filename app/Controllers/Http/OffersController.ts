import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Offer from 'App/Models/Offer';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Post from 'App/Models/Post'

export default class OffersController {

    //see Jobs Post
    public async index({ response, auth }: HttpContextContract) {
        //User view Only
        if (auth.use('web').isAuthenticated) {

        } else
        //Maker View Only
        {

        }
        //If not Users Or Maker
        //return Post.all();

    }

    //User create their post jobs
    public async store({ request, response, auth }: HttpContextContract) {
        const quotes = request.input("quotes")
        const author = request.input("author")
        const posts = request.input("posts")

        // get Post from dataBase
        const getPost = await Post.findOrFail(posts.id);

        // get user 
        const user = await auth.use('web').authenticate();

        // add user bto offers

        // Create offers related to that post
        const createOffer = await getPost
            .related('offers')
            .updateOrCreate({ makerId: user.id }, quotes);

        if (createOffer.id!) {
            return response.status(200).send(createOffer)
        }
    }

    //An exsisting Job Posts
    public async show({ params, response, auth }: HttpContextContract) {
        if (auth.use('web').isAuthenticated) {
            //GET :id
            return Post.findOrFail(params.id);
        }
        return response.send('you need to login')
    }

    // update specific jobs, update offers
    public async update({ params, request, response, auth }: HttpContextContract) {

        // if Users-update job post
        if (auth.use('web').isAuthenticated) {
            //Update
            const body = request.body();
            const profile = await Post.findOrFail(params.id);
            //profile.firstName = body.firstName;
            //return post.save();
        } else
        //If Maker-update offers
        {

        }
        return response.send('you are not authorised')
    }

    // delete Job Posts,cancel Offer
    public async destroy({ params, response, request, auth }: HttpContextContract) {
        if (auth.use('web').isAuthenticated) {
            //Delete
            const post = await Post.findOrFail(request.body().postId);
            // post.numberQuotes = post.numberQuotes - 1;
            await post.save();
            // const profile = await Profile.findOrFail(params.id);
            // return profile.delete();
        }
        return response.send('you are not authorised')
    }
}
