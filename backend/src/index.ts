import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "./db/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

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

export default app;
