import { BaseModelFilter } from "@ioc:Adonis/Addons/LucidFilter";
import { ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm";
import Todo from "App/Models/Todo";

export default class TodoFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Todo, Todo>;

  title(value: string) {
    this.$query.where("title", "like", `%${value}%`);
  }

  description(value: string) {
    this.$query
      .where("description", "like", `%${value}%`)
      .orWhere("description", "icontains", `%${value}%`)
      .orWhere("description", "startsWith", `%${value}%`);
  }

  status(value: string) {
    this.$query.where("status", value);
  }
}
