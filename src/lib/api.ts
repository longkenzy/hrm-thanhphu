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

  // Xóa nhân sự (chuyển vào Thùng rác)
  async deleteEmployee(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      fetch(`/api/employees/${id}`, { method: "DELETE" }).catch(() => {});
    } catch {
      // ignore
    }

    const list = getLocalEmployees();
    const itemToDelete = list.find((e) => e.id === id);
    if (itemToDelete) {
      // Lưu vào Thùng rác
      const trash = this.getTrash();
      trash.unshift(itemToDelete);
      localStorage.setItem("hrm_trash_v1", JSON.stringify(trash));
      this.addLog("Xóa hồ sơ", `Chuyển nhân sự ${itemToDelete.ma_nv} - ${itemToDelete.ho_ten} vào thùng rác`, "warning");
    }

    const filtered = list.filter((e) => e.id !== id);
    saveLocalEmployees(filtered);
    return { success: true, message: "Đã chuyển vào thùng rác" };
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

  // Quản lý Thùng rác
  getTrash(): Employee[] {
    const raw = localStorage.getItem("hrm_trash_v1");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  restoreFromTrash(id: number): boolean {
    const trash = this.getTrash();
    const item = trash.find((e) => e.id === id);
    if (!item) return false;

    // Trả về danh sách nhân sự
    const list = getLocalEmployees();
    if (!list.some((e) => e.id === id || e.ma_nv === item.ma_nv)) {
      list.unshift(item);
      saveLocalEmployees(list);
    }

    // Xóa khỏi thùng rác
    const newTrash = trash.filter((e) => e.id !== id);
    localStorage.setItem("hrm_trash_v1", JSON.stringify(newTrash));
    this.addLog("Khôi phục hồ sơ", `Đã khôi phục nhân viên ${item.ma_nv} - ${item.ho_ten} từ thùng rác`, "success");
    return true;
  },

  permanentDeleteTrash(id: number): boolean {
    const trash = this.getTrash();
    const item = trash.find((e) => e.id === id);
    const newTrash = trash.filter((e) => e.id !== id);
    localStorage.setItem("hrm_trash_v1", JSON.stringify(newTrash));
    if (item) {
      this.addLog("Xóa vĩnh viễn", `Đã xóa vĩnh viễn nhân sự ${item.ma_nv} - ${item.ho_ten}`, "danger");
    }
    return true;
  },

  emptyTrash(): boolean {
    localStorage.setItem("hrm_trash_v1", JSON.stringify([]));
    this.addLog("Dọn sạch thùng rác", "Đã xóa toàn bộ hồ sơ trong thùng rác", "danger");
    return true;
  },

  // Quản lý Nhật ký hoạt động
  getLogs(): import("../types/system").ActivityLog[] {
    const raw = localStorage.getItem("hrm_activity_logs_v1");
    if (!raw) {
      const initialLogs: import("../types/system").ActivityLog[] = [
        {
          id: "log-1",
          timestamp: new Date().toLocaleString("vi-VN"),
          user: "admin",
          action: "Khởi động hệ thống",
          detail: "Hệ thống quản lý nhân sự HRM Thành Phú sẵn sàng hoạt động",
          type: "info",
        },
      ];
      localStorage.setItem("hrm_activity_logs_v1", JSON.stringify(initialLogs));
      return initialLogs;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addLog(action: string, detail: string, type: "info" | "success" | "warning" | "danger" = "info"): void {
    const logs = this.getLogs();
    const currentUser = this.getCurrentUser();
    const newLog: import("../types/system").ActivityLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toLocaleString("vi-VN"),
      user: currentUser?.username || "admin",
      action,
      detail,
      type,
    };
    logs.unshift(newLog);
    // Giữ tối đa 200 logs
    if (logs.length > 200) logs.pop();
    localStorage.setItem("hrm_activity_logs_v1", JSON.stringify(logs));
  },

  clearLogs(): void {
    localStorage.setItem("hrm_activity_logs_v1", JSON.stringify([]));
  },

  // Reset về dữ liệu gốc từ Excel
  resetSeedData(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    localStorage.setItem("hrm_trash_v1", JSON.stringify([]));
    this.addLog("Khôi phục gốc", "Khôi phục toàn bộ danh sách 121 nhân sự gốc từ file data.xlsx", "warning");
  },

  // Đăng nhập
  async login(username: string, password: string): Promise<{ success: boolean; user?: import("../types/auth").AuthUser; message?: string }> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json()) as any;
      if (res.ok && json.success && json.user) {
        localStorage.setItem("hrm_auth_session_user", JSON.stringify(json.user));
        this.addLog("Đăng nhập", `Người dùng ${json.user.username} (${json.user.full_name}) đăng nhập thành công`, "success");
        return json;
      } else if (json.message) {
        return { success: false, message: json.message };
      }
    } catch {
      // Fallback offline
    }

    // Tài khoản admin mặc định khi offline
    if (username.trim() === "admin" && password === "admin123") {
      const defaultAdmin: import("../types/auth").AuthUser = {
        id: 1,
        username: "admin",
        full_name: "Quản Trị Viên",
        role: "admin",
      };
      localStorage.setItem("hrm_auth_session_user", JSON.stringify(defaultAdmin));
      this.addLog("Đăng nhập", "Quản trị viên đăng nhập hệ thống", "success");
      return { success: true, user: defaultAdmin };
    }

    return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác" };
  },

  getCurrentUser(): import("../types/auth").AuthUser | null {
    const raw = localStorage.getItem("hrm_auth_session_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.addLog("Đăng xuất", `Người dùng ${user.username} đã đăng xuất`, "info");
    }
    localStorage.removeItem("hrm_auth_session_user");
  },
};

