import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import Roles from "App/Enums/Roles";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table
        .integer("role_id")
        .unsigned()
        .references("id")
        .inTable("roles")
        .defaultTo(Roles.USER);
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("role_id");
    });
  }
}
