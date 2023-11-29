import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Status from "App/Enums/Status";
import Todo from "App/Models/Todo";

export default class TodosController {
  public async create({ request, response, auth }: HttpContextContract) {
    const todoSchema = schema.create({
      title: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
    });

    const data = await request.validate({
      schema: todoSchema,
    });

    const todo = await auth.user?.related("todos").create(data);

    return response.json(todo);
  }

  public async getById({ params, response, bouncer }: HttpContextContract) {
    const todo = await Todo.query().where("id", params.id).firstOrFail();
    await bouncer.with("TodoPolicy").authorize("getById", todo);

    return response.json(todo);
  }

  public async getTodos({
    request,
    response,
    bouncer,
    auth,
  }: HttpContextContract) {
    const filterSchema = schema.create({
      title: schema.string.optional({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(Status)),
      page: schema.number.optional(),
      limit: schema.number.optional(),
    });

    const filterData = await request.validate({
      schema: filterSchema,
    });

    const page = filterData.page || 1;
    const limit = filterData.limit || 10;
    let todos;
    if (auth.user?.isAdmin) {
      todos = await Todo.query().filter(filterData).paginate(page, limit);
    } else {
      todos = await auth.user
        ?.related("todos")
        .query()
        .filter(filterData)
        .paginate(page, limit);
    }

    await bouncer.with("TodoPolicy").authorize("getTodos", todos);

    return response.json(todos);
  }

  public async update({
    request,
    response,
    params,
    bouncer,
  }: HttpContextContract) {
    const todoSchema = schema.create({
      title: schema.string.optional({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(Status)),
    });
    let todo;

    try {
      const data = await request.validate({
        schema: todoSchema,
      });

      todo = await Todo.query().where("id", params.id).firstOrFail();

      await bouncer.with("TodoPolicy").authorize("update", todo);

      todo.merge(data);
      await todo.save();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }

    return response.json(todo);
  }
}
