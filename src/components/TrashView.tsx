import React from "react";
import { Employee } from "../types/employee";

interface TrashViewProps {
  trashItems: Employee[];
  onRestore: (emp: Employee) => void;
  onPermanentDelete: (emp: Employee) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  trashItems,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-[3px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
              Thùng Rác Hồ Sơ ({trashItems.length})
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Các hồ sơ đã xóa được lưu tại đây. Bạn có thể khôi phục lại bất kỳ lúc nào hoặc xóa vĩnh viễn.
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("CẢNH BÁO: Xóa toàn bộ hồ sơ trong thùng rác? Thao tác này KHÔNG thể hoàn tác!")) {
                onEmptyTrash();
              }
            }}
            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-[3px] transition-colors shadow-sm self-start sm:self-auto"
          >
            Dọn Sạch Thùng Rác
          </button>
        )}
      </div>

      {/* Danh sách thùng rác */}
      <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden shadow-sm">
        {trashItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-2">
            <div className="text-3xl text-gray-300">🗑️</div>
            <p className="font-semibold text-gray-700">Thùng rác đang trống</p>
            <p className="text-gray-400">Không có hồ sơ nhân sự nào bị xóa gần đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200 text-[11px] font-semibold uppercase">
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 w-24">Mã NV</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3">Phòng ban</th>
                  <th className="py-2.5 px-3">Vị trí</th>
                  <th className="py-2.5 px-3">Trạng thái cũ</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trashItems.map((emp, idx) => (
                  <tr key={emp.id || emp.ma_nv} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-2.5 px-3 text-center text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-gray-900">{emp.ma_nv}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-900">{emp.ho_ten}</td>
                    <td className="py-2.5 px-3 text-gray-600">{emp.phong_ban || "-"}</td>
                    <td className="py-2.5 px-3 text-gray-600">{emp.vi_tri || "-"}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10.5px] px-2 py-0.5 rounded-[2px] bg-gray-100 text-gray-700 border border-gray-200">
                        {emp.trang_thai}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex space-x-1.5">
                        <button
                          onClick={() => onRestore(emp)}
                          className="px-2.5 py-1 text-[11px] border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-[2px] font-medium transition-colors"
                        >
                          Khôi Phục
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa vĩnh viễn hồ sơ ${emp.ma_nv} - ${emp.ho_ten}?`)) {
                              onPermanentDelete(emp);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] border border-red-300 text-red-600 hover:bg-red-50 rounded-[2px] font-medium transition-colors"
                        >
                          Xóa Vĩnh Viễn
                        </button>
                      </div>
                    </td>
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
