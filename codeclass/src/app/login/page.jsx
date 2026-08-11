'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLaptopCode } from "react-icons/fa";
import { useLoginMutation } from "../../store/api/authApis";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [activeTab, setActiveTab] = useState("presenter");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("ایمیل و رمز عبور را وارد کنید");
      return;
    }

    try {
      const data = await login({
        email: email.trim(),
        password,
        role: activeTab,
      }).unwrap();

      dispatch(setCredentials(data));

      router.push(
        data.user.role === "presenter"
          ? "/presenter/dashboard"
          : "/participant/dashboard"
      );
    } catch (err) {
      setFormError(err?.data?.message || "ورود ناموفق بود");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-10 via-blue-100 to-blue-80 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center" dir="rtl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              ورود به حساب کاربری
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-blue-600 font-semibold text-xl">CodeClass</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <FaLaptopCode size={22} />
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {["presenter", "participant"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center font-medium transition-colors relative ${
                  activeTab === tab ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "presenter" ? "ارائه‌دهنده" : "شرکت‌کننده"}
                {activeTab === tab && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل یا شماره موبایل
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="presenter@test.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}                          
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-600">مرا به‌خاطر بسپار</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                فراموشی رمز عبور؟
              </a>
            </div>

            {(formError || error) && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">
                {formError || error?.data?.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3.5 rounded-xl transition shadow-md"
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600 text-sm">
            حساب کاربری ندارید؟{" "}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              ثبت‌نام کنید
            </a>
          </p>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative min-h-full">
          <img src="/login.png" alt="CodeClass" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}