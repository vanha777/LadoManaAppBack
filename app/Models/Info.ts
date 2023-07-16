import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class Info extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profileId: number // Foreign key, define in migrations

  @column()
  public address: string

  @column()
  public suburb: string

  @column()
  public city: string

  @column()
  public postCode: number

  @column()
  public mobile: number

  @column()
  public email: string

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
