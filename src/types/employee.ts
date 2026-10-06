export interface Employee {
  id?: number;
  ma_nv: string;
  ho_ten: string;
  gioi_tinh?: string;
  ngay_sinh?: string;
  thang_sinh?: number | null;
  cccd?: string;
  ngay_cap_cccd?: string;
  noi_cap_cccd?: string;
  dia_chi_thuong_tru?: string;
  dia_chi_tam_tru?: string;
  phuong_xa?: string;
  quan_huyen?: string;
  tinh_thanh?: string;
  sdt?: string;
  email?: string;
  tinh_trang_hon_nhan?: string;

  // Người thân khẩn cấp
  nguoi_lien_he_khan_cap?: string;
  moi_quan_he?: string;
  sdt_nguoi_than?: string;

  // Công việc & Chức vụ
  nghe_nghiep?: string;
  vi_tri?: string;
  cap_bac?: string;
  phong_ban?: string;
  quan_ly_truc_tiep?: string;
  trinh_do_hoc_van?: string;
  chuyen_nganh?: string;

  // Quá trình công tác
  ngay_thu_viec?: string;
  ngay_chinh_thuc?: string;
  ngay_ky_hop_dong?: string;
  tham_nien?: string;
  thang_dong_bhxh?: string;
  so_hdld_cu?: string;
  trang_thai_hd?: string;
  ngay_ky_hdtv?: string;
  ngay_ket_thuc_hdtv?: string;
  ngay_ky_hdld_xdth_1?: string;
  ngay_ket_thuc_hdld_xdth_1?: string;
  ngay_ky_hdld_xdth_2?: string;
  ngay_ket_thuc_hdld_xdth_2?: string;
  ngay_ky_hdld_kxdth?: string;
  so_hdld_moi_nhat?: string;

  // Bảo hiểm & Ngân hàng
  so_so_bhxh?: string;
  muc_dong_bhxh_cu?: number | null;
  muc_dong_bhxh_moi?: number | null;
  stk_ngan_hang?: string;

  // Lương bổng & Phụ cấp
  luong_gross_thu_viec?: number | null;
  luong_gross_chinh_thuc?: number | null;
  phu_cap?: number | null;
  luong_dieu_chinh_1?: number | null;
  ngay_hieu_luc_1?: string;
  luong_dieu_chinh_2?: number | null;
  ngay_hieu_luc_2?: string;
  luong_dieu_chinh_3?: number | null;
  ngay_hieu_luc_3?: string;
  luong_gross_hien_tai?: number | null;
  ngay_hieu_luc_hien_tai?: string;

  // Trạng thái nhân sự
  trang_thai: "Đang làm việc" | "Đã nghỉ việc";
  ngay_nghi_viec?: string;
  ly_do_nghi?: string;
  ghi_chu?: string;

  created_at?: string;
  updated_at?: string;
}

export type EmployeeTab = "all" | "active" | "resigned";
