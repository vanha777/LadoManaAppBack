import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile';

import { schema } from '@ioc:Adonis/Core/Validator';

export default class ProfilesController {

    public async index({ auth, response }, ctx: HttpContextContract) {
        if (auth.use('web').isAuthenticated) {
            //get current user infors
            const user = await auth.use('web').authenticate()
            //get user profile
            const profile = await user.related('profile').query()
            return response.json(profile)
        }
        return response.status(401).send('You are not authenticated.')
    }

    public async store({ request, response, auth }: HttpContextContract) {
        // validators
        const newProfileSchema = schema.create({
            firstName: schema.string({ trim: true }),
            lastName: schema.string({ trim: true }),
            bio: schema.string(),
            address: schema.string({ trim: true }),
            state: schema.string({ trim: true }),
            postCode: schema.number(),
            phoneNumber: schema.number()
        })
        const payload = await request.validate({ schema: newProfileSchema })
        //Create 
        // check if user has loged in sessions
        if (auth.use('web').isAuthenticated) {
            //get current user infors
            const user = await auth.use('web').authenticate();
            // UpdateOrCreate profile of current user
            const profile = await user.related('profile').updateOrCreate({}, payload);
            return response.status(200).send(profile)
        }
        return response.status(401).send('You are not authenticated.')
    }


    //un-use route, due to defaults that user @hasOne profile not many
    public async show({ params }: HttpContextContract) {
        //GET :id
        return Profile.findOrFail(params.id);
    }

    //un-use route, due to defaults that user @hasOne profile not many
    public async update({ params, request }: HttpContextContract) {
        //Update
        const body = request.body();
        const profile = await Profile.findOrFail(params.id);
        profile.firstName = body.firstName;
        return profile.save();
    }

    public async destroy({ params }: HttpContextContract) {
        //Delete
        const profile = await Profile.findOrFail(params.id);
        return profile.delete();
    }


}
