import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('from_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE') // delete profile when user is deleted

      table.integer('to_id')
      table.string('address')
      table.string('avatar')
      table.string('email')
      table.string('last_act')
      table.string('name')
      table.integer('phone')
      table.string('role')
      table.string('status')
      table.string('user_name')


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
