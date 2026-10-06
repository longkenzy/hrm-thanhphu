import React from "react";
import { ActivityLog } from "../types/system";

interface LogViewProps {
  logs: ActivityLog[];
  onClearLogs: () => void;
  onRefresh: () => void;
}

export const LogView: React.FC<LogViewProps> = ({ logs, onClearLogs, onRefresh }) => {
  const getBadgeClass = (type: ActivityLog["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "danger":
        return "bg-red-50 text-red-800 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-[3px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00B7CD]" />
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
              Nhật Ký Thao Tác Hệ Thống ({logs.length})
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Lịch sử các hoạt động nhập liệu, chỉnh sửa, đăng nhập và xuất dữ liệu
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-xs rounded-[3px] transition-colors"
          >
            Làm Mới
          </button>
          {logs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nhật ký thao tác?")) {
                  onClearLogs();
                }
              }}
              className="px-3 py-1.5 border border-gray-300 text-red-600 hover:bg-red-50 font-medium text-xs rounded-[3px] transition-colors"
            >
              Xóa Nhật Ký
            </button>
          )}
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-sm">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">Chưa có nhật ký hoạt động nào</p>
            <p className="text-gray-400">Các thao tác của người dùng sẽ tự động được ghi lại tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200 text-[11px] font-semibold uppercase">
                  <th className="py-2.5 px-3 w-40">Thời gian</th>
                  <th className="py-2.5 px-3 w-28">Tài khoản</th>
                  <th className="py-2.5 px-3 w-36">Thao tác</th>
                  <th className="py-2.5 px-3">Chi tiết nội dung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-gray-500 whitespace-nowrap text-[11.5px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-gray-900">
                      @{log.user}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[2px] text-[10.5px] font-medium border ${getBadgeClass(
                          log.type
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
