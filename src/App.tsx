import React, { useState, useEffect, useMemo } from "react";
import { Employee } from "./types/employee";
import { AuthUser } from "./types/auth";
import { api } from "./lib/api";
import { exportEmployeesToExcel } from "./lib/excelHelper";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { StatsBar } from "./components/StatsBar";
import { FilterBar } from "./components/FilterBar";
import { EmployeeTable } from "./components/EmployeeTable";
import { EmployeeFormModal } from "./components/EmployeeFormModal";
import { EmployeeDetailModal } from "./components/EmployeeDetailModal";
import { ImportExcelModal } from "./components/ImportExcelModal";
import { LoginPage } from "./components/LoginPage";

export const App: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => api.getCurrentUser());

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  // Toast notification
  const [notify, setNotify] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotify({ message, type });
    setTimeout(() => setNotify(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployees();
      if (res.success && res.data) {
        setEmployees(res.data);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Danh sách phòng ban kèm số lượng
  const departmentStats = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((e) => {
      const d = e.phong_ban?.trim();
      if (d) {
        map.set(d, (map.get(d) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees]);

  const departmentNames = useMemo(() => {
    return departmentStats.map((d) => d.name);
  }, [departmentStats]);

  // Bộ lọc dữ liệu
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Lọc trạng thái
      if (status !== "all" && emp.trang_thai !== status) {
        return false;
      }
      // Lọc phòng ban
      if (department !== "all" && emp.phong_ban !== department) {
        return false;
      }
      // Tìm kiếm
      if (search.trim() !== "") {
        const s = search.toLowerCase().trim();
        const match =
          emp.ma_nv?.toLowerCase().includes(s) ||
          emp.ho_ten?.toLowerCase().includes(s) ||
          emp.cccd?.includes(s) ||
          emp.sdt?.includes(s) ||
          emp.vi_tri?.toLowerCase().includes(s) ||
          emp.phong_ban?.toLowerCase().includes(s);
        if (!match) return false;
      }
      return true;
    });
  }, [employees, status, department, search]);

  // Thống kê
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.trang_thai === "Đang làm việc").length;
  const resignedCount = employees.filter((e) => e.trang_thai === "Đã nghỉ việc").length;

  // Handlers
  const handleAddNew = () => {
    setCurrentEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setCurrentEmployee(emp);
    setIsFormOpen(true);
  };

  const handleView = (emp: Employee) => {
    setCurrentEmployee(emp);
    setIsDetailOpen(true);
  };

  const handleDelete = async (emp: Employee) => {
    if (window.confirm(`Xác nhận xóa hồ sơ nhân viên ${emp.ma_nv} - ${emp.ho_ten}?`)) {
      if (emp.id) {
        await api.deleteEmployee(emp.id);
        showNotification(`Đã xóa hồ sơ ${emp.ma_nv}`);
        await loadData();
      }
    }
  };

  const handleSave = async (data: Employee) => {
    if (data.id) {
      await api.updateEmployee(data.id, data);
      showNotification(`Cập nhật thành công hồ sơ ${data.ma_nv}`);
    } else {
      await api.createEmployee(data);
      showNotification(`Thêm mới thành công nhân viên ${data.ma_nv}`);
    }
    await loadData();
  };

  const handleExport = () => {
    exportEmployeesToExcel(
      filteredEmployees,
      `Danh_sach_nhan_su_${status === "all" ? "tat_ca" : status}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    showNotification(`Đã xuất ${filteredEmployees.length} dòng ra Excel`);
  };

  const handleImportComplete = async (items: Employee[]) => {
    await api.bulkImport(items);
    showNotification(`Đã import thành công ${items.length} hồ sơ`);
    await loadData();
  };

  const handleResetSeed = () => {
    if (window.confirm("Khôi phục lại toàn bộ 121 hồ sơ nhân sự chuẩn từ file data.xlsx ban đầu?")) {
      api.resetSeedData();
      loadData();
      showNotification("Đã khôi phục toàn bộ danh sách nhân sự gốc từ file data.xlsx!");
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Nếu chưa đăng nhập -> hiển thị trang đăng nhập
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8F9FA] font-sans select-none">
      {/* 1. Navbar cố định trên cùng */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImport={() => setIsImportOpen(true)}
        onReset={handleResetSeed}
        totalCount={totalCount}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Khung thân hệ thống: Sidebar cố định bên trái, Chỉ Main Area cuộn */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar cố định */}
        <Sidebar
          isOpen={isSidebarOpen}
          currentStatus={status}
          onSelectStatus={(s) => setStatus(s)}
          currentDepartment={department}
          onSelectDepartment={(d) => setDepartment(d)}
          departments={departmentStats}
          totalCount={totalCount}
          activeCount={activeCount}
          resignedCount={resignedCount}
          onAddNew={handleAddNew}
          onImport={() => setIsImportOpen(true)}
          onExport={handleExport}
          onReset={handleResetSeed}
        />

        {/* Main Content Area - Duy nhất khu vực này cuộn độc lập */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 select-text">
          <div className="max-w-7xl mx-auto space-y-4 pb-8">
            {/* Toast thông báo */}
            {notify && (
              <div className="px-3 py-2 bg-gray-900 text-white text-xs rounded-[3px] flex items-center justify-between border-l-4 border-l-[#00B7CD] shadow-sm animate-fade-in">
                <span>{notify.message}</span>
                <button
                  onClick={() => setNotify(null)}
                  className="text-gray-400 hover:text-white ml-4 text-sm"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Breadcrumb & Tiêu đề khu vực */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">HRM</span>
                <span>/</span>
                <span>
                  {department !== "all"
                    ? `Phòng: ${department}`
                    : status === "all"
                    ? "Tất cả hồ sơ"
                    : status}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Đang hiển thị <strong>{filteredEmployees.length}</strong> / <strong>{totalCount}</strong> nhân sự
              </div>
            </div>

            {/* Thống kê thẻ phẳng */}
            <StatsBar
              total={totalCount}
              active={activeCount}
              resigned={resignedCount}
              departmentCount={departmentStats.length}
              currentStatus={status}
              onSelectStatus={(s) => setStatus(s)}
            />

            {/* Bộ lọc */}
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              department={department}
              onDepartmentChange={setDepartment}
              departments={departmentNames}
              totalFiltered={filteredEmployees.length}
              onClear={() => {
                setSearch("");
                setStatus("all");
                setDepartment("all");
              }}
            />

            {/* Bảng nhân sự */}
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-[3px] p-8 text-center text-xs text-gray-500">
                Đang tải dữ liệu hồ sơ nhân sự...
              </div>
            ) : (
              <EmployeeTable
                employees={filteredEmployees}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={currentEmployee}
        departments={departmentNames}
      />

      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(emp) => {
          setIsDetailOpen(false);
          handleEdit(emp);
        }}
        employee={currentEmployee}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default App;
