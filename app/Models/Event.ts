import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { time } from 'aws-sdk/clients/frauddetector';
import Profile from './Profile';

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number


  @column()
  public profileId: number; // Foreign key, define in migrations

  @column()
  public title: string

  @column()
  public durationMinute: number

  @column()
  public date: DateTime

  @column()
  public description: string

  @column()
  public status: boolean

  @belongsTo(() => Profile)
  public profile: BelongsTo<typeof Profile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
