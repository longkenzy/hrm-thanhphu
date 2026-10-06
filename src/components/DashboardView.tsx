import React from "react";
import { Employee } from "../types/employee";
import { MainTab } from "../types/system";

interface DashboardViewProps {
  employees: Employee[];
  departments: { name: string; count: number }[];
  onNavigate: (tab: MainTab) => void;
  onAddNew: () => void;
  onViewEmployee: (emp: Employee) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  departments,
  onNavigate,
  onAddNew,
  onViewEmployee,
}) => {
  const activeEmployees = employees.filter((e) => e.trang_thai === "Đang làm việc");
  const resignedEmployees = employees.filter((e) => e.trang_thai === "Đã nghỉ việc");

  const total = employees.length;
  const activeCount = activeEmployees.length;
  const resignedCount = resignedEmployees.length;

  const maleCount = employees.filter((e) => e.gioi_tinh === "Nam").length;
  const femaleCount = employees.filter((e) => e.gioi_tinh === "Nữ").length;

  // Recent 5 employees
  const recentEmployees = employees.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#1E2633] border-l-4 border-l-[#DF301C] rounded-[3px] p-5 text-white flex flex-col md:flex-row md:items-center justify-between shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#FFF1D1] font-bold block mb-1">
            Bảng Điều Khiển Hệ Thống
          </span>
          <h2 className="text-xl font-bold tracking-tight">
            Tổng Quan Hồ Sơ Nhân Sự Công Ty Thành Phú
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Theo dõi phân bổ nhân sự, tình trạng hợp đồng và biến động lao động thời gian thực
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button
            onClick={onAddNew}
            className="px-3.5 py-2 bg-[#FFF1D1] hover:bg-white text-gray-900 font-bold text-xs rounded-[3px] transition-colors shadow-sm"
          >
            + Thêm Nhân Viên
          </button>
          <button
            onClick={() => onNavigate("employees")}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-[3px] transition-colors border border-white/30"
          >
            Quản Lý Hồ Sơ ➔
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigate("employees")}
          className="bg-white border border-gray-200 p-4 rounded-[3px] border-t-[3px] border-t-[#DF301C] cursor-pointer hover:border-gray-300 transition-all shadow-sm"
        >
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
            Tổng Số Nhân Sự
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
            <span className="text-xs font-semibold text-[#DF301C] bg-red-50 px-1.5 py-0.5 rounded-[2px]">
              100% hồ sơ
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate("employees")}
          className="bg-white border border-gray-200 p-4 rounded-[3px] border-t-[3px] border-t-[#00B7CD] cursor-pointer hover:border-gray-300 transition-all shadow-sm"
        >
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
            Đang Làm Việc
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#00B7CD]">{activeCount}</span>
            <span className="text-xs font-semibold text-[#00B7CD] bg-cyan-50 px-1.5 py-0.5 rounded-[2px]">
              {total > 0 ? Math.round((activeCount / total) * 100) : 0}% quy mô
            </span>
          </div>
        </div>

        <div
          onClick={() => onNavigate("resigned")}
          className="bg-white border border-gray-200 p-4 rounded-[3px] border-t-[3px] border-t-[#FF9100] cursor-pointer hover:border-gray-300 transition-all shadow-sm"
        >
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
            Đã Nghỉ Việc
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#FF9100]">{resignedCount}</span>
            <span className="text-xs font-semibold text-[#FF9100] bg-amber-50 px-1.5 py-0.5 rounded-[2px]">
              {total > 0 ? Math.round((resignedCount / total) * 100) : 0}% lưu trữ
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-[3px] border-t-[3px] border-t-[#1E2633] shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold block">
            Phòng Ban Đơn Vị
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-gray-800">{departments.length}</span>
            <span className="text-xs text-gray-500">Bộ phận chính</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Phân bổ phòng ban & Cơ cấu giới tính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Phân bổ theo phòng ban */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-[3px] p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
            <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">
              Phân Bổ Nhân Lực Theo Phòng Ban
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">{departments.length} phòng ban</span>
          </div>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {departments.map((dept) => {
              const pct = total > 0 ? Math.round((dept.count / total) * 100) : 0;
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-700 truncate pr-2">{dept.name}</span>
                    <span className="font-mono text-gray-900 font-semibold shrink-0">
                      {dept.count} <span className="text-gray-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-[2px] overflow-hidden">
                    <div
                      className="bg-[#DF301C] h-full rounded-[2px]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cơ cấu giới tính & Thống kê nhân khẩu */}
        <div className="bg-white border border-gray-200 rounded-[3px] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-gray-200 mb-3">
              <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">
                Cơ Cấu Giới Tính
              </h3>
            </div>
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-[3px] flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-900 font-semibold block">Nam</span>
                  <span className="text-xs text-blue-700">
                    {total > 0 ? Math.round((maleCount / total) * 100) : 0}% tổng số
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono text-blue-800">{maleCount}</span>
              </div>

              <div className="p-3 bg-pink-50/50 border border-pink-100 rounded-[3px] flex items-center justify-between">
                <div>
                  <span className="text-xs text-pink-900 font-semibold block">Nữ</span>
                  <span className="text-xs text-pink-700">
                    {total > 0 ? Math.round((femaleCount / total) * 100) : 0}% tổng số
                  </span>
                </div>
                <span className="text-2xl font-bold font-mono text-pink-800">{femaleCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
            Dữ liệu đồng bộ trực tiếp từ cơ sở dữ liệu Cloudflare D1
          </div>
        </div>
      </div>

      {/* 4. Danh sách nhân sự mới nhất */}
      <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50/60">
          <h3 className="text-xs font-bold uppercase text-gray-800 tracking-wider">
            Nhân Sự Tiêu Biểu / Cập Nhật Mới Nhất
          </h3>
          <button
            onClick={() => onNavigate("employees")}
            className="text-xs text-[#DF301C] hover:underline font-semibold"
          >
            Xem tất cả hồ sơ ({total}) ➔
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100/70 text-gray-700 border-b border-gray-200 text-[11px] font-semibold uppercase">
                <th className="py-2.5 px-3 w-24">Mã NV</th>
                <th className="py-2.5 px-3">Họ và tên</th>
                <th className="py-2.5 px-3">Phòng ban</th>
                <th className="py-2.5 px-3">Vị trí</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentEmployees.map((emp) => (
                <tr key={emp.id || emp.ma_nv} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-gray-900">{emp.ma_nv}</td>
                  <td className="py-2.5 px-3 font-medium text-gray-900">{emp.ho_ten}</td>
                  <td className="py-2.5 px-3 text-gray-600">{emp.phong_ban || "-"}</td>
                  <td className="py-2.5 px-3 text-gray-600">{emp.vi_tri || "-"}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-[2px] text-[10.5px] font-medium border ${
                        emp.trang_thai === "Đang làm việc"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {emp.trang_thai}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-[2px] hover:border-[#00B7CD] hover:text-[#00B7CD] bg-white transition-colors"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
