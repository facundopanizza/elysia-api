import { Elysia, t } from "elysia";
import { auth } from "@/middleware/auth.middleware";

export const users = new Elysia({ prefix: "/users" })
    .use(auth)
    .get("/me", ({ user }) => {
        return {
            user: {
                id: user!.id,
                email: user!.email
            }
        };
    }, {
        response: t.Object({
            user: t.Object({
                id: t.Number(),
                email: t.String()
            })
        })
    });

export type Users = typeof users;