import { BasePolicy } from "@ioc:Adonis/Addons/Bouncer";
import User from "App/Models/User";
import Todo from "App/Models/Todo";

export default class TodoPolicy extends BasePolicy {
  public async update(user: User, todo: Todo) {
    return user.id === todo.userId || user.isAdmin;
  }

  public async getById(user: User, todo: Todo) {
    return user.id === todo.userId || user.isAdmin;
  }
}
