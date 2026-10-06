import React, { useState, useEffect, useMemo } from "react";
import { Employee } from "./types/employee";
import { api } from "./lib/api";
import { exportEmployeesToExcel } from "./lib/excelHelper";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { FilterBar } from "./components/FilterBar";
import { EmployeeTable } from "./components/EmployeeTable";
import { EmployeeFormModal } from "./components/EmployeeFormModal";
import { EmployeeDetailModal } from "./components/EmployeeDetailModal";
import { ImportExcelModal } from "./components/ImportExcelModal";

export const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  // Notification message
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
    loadData();
  }, []);

  // Danh sách phòng ban duy nhất
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.phong_ban?.trim()) set.add(e.phong_ban.trim());
    });
    return Array.from(set).sort();
  }, [employees]);

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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <Header
        onAddNew={handleAddNew}
        onExport={handleExport}
        onImport={() => setIsImportOpen(true)}
        onReset={handleResetSeed}
        totalCount={totalCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* Toast thông báo phẳng */}
        {notify && (
          <div className="mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-[3px] flex items-center justify-between border-l-4 border-l-[#00B7CD] shadow-sm animate-fade-in">
            <span>{notify.message}</span>
            <button
              onClick={() => setNotify(null)}
              className="text-gray-400 hover:text-white ml-4 text-sm"
            >
              &times;
            </button>
          </div>
        )}

        {/* Stats */}
        <StatsBar
          total={totalCount}
          active={activeCount}
          resigned={resignedCount}
          departmentCount={departments.length}
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
          departments={departments}
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
      </main>

      {/* Footer bản quyền & thông tin */}
      <footer className="border-t border-gray-200 bg-white py-3 text-center text-[11px] text-gray-400">
        Hệ thống quản lý nhân sự &bull; Cloudflare D1 Serverless &bull; Cloudflare Pages
      </footer>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={currentEmployee}
        departments={departments}
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
