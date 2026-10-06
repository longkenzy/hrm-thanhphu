import React from "react";
import { Employee } from "../types/employee";

interface DetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<DetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !employee) return null;

  const isActive = employee.trang_thai === "Đang làm việc";

  const renderField = (label: string, value: any, isMono = false) => (
    <div className="py-1.5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between text-xs">
      <span className="text-gray-500 font-medium min-w-[140px]">{label}:</span>
      <span className={`text-gray-900 text-right ${isMono ? "font-mono" : ""}`}>
        {value !== null && value !== undefined && value !== "" ? String(value) : "-"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-gray-300 rounded-[3px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 bg-[#DF301C] rounded-[2px]" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-gray-900 uppercase">
                  {employee.ho_ten}
                </h2>
                <span className="font-mono text-xs text-gray-500">({employee.ma_nv})</span>
                <span
                  className={`text-[10.5px] px-2 py-0.5 rounded-[3px] font-medium border ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {employee.trang_thai}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {employee.vi_tri || "Chức vụ chưa cập nhật"} &bull; {employee.phong_ban || "Chưa có phòng ban"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none font-bold px-2"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-5">
          {/* Nhóm 1: Thông tin cá nhân & Liên lạc */}
          <div className="bg-white border border-gray-200 rounded-[3px] p-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-[#DF301C]">
              I. Thông Tin Cá Nhân & Liên Lạc
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderField("Giới tính", employee.gioi_tinh)}
              {renderField("Ngày sinh", employee.ngay_sinh, true)}
              {renderField("Tháng sinh nhật", employee.thang_sinh ? `Tháng ${employee.thang_sinh}` : "-")}
              {renderField("Số điện thoại", employee.sdt, true)}
              {renderField("Email", employee.email)}
              {renderField("Tình trạng hôn nhân", employee.tinh_trang_hon_nhan)}
              {renderField("Số CCCD / CMND", employee.cccd, true)}
              {renderField("Ngày cấp CCCD", employee.ngay_cap_cccd, true)}
              {renderField("Nơi cấp CCCD", employee.noi_cap_cccd)}
              {renderField("Địa chỉ thường trú", employee.dia_chi_thuong_tru)}
              {renderField("Tạm trú (Số nhà/Đường)", employee.dia_chi_tam_tru)}
              {renderField("Phường/Xã - Quận/Huyện", `${employee.phuong_xa || ""} ${employee.quan_huyen || ""}`.trim())}
              {renderField("Tỉnh / Thành phố", employee.tinh_thanh)}
            </div>
          </div>

          {/* Nhóm 2: Chức vụ & Quá trình làm việc */}
          <div className="bg-white border border-gray-200 rounded-[3px] p-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-[#00B7CD]">
              II. Chức Vụ & Tổ Chức
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderField("Phòng ban", employee.phong_ban)}
              {renderField("Vị trí / Chức danh", employee.vi_tri)}
              {renderField("Cấp bậc", employee.cap_bac)}
              {renderField("Quản lý trực tiếp", employee.quan_ly_truc_tiep)}
              {renderField("Nghề nghiệp", employee.nghe_nghiep)}
              {renderField("Học vấn cao nhất", employee.trinh_do_hoc_van)}
              {renderField("Chuyên ngành", employee.chuyen_nganh)}
            </div>
          </div>

          {/* Nhóm 3: Hợp đồng lao động */}
          <div className="bg-white border border-gray-200 rounded-[3px] p-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-[#FF9100]">
              III. Quá Trình Hợp Đồng & Thâm Niên
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderField("Ngày thử việc", employee.ngay_thu_viec, true)}
              {renderField("Ngày chính thức", employee.ngay_chinh_thuc, true)}
              {renderField("Ngày ký hợp đồng", employee.ngay_ky_hop_dong, true)}
              {renderField("Thâm niên làm việc", employee.tham_nien ? `${employee.tham_nien} năm` : "-")}
              {renderField("Trạng thái HĐ", employee.trang_thai_hd)}
              {renderField("Số HĐLĐ mới nhất", employee.so_hdld_moi_nhat)}
              {renderField("Số HĐLĐ cũ", employee.so_hdld_cu)}
              {renderField("Ngày ký HĐTV", employee.ngay_ky_hdtv, true)}
              {renderField("Ngày kết thúc HĐTV", employee.ngay_ket_thuc_hdtv, true)}
              {renderField("Ký HĐLĐ XĐTH Lần 1", employee.ngay_ky_hdld_xdth_1, true)}
              {renderField("Ký HĐLĐ KXĐTH", employee.ngay_ky_hdld_kxdth, true)}
            </div>
          </div>

          {/* Nhóm 4: Lương & Bảo hiểm */}
          <div className="bg-white border border-gray-200 rounded-[3px] p-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-emerald-700">
              IV. Chế Độ Lương & Bảo Hiểm Xã Hội
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderField(
                "Lương gross hiện tại",
                employee.luong_gross_hien_tai
                  ? `${employee.luong_gross_hien_tai.toLocaleString("vi-VN")} VNĐ`
                  : "-",
                true
              )}
              {renderField("Ngày hiệu lực lương", employee.ngay_hieu_luc_hien_tai, true)}
              {renderField(
                "Lương gross thử việc",
                employee.luong_gross_thu_viec
                  ? `${employee.luong_gross_thu_viec.toLocaleString("vi-VN")} VNĐ`
                  : "-"
              )}
              {renderField(
                "Lương gross chính thức",
                employee.luong_gross_chinh_thuc
                  ? `${employee.luong_gross_chinh_thuc.toLocaleString("vi-VN")} VNĐ`
                  : "-"
              )}
              {renderField(
                "Phụ cấp",
                employee.phu_cap ? `${employee.phu_cap.toLocaleString("vi-VN")} VNĐ` : "-"
              )}
              {renderField("Số sổ BHXH", employee.so_so_bhxh, true)}
              {renderField("Tháng đóng BHXH", employee.thang_dong_bhxh)}
              {renderField(
                "Mức đóng BHXH",
                employee.muc_dong_bhxh_cu
                  ? `${employee.muc_dong_bhxh_cu.toLocaleString("vi-VN")} VNĐ`
                  : "-"
              )}
              {renderField("Số TK ngân hàng", employee.stk_ngan_hang, true)}
            </div>
          </div>

          {/* Nhóm 5: Người thân & Nghỉ việc (nếu có) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-[3px] p-4">
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-gray-700">
                V. Người Liên Hệ Khẩn Cấp
              </h3>
              {renderField("Họ tên người thân", employee.nguoi_lien_he_khan_cap)}
              {renderField("Mối quan hệ", employee.moi_quan_he)}
              {renderField("Số điện thoại", employee.sdt_nguoi_than, true)}
            </div>

            <div className="bg-white border border-gray-200 rounded-[3px] p-4">
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-3 text-gray-700">
                VI. Trạng Thái & Ghi Chú
              </h3>
              {renderField("Trạng thái", employee.trang_thai)}
              {employee.trang_thai === "Đã nghỉ việc" && (
                <>
                  {renderField("Ngày nghỉ việc", employee.ngay_nghi_viec, true)}
                  {renderField("Lý do nghỉ việc", employee.ly_do_nghi)}
                </>
              )}
              {renderField("Ghi chú", employee.ghi_chu)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-2">
          <button
            onClick={() => {
              onClose();
              onEdit(employee);
            }}
            className="px-4 py-1.5 border border-[#DF301C] bg-[#DF301C] text-white rounded-[3px] font-medium hover:bg-[#c52714] transition-colors text-xs"
          >
            Chỉnh Sửa Hồ Sơ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 bg-white text-gray-700 rounded-[3px] hover:bg-gray-100 transition-colors text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
