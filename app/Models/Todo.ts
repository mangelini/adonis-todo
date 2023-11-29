import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { compose } from "@ioc:Adonis/Core/Helpers";
import Status from "App/Enums/Status";
import TodoFilter from "./Filters/TodoFilter";
import { Filterable } from "@ioc:Adonis/Addons/LucidFilter";

export default class Todo extends compose(BaseModel, Filterable) {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public status: Status;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public userId: number;

  public static $filter = () => TodoFilter;
}
