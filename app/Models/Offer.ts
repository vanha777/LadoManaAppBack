import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class Offer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: true })
  public postId: number

  @column({ isPrimary: true })
  public makerId: number

  @column()
  public quotes: number

  @column()
  public days: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

}
