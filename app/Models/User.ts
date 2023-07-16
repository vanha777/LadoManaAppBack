import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column, BaseModel, hasOne,
  HasOne, hasMany,
  HasMany, belongsTo,
  BelongsTo,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from 'App/Models/Profile'

import Offer from 'App/Models/Offer'
import Role from 'App/Models/Role'
import Post from 'App/Models/Post'
import Contact from './Contact'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: string // Foreign key, define in migrations

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>


  @hasMany(() => Offer)
  public offers: HasMany<typeof Offer>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>


  @hasMany(() => Contact)
  public contacts: HasMany<typeof Contact>


  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  //automatically generate a profile for every users


}
