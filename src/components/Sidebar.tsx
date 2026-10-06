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
      className={`bg-white border-r border-gray-200 w-64 flex flex-col shrink-0 transition-all duration-200 z-20 ${
        isOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-5">
        {/* Nhóm 1: Trạng thái nhân sự */}
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold px-2 block mb-1.5">
            Trạng Thái Hồ Sơ
          </span>
          <nav className="space-y-0.5">
            <button
              onClick={() => {
                onSelectStatus("all");
                onSelectDepartment("all");
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[3px] font-medium transition-colors text-left ${
                currentStatus === "all" && currentDepartment === "all"
                  ? "bg-red-50 text-[#DF301C] font-semibold border-l-2 border-l-[#DF301C]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Tất cả hồ sơ</span>
              <span className="font-mono text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-[3px]">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => onSelectStatus("Đang làm việc")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[3px] font-medium transition-colors text-left ${
                currentStatus === "Đang làm việc"
                  ? "bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-l-emerald-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Đang làm việc</span>
              <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-[3px]">
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => onSelectStatus("Đã nghỉ việc")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[3px] font-medium transition-colors text-left ${
                currentStatus === "Đã nghỉ việc"
                  ? "bg-amber-50 text-amber-800 font-semibold border-l-2 border-l-amber-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Đã nghỉ việc</span>
              <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-[3px]">
                {resignedCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Nhóm 2: Lọc theo phòng ban */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">
              Phòng Ban ({departments.length})
            </span>
            {currentDepartment !== "all" && (
              <button
                onClick={() => onSelectDepartment("all")}
                className="text-[10.5px] text-[#DF301C] hover:underline"
              >
                Xóa chọn
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors text-left text-xs ${
                    isSelected
                      ? "bg-cyan-50 text-[#00B7CD] font-semibold border-l-2 border-l-[#00B7CD]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="truncate pr-2">{dept.name}</span>
                  <span className="font-mono text-[10.5px] text-gray-400">
                    {dept.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Nhóm 3: Tiện ích dữ liệu */}
        <div className="border-t border-gray-200 pt-3">
          <span className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold px-2 block mb-1.5">
            Thao Tác Nhanh
          </span>
          <nav className="space-y-1">
            <button
              onClick={onAddNew}
              className="w-full text-left px-2.5 py-1.5 text-xs text-[#DF301C] hover:bg-red-50 rounded-[3px] font-medium transition-colors"
            >
              + Thêm nhân sự mới
            </button>
            <button
              onClick={onImport}
              className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-[3px] transition-colors"
            >
              Nhập Excel (.xlsx)
            </button>
            <button
              onClick={onExport}
              className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-[3px] transition-colors"
            >
              Xuất Excel (.xlsx)
            </button>
            <button
              onClick={onReset}
              className="w-full text-left px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-[3px] transition-colors"
            >
              Đồng bộ dữ liệu mẫu
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-500">
        <div>Hệ thống HRM Flat UI</div>
        <div className="text-gray-400 text-[10px]">Cloudflare D1 &bull; v1.0.0</div>
      </div>
    </aside>
  );
};
