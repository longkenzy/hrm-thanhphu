import React, { useState } from "react";
import { Employee } from "../types/employee";

interface TableProps {
  employees: Employee[];
  onView: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<TableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(employees.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentEmployees = employees.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[3px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 w-12 text-center">STT</th>
              <th className="py-2.5 px-3 w-24">Mã NV</th>
              <th className="py-2.5 px-3 min-w-[150px]">Họ và tên</th>
              <th className="py-2.5 px-3 w-20">Giới tính</th>
              <th className="py-2.5 px-3 min-w-[140px]">Phòng ban</th>
              <th className="py-2.5 px-3 min-w-[150px]">Vị trí</th>
              <th className="py-2.5 px-3 min-w-[110px]">Số điện thoại</th>
              <th className="py-2.5 px-3 min-w-[110px]">CCCD</th>
              <th className="py-2.5 px-3 w-28 text-center">Trạng thái</th>
              <th className="py-2.5 px-3 w-28 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-500">
                  Không tìm thấy hồ sơ nhân sự nào phù hợp
                </td>
              </tr>
            ) : (
              currentEmployees.map((emp, idx) => {
                const isActive = emp.trang_thai === "Đang làm việc";
                return (
                  <tr
                    key={emp.id || emp.ma_nv || idx}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center text-gray-500 font-mono">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-gray-900">
                      {emp.ma_nv}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onView(emp)}
                        className="font-medium text-gray-900 hover:text-[#DF301C] text-left transition-colors"
                      >
                        {emp.ho_ten}
                      </button>
                      {emp.email && (
                        <span className="block text-[10.5px] text-gray-400">
                          {emp.email}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {emp.gioi_tinh || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {emp.phong_ban || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {emp.vi_tri || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 font-mono">
                      {emp.sdt || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 font-mono">
                      {emp.cccd || "-"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[3px] text-[10.5px] font-medium border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {emp.trang_thai}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex space-x-1">
                        <button
                          onClick={() => onView(emp)}
                          className="px-2 py-1 text-[11px] text-gray-700 hover:text-[#00B7CD] border border-gray-200 hover:border-[#00B7CD] rounded-[3px] bg-white transition-colors"
                        >
                          Xem
                        </button>
                        <button
                          onClick={() => onEdit(emp)}
                          className="px-2 py-1 text-[11px] text-gray-700 hover:text-[#DF301C] border border-gray-200 hover:border-[#DF301C] rounded-[3px] bg-white transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onDelete(emp)}
                          className="px-2 py-1 text-[11px] text-gray-500 hover:text-red-700 border border-gray-200 hover:border-red-300 rounded-[3px] bg-white transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {employees.length > 0 && (
        <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div>
            Hiển thị <strong>{startIndex + 1}</strong> -{" "}
            <strong>{Math.min(startIndex + pageSize, employees.length)}</strong> trên{" "}
            <strong>{employees.length}</strong> nhân sự
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-gray-300 rounded-[3px] bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            >
              Trước
            </button>
            <span className="px-2 font-mono text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-gray-300 rounded-[3px] bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
