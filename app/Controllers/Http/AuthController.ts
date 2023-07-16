import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from "App/Models/User";
import Role from 'App/Models/Role'
import ProfilesController from './ProfilesController';

export default class AuthController {

    public async register({ request, response, auth }: HttpContextContract) {
        // create validation schema for expected user form data - check input
        const roleSchema = schema.create({
            role: schema.string({ trim: true })
        })
        const userSchema = schema.create({
            email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),

            password: schema.string({}, [rules.minLength(8)])
        })
        const profileSchema = schema.create({
            firstName: schema.string({ trim: true }),
            lastName: schema.string({ trim: true }),
            dateOfBirth: schema.date(),
            class: schema.string({ trim: true }),
            numberOfClass: schema.number(),
            status: schema.boolean(),
            avatarUrl: schema.string.optional({ trim: true }),
        })
        const infoSchema = schema.create({
            address: schema.string.optional({ trim: true }),
            suburb: schema.string.optional({ trim: true }),
            city: schema.string.optional({ trim: true }),
            postCode: schema.number.optional(),
            mobile: schema.number.optional(),
            email: schema.string({ trim: true }),
            calendar: schema.date.optional(),
        })

        // get validated data by validating our userSchema

        // if validation fails the request will be automatically redirected back to the form
        const userData = await request.validate({ schema: userSchema })
        const roleData = await request.validate({ schema: roleSchema })
        const profileData = await request.validate({ schema: profileSchema })
        const infoData = await request.validate({ schema: infoSchema })
        // create a user record with the validated data
        const role = await Role.query().where('role', roleData.role).firstOrFail()
        const user = await role.related('users').create(userData)
        const profile = await user.related('profile').updateOrCreate({}, profileData)
        const info = await profile.related('info').updateOrCreate({}, infoData)

        // login the user using the user model record
        await auth.use('web').login(user)
        await auth.use('web').authenticate()
        if (auth.use('web').isLoggedIn) {
            return response.status(200).send({
                profile: { profile },
                info: { info }
            })
        }
        // redirect to the login page
        return response.status(401).send('Register Failed.')
    }

    public async login({ request, response, auth, session }: HttpContextContract) {

        // grab uid and password values off request body
        const { email, password } = request.only(['email', 'password'])

        try {
            // attempt to login
            await auth.use('web').attempt(email, password)
            const user = await auth.use('web').authenticate()
            const profile = await user.related('profile').query()

            return response.status(200).send(profile)
        } catch (error) {
            // if login fails, return vague form message and redirect back

            return response.badRequest('Invalid credentials')
        }

        // otherwise, redirect to home page
        //return response.redirect('/profiles')
    }

    public async logout({ response, auth }: HttpContextContract) {
        // logout the user
        await auth.use('web').logout()
        // redirect to login page
        return response.redirect().toRoute('/home')
    }
}
