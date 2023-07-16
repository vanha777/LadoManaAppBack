import { DateTime } from 'luxon'
import {
  BaseModel, column, hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public role: string

  @column()
  public access: string[]

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
