import React from "react";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  departments: string[];
  totalFiltered: number;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
  departments,
  totalFiltered,
  onClear,
}) => {
  const isFiltered = search !== "" || status !== "all" || department !== "all";

  return (
    <div className="bg-white border border-gray-200 p-3 rounded-[3px] mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {/* Tìm kiếm */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo Mã NV, Họ tên, CCCD, SĐT..."
            className="w-full border border-gray-300 rounded-[3px] px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#DF301C] bg-white"
          />
        </div>

        {/* Lọc theo Trạng thái */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border border-gray-300 rounded-[3px] px-2.5 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-[#DF301C]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Đã nghỉ việc">Đã nghỉ việc</option>
        </select>

        {/* Lọc theo Phòng ban */}
        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="border border-gray-300 rounded-[3px] px-2.5 py-1.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-[#DF301C] max-w-[220px]"
        >
          <option value="all">Tất cả phòng ban ({departments.length})</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Nút Xóa lọc */}
        {isFiltered && (
          <button
            onClick={onClear}
            className="text-xs text-gray-600 hover:text-red-600 border border-dashed border-gray-300 px-2.5 py-1.5 rounded-[3px] hover:border-red-300 transition-colors"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Hiển thị số lượng tìm thấy */}
      <div className="text-xs text-gray-500 font-medium whitespace-nowrap pl-2 border-l border-gray-200">
        Tìm thấy: <strong className="text-gray-900">{totalFiltered}</strong> nhân sự
      </div>
    </div>
  );
};
