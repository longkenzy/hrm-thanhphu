import React, { useState } from "react";
import { parseExcelFile } from "../lib/excelHelper";
import { Employee } from "../types/employee";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (items: Employee[]) => Promise<void>;
}

export const ImportExcelModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedItems, setParsedItems] = useState<Partial<Employee>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError("");
    setLoading(true);

    try {
      const items = await parseExcelFile(selected);
      if (items.length === 0) {
        setError("Không đọc được dữ liệu nhân sự nào từ file Excel này. Vui lòng kiểm tra định dạng sheet.");
      } else {
        setParsedItems(items);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi đọc file Excel");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (parsedItems.length === 0) return;
    setLoading(true);
    try {
      await onImportComplete(parsedItems as Employee[]);
      onClose();
    } catch (err: any) {
      setError(err.message || "Lỗi khi import dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-gray-300 rounded-[3px] w-full max-w-lg p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-sm font-bold text-gray-900 uppercase">
            Nhập Dữ Liệu Nhân Sự Từ Excel (.xlsx)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none font-bold"
          >
            &times;
          </button>
        </div>

        <div className="my-4 text-xs space-y-3">
          <p className="text-gray-600">
            Hỗ trợ file cấu trúc như <strong>data.xlsx</strong> (đọc sheet <em>Master List</em> hoặc sheet đầu tiên).
          </p>

          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-[3px] file:border file:border-gray-300 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer border border-gray-300 rounded-[3px] p-1.5"
          />

          {loading && (
            <div className="text-xs text-gray-500 py-2">Đang xử lý dữ liệu...</div>
          )}

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3px]">
              {error}
            </div>
          )}

          {parsedItems.length > 0 && !loading && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[3px]">
              Đã nhận diện thành công <strong>{parsedItems.length}</strong> hồ sơ nhân viên sẵn sàng nhập!
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-[3px] hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={parsedItems.length === 0 || loading}
            className="px-4 py-1.5 border border-[#DF301C] bg-[#DF301C] text-white rounded-[3px] font-medium hover:bg-[#c52714] disabled:opacity-50"
          >
            {loading ? "Đang Nhập..." : `Xác Nhận Nhập (${parsedItems.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};
