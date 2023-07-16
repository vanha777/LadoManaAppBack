import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from "App/Models/User";
import Role from 'App/Models/Role'
import ProfilesController from './ProfilesController';
import Profile from 'App/Models/Profile';
import { DateTime } from 'luxon';
import { integer } from 'aws-sdk/clients/frauddetector';


export default class StudentsController {

    // GET all
    public async index({ request, auth, response }, ctx: HttpContextContract) {
        try {

            // student.role.id is 1
            const student = await User.query().where('role_id', 1).select('*')

            // const studentProfile = await Promise.all(student.map(async (number) => { return await Profile.query().where('user_id', number.id).select('*') }))
            const studentProfile = await Promise.all(student.map(async (number) => await Profile.query().where('user_id', number.id)))



            return response.status(200).send(studentProfile)
        } catch {
            return response.status(401).send('Get student list failed')
        }
    }


    // POST create Student
    public async store({ request, response, auth }: HttpContextContract) {
        try {
            // create validation schema for expected user form data - check input
            /*  const userSchema = schema.create({
               // front-end will generate unique.empty email if request.emai undefined
               email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
               // front-end will generate password = '12345679' if request.password = empty
               password: schema.string({}, [rules.minLength(8)])
           }) */
            const profileSchema = schema.create({
                firstName: schema.string({ trim: true }),
                lastName: schema.string({ trim: true }),
                dateOfBirth: schema.date(),
                class: schema.string({ trim: true }),
                numberOfClass: schema.number(),
                numberOfMonth: schema.number(),
                status: schema.boolean(),
                avatarUrl: schema.string.optional({ trim: true }),
            })

            const infoSchema = schema.create({
                address: schema.string.optional({ trim: true }),
                suburb: schema.string.optional({ trim: true }),
                city: schema.string.optional({ trim: true }),
                postCode: schema.number.optional(),
                mobile: schema.number.optional(),
                email: schema.string.optional({ trim: true }),
                calendar: schema.date.optional(),
            })

            const eventSchema = schema.create({
                startDate1: schema.date(),
                startDate2: schema.date()
            })

            // get validated data by validating our userSchema

            // if validation fails the request will be automatically redirected back to the form

            // const userData = await request.validate({ schema: userSchema })

            // const profileData = await request.validate({ schema: profileSchema, data: requestData.data })
            const profileData = await request.validate({ schema: profileSchema })
            const infoData = await request.validate({ schema: infoSchema })
            const eventData = await request.validate({ schema: eventSchema })
            const arrayDate = [eventData.startDate1, eventData.startDate2];


            // create a user record with the validated data

            const role = await Role.query().where('role', 'student').firstOrFail()
            const user = await role.related('users').create({
                email: `${profileData.lastName}${profileData.firstName}@gmail.com`,
                password: '12345679'
            });
            const profile = await user.related('profile').updateOrCreate({}, profileData)
            await profile.related('info').updateOrCreate({}, infoData)

            // create event acording to student number of class
            const createEvent = async (time: integer, start: DateTime, loopTimes: integer) => {
                const startDate = start.plus({ weeks: loopTimes }); // plus 7 days for next week
                await profile.related('events').create({
                    title: `${profile.lastName} ${profile.firstName}`,
                    durationMinute: time,
                    date: startDate,
                    description: profile.class,
                    status: true
                })
            }
            // keep adding event till numberOfClass run out 
            for (let i = 0; i < profile.numberOfClass; i++) {
                arrayDate.map(async (date) => {
                    await createEvent(60, date, i)
                })
            }
            return response.status(200).send(user.id)
        } catch {
            return response.status(500).send('student registering Failed')
        }
    }


    //un-use route, due to defaults that user @hasOne profile not many
    public async show({ params, response }: HttpContextContract) {
        //GET :id
        try {
            const user = await User.query().where('id', params.id).firstOrFail()
            const profile = await user.related('profile').query()
            const infos = await profile[0].related('info').query()
            return response.status(200).send({ profile: profile[0], info: infos[0] })
        } catch {
            return response.status(401).send('failed back-end')
        }
    }



    //un-use route, due to defaults that user @hasOne profile not many
    public async update({ params, request, response }: HttpContextContract) {
        //Update
        try {
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
                email: schema.string.optional({ trim: true }),
                extraInfo: schema.string.optional({ trim: true }),
            })
            const profileData = await request.validate({ schema: profileSchema })
            const infoData = await request.validate({ schema: infoSchema })
            const user = await User.query().where('id', params.id).firstOrFail()
            const profile = await user.related('profile').updateOrCreate({}, profileData)
            const info = await profile.related('info').updateOrCreate({}, infoData)
            return response.status(200).send(`update user ${user.id} success`)
        } catch {
            return response.status(401).send(`failed update user `)
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        //Delete
        try {
            const user = await User.query().where('id', params.id).firstOrFail()
            await user.delete();
            response.status(200).send(`deleted ${params.id} success`)
        } catch {
            return response.status(404).send(`failed to deleted ${params.id}`)
        }
    }
}