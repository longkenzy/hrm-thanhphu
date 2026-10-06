import React from "react";

interface NavbarProps {
  onToggleSidebar: () => void;
  onAddNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onAddNew,
  onExport,
  onImport,
  onReset,
  totalCount,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left Section: Toggle & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            title="Đóng / Mở Menu"
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[3px] border border-gray-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />

          <div className="border-l border-gray-300 pl-3">
            <h1 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tight leading-none">
              Hệ Thống Quản Lý Hồ Sơ Nhân Sự
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[11px] text-gray-500 leading-none">
                Cloudflare D1 &bull; {totalCount} nhân sự
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="hidden sm:inline-block text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-2.5 py-1.5 rounded-[3px] bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Khôi phục lại dữ liệu gốc từ Excel"
          >
            Đồng bộ mẫu
          </button>

          <button
            onClick={onImport}
            className="text-xs text-gray-700 hover:text-gray-900 border border-gray-300 px-2.5 sm:px-3 py-1.5 rounded-[3px] bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Nhập Excel
          </button>

          <button
            onClick={onExport}
            className="text-xs text-white border border-[#00B7CD] px-2.5 sm:px-3 py-1.5 rounded-[3px] bg-[#00B7CD] hover:bg-[#009eb1] font-medium transition-colors"
          >
            Xuất Excel
          </button>

          <button
            onClick={onAddNew}
            className="text-xs text-white border border-[#DF301C] px-3 sm:px-3.5 py-1.5 rounded-[3px] bg-[#DF301C] hover:bg-[#c52714] font-medium transition-colors flex items-center"
          >
            + Thêm Nhân Viên
          </button>
        </div>
      </div>
      <div className="h-[2px] bg-gradient-to-r from-[#DF301C] via-[#FF9100] to-[#00B7CD]" />
    </header>
  );
};
