import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, ParsedTypedSchema } from '@ioc:Adonis/Core/Validator';
import Contact from 'App/Models/Contact';
import Conversation from 'App/Models/Conversation';
import Message from 'App/Models/Message';
import Profile from 'App/Models/Profile';
import User from 'App/Models/User';
export default class ChatsController {
    //see Jobs Post
    public async index({ request, response, auth }: HttpContextContract) {
        //User view Only
        //  if (auth.use('web').isAuthenticated) {

        //  } else
        //Maker View Only
        //  {

        // }
        //If not Users Or Maker
        // const allPosts = await Post.all()

        // identiufy user 
        const user = await auth.use('web').authenticate()
        const userProfile = await user.related('profile').query()
        const result: Array<object> = [];

        // // get contact for user
        const contacts = await Contact.query()
            .where('from_id', user.id)
            .select('*')
        //return many contact

        // get conversation,messages and attach to contacts
        const getResult = Promise.allSettled(
            contacts.map(async (contact, index) => {
                const toProfile = await Profile.query().where('user_id', contact.toId).first()
                const conversation = await Conversation.query().where('contact_id', contact.id).first()
                const getMeassages = await Message.query().where('conversation_id', conversation!.id).select('*')

                return result.push({
                    from: {
                        userId: user.id,
                        profile: userProfile[0]
                    },
                    to: {
                        toId: contact.toId,
                        profile: toProfile
                    },
                    messages: getMeassages
                })
            })
        )
        await getResult;
        console.log(result[0].to.profile);


        if (auth.use('web').isAuthenticated) {
            console.log("authenticated")
        } else {
            console.log("not authenticated")
        }
        return response.status(200).send(result)

    }

    //User create their post jobs
    public async store({ request, response, auth }: HttpContextContract) {

        //if User - create job posts
        if (auth.use('web').isAuthenticated) {
            // validators

            const chatSchema = schema.create({
                messages: schema.array().members(
                    schema.object().members({
                        user: schema.string(),
                        messages: schema.string({ trim: true }),
                    })
                ),
            });
            const receiverSchema = schema.create({
                toUserId: schema.number()
            })

            const chatData = await request.validate({ schema: chatSchema })
            const receiverId = await request.validate({ schema: receiverSchema })

            const receiver = await User.query().where('id', receiverId.toUserId).first();
            const user = await auth.use('web').authenticate()

            // createa
            //  const newChat = await Chat.create(chatData); // Create a new chat record

            //  const result = await user!.related('chats').attach([newChat!.id]);

            //   const result2 = await receiver!.related('chats').attach([newChat!.id!])



            //Create 
            // const post = await user.related('posts').create(payload)
            // Create the post and establish the relationship

            //const post = await user.related('posts').save(payload)
            //   return response.status(201).send(result2)
        } else
        //If Maker- submit offers
        {
            return response.status(401).send('You are not authenticated.')
        }
    }


    //An exsisting Job Posts
    public async show({ params, response, auth }: HttpContextContract) {
        if (auth.use('web').isAuthenticated) {
            //GET :id
            // return Post.findOrFail(params.id);
        }
        return response.send('you need to login')
    }

    // update specific jobs, update offers
    public async update({ params, request, response, auth }: HttpContextContract) {

        // if Users-update job post
        if (auth.use('web').isAuthenticated) {
            //Update
            const body = request.body();
            // const profile = await Post.findOrFail(params.id);
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
            // const profile = await Profile.findOrFail(params.id);
            // return profile.delete();
        }
        return response.send('you are not authorised')
    }

}
