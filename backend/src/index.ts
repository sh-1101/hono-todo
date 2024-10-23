import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "./db/schema";
import { eq } from "drizzle-orm";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/todos/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/todos", async (c) => {
  const db = drizzle(c.env.DB);
  try {
    //todosテーブルから全てのデータを取得
    const result = await db.select().from(todos).execute();
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

app.post("/todos", async (c) => {
  const db = drizzle(c.env.DB);
  try {
    const params = await c.req.json<typeof todos.$inferInsert>();
    const result = await db
      .insert(todos)
      .values({ title: params.title })
      .execute();
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to create todo" }, 500);
  }
});

app.put("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const db = drizzle(c.env.DB);
  try {
    const params = await c.req.json<typeof todos.$inferSelect>();
    const result = await db
      .update(todos)
      .set({ title: params.title, status: params.status })
      .where(eq(todos.id, id));
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

app.delete("/todos/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  const db = drizzle(c.env.DB);
  try {
    const result = await db.delete(todos).where(eq(todos.id, id));
    return c.json(result);
  } catch (error) {
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export default app;
