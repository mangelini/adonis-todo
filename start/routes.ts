/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "AuthController.login").as("auth.login");
Route.post("/register", "AuthController.register").as("auth.register");
Route.group(() => {
  Route.post("/logout", "AuthController.logout").as("auth.logout");
  Route.post("/profile", "AuthController.profile").as("auth.profile");

  Route.post("/todos", "TodosController.create").as("todos.create");
  Route.post("/getTodos", "TodosController.getTodos").as("todos.getTodos");
  Route.get("/todos/:id", "TodosController.getById").as("todos.getById");
  Route.patch("/todos/:id", "TodosController.update").as("todos.update");
}).middleware("auth");
