import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Info from 'App/Models/Info'
import Event from 'App/Models/Event'


export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number; // Foreign key, define in migrations

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public dateOfBirth: DateTime

  @column()
  public class: string

  @column()
  public numberOfClass: number

  @column()
  public numberOfMonth: number

  @column()
  public avatarUrl: string

  @column()
  public status: boolean

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Info)
  public info: HasOne<typeof Info>

  @hasMany(() => Event)
  public events: HasMany<typeof Event>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
