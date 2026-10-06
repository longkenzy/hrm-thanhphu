import React from "react";

interface HeaderProps {
  onAddNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onAddNew,
  onExport,
  onImport,
  onReset,
  totalCount,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              // Hide image if fails to load
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div className="border-l border-gray-300 pl-3">
            <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none uppercase">
              Hệ Thống Quản Lý Hồ Sơ Nhân Sự
            </h1>
            <p className="text-xs text-gray-500 mt-1 leading-none">
              Dữ liệu Cloudflare D1 &bull; Tổng: {totalCount} hồ sơ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-2.5 py-1.5 rounded-[3px] bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Đồng bộ lại dữ liệu gốc từ Excel"
          >
            Đồng bộ mẫu
          </button>
          
          <button
            onClick={onImport}
            className="text-xs text-gray-700 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-[3px] bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Nhập Excel
          </button>

          <button
            onClick={onExport}
            className="text-xs text-white border border-[#00B7CD] px-3 py-1.5 rounded-[3px] bg-[#00B7CD] hover:bg-[#009eb1] font-medium transition-colors"
          >
            Xuất Excel
          </button>

          <button
            onClick={onAddNew}
            className="text-xs text-white border border-[#DF301C] px-3.5 py-1.5 rounded-[3px] bg-[#DF301C] hover:bg-[#c52714] font-medium transition-colors flex items-center"
          >
            + Thêm Nhân Viên
          </button>
        </div>
      </div>
      <div className="h-[2px] bg-[#DF301C]" />
    </header>
  );
};
