import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Thông tin định danh & Cá nhân
  ma_nv: text("ma_nv").notNull().unique(), // Mã số (VD: MS00001)
  ho_ten: text("ho_ten").notNull(), // Họ và tên Nhân viên
  gioi_tinh: text("gioi_tinh"), // Nam / Nữ
  ngay_sinh: text("ngay_sinh"), // Ngày sinh (dd/mm/yyyy)
  thang_sinh: integer("thang_sinh"), // Tháng sinh nhật
  cccd: text("cccd"), // Số CCCD / CMND
  ngay_cap_cccd: text("ngay_cap_cccd"), // Ngày cấp CCCD
  noi_cap_cccd: text("noi_cap_cccd"), // Nơi cấp CCCD
  dia_chi_thuong_tru: text("dia_chi_thuong_tru"), // Địa chỉ thường trú ghi theo CCCD
  dia_chi_tam_tru: text("dia_chi_tam_tru"), // Số nhà/Đường nơi ở hiện tại
  phuong_xa: text("phuong_xa"), // Phường/Xã nơi ở hiện tại
  quan_huyen: text("quan_huyen"), // Quận/Huyện nơi ở hiện tại
  tinh_thanh: text("tinh_thanh"), // Thành phố/Tỉnh nơi ở hiện tại
  sdt: text("sdt"), // Số điện thoại liên lạc
  email: text("email"), // Địa chỉ email
  tinh_trang_hon_nhan: text("tinh_trang_hon_nhan"), // Tình trạng hôn nhân

  // Người liên hệ khẩn cấp
  nguoi_lien_he_khan_cap: text("nguoi_lien_he_khan_cap"), // Họ tên người thân
  moi_quan_he: text("moi_quan_he"), // Mối quan hệ
  sdt_nguoi_than: text("sdt_nguoi_than"), // SĐT người thân

  // Trình độ & Nghề nghiệp
  nghe_nghiep: text("nghe_nghiep"), // Nghề nghiệp
  vi_tri: text("vi_tri"), // Vị trí / Chức vụ
  cap_bac: text("cap_bac"), // Cấp bậc (QL Bậc 1, Bậc 2, Nhân viên...)
  phong_ban: text("phong_ban"), // Phòng ban
  quan_ly_truc_tiep: text("quan_ly_truc_tiep"), // Quản lý trực tiếp
  trinh_do_hoc_van: text("trinh_do_hoc_van"), // Bằng cấp chuyên môn/văn hóa cao nhất
  chuyen_nganh: text("chuyen_nganh"), // Chuyên ngành

  // Quá trình công tác & Hợp đồng
  ngay_thu_viec: text("ngay_thu_viec"), // Ngày thử việc / nhận việc
  ngay_chinh_thuc: text("ngay_chinh_thuc"), // Ngày nhận việc chính thức
  ngay_ky_hop_dong: text("ngay_ky_hop_dong"), // Ngày ký hợp đồng
  tham_nien: text("tham_nien"), // Thâm niên làm việc (năm)
  thang_dong_bhxh: text("thang_dong_bhxh"), // Tháng đóng BHXH (VD: T07/2010)
  so_hdld_cu: text("so_hdld_cu"), // Số HĐLĐ cũ
  trang_thai_hd: text("trang_thai_hd"), // Trạng thái HĐ (CT, TV...)
  ngay_ky_hdtv: text("ngay_ky_hdtv"), // Ngày ký HĐTV
  ngay_ket_thuc_hdtv: text("ngay_ket_thuc_hdtv"), // Ngày kết thúc HĐTV
  ngay_ky_hdld_xdth_1: text("ngay_ky_hdld_xdth_1"), // Ngày ký HĐLĐ XĐTH Lần 1
  ngay_ket_thuc_hdld_xdth_1: text("ngay_ket_thuc_hdld_xdth_1"), // Ngày kết thúc HĐLĐ XĐTH Lần 1
  ngay_ky_hdld_xdth_2: text("ngay_ky_hdld_xdth_2"), // Ngày ký HĐLĐ XĐTH Lần 2
  ngay_ket_thuc_hdld_xdth_2: text("ngay_ket_thuc_hdld_xdth_2"), // Ngày kết thúc HĐLĐ XĐTH Lần 2
  ngay_ky_hdld_kxdth: text("ngay_ky_hdld_kxdth"), // Ngày ký HĐLĐ KXĐTH
  so_hdld_moi_nhat: text("so_hdld_moi_nhat"), // Số HĐLĐ mới nhất

  // Bảo hiểm & Tài khoản ngân hàng
  so_so_bhxh: text("so_so_bhxh"), // Số sổ BHXH
  muc_dong_bhxh_cu: real("muc_dong_bhxh_cu"), // Mức đóng BHXH trên HĐ cũ
  muc_dong_bhxh_moi: real("muc_dong_bhxh_moi"), // Mức đóng BHXH Từ ngày...
  stk_ngan_hang: text("stk_ngan_hang"), // STK cá nhân

  // Chế độ lương & Phụ cấp
  luong_gross_thu_viec: real("luong_gross_thu_viec"), // Lương gross Thử việc
  luong_gross_chinh_thuc: real("luong_gross_chinh_thuc"), // Lương gross Chính thức
  phu_cap: real("phu_cap"), // Phụ cấp
  luong_dieu_chinh_1: real("luong_dieu_chinh_1"), // Lương điều chỉnh tăng lần 1
  ngay_hieu_luc_1: text("ngay_hieu_luc_1"),
  luong_dieu_chinh_2: real("luong_dieu_chinh_2"), // Lương điều chỉnh tăng lần 2
  ngay_hieu_luc_2: text("ngay_hieu_luc_2"),
  luong_dieu_chinh_3: real("luong_dieu_chinh_3"), // Lương điều chỉnh tăng lần 3
  ngay_hieu_luc_3: text("ngay_hieu_luc_3"),
  luong_gross_hien_tai: real("luong_gross_hien_tai"), // Lương gross hiện tại
  ngay_hieu_luc_hien_tai: text("ngay_hieu_luc_hien_tai"),

  // Trạng thái nhân sự & Nghỉ việc
  trang_thai: text("trang_thai").notNull().default("Đang làm việc"), // Đang làm việc / Đã nghỉ việc
  ngay_nghi_viec: text("ngay_nghi_viec"), // Ngày nghỉ việc
  ly_do_nghi: text("ly_do_nghi"), // Lý do nghỉ
  ghi_chu: text("ghi_chu"), // Ghi chú

  // Dấu thời gian hệ thống
  created_at: text("created_at").default(sql`(datetime('now', 'localtime'))`),
  updated_at: text("updated_at").default(sql`(datetime('now', 'localtime'))`),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  full_name: text("full_name").notNull(),
  role: text("role").notNull().default("admin"), // admin | hr | viewer
  created_at: text("created_at").default(sql`(datetime('now', 'localtime'))`),
  updated_at: text("updated_at").default(sql`(datetime('now', 'localtime'))`),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
