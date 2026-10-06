import React, { useState, useEffect, useMemo } from "react";
import { Employee } from "./types/employee";
import { AuthUser } from "./types/auth";
import { MainTab, ActivityLog } from "./types/system";
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
import { DashboardView } from "./components/DashboardView";
import { ReportView } from "./components/ReportView";
import { TrashView } from "./components/TrashView";
import { LogView } from "./components/LogView";

export const App: React.FC = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => api.getCurrentUser());

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<MainTab>("dashboard");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [trashItems, setTrashItems] = useState<Employee[]>(() => api.getTrash());
  const [logs, setLogs] = useState<ActivityLog[]>(() => api.getLogs());

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
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
      setTrashItems(api.getTrash());
      setLogs(api.getLogs());
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

  // Thống kê phòng ban kèm số lượng
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

  // Số lượng hồ sơ
  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.trang_thai === "Đang làm việc").length;
  const resignedCount = employees.filter((e) => e.trang_thai === "Đã nghỉ việc").length;

  // Bộ lọc dữ liệu theo tab (Hồ sơ nhân sự vs Nghỉ việc)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Nếu tab là Hồ sơ nhân sự -> chỉ hiển thị Đang làm việc
      if (currentTab === "employees" && emp.trang_thai !== "Đang làm việc") {
        return false;
      }
      // Nếu tab là Nghỉ việc -> chỉ hiển thị Đã nghỉ việc
      if (currentTab === "resigned" && emp.trang_thai !== "Đã nghỉ việc") {
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
  }, [employees, currentTab, department, search]);

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
    if (window.confirm(`Chuyển hồ sơ nhân viên ${emp.ma_nv} - ${emp.ho_ten} vào Thùng rác?`)) {
      if (emp.id) {
        await api.deleteEmployee(emp.id);
        showNotification(`Đã chuyển ${emp.ma_nv} vào thùng rác`);
        await loadData();
      }
    }
  };

  const handleSave = async (data: Employee) => {
    if (data.id) {
      await api.updateEmployee(data.id, data);
      api.addLog("Cập nhật hồ sơ", `Cập nhật thông tin nhân viên ${data.ma_nv} - ${data.ho_ten}`, "info");
      showNotification(`Cập nhật thành công hồ sơ ${data.ma_nv}`);
    } else {
      await api.createEmployee(data);
      api.addLog("Thêm nhân sự", `Thêm mới nhân viên ${data.ma_nv} - ${data.ho_ten}`, "success");
      showNotification(`Thêm mới thành công nhân viên ${data.ma_nv}`);
    }
    await loadData();
  };

  const handleExport = () => {
    const listToExport = currentTab === "resigned" 
      ? employees.filter(e => e.trang_thai === "Đã nghỉ việc")
      : employees.filter(e => e.trang_thai === "Đang làm việc");

    exportEmployeesToExcel(
      listToExport,
      `Danh_sach_${currentTab === "resigned" ? "nghi_viec" : "nhan_su"}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    api.addLog("Xuất Excel", `Xuất ${listToExport.length} hồ sơ ra file Excel`, "info");
    showNotification(`Đã xuất ${listToExport.length} dòng ra Excel`);
  };

  const handleImportComplete = async (items: Employee[]) => {
    await api.bulkImport(items);
    api.addLog("Nhập Excel", `Nhập thành công ${items.length} hồ sơ từ file Excel`, "success");
    showNotification(`Đã import thành công ${items.length} hồ sơ`);
    await loadData();
  };

  const handleResetSeed = () => {
    if (window.confirm("Khôi phục lại toàn bộ 121 hồ sơ nhân sự chuẩn từ file data.xlsx ban đầu?")) {
      api.resetSeedData();
      loadData();
      showNotification("Đã khôi phục toàn bộ danh sách nhân sự gốc!");
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Thao tác thùng rác
  const handleRestoreFromTrash = (emp: Employee) => {
    if (emp.id) {
      api.restoreFromTrash(emp.id);
      showNotification(`Đã khôi phục hồ sơ ${emp.ma_nv} - ${emp.ho_ten}`);
      loadData();
    }
  };

  const handlePermanentDelete = (emp: Employee) => {
    if (emp.id) {
      api.permanentDeleteTrash(emp.id);
      showNotification(`Đã xóa vĩnh viễn hồ sơ ${emp.ma_nv}`);
      loadData();
    }
  };

  const handleEmptyTrash = () => {
    api.emptyTrash();
    showNotification("Đã dọn sạch thùng rác");
    loadData();
  };

  const handleClearLogs = () => {
    api.clearLogs();
    setLogs([]);
    showNotification("Đã làm sạch nhật ký thao tác");
  };

  // Nếu chưa đăng nhập -> hiển thị trang đăng nhập
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const getTabTitle = () => {
    switch (currentTab) {
      case "dashboard":
        return "Dashboard Tổng Quan";
      case "employees":
        return "Danh Sách Hồ Sơ Nhân Sự (Đang Làm Việc)";
      case "resigned":
        return "Danh Sách Nhân Viên Đã Nghỉ Việc";
      case "reports":
        return "Báo Cáo Thống Kê Nhân Sự";
      case "trash":
        return "Thùng Rác Hồ Sơ";
      case "logs":
        return "Nhật Ký Thao Tác Hệ Thống";
    }
  };

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
        {/* Sidebar với menu chính */}
        <Sidebar
          isOpen={isSidebarOpen}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setDepartment("all");
            setSearch("");
          }}
          activeCount={activeCount}
          resignedCount={resignedCount}
          trashCount={trashItems.length}
          logsCount={logs.length}
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
                <span className="text-[#DF301C] font-semibold">{getTabTitle()}</span>
              </div>
              <div className="text-xs text-gray-500">
                {currentTab === "employees" && (
                  <>Đang hiển thị <strong>{filteredEmployees.length}</strong> / <strong>{activeCount}</strong> nhân sự</>
                )}
                {currentTab === "resigned" && (
                  <>Đang hiển thị <strong>{filteredEmployees.length}</strong> / <strong>{resignedCount}</strong> nhân sự đã nghỉ</>
                )}
                {currentTab === "dashboard" && (
                  <>Tổng hồ sơ hệ thống: <strong>{totalCount}</strong></>
                )}
              </div>
            </div>

            {/* TAB 1: DASHBOARD */}
            {currentTab === "dashboard" && (
              <DashboardView
                employees={employees}
                departments={departmentStats}
                onNavigate={(tab) => setCurrentTab(tab)}
                onAddNew={handleAddNew}
                onViewEmployee={handleView}
              />
            )}

            {/* TAB 2 & 3: HỒ SƠ NHÂN SỰ HOẶC NGHỈ VIỆC */}
            {(currentTab === "employees" || currentTab === "resigned") && (
              <>
                {/* Thống kê thẻ phẳng */}
                <StatsBar
                  total={totalCount}
                  active={activeCount}
                  resigned={resignedCount}
                  departmentCount={departmentStats.length}
                  currentStatus={currentTab === "employees" ? "Đang làm việc" : "Đã nghỉ việc"}
                  onSelectStatus={(s) => {
                    if (s === "Đang làm việc") setCurrentTab("employees");
                    else if (s === "Đã nghỉ việc") setCurrentTab("resigned");
                  }}
                />

                {/* Bộ lọc */}
                <FilterBar
                  search={search}
                  onSearchChange={setSearch}
                  status={currentTab === "employees" ? "Đang làm việc" : "Đã nghỉ việc"}
                  onStatusChange={(s) => {
                    if (s === "Đang làm việc") setCurrentTab("employees");
                    else if (s === "Đã nghỉ việc") setCurrentTab("resigned");
                  }}
                  department={department}
                  onDepartmentChange={setDepartment}
                  departments={departmentNames}
                  totalFiltered={filteredEmployees.length}
                  onClear={() => {
                    setSearch("");
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
              </>
            )}

            {/* TAB 4: BÁO CÁO */}
            {currentTab === "reports" && <ReportView employees={employees} />}

            {/* TAB 5: THÙNG RÁC */}
            {currentTab === "trash" && (
              <TrashView
                trashItems={trashItems}
                onRestore={handleRestoreFromTrash}
                onPermanentDelete={handlePermanentDelete}
                onEmptyTrash={handleEmptyTrash}
              />
            )}

            {/* TAB 6: NHẬT KÝ */}
            {currentTab === "logs" && (
              <LogView
                logs={logs}
                onClearLogs={handleClearLogs}
                onRefresh={() => setLogs(api.getLogs())}
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
