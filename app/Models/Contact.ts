import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo,
  BelongsTo,
  HasMany,
  hasMany,
  HasOne,
  hasOne
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Conversation from './Conversation'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: true })
  public toId: number

  @column({ isPrimary: true })
  public fromId: number

  @column({ isPrimary: true })
  public address: string

  @column({ isPrimary: true })
  public avatar: string

  @column({ isPrimary: true })
  public email: string

  @column({ isPrimary: true })
  public lastAct: DateTime

  @column({ isPrimary: true })
  public name: string

  @column({ isPrimary: true })
  public phone: number

  @column({ isPrimary: true })
  public role: string

  @column({ isPrimary: true })
  public status: string

  @column({ isPrimary: true })
  public userName: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Conversation)
  public conversation: HasOne<typeof Conversation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
