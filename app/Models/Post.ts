import { DateTime } from 'luxon'
import {
  BaseModel, column, belongsTo,
  BelongsTo, hasMany,
  HasMany,

} from '@ioc:Adonis/Lucid/Orm'
import Offer from 'App/Models/Offer'
import User from './User'

export default class Post extends BaseModel {
  Offers() {
    throw new Error('Method not implemented.')
  }
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public metaType: string

  @column()
  public publish: boolean

  @column()
  public metaSuburb: string

  @column()
  public metaAddress: string


  @column()
  public metaPostcode: number

  @column()
  public metaBudget: number

  @column()
  public metaState: string

  @column({ serializeAs: 'images' })
  public images: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Offer)
  public offers: HasMany<typeof Offer>

}
