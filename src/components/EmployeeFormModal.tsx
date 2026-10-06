import React, { useState, useEffect } from "react";
import { Employee } from "../types/employee";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Employee) => Promise<void>;
  initialData?: Employee | null;
  departments: string[];
}

export const EmployeeFormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  departments,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<Employee>>({
    trang_thai: "Đang làm việc",
    gioi_tinh: "Nam",
  });
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        trang_thai: "Đang làm việc",
        gioi_tinh: "Nam",
        ma_nv: "",
        ho_ten: "",
      });
    }
    setError("");
    setActiveTab(1);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ma_nv?.trim()) {
      setError("Vui lòng nhập Mã số nhân viên (Mã NV)");
      setActiveTab(1);
      return;
    }
    if (!formData.ho_ten?.trim()) {
      setError("Vui lòng nhập Họ và tên nhân viên");
      setActiveTab(1);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onSave(formData as Employee);
      onClose();
    } catch (err: any) {
      setError(err.message || "Lỗi khi lưu hồ sơ");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 1, label: "1. Thông Tin Cá Nhân" },
    { id: 2, label: "2. Chức Vụ & Tổ Chức" },
    { id: 3, label: "3. Hợp Đồng & Công Tác" },
    { id: 4, label: "4. Lương & Bảo Hiểm" },
    { id: 5, label: "5. Khẩn Cấp & Nghỉ Việc" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-gray-300 rounded-[3px] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#DF301C] rounded-[2px]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase">
              {initialData ? `Chỉnh Sửa Hồ Sơ: ${initialData.ma_nv} - ${initialData.ho_ten}` : "Thêm Mới Hồ Sơ Nhân Sự"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none font-bold px-2"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-100/60 px-4 pt-2 gap-1 overflow-x-auto text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 font-medium border-t-2 transition-all whitespace-nowrap rounded-t-[3px] ${
                activeTab === tab.id
                  ? "bg-white text-[#DF301C] border-[#DF301C] border-l border-r border-gray-200 -mb-[1px]"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-5 mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3px]">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs">
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Mã số nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: MS00065"
                    value={formData.ma_nv || ""}
                    onChange={(e) => handleChange("ma_nv", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Họ và tên nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={formData.ho_ten || ""}
                    onChange={(e) => handleChange("ho_ten", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Giới tính</label>
                  <select
                    value={formData.gioi_tinh || "Nam"}
                    onChange={(e) => handleChange("gioi_tinh", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày sinh (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    placeholder="VD: 15/05/1985"
                    value={formData.ngay_sinh || ""}
                    onChange={(e) => handleChange("ngay_sinh", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="VD: 0914353320"
                    value={formData.sdt || ""}
                    onChange={(e) => handleChange("sdt", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="VD: nhanvien@company.vn"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    placeholder="12 chữ số"
                    value={formData.cccd || ""}
                    onChange={(e) => handleChange("cccd", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày cấp CCCD</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.ngay_cap_cccd || ""}
                    onChange={(e) => handleChange("ngay_cap_cccd", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nơi cấp CCCD</label>
                  <input
                    type="text"
                    placeholder="Cục CS QLHC về TTXH"
                    value={formData.noi_cap_cccd || ""}
                    onChange={(e) => handleChange("noi_cap_cccd", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Địa chỉ thường trú (theo CCCD)</label>
                <input
                  type="text"
                  placeholder="Ghi rõ số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  value={formData.dia_chi_thuong_tru || ""}
                  onChange={(e) => handleChange("dia_chi_thuong_tru", e.target.value)}
                  className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tạm trú: Số nhà / Đường</label>
                  <input
                    type="text"
                    value={formData.dia_chi_tam_tru || ""}
                    onChange={(e) => handleChange("dia_chi_tam_tru", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phường / Xã</label>
                  <input
                    type="text"
                    value={formData.phuong_xa || ""}
                    onChange={(e) => handleChange("phuong_xa", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quận / Huyện</label>
                  <input
                    type="text"
                    value={formData.quan_huyen || ""}
                    onChange={(e) => handleChange("quan_huyen", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={formData.tinh_thanh || ""}
                    onChange={(e) => handleChange("tinh_thanh", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHỨC VỤ & TỔ CHỨC */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phòng ban</label>
                  <input
                    list="dept-options"
                    type="text"
                    placeholder="Chọn hoặc nhập phòng ban"
                    value={formData.phong_ban || ""}
                    onChange={(e) => handleChange("phong_ban", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                  <datalist id="dept-options">
                    {departments.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Vị trí / Chức danh</label>
                  <input
                    type="text"
                    placeholder="VD: Trưởng phòng kinh doanh"
                    value={formData.vi_tri || ""}
                    onChange={(e) => handleChange("vi_tri", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Cấp bậc</label>
                  <input
                    type="text"
                    placeholder="QL Bậc 1, Nhân viên..."
                    value={formData.cap_bac || ""}
                    onChange={(e) => handleChange("cap_bac", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Quản lý trực tiếp</label>
                  <input
                    type="text"
                    placeholder="Tên quản lý trực tiếp"
                    value={formData.quan_ly_truc_tiep || ""}
                    onChange={(e) => handleChange("quan_ly_truc_tiep", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={formData.nghe_nghiep || ""}
                    onChange={(e) => handleChange("nghe_nghiep", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Trình độ học vấn cao nhất
                  </label>
                  <input
                    type="text"
                    placeholder="Đại học, Thạc sĩ, Cao đẳng..."
                    value={formData.trinh_do_hoc_van || ""}
                    onChange={(e) => handleChange("trinh_do_hoc_van", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Chuyên ngành</label>
                  <input
                    type="text"
                    placeholder="Quản trị kinh doanh, Kế toán..."
                    value={formData.chuyen_nganh || ""}
                    onChange={(e) => handleChange("chuyen_nganh", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HỢP ĐỒNG & CÔNG TÁC */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày thử việc</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.ngay_thu_viec || ""}
                    onChange={(e) => handleChange("ngay_thu_viec", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày chính thức</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.ngay_chinh_thuc || ""}
                    onChange={(e) => handleChange("ngay_chinh_thuc", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày ký hợp đồng</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.ngay_ky_hop_dong || ""}
                    onChange={(e) => handleChange("ngay_ky_hop_dong", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Thâm niên (năm)</label>
                  <input
                    type="text"
                    value={formData.tham_nien || ""}
                    onChange={(e) => handleChange("tham_nien", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Trạng thái hợp đồng</label>
                  <input
                    type="text"
                    placeholder="CT, TV, XĐTH..."
                    value={formData.trang_thai_hd || ""}
                    onChange={(e) => handleChange("trang_thai_hd", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số HĐLĐ cũ</label>
                  <input
                    type="text"
                    value={formData.so_hdld_cu || ""}
                    onChange={(e) => handleChange("so_hdld_cu", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số HĐLĐ mới nhất</label>
                  <input
                    type="text"
                    value={formData.so_hdld_moi_nhat || ""}
                    onChange={(e) => handleChange("so_hdld_moi_nhat", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-[3px] space-y-3">
                <span className="font-semibold text-gray-800 block text-[11px] uppercase tracking-wide">
                  Chi tiết các đợt ký HĐ
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Ngày ký HĐTV</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.ngay_ky_hdtv || ""}
                      onChange={(e) => handleChange("ngay_ky_hdtv", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Ngày kết thúc HĐTV</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.ngay_ket_thuc_hdtv || ""}
                      onChange={(e) => handleChange("ngay_ket_thuc_hdtv", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Ký HĐLĐ XĐTH Lần 1</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.ngay_ky_hdld_xdth_1 || ""}
                      onChange={(e) => handleChange("ngay_ky_hdld_xdth_1", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Kết thúc HĐLĐ XĐTH Lần 1</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.ngay_ket_thuc_hdld_xdth_1 || ""}
                      onChange={(e) => handleChange("ngay_ket_thuc_hdld_xdth_1", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Ký HĐLĐ KXĐTH</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.ngay_ky_hdld_kxdth || ""}
                      onChange={(e) => handleChange("ngay_ky_hdld_kxdth", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LƯƠNG & BẢO HIỂM */}
          {activeTab === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Lương gross thử việc</label>
                  <input
                    type="number"
                    value={formData.luong_gross_thu_viec || ""}
                    onChange={(e) => handleChange("luong_gross_thu_viec", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Lương gross chính thức</label>
                  <input
                    type="number"
                    value={formData.luong_gross_chinh_thuc || ""}
                    onChange={(e) => handleChange("luong_gross_chinh_thuc", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phụ cấp</label>
                  <input
                    type="number"
                    value={formData.phu_cap || ""}
                    onChange={(e) => handleChange("phu_cap", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mức lương gross hiện tại</label>
                  <input
                    type="number"
                    value={formData.luong_gross_hien_tai || ""}
                    onChange={(e) => handleChange("luong_gross_hien_tai", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ngày hiệu lực lương hiện tại</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.ngay_hieu_luc_hien_tai || ""}
                    onChange={(e) => handleChange("ngay_hieu_luc_hien_tai", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-gray-200 pt-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số sổ BHXH</label>
                  <input
                    type="text"
                    value={formData.so_so_bhxh || ""}
                    onChange={(e) => handleChange("so_so_bhxh", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mức đóng BHXH</label>
                  <input
                    type="number"
                    value={formData.muc_dong_bhxh_cu || ""}
                    onChange={(e) => handleChange("muc_dong_bhxh_cu", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số TK cá nhân / Ngân hàng</label>
                  <input
                    type="text"
                    value={formData.stk_ngan_hang || ""}
                    onChange={(e) => handleChange("stk_ngan_hang", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KHẨN CẤP & NGHỈ VIỆC */}
          {activeTab === 5 && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-[3px] space-y-3">
                <span className="font-semibold text-gray-800 block text-[11px] uppercase tracking-wide">
                  Người liên hệ khẩn cấp
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Họ tên người thân</label>
                    <input
                      type="text"
                      value={formData.nguoi_lien_he_khan_cap || ""}
                      onChange={(e) => handleChange("nguoi_lien_he_khan_cap", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Mối quan hệ</label>
                    <input
                      type="text"
                      placeholder="Vợ, Chồng, Bố, Mẹ..."
                      value={formData.moi_quan_he || ""}
                      onChange={(e) => handleChange("moi_quan_he", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">SĐT người thân</label>
                    <input
                      type="text"
                      value={formData.sdt_nguoi_than || ""}
                      onChange={(e) => handleChange("sdt_nguoi_than", e.target.value)}
                      className="w-full border border-gray-300 rounded-[3px] p-2 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 border border-gray-200 rounded-[3px] space-y-3 bg-white">
                <span className="font-semibold text-gray-800 block text-[11px] uppercase tracking-wide">
                  Trạng thái làm việc & Nghỉ việc
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Trạng thái nhân sự</label>
                    <select
                      value={formData.trang_thai || "Đang làm việc"}
                      onChange={(e) => handleChange("trang_thai", e.target.value as any)}
                      className="w-full border border-gray-300 rounded-[3px] p-2 bg-white font-medium"
                    >
                      <option value="Đang làm việc">Đang làm việc</option>
                      <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                    </select>
                  </div>
                  {formData.trang_thai === "Đã nghỉ việc" && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Ngày nghỉ việc</label>
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={formData.ngay_nghi_viec || ""}
                          onChange={(e) => handleChange("ngay_nghi_viec", e.target.value)}
                          className="w-full border border-gray-300 rounded-[3px] p-2 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Lý do nghỉ việc</label>
                        <input
                          type="text"
                          placeholder="Hết hạn HĐ, Lý do cá nhân..."
                          value={formData.ly_do_nghi || ""}
                          onChange={(e) => handleChange("ly_do_nghi", e.target.value)}
                          className="w-full border border-gray-300 rounded-[3px] p-2 bg-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Ghi chú thêm</label>
                  <textarea
                    rows={2}
                    value={formData.ghi_chu || ""}
                    onChange={(e) => handleChange("ghi_chu", e.target.value)}
                    className="w-full border border-gray-300 rounded-[3px] p-2 focus:border-[#DF301C] outline-none"
                    placeholder="Ghi chú hồ sơ..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-gray-500 text-[11px]">
              Trường có dấu <span className="text-red-500">*</span> là bắt buộc
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 border border-gray-300 rounded-[3px] text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-1.5 border border-[#DF301C] bg-[#DF301C] text-white rounded-[3px] font-medium hover:bg-[#c52714] transition-colors disabled:opacity-50"
              >
                {submitting ? "Đang Lưu..." : "Lưu Hồ Sơ"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
