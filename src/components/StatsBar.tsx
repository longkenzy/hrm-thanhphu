import React from "react";

interface StatsProps {
  total: number;
  active: number;
  resigned: number;
  departmentCount: number;
  currentStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatsBar: React.FC<StatsProps> = ({
  total,
  active,
  resigned,
  departmentCount,
  currentStatus,
  onSelectStatus,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      {/* Tổng nhân sự */}
      <div
        onClick={() => onSelectStatus("all")}
        className={`bg-white border p-3.5 rounded-[3px] cursor-pointer transition-all border-t-[3px] border-t-[#DF301C] ${
          currentStatus === "all" ? "border-gray-400 bg-red-50/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">
          Tổng hồ sơ
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-[#DF301C] font-medium">Toàn bộ</span>
        </div>
      </div>

      {/* Đang làm việc */}
      <div
        onClick={() => onSelectStatus("Đang làm việc")}
        className={`bg-white border p-3.5 rounded-[3px] cursor-pointer transition-all border-t-[3px] border-t-[#00B7CD] ${
          currentStatus === "Đang làm việc" ? "border-gray-400 bg-cyan-50/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">
          Đang làm việc
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-[#00B7CD]">{active}</span>
          <span className="text-xs text-gray-500">
            {total > 0 ? Math.round((active / total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Đã nghỉ việc */}
      <div
        onClick={() => onSelectStatus("Đã nghỉ việc")}
        className={`bg-white border p-3.5 rounded-[3px] cursor-pointer transition-all border-t-[3px] border-t-[#FF9100] ${
          currentStatus === "Đã nghỉ việc" ? "border-gray-400 bg-amber-50/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">
          Đã nghỉ việc
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-[#FF9100]">{resigned}</span>
          <span className="text-xs text-gray-500">
            {total > 0 ? Math.round((resigned / total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Phòng ban */}
      <div className="bg-white border border-gray-200 p-3.5 rounded-[3px] border-t-[3px] border-t-gray-500">
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">
          Phòng ban hoạt động
        </span>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-gray-800">{departmentCount}</span>
          <span className="text-xs text-gray-500">Đơn vị</span>
        </div>
      </div>
    </div>
  );
};
