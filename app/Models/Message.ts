import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Conversation from './Conversation'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: true })
  public senderId: number

  @column({ serializeAs: 'attachments' })
  public attachments: string[]

  @column({ isPrimary: true })
  public body: string

  @column({ isPrimary: true })
  public contentType: string

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
