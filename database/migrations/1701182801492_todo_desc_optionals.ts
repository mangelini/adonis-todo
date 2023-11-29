import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "todos";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("description").defaultTo("").alter();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("description");
    });
  }
}
