import { db } from "@/db/database";
import { usersTable } from "@/db/schema";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import Elysia, { error, t } from "elysia";
import jwt from "jsonwebtoken";

export const auth = new Elysia({ prefix: "/auth" })
    .post("/signin", async ({ body }) => {
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, body.email)
        });

        if (!user || !bcrypt.compareSync(body.password, user.password)) {
            return error('Unauthorized', {
                message: "Invalid email or password"
            })
        }

        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return { accessToken }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ optional: true }),
        }),
        response: {
            200: t.Object({
                accessToken: t.String(),
            }),
            401: t.Object({
                message: t.String(),
            }),
        }
    })
    .post("/signup", async ({ body }) => {
        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);

            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, body.email)
            });

            if (user) {
                return error('Conflict', {
                    message: "User already exists"
                })
            }

            await db.insert(usersTable).values({
                email: body.email,
                password: hashedPassword,
            });

            return {
                message: "User created successfully",
            }
        } catch (error) {
            throw new Error('Failed to create user');
        }
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 4 }),
        }),
        response: {
            201: t.Object({
                message: t.String(),
            }),


        }
    });