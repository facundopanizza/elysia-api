import { db } from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Elysia, error } from "elysia";
import jwt from "jsonwebtoken";

type JWTPayload = {
    userId: number;
}

export const auth = new Elysia()
    .derive({ as: 'global' }, async ({ headers }) => {
        const authorization = headers.authorization;

        if (!authorization) {
            return { user: null };
        }

        const token = authorization.split('Bearer ')?.[1];

        if (!token) {
            return { user: null };
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.id, payload.userId)
            });

            return { user };
        } catch (error) {
            return { user: null };
        }
    }).onBeforeHandle({ as: 'global' }, ({ user }) => {
        if (!user) {
            throw error('Unauthorized', {
                message: 'No token provided'
            });
        }
    });
