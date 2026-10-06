import React from "react";
import { MainTab } from "../types/system";

interface SidebarProps {
  isOpen: boolean;
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  activeCount: number;
  resignedCount: number;
  trashCount: number;
  logsCount: number;
  onAddNew: () => void;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentTab,
  onSelectTab,
  activeCount,
  resignedCount,
  trashCount,
  logsCount,
  onAddNew,
  onImport,
  onExport,
  onReset,
}) => {
  const menuItems: {
    id: MainTab;
    label: string;
    badge?: number;
    badgeColor?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.8" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.8" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      id: "employees",
      label: "Hồ sơ nhân sự",
      badge: activeCount,
      badgeColor: "bg-[#00B7CD]",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "resigned",
      label: "Nghỉ việc",
      badge: resignedCount,
      badgeColor: "bg-[#FF9100]",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "trash",
      label: "Thùng rác",
      badge: trashCount > 0 ? trashCount : undefined,
      badgeColor: "bg-red-600",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    {
      id: "logs",
      label: "Nhật ký",
      badge: logsCount > 0 ? logsCount : undefined,
      badgeColor: "bg-slate-600",
      icon: (
        <svg className="w-4 h-4 shrink-0 text-current opacity-85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`bg-[#1E2633] border-r border-[#2A3444] text-slate-200 w-64 h-[calc(100vh-58.5px)] sticky top-[58.5px] flex flex-col shrink-0 transition-all duration-200 z-20 ${
        isOpen ? "block" : "hidden md:block"
      }`}
    >
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-5">
        {/* Nhóm Menu Chính */}
        <div>
          <span className="text-[10.5px] uppercase tracking-wider text-[#FFF1D1] font-bold px-2 block mb-2 opacity-90">
            Danh Mục Hệ Thống
          </span>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] font-medium transition-all text-left ${
                    isActive
                      ? "bg-[#DF301C] text-white font-bold shadow-sm"
                      : "text-slate-300 hover:bg-[#2A3444] hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="shrink-0 flex items-center justify-center">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded-[3px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : `${item.badgeColor || "bg-[#2A3444]"} text-white`
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tiện ích thao tác nhanh */}
        <div className="border-t border-[#2A3444] pt-4">
          <span className="text-[10.5px] uppercase tracking-wider text-[#FFF1D1] font-bold px-2 block mb-2 opacity-90">
            Thao Tác Dữ Liệu
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
        <span className="font-semibold text-slate-300">HRM Thành Phú</span>
        <span className="text-[10.5px] text-[#00B7CD] font-mono">D1 Database</span>
      </div>
    </aside>
  );
};
