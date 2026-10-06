import { Employee } from "../types/employee";
import seedData from "../data/seedEmployees.json";

const STORAGE_KEY = "hrm_employees_local_v1";

function getLocalEmployees(): Employee[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  const initial = seedData as Employee[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalEmployees(data: Employee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const api = {
  // Lấy danh sách nhân sự
  async getEmployees(params?: {
    search?: string;
    status?: string;
    department?: string;
  }): Promise<{ success: boolean; data: Employee[] }> {
    try {
      const q = new URLSearchParams();
      if (params?.search) q.append("search", params.search);
      if (params?.status) q.append("status", params.status);
      if (params?.department) q.append("department", params.department);

      const res = await fetch(`/api/employees?${q.toString()}`);
      if (res.ok) {
        const json = (await res.json()) as any;
        if (json.success && Array.isArray(json.data)) {
          return json;
        }
      }
    } catch {
      // Fallback to local storage if API is offline
    }

    // Local fallback processing
    let list = getLocalEmployees();

    if (params?.status && params.status !== "all") {
      list = list.filter((e) => e.trang_thai === params.status);
    }

    if (params?.department && params.department !== "all") {
      list = list.filter((e) => e.phong_ban === params.department);
    }

    if (params?.search && params.search.trim()) {
      const s = params.search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.ma_nv?.toLowerCase().includes(s) ||
          e.ho_ten?.toLowerCase().includes(s) ||
          e.cccd?.includes(s) ||
          e.sdt?.includes(s) ||
          e.vi_tri?.toLowerCase().includes(s)
      );
    }

    return { success: true, data: list };
  },

  // Lấy 1 nhân sự
  async getEmployeeById(id: number | string): Promise<{ success: boolean; data?: Employee }> {
    try {
      const res = await fetch(`/api/employees/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const list = getLocalEmployees();
    const item = list.find((e) => String(e.id) === String(id) || e.ma_nv === String(id));
    return { success: !!item, data: item };
  },

  // Tạo mới nhân sự
  async createEmployee(data: Employee): Promise<{ success: boolean; data?: Employee; message?: string }> {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const list = getLocalEmployees();
    if (list.some((e) => e.ma_nv.toLowerCase() === data.ma_nv.toLowerCase())) {
      return { success: false, message: `Mã nhân viên ${data.ma_nv} đã tồn tại!` };
    }

    const nextId = list.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
    const newEmp: Employee = {
      ...data,
      id: nextId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newEmp);
    saveLocalEmployees(list);
    return { success: true, data: newEmp };
  },

  // Cập nhật nhân sự
  async updateEmployee(id: number, data: Partial<Employee>): Promise<{ success: boolean; data?: Employee; message?: string }> {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const list = getLocalEmployees();
    const idx = list.findIndex((e) => e.id === id || e.ma_nv === data.ma_nv);
    if (idx === -1) {
      return { success: false, message: "Không tìm thấy nhân sự" };
    }

    list[idx] = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    saveLocalEmployees(list);
    return { success: true, data: list[idx] };
  },

  // Xóa nhân sự
  async deleteEmployee(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const list = getLocalEmployees();
    const filtered = list.filter((e) => e.id !== id);
    saveLocalEmployees(filtered);
    return { success: true, message: "Đã xóa thành công" };
  },

  // Import hàng loạt
  async bulkImport(items: Employee[]): Promise<{ success: boolean; imported: number }> {
    try {
      const res = await fetch("/api/employees/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const list = getLocalEmployees();
    let count = 0;
    for (const item of items) {
      if (!item.ma_nv || !item.ho_ten) continue;
      const existIdx = list.findIndex((e) => e.ma_nv === item.ma_nv);
      if (existIdx >= 0) {
        list[existIdx] = { ...list[existIdx], ...item, updated_at: new Date().toISOString() };
      } else {
        const nextId = list.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
        list.push({ ...item, id: nextId, created_at: new Date().toISOString() });
      }
      count++;
    }
    saveLocalEmployees(list);
    return { success: true, imported: count };
  },

  // Reset về dữ liệu gốc từ Excel
  resetSeedData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  },
};
