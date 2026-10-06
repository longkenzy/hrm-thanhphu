import React, { useState } from "react";
import { api } from "../lib/api";
import { AuthUser } from "../types/auth";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      className="min-h-screen flex items-center justify-center px-4 font-sans select-none"
      style={{
        background: "radial-gradient(ellipse at 50% 45%, #162752 0%, #091224 100%)",
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[3px] shadow-[0_15px_45px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-700/30 animate-fade-in">
        {/* Top brand red accent bar */}
        <div className="h-[3px] bg-[#DF301C]" />

        <div className="p-7 sm:p-8">
          {/* Logo & Company Header */}
          <div className="text-center mb-5">
            <img
              src="/logo.png"
              alt="Logo Công ty"
              className="h-14 w-auto object-contain mx-auto mb-3.5"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <h1 className="text-base font-bold text-[#1A2E62] uppercase tracking-tight leading-snug">
              ĐĂNG NHẬP HỆ THỐNG HRM
            </h1>
            <p className="text-[11.5px] font-semibold text-[#4A5D7E] uppercase tracking-wide mt-1">
              CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY LẮP THÀNH PHÚ
            </p>
          </div>

          <div className="h-[1px] bg-gray-100 mb-5" />

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3px] flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-700 ml-2 text-sm font-bold"
              >
                &times;
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Field 1: Tên đăng nhập */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-xs">
                Tên đăng nhập / Mã NV / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {/* User Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Vui lòng nhập username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs text-gray-900 border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400 bg-white transition-colors"
                />
              </div>
            </div>

            {/* Field 2: Mật khẩu */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-xs">
                Mật khẩu truy cập
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {/* Lock Icon */}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Vui lòng nhập password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs text-gray-900 border border-gray-300 rounded-[3px] focus:outline-none focus:border-[#1E3A8A] placeholder-gray-400 bg-white transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    /* Eye-slash Icon */
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    /* Eye Icon */
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172B63] text-white font-bold rounded-[3px] text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 mt-4 active:scale-[0.99]"
            >
              {/* Arrow sign-in icon */}
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{loading ? "Đang Xác Thực..." : "Đăng Nhập Vào Hệ Thống"}</span>
            </button>
          </form>

          {/* Subtle hint for default account */}
          <div className="mt-5 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-400">
            Tài khoản mẫu: <span className="text-gray-600 font-mono font-medium">admin</span> &bull; Mật khẩu: <span className="text-gray-600 font-mono font-medium">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
