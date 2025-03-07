import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import 'dotenv/config';
import { Elysia } from "elysia";
import { auth } from "./controllers/auth.controller";
import { users } from "./controllers/users.controller";

const app = new Elysia()
  .use(cors({ origin: '*' }))
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .use(auth)
  .use(users)

app.listen(4000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
