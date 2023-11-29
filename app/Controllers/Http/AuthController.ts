import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Roles from "App/Enums/Roles";
import User from "App/Models/User";

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.only(["username", "password"]);
    const rememberMe = true;

    try {
      await auth.attempt(username, password, rememberMe);
    } catch (error) {
      return response.status(401).json({ error: "Invalid credentials" });
    } finally {
      return response.json(auth.user);
    }
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({
          table: "users",
          column: "username",
          caseInsensitive: true,
        }),
      ]),
      password: schema.string(),
      role: schema.enum(Object.values(Roles)),
    });

    const data = await request.validate({
      schema: userSchema,
    });

    const user = await User.create({
      ...data,
      roleId: Number(data.role),
    });

    await auth.login(user);

    return response.json(user);
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.logout();
    } catch (error) {
      return response.badRequest(error.message);
    }

    return response.json({ message: "Logout successful" });
  }

  public async profile({ request, response, auth }: HttpContextContract) {
    if (auth.user?.isAdmin) {
      const paginationSchema = schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional(),
      });

      const filterData = await request.validate({
        schema: paginationSchema,
      });
      const page = filterData.page || 1;
      const limit = filterData.limit || 10;

      const allUsers = await User.query().paginate(page, limit);
      return response.json(allUsers);
    }
    return response.json(auth.user);
  }
}
