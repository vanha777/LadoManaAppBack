/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Profile from 'App/Models/Profile';

// homePage 
Route.get('/home', async () => {
  return { hello: 'Home' }
})

// test if userIslogedIn 
Route.get('/test', 'TestsController.test1')


// test fille upload
Route.post('/test', 'TestsController.test2')

// profiles
Route.resource('/profiles', 'ProfilesController').apiOnly()

// calendar
Route.resource('/calendars', 'CalendarsController').apiOnly()

// Authetication:register,login,logout 
Route.post('/register', 'AuthController.register').as('auth.register')
Route.post('/login', 'AuthController.login').as('auth.login')
Route.get('/logout', 'AuthController.logout').as('auth.logout')

//StudentController CRUD require admin
Route.resource('/students', 'StudentsController').apiOnly()

//
Route.resource('/offers', 'OffersController').apiOnly()

//
Route.post('/files', 'FilesController.store')

// get chat data
Route.resource('/chats', 'ChatsController').apiOnly()

//test
Route.get('/test2/:id', async ({ bouncer, request }) => {
  const post = await Profile.findOrFail(request.param('id'))
  //check authorization from bouncer.ts - Actions/viewPort
  await bouncer.authorize('viewPost', post)
  return post
})
//.end
