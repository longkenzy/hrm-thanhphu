import React, { useState } from "react";
import { api } from "../lib/api";
import { AuthUser } from "../types/auth";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.login(username, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || "Tên đăng nhập hoặc mật khẩu không chính xác");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-center items-center px-4 font-sans select-none">
      {/* Login Card */}
      <div className="w-full max-w-[390px] bg-white border border-gray-300 rounded-[3px] shadow-sm overflow-hidden">
        {/* Top colored accent line */}
        <div className="h-[3px] bg-gradient-to-r from-[#DF301C] via-[#FF9100] to-[#00B7CD]" />

        <div className="p-7">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 bg-gray-50 border border-gray-200 rounded-[3px] mb-3">
              <img
                src="/logo.png"
                alt="Logo Công ty"
                className="h-10 w-auto object-contain mx-auto"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <h1 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
              Hệ Thống Quản Lý Hồ Sơ Nhân Sự
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Đăng nhập để truy cập cơ sở dữ liệu D1
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3px]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="VD: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#DF301C] bg-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-[3px] px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#DF301C] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#DF301C] hover:bg-[#c52714] text-white font-bold rounded-[3px] text-xs transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? "Đang xác thực..." : "ĐĂNG NHẬP"}
            </button>
          </form>

          {/* Default account hint */}
          <div className="mt-5 pt-3 border-t border-gray-200 text-[11px] text-gray-500 text-center bg-gray-50/70 p-2 rounded-[3px]">
            <span>Tài khoản mặc định hệ thống:</span>
            <div className="font-mono text-gray-700 font-medium mt-0.5">
              Tài khoản: <strong className="text-gray-900">admin</strong> &bull; Mật khẩu: <strong className="text-gray-900">admin123</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-6 text-[11px] text-gray-400 text-center">
        Cloudflare D1 &bull; Cloudflare Pages &bull; Bảo mật nội bộ
      </div>
    </div>
  );
};
