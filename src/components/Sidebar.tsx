import React from "react";

interface SidebarProps {
  isOpen: boolean;
  currentStatus: string;
  onSelectStatus: (status: string) => void;
  currentDepartment: string;
  onSelectDepartment: (dept: string) => void;
  departments: { name: string; count: number }[];
  totalCount: number;
  activeCount: number;
  resignedCount: number;
  onAddNew: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentStatus,
  onSelectStatus,
  currentDepartment,
  onSelectDepartment,
  departments,
  totalCount,
  activeCount,
  resignedCount,
  onAddNew,
  onImport,
  onExport,
  onReset,
}) => {
  return (
    <aside
      className={`bg-[#1E2633] border-r border-[#2A3444] text-slate-200 w-64 flex flex-col shrink-0 transition-all duration-200 z-20 ${
        isOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-5">
        {/* Nhóm 1: Trạng thái hồ sơ */}
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#FFF1D1] font-bold px-2 block mb-2 opacity-90">
            Trạng Thái Hồ Sơ
          </span>
          <nav className="space-y-1">
            {/* Tất cả */}
            <button
              onClick={() => {
                onSelectStatus("all");
                onSelectDepartment("all");
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] font-medium transition-all text-left ${
                currentStatus === "all" && currentDepartment === "all"
                  ? "bg-[#DF301C] text-white font-bold shadow-sm"
                  : "text-slate-300 hover:bg-[#2A3444] hover:text-white"
              }`}
            >
              <span>Tất cả hồ sơ</span>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[3px] ${
                  currentStatus === "all" && currentDepartment === "all"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-[#2A3444] text-slate-300"
                }`}
              >
                {totalCount}
              </span>
            </button>

            {/* Đang làm việc */}
            <button
              onClick={() => onSelectStatus("Đang làm việc")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] font-medium transition-all text-left ${
                currentStatus === "Đang làm việc"
                  ? "bg-[#00B7CD] text-white font-bold shadow-sm"
                  : "text-slate-300 hover:bg-[#2A3444] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00B7CD]" />
                <span>Đang làm việc</span>
              </div>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[3px] font-bold ${
                  currentStatus === "Đang làm việc"
                    ? "bg-white/20 text-white"
                    : "bg-[#00B7CD]/20 text-[#00B7CD]"
                }`}
              >
                {activeCount}
              </span>
            </button>

            {/* Đã nghỉ việc */}
            <button
              onClick={() => onSelectStatus("Đã nghỉ việc")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[3px] font-medium transition-all text-left ${
                currentStatus === "Đã nghỉ việc"
                  ? "bg-[#FF9100] text-white font-bold shadow-sm"
                  : "text-slate-300 hover:bg-[#2A3444] hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#FF9100]" />
                <span>Đã nghỉ việc</span>
              </div>
              <span
                className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[3px] font-bold ${
                  currentStatus === "Đã nghỉ việc"
                    ? "bg-white/20 text-white"
                    : "bg-[#FF9100]/20 text-[#FF9100]"
                }`}
              >
                {resignedCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Nhóm 2: Lọc theo phòng ban */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10.5px] uppercase tracking-wider text-[#FFF1D1] font-bold opacity-90">
              Phòng Ban ({departments.length})
            </span>
            {currentDepartment !== "all" && (
              <button
                onClick={() => onSelectDepartment("all")}
                className="text-[10.5px] text-[#FF9100] hover:text-white underline font-medium"
              >
                Xem tất cả
              </button>
            )}
          </div>
          <nav className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
            {departments.map((dept) => {
              const isSelected = currentDepartment === dept.name;
              return (
                <button
                  key={dept.name}
                  onClick={() => onSelectDepartment(dept.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-all text-left text-xs ${
                    isSelected
                      ? "bg-[#00B7CD] text-white font-bold shadow-sm"
                      : "text-slate-300 hover:bg-[#2A3444] hover:text-white"
                  }`}
                >
                  <span className="truncate pr-2">{dept.name}</span>
                  <span
                    className={`font-mono text-[10.5px] px-1.5 py-0.2 rounded-[2px] ${
                      isSelected
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-[#2A3444] text-slate-400"
                    }`}
                  >
                    {dept.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Nhóm 3: Tiện ích dữ liệu */}
        <div className="border-t border-[#2A3444] pt-3">
          <span className="text-[10.5px] uppercase tracking-wider text-[#FFF1D1] font-bold px-2 block mb-2 opacity-90">
            Thao Tác Nhanh
          </span>
          <nav className="space-y-1.5">
            <button
              onClick={onAddNew}
              className="w-full text-center px-3 py-1.5 text-xs bg-[#DF301C] hover:bg-[#c52714] text-white rounded-[3px] font-bold transition-all shadow-sm block"
            >
              + Thêm Nhân Sự Mới
            </button>
            <button
              onClick={onExport}
              className="w-full text-center px-3 py-1.5 text-xs bg-[#00B7CD] hover:bg-[#009eb1] text-white rounded-[3px] font-bold transition-all shadow-sm block"
            >
              Xuất File Excel (.xlsx)
            </button>
            <button
              onClick={onImport}
              className="w-full text-center px-3 py-1.5 text-xs bg-[#2A3444] hover:bg-[#354256] text-slate-200 border border-slate-600 rounded-[3px] font-medium transition-all block"
            >
              Nhập File Excel (.xlsx)
            </button>
            <button
              onClick={onReset}
              className="w-full text-center px-2 py-1 text-[11px] text-slate-400 hover:text-[#FFF1D1] hover:underline transition-colors block mt-1"
            >
              Khôi phục dữ liệu gốc mẫu
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-[#2A3444] bg-[#171E28] text-[11px] flex items-center justify-between text-slate-400">
        <span className="font-semibold text-slate-300">HRM Flat UI</span>
        <span className="text-[10.5px] text-[#00B7CD] font-mono">D1 Serverless</span>
      </div>
    </aside>
  );
};
