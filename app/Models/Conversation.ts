import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Contact from './Contact'
import Message from './Message'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: true })
  public contactId: number

  @column({ serializeAs: 'participant' })
  public participant: string[]

  @column({ isPrimary: true })
  public unreadCount: number

  @belongsTo(() => Contact)
  public contact: BelongsTo<typeof Contact>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
