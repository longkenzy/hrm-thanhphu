import * as XLSX from "xlsx";
import { Employee } from "../types/employee";

export const EXCEL_COLUMNS: { key: keyof Employee; label: string }[] = [
  { key: "ma_nv", label: "Mã số" },
  { key: "ho_ten", label: "Họ và tên" },
  { key: "gioi_tinh", label: "Giới tính" },
  { key: "ngay_sinh", label: "Ngày sinh" },
  { key: "thang_sinh", label: "Tháng sinh nhật" },
  { key: "cccd", label: "CCCD" },
  { key: "ngay_cap_cccd", label: "Ngày cấp CCCD" },
  { key: "noi_cap_cccd", label: "Nơi cấp CCCD" },
  { key: "dia_chi_thuong_tru", label: "Địa chỉ thường trú" },
  { key: "dia_chi_tam_tru", label: "Số nhà/Đường tạm trú" },
  { key: "phuong_xa", label: "Phường/Xã" },
  { key: "quan_huyen", label: "Quận/Huyện" },
  { key: "tinh_thanh", label: "Tỉnh/Thành phố" },
  { key: "sdt", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "tinh_trang_hon_nhan", label: "Tình trạng hôn nhân" },
  { key: "nguoi_lien_he_khan_cap", label: "Người liên hệ khẩn cấp" },
  { key: "moi_quan_he", label: "Mối quan hệ" },
  { key: "sdt_nguoi_than", label: "SĐT người thân" },
  { key: "nghe_nghiep", label: "Nghề nghiệp" },
  { key: "vi_tri", label: "Vị trí" },
  { key: "cap_bac", label: "Cấp bậc" },
  { key: "phong_ban", label: "Phòng ban" },
  { key: "quan_ly_truc_tiep", label: "Quản lý trực tiếp" },
  { key: "trinh_do_hoc_van", label: "Bằng cấp/Học vấn" },
  { key: "chuyen_nganh", label: "Chuyên ngành" },
  { key: "ngay_thu_viec", label: "Ngày thử việc" },
  { key: "ngay_chinh_thuc", label: "Ngày chính thức" },
  { key: "ngay_ky_hop_dong", label: "Ngày ký HĐ" },
  { key: "tham_nien", label: "Thâm niên" },
  { key: "thang_dong_bhxh", label: "Tháng đóng BHXH" },
  { key: "so_hdld_cu", label: "Số HĐLĐ cũ" },
  { key: "trang_thai_hd", label: "Trạng thái HĐ" },
  { key: "ngay_ky_hdtv", label: "Ngày ký HĐTV" },
  { key: "ngay_ket_thuc_hdtv", label: "Ngày kết thúc HĐTV" },
  { key: "ngay_ky_hdld_xdth_1", label: "Ngày ký HĐLĐ XĐTH 1" },
  { key: "ngay_ket_thuc_hdld_xdth_1", label: "Ngày kết thúc HĐLĐ XĐTH 1" },
  { key: "ngay_ky_hdld_xdth_2", label: "Ngày ký HĐLĐ XĐTH 2" },
  { key: "ngay_ket_thuc_hdld_xdth_2", label: "Ngày kết thúc HĐLĐ XĐTH 2" },
  { key: "ngay_ky_hdld_kxdth", label: "Ngày ký HĐLĐ KXĐTH" },
  { key: "so_hdld_moi_nhat", label: "Số HĐLĐ mới nhất" },
  { key: "so_so_bhxh", label: "Số sổ BHXH" },
  { key: "muc_dong_bhxh_cu", label: "Mức đóng BHXH cũ" },
  { key: "muc_dong_bhxh_moi", label: "Mức đóng BHXH mới" },
  { key: "stk_ngan_hang", label: "Số TK cá nhân" },
  { key: "luong_gross_thu_viec", label: "Lương gross thử việc" },
  { key: "luong_gross_chinh_thuc", label: "Lương gross chính thức" },
  { key: "phu_cap", label: "Phụ cấp" },
  { key: "luong_gross_hien_tai", label: "Lương gross hiện tại" },
  { key: "trang_thai", label: "Trạng thái" },
  { key: "ngay_nghi_viec", label: "Ngày nghỉ việc" },
  { key: "ly_do_nghi", label: "Lý do nghỉ" },
  { key: "ghi_chu", label: "Ghi chú" },
];

export function exportEmployeesToExcel(data: Employee[], filename = "Danh_sach_nhan_su.xlsx") {
  const rows = data.map((emp, index) => {
    const row: Record<string, any> = { "STT": index + 1 };
    EXCEL_COLUMNS.forEach((col) => {
      row[col.label] = emp[col.key] ?? "";
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Nhân Sự");
  XLSX.writeFile(wb, filename);
}

export function parseExcelFile(file: File): Promise<Partial<Employee>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const wb = XLSX.read(buffer, { type: "binary" });
        const firstSheetName = wb.SheetNames.includes("Master List")
          ? "Master List"
          : wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

        // Tìm dòng header
        let headerRowIdx = 1;
        for (let i = 0; i < Math.min(5, json.length); i++) {
          const rowStr = JSON.stringify(json[i] || []);
          if (rowStr.includes("Mã số") || rowStr.includes("Họ và tên")) {
            headerRowIdx = i;
            break;
          }
        }

        const headers: string[] = json[headerRowIdx] || [];
        const result: Partial<Employee>[] = [];

        for (let r = headerRowIdx + 1; r < json.length; r++) {
          const row = json[r];
          if (!row || row.length === 0) continue;

          const item: Record<string, any> = {};
          headers.forEach((h, colIdx) => {
            if (!h) return;
            const hClean = String(h).trim().toLowerCase();
            const val = row[colIdx];
            if (val === undefined || val === null) return;

            if (hClean.includes("mã số") || hClean === "msnv") item.ma_nv = String(val).trim();
            else if (hClean.includes("họ và tên") || hClean.includes("họ tên")) item.ho_ten = String(val).trim();
            else if (hClean.includes("giới tính")) item.gioi_tinh = String(val).trim();
            else if (hClean.includes("ngày sinh")) item.ngay_sinh = String(val).trim();
            else if (hClean.includes("cccd") || hClean.includes("cmnd")) item.cccd = String(val).trim();
            else if (hClean.includes("vị trí") || hClean.includes("chức vụ")) item.vi_tri = String(val).trim();
            else if (hClean.includes("phòng ban")) item.phong_ban = String(val).trim();
            else if (hClean.includes("số điện thoại") || hClean.includes("sđt")) item.sdt = String(val).trim();
            else if (hClean.includes("email")) item.email = String(val).trim();
            else if (hClean.includes("trạng thái")) item.trang_thai = String(val).trim();
            else if (hClean.includes("nghỉ việc") || hClean.includes("ngày nghỉ")) item.ngay_nghi_viec = String(val).trim();
            else if (hClean.includes("lý do")) item.ly_do_nghi = String(val).trim();
          });

          if (item.ma_nv && item.ho_ten) {
            item.trang_thai = item.trang_thai || "Đang làm việc";
            result.push(item as Partial<Employee>);
          }
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
