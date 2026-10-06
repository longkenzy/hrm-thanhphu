import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { eq, or, like, desc, sql } from "drizzle-orm";
import { employees } from "../../drizzle/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("*", cors());

// Health check & DB test
app.get("/health", async (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Thống kê tổng quan
app.get("/stats", async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: "D1 database binding 'DB' not configured" }, 500);
  }
  const db = drizzle(c.env.DB);
  
  try {
    const totalActiveRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(eq(employees.trang_thai, "Đang làm việc"));
      
    const totalResignedRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(eq(employees.trang_thai, "Đang làm việc"));

    const totalAllRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees);

    const departments = await db
      .select({
        phong_ban: employees.phong_ban,
        count: sql<number>`count(*)`,
      })
      .from(employees)
      .where(eq(employees.trang_thai, "Đang làm việc"))
      .groupBy(employees.phong_ban);

    return c.json({
      total: totalAllRes[0]?.count ?? 0,
      active: totalActiveRes[0]?.count ?? 0,
      resigned: totalResignedRes[0]?.count ?? 0,
      departments,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Lấy danh sách nhân sự (có tìm kiếm, lọc theo phòng ban & trạng thái)
app.get("/employees", async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: "D1 database binding 'DB' not found" }, 500);
  }
  const db = drizzle(c.env.DB);

  const query = c.req.query("search") || "";
  const status = c.req.query("status") || "all";
  const department = c.req.query("department") || "all";

  try {
    let conditions = [];

    if (status !== "all") {
      conditions.push(eq(employees.trang_thai, status));
    }
    if (department !== "all") {
      conditions.push(eq(employees.phong_ban, department));
    }
    if (query.trim() !== "") {
      const q = `%${query.trim()}%`;
      conditions.push(
        or(
          like(employees.ma_nv, q),
          like(employees.ho_ten, q),
          like(employees.cccd, q),
          like(employees.sdt, q),
          like(employees.vi_tri, q)
        )
      );
    }

    const whereClause = conditions.length > 0
      ? sql.join(conditions, sql` AND `)
      : undefined;

    const list = await db
      .select()
      .from(employees)
      .where(whereClause)
      .orderBy(desc(employees.id));

    return c.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Chi tiết 1 nhân sự
app.get("/employees/:id", async (c) => {
  if (!c.env?.DB) return c.json({ error: "D1 not found" }, 500);
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));

  try {
    const record = await db.select().from(employees).where(eq(employees.id, id)).get();
    if (!record) {
      return c.json({ success: false, message: "Không tìm thấy nhân sự" }, 404);
    }
    return c.json({ success: true, data: record });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Thêm mới nhân sự
app.post("/employees", async (c) => {
  if (!c.env?.DB) return c.json({ error: "D1 not found" }, 500);
  const db = drizzle(c.env.DB);

  try {
    const body = await c.req.json();
    
    // Kiểm tra trùng mã nhân viên
    if (body.ma_nv) {
      const existing = await db
        .select({ id: employees.id })
        .from(employees)
        .where(eq(employees.ma_nv, body.ma_nv))
        .get();

      if (existing) {
        return c.json({ success: false, message: `Mã nhân viên ${body.ma_nv} đã tồn tại!` }, 400);
      }
    }

    const inserted = await db.insert(employees).values({
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).returning();

    return c.json({ success: true, data: inserted[0] }, 201);
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Cập nhật thông tin nhân sự
app.put("/employees/:id", async (c) => {
  if (!c.env?.DB) return c.json({ error: "D1 not found" }, 500);
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));

  try {
    const body = await c.req.json();
    delete body.id; // không cập nhật id

    const updated = await db
      .update(employees)
      .set({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .where(eq(employees.id, id))
      .returning();

    return c.json({ success: true, data: updated[0] });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Xóa nhân sự
app.delete("/employees/:id", async (c) => {
  if (!c.env?.DB) return c.json({ error: "D1 not found" }, 500);
  const db = drizzle(c.env.DB);
  const id = Number(c.req.param("id"));

  try {
    await db.delete(employees).where(eq(employees.id, id));
    return c.json({ success: true, message: "Đã xóa thành công" });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Import hàng loạt từ Excel
app.post("/employees/bulk", async (c) => {
  if (!c.env?.DB) return c.json({ error: "D1 not found" }, 500);
  const db = drizzle(c.env.DB);

  try {
    const { items } = await c.req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ success: false, message: "Dữ liệu không hợp lệ" }, 400);
    }

    let insertedCount = 0;
    for (const item of items) {
      if (!item.ma_nv || !item.ho_ten) continue;
      
      const existing = await db
        .select({ id: employees.id })
        .from(employees)
        .where(eq(employees.ma_nv, item.ma_nv))
        .get();

      if (existing) {
        await db
          .update(employees)
          .set({ ...item, updated_at: new Date().toISOString() })
          .where(eq(employees.id, existing.id));
      } else {
        await db.insert(employees).values({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      insertedCount++;
    }

    return c.json({ success: true, imported: insertedCount });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export const onRequest: PagesFunction<Bindings> = async (context) => {
  return app.fetch(context.request, context.env, context);
};
