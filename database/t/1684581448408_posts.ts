import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('meta_type').notNullable()
      table.boolean('publish').notNullable()
      table.string('meta_suburb').notNullable()
      table.integer('meta_postcode').notNullable()
      table.string('meta_address').notNullable()
      table.integer('meta_budget').notNullable()
      table.string('meta_state').notNullable()
      table.specificType('images', 'text[]').nullable()


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
