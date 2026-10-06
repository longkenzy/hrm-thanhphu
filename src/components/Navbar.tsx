import React from "react";

interface NavbarProps {
  onToggleSidebar: () => void;
  onAddNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  totalCount: number;
  user?: import("../types/auth").AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onAddNew,
  onExport,
  onImport,
  onReset,
  totalCount,
  user,
  onLogout,
}) => {
  return (
    <header className="bg-[#DF301C] text-white sticky top-0 z-30 shadow-sm">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left Section: Toggle, Logo & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            title="Đóng / Mở Menu"
            className="p-1.5 text-white/90 hover:text-white hover:bg-black/15 rounded-[3px] border border-white/20 transition-colors"
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

          {/* Logo container with crisp white background */}
          <div className="bg-white px-2 py-1 rounded-[3px] flex items-center shadow-sm">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="border-l border-white/30 pl-3">
            <h1 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight leading-none">
              HRM THÀNH PHÚ
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span className="text-[11px] text-[#FFF1D1] font-medium leading-none">
                CÔNG TY CP ĐẦU TƯ XÂY LẮP THÀNH PHÚ &bull; {totalCount} nhân sự
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="hidden sm:inline-block text-xs text-white/90 hover:text-white border border-white/30 px-2.5 py-1.5 rounded-[3px] bg-white/10 hover:bg-white/20 transition-colors font-medium"
            title="Khôi phục lại dữ liệu gốc từ Excel"
          >
            Đồng bộ mẫu
          </button>

          <button
            onClick={onImport}
            className="text-xs text-white hover:text-white border border-white/40 px-2.5 sm:px-3 py-1.5 rounded-[3px] bg-white/15 hover:bg-white/25 font-medium transition-colors"
          >
            Nhập Excel
          </button>

          <button
            onClick={onExport}
            className="text-xs text-white border border-[#00B7CD] px-2.5 sm:px-3 py-1.5 rounded-[3px] bg-[#00B7CD] hover:bg-[#009eb1] font-bold transition-colors shadow-sm"
          >
            Xuất Excel
          </button>

          <button
            onClick={onAddNew}
            className="text-xs text-gray-900 border border-[#FFF1D1] px-3 sm:px-3.5 py-1.5 rounded-[3px] bg-[#FFF1D1] hover:bg-white font-bold transition-colors shadow-sm flex items-center"
          >
            + Thêm Nhân Viên
          </button>

          {user && (
            <div className="flex items-center space-x-2 border-l border-white/30 pl-2 ml-1">
              <div className="hidden lg:block text-right text-[11px] leading-tight">
                <span className="font-bold text-white block">{user.full_name}</span>
                <span className="text-[#FFF1D1] text-[10px]">@{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Đăng xuất khỏi hệ thống"
                className="text-xs text-white border border-white/40 hover:bg-white/20 px-2.5 py-1.5 rounded-[3px] transition-colors font-medium"
              >
                Đăng Xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-brand solid accent stripe */}
      <div className="h-[2px] bg-[#DF301C]" />
    </header>
  );
};
