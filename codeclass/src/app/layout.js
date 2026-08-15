import { Vazirmatn } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/providers/StoreProvider";
import MSWProvider from "@/components/providers/MSWProvider";
import ToastProvider from "./ToastProvider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata = {
  title: "CodeClass",
  description: "پلتفرم آموزشی کدکلاس",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        <StoreProvider>
          <MSWProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </MSWProvider>
        </StoreProvider>
      </body>
    </html>
  );
}