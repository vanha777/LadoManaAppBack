import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Role from 'App/Models/Role'
import ProfilesController from './ProfilesController';
import Profile from 'App/Models/Profile';
import Info from 'App/Models/Info';
import { formatISO, addHours } from 'date-fns';
import { DateTime } from 'luxon';

interface ScheduleEvent {
    allDay: boolean;
    color: string;
    description: string;
    end: Date;
    id: number;
    start: Date;
    textColor: string;
    title: string;
}


export default class CalendarsController {

    // get All Calendar
    public async index({ request, response, auth }: HttpContextContract) {
        try {

            const studentProfile = await Profile.query().where('numberOfClass', '>', 0)  // get Student Profile
            const results: ScheduleEvent[] = [];    // array of result

            await Promise.all(studentProfile.map(async (value) => {

                const studentInfo = await Info.query().where('profileId', value.id).firstOrFail();  // get info of student
                const date = new Date(studentInfo.calendar.valueOf()) // student calendar first start date
                console.log(studentInfo)

                const firstDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000); // firstDate - 7 days

                // random Color
                const colour = ['#00AB55', '#1890FF', '#54D62C', '#FFC107', '#FF4842', '#04297A', '#7A0C2E'];
                const randomIndex = Math.floor(Math.random() * colour.length);
                const randomColor = colour[randomIndex];
                for (let i = 0; i < value.numberOfClass; i++) {
                    let startDate = new Date(firstDate.getTime() + 7 * 24 * 60 * 60 * 1000) // plus 7days every loops
                    let endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // endDate = firstDate + 60 minutes
                    const object = {
                        allDay: false,
                        color: randomColor,
                        description: value.class,
                        end: endDate,
                        id: value.userId,
                        start: startDate,
                        textColor: randomColor,
                        title: `${value.lastName} ${value.firstName}`,
                    };
                    results.push(object); // Push the object into the results array
                }
            }))
            return response.status(200).send(results); // Send the results array as the response
        } catch {
            return response.status(400)
        }
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