import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted
      table.string('first_name')
      table.string('last_name')
      table.date('date_of_birth').nullable()
      table.string('class').nullable()
      table.integer('number_of_class').nullable()
      table.integer('number_of_month').nullable()
      table.string('avatar_url').nullable()
      table.boolean('status').nullable()

      //Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}