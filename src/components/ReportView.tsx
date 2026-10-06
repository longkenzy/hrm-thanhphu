import React from "react";
import { Employee } from "../types/employee";
import { exportEmployeesToExcel } from "../lib/excelHelper";

interface ReportViewProps {
  employees: Employee[];
}

export const ReportView: React.FC<ReportViewProps> = ({ employees }) => {
  const activeEmployees = employees.filter((e) => e.trang_thai === "Đang làm việc");
  const resignedEmployees = employees.filter((e) => e.trang_thai === "Đã nghỉ việc");
  const total = employees.length;

  // Thống kê phòng ban
  const deptStats = React.useMemo(() => {
    const map = new Map<string, { active: number; resigned: number; total: number }>();
    employees.forEach((e) => {
      const d = e.phong_ban?.trim() || "Chưa phân bổ";
      const current = map.get(d) || { active: 0, resigned: 0, total: 0 };
      if (e.trang_thai === "Đang làm việc") current.active++;
      else current.resigned++;
      current.total++;
      map.set(d, current);
    });
    return Array.from(map.entries())
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.total - a.total);
  }, [employees]);

  // Thống kê cấp bậc
  const rankStats = React.useMemo(() => {
    const map = new Map<string, number>();
    activeEmployees.forEach((e) => {
      const rank = e.cap_bac?.trim() || "Chưa xếp bậc";
      map.set(rank, (map.get(rank) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [activeEmployees]);

  // Thống kê trình độ học vấn
  const eduStats = React.useMemo(() => {
    const map = new Map<string, number>();
    activeEmployees.forEach((e) => {
      const edu = e.trinh_do_hoc_van?.trim() || "Khác";
      map.set(edu, (map.get(edu) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [activeEmployees]);

  const handleExportReport = () => {
    exportEmployeesToExcel(employees, `Bao_cao_nhan_su_tong_hop_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="bg-white border border-gray-200 rounded-[3px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
            Báo Cáo Cơ Cấu Nhân Sự Toàn Công Ty
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng hợp dữ liệu nhân sự, thâm niên và biến động lao động
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-[#00B7CD] hover:bg-[#009eb1] text-white font-bold text-xs rounded-[3px] transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          Xuất Báo Cáo Excel (.xlsx)
        </button>
      </div>

      {/* Bảng báo cáo theo phòng ban */}
      <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            I. Báo Cáo Nhân Sự Theo Phòng Ban
          </h3>
          <span className="text-xs text-gray-500 font-medium">Tổng: {deptStats.length} phòng ban</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200 text-[11px] font-semibold uppercase">
                <th className="py-2.5 px-3 w-12 text-center">STT</th>
                <th className="py-2.5 px-3">Tên Phòng Ban</th>
                <th className="py-2.5 px-3 text-center">Đang làm việc</th>
                <th className="py-2.5 px-3 text-center">Đã nghỉ việc</th>
                <th className="py-2.5 px-3 text-center font-bold">Tổng nhân sự</th>
                <th className="py-2.5 px-3 text-right">Tỷ lệ cơ cấu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {deptStats.map((item, idx) => {
                const pct = total > 0 ? ((item.total / total) * 100).toFixed(1) : "0";
                return (
                  <tr key={item.name} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-gray-900 font-semibold">{item.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#00B7CD]">{item.active}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#FF9100]">{item.resigned}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-900">{item.total}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-gray-700">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold text-gray-900 border-t border-gray-300">
                <td colSpan={2} className="py-2.5 px-3 text-center uppercase text-[11px]">
                  Tổng Cộng Toàn Công Ty
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-[#00B7CD]">{activeEmployees.length}</td>
                <td className="py-2.5 px-3 text-center font-mono text-[#FF9100]">{resignedEmployees.length}</td>
                <td className="py-2.5 px-3 text-center font-mono text-gray-900">{total}</td>
                <td className="py-2.5 px-3 text-right font-mono">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Hai cột: Cấp bậc & Học vấn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cấp bậc */}
        <div className="bg-white border border-gray-200 rounded-[3px] p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200 mb-3">
            II. Phân Bổ Theo Cấp Bậc (Đang Làm Việc)
          </h3>
          <div className="space-y-2">
            {rankStats.map(([rank, count]) => {
              const pct = activeEmployees.length > 0 ? Math.round((count / activeEmployees.length) * 100) : 0;
              return (
                <div key={rank} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-[2px] text-xs">
                  <span className="font-medium text-gray-800">{rank}</span>
                  <span className="font-mono font-bold text-gray-900">
                    {count} <span className="text-gray-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Học vấn */}
        <div className="bg-white border border-gray-200 rounded-[3px] p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-200 mb-3">
            III. Trình Độ Học Vấn / Bằng Cấp
          </h3>
          <div className="space-y-2">
            {eduStats.map(([edu, count]) => {
              const pct = activeEmployees.length > 0 ? Math.round((count / activeEmployees.length) * 100) : 0;
              return (
                <div key={edu} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-100 rounded-[2px] text-xs">
                  <span className="font-medium text-gray-800">{edu}</span>
                  <span className="font-mono font-bold text-gray-900">
                    {count} <span className="text-gray-400 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
