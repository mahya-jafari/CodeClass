import { http, HttpResponse } from "msw";
import { users } from "./data/users";
const API = "/api";

let adminWebinars = [
  { id: 1, title: "آشنایی با React 19", teacher: "استاد علی محمدی", registered: 87, status: "upcoming", date: "۱۴۰۵/۰۲/۱۵" },
];

let adminClasses = [
  { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", students: 24, status: "فعال", date: "۱۴۰۵/۰۱/۱۰" },
  { id: 2, title: "جامع JavaScript", teacher: "استاد سارا رضایی", students: 31, status: "فعال", date: "۱۴۰۵/۰۱/۱۸" },
];

let adminMessages = [
  { id: 1, name: "سارا احمدی", message: "مشکل در ورود به کلاس آنلاین دارم، لطفا راهنمایی کنید.", time: "۱ ساعت پیش", unread: true, status: "pending" },
];

let messageThreads = {
  1: [
    { id: 1, text: "سلام، من نمی‌تونم وارد کلاس آنلاین بشم، خطای اتصال میده.", fromMe: false, time: "۰۹:۱۲" },
    { id: 2, text: "سلام، لطفاً نام مرورگر و سیستم عاملتون رو بفرمایید.", fromMe: true, time: "۰۹:۲۰" },
  ],
};

let adminProfile = {
  name: "مدیر سیستم",
  role: "ادمین",
  email: "admin@codeclass.ir",
  phone: "۰۹۱۲۱۲۳۴۵۶۷",
  bio: "مدیر ارشد پلتفرم CodeClass",
  avatar: "https://via.placeholder.com/120x120?text=Admin",
};

let adminCertificates = [
  { id: 1, userName: "سارا احمدی", course: "گواهینامه UI/UX با Figma", score: 95, status: "صادر شده" },
  { id: 4, userName: "محمد حسینی", course: "گواهینامه Python برای مبتدیان", score: 74, status: "در انتظار" },
];

let adminCoupons = [
  { id: 1, code: "WELCOME20", type: "percent", value: 20, maxUses: 100, usedCount: 34, expiresAt: "۱۴۰۵/۰۴/۰۱", status: "فعال" },
  { id: 3, code: "OLDCODE10", type: "percent", value: 10, maxUses: 200, usedCount: 200, expiresAt: "۱۴۰۴/۱۲/۰۱", status: "منقضی شده" },
  { id: 4, code: "VIP15", type: "percent", value: 15, maxUses: 30, usedCount: 5, expiresAt: "۱۴۰۵/۰۳/۲۰", status: "غیرفعال" },
];

let adminReviews = [
  { id: 1, userName: "سارا احمدی", className: "آموزش React از صفر تا پیشرفته", rating: 5, comment: "دوره فوق‌العاده‌ای بود، توضیحات مدرس خیلی روان و کاربردی بود.", date: "۱۴۰۵/۰۲/۱۲", status: "در انتظار" },
  { id: 2, userName: "نگار رضایی", className: "جامع JavaScript", rating: 4, comment: "محتوا خوب بود ولی سرعت پیشرفت یه‌کم زیاد بود برای مبتدی‌ها.", date: "۱۴۰۵/۰۲/۱۰", status: "تأیید شده" },
];

export const handlers = [
    http.get(`${API}/admin/profile`, () => {
    return HttpResponse.json(adminProfile);
    }),
    http.put(`${API}/admin/profile`, async ({ request }) => {
    const body = await request.json();
    adminProfile = { ...adminProfile, ...body };
    return HttpResponse.json(adminProfile);
    }),
    http.put(`${API}/admin/profile/password`, async ({ request }) => {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
        return HttpResponse.json({ message: "اطلاعات ناقص است" }, { status: 400 });
    }
    if (newPassword.length < 6) {
        return HttpResponse.json({ message: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
    }
    return HttpResponse.json({ success: true });
    }),

    http.get(`${API}/admin/dashboard`, () => {
    return HttpResponse.json({
        stats: [
        { title: "کل کاربران", value: "۱,۲۴۸", change: "+۱۲٪", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "کلاس‌های فعال", value: "۸۶", change: "+۵٪", color: "text-purple-600", bg: "bg-purple-50" },
        { title: "درآمد این ماه", value: "۴۸.۲M", change: "+۱۸٪", color: "text-green-600", bg: "bg-green-50" },
        { title: "وبینارهای زنده", value: "۷", change: "۰٪", color: "text-orange-600", bg: "bg-orange-50" },
        ],
        recentUsers: [
        { id: 1, name: "سارا احمدی", role: "شرکت‌کننده", date: "۱۴۰۵/۰۲/۱۰", status: "فعال" },
        { id: 2, name: "علی محمدی", role: "ارائه‌دهنده", date: "۱۴۰۵/۰۲/۰۹", status: "فعال" },
        { id: 3, name: "نگار رضایی", role: "شرکت‌کننده", date: "۱۴۰۵/۰۲/۰۸", status: "غیرفعال" },
        ],
        recentClasses: [
        { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", students: 24, status: "فعال" },
        ],
        pendingWithdrawals: [
        { id: 1, name: "استاد علی محمدی", amount: 2500000, date: "۱۴۰۵/۰۲/۱۰" },
        { id: 2, name: "استاد سارا رضایی", amount: 1800000, date: "۱۴۰۵/۰۲/۰۹" },
        ],
    });
    }),
    
    /* USERS */

    http.get(`${API}/admin/users`, () => HttpResponse.json(users.map(({ password, ...safe }) => safe))),
    http.patch(`${API}/admin/users/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    const id = Number(params.id);
    const target = users.find((u) => u.id === id);
    if (target) target.status = status;
    return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/users/:id`, ({ params }) => {
    const id = Number(params.id);
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) users.splice(idx, 1);
    return HttpResponse.json({ success: true });
    }),

    /* PRESENTER APPROVALS */
    http.get(`${API}/admin/presenters/pending`, () => {
      const pending = users.filter(
        (u) => u.role === "presenter" && u.approvalStatus === "pending"
      );
      return HttpResponse.json(pending);
    }),

    http.patch(`${API}/admin/presenters/:id/approval`, async ({ request, params }) => {
      const { approvalStatus } = await request.json();
      const id = Number(params.id);

      const target = users.find((u) => u.id === id);
      if (target) {
        target.approvalStatus = approvalStatus;
      }

      return HttpResponse.json({ success: true });
    }),

    /* CLASSES */

    http.get(`${API}/admin/classes`, () => HttpResponse.json(adminClasses)),
    http.patch(`${API}/admin/classes/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    adminClasses = adminClasses.map((c) => c.id === Number(params.id) ? { ...c, status } : c);
    return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/classes/:id`, ({ params }) => {
    adminClasses = adminClasses.filter((c) => c.id !== Number(params.id));
    return HttpResponse.json({ success: true });
    }),

    /* WEBINARS */

    http.get(`${API}/admin/webinars`, () => HttpResponse.json(adminWebinars)),
    http.patch(`${API}/admin/webinars/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    adminWebinars = adminWebinars.map((w) => w.id === Number(params.id) ? { ...w, status } : w);
    return HttpResponse.json({ success: true });
    }),

    /* FINANCE */
    http.get(`${API}/admin/finance`, () => HttpResponse.json({
    summary: [
        { title: "درآمد کل", value: "۱۲۴.۵M", color: "text-green-600" },
        { title: "کمیسیون پلتفرم", value: "۱۲.۴M", color: "text-blue-600" },
        { title: "در انتظار برداشت", value: "۸.۲M", color: "text-orange-500" },
    ],
    withdrawals: [
        { id: 1, name: "استاد علی محمدی", amount: 2500000, date: "۱۴۰۵/۰۲/۱۰", status: "در انتظار" },
        { id: 2, name: "استاد سارا رضایی", amount: 1800000, date: "۱۴۰۵/۰۲/۰۹", status: "در انتظار" },
        { id: 3, name: "استاد محمد حسینی", amount: 3200000, date: "۱۴۰۵/۰۲/۰۵", status: "تأیید شده" },
    ],
    recentTransactions: [
        { id: 1, title: "فروش کلاس React", amount: 4500000, type: "درآمد", status: "completed", date: "۱۴۰۵/۰۲/۰۸" },
        { id: 2, title: "برداشت استاد علی", amount: 2500000, type: "برداشت", status: "pending", date: "۱۴۰۵/۰۲/۰۵" },
        { id: 3, title: "فروش وبینار جاوااسکریپت", amount: 1800000, type: "درآمد", status: "completed", date: "۱۴۰۵/۰۲/۰۳" },
        { id: 4, title: "برداشت استاد محمد حسینی", amount: 3200000, type: "برداشت", status: "completed", date: "۱۴۰۵/۰۱/۲۸" },
    ],
    })),
    http.post(`${API}/admin/finance/withdrawals/:id/approve`, ({ params }) => HttpResponse.json({ success: true })),
    http.post(`${API}/admin/finance/withdrawals/:id/reject`, ({ params }) => HttpResponse.json({ success: true })),

    /* ASSIGNMENTS */
    http.get(`${API}/admin/assignments`, () => HttpResponse.json([
    { id: 1, user: "سارا احمدی", title: "پروژه نهایی React", course: "آموزش React از صفر تا پیشرفته", status: "تحویل شده", score: 92, date: "۱۴۰۵/۰۲/۰۸" },
    { id: 2, user: "نگار رضایی", title: "تمرین Async/Await", course: "جامع JavaScript", status: "در انتظار بررسی", score: null, date: "۱۴۰۵/۰۲/۱۰" },
    { id: 3, user: "محمد حسینی", title: "طراحی کامپوننت‌ها", course: "طراحی UI/UX با Figma", status: "تحویل شده", score: 78, date: "۱۴۰۵/۰۲/۰۶" },
    { id: 4, user: "سارا احمدی", title: "پروژه پایانی Python", course: "Python برای مبتدیان", status: "در انتظار بررسی", score: null, date: "۱۴۰۵/۰۲/۱۱" },
    ])),

    /* MESSAGES */
    http.get(`${API}/admin/messages`, () => HttpResponse.json(adminMessages)),

    http.get(`${API}/admin/messages/:id/thread`, ({ params }) => {
    const id = Number(params.id);
    // opening a conversation marks it as read
    adminMessages = adminMessages.map((m) => m.id === id ? { ...m, unread: false } : m);
    return HttpResponse.json(messageThreads[id] || []);
    }),

    http.post(`${API}/admin/messages/:id/thread`, async ({ request, params }) => {
    const id = Number(params.id);
    const { text } = await request.json();
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg = { id: Date.now(), text, fromMe: true, time };
    messageThreads[id] = [...(messageThreads[id] || []), newMsg];
    adminMessages = adminMessages.map((m) => m.id === id ? { ...m, message: text, time: "اکنون" } : m);
    return HttpResponse.json(newMsg);
    }),

    http.patch(`${API}/admin/messages/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    const id = Number(params.id);
    adminMessages = adminMessages.map((m) => m.id === id ? { ...m, status } : m);
    return HttpResponse.json({ success: true });
    }),

    http.patch(`${API}/admin/messages/:id/read`, ({ params }) => {
    const id = Number(params.id);
    adminMessages = adminMessages.map((m) => m.id === id ? { ...m, unread: false } : m);
    return HttpResponse.json({ success: true });
    }),

    http.delete(`${API}/admin/messages/:id`, ({ params }) => {
    const id = Number(params.id);
    adminMessages = adminMessages.filter((m) => m.id !== id);
    delete messageThreads[id];
    return HttpResponse.json({ success: true });
    }),

    /* REPORTS */
    http.get(`${API}/admin/reports`, () => HttpResponse.json({
    userGrowth: [120, 145, 168, 190, 210, 248],
    revenue: [12, 18, 22, 28, 35, 48],
    months: ["مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    })),

    /* SETTINGS */
    http.get(`${API}/admin/settings`, () => HttpResponse.json({
    siteName: "CodeClass",
    commission: 10,
    supportEmail: "support@codeclass.ir",
    categories: ["برنامه‌نویسی وب", "برنامه‌نویسی موبایل", "طراحی UI/UX", "هوش مصنوعی"],
    })),
    http.put(`${API}/admin/settings`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
    }),

    /* CERTIFICATES */
    http.get(`${API}/admin/certificates`, () => HttpResponse.json(adminCertificates)),
    http.patch(`${API}/admin/certificates/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    const id = Number(params.id);
    adminCertificates = adminCertificates.map((c) => c.id === id ? { ...c, status } : c);
    return HttpResponse.json({ success: true });
    }),

    /* COUPONS */
    http.get(`${API}/admin/coupons`, () => HttpResponse.json(adminCoupons)),
    http.post(`${API}/admin/coupons`, async ({ request }) => {
    const body = await request.json();
    const newCoupon = {
        id: Date.now(),
        code: (body.code || "").toUpperCase(),
        type: body.type === "fixed" ? "fixed" : "percent",
        value: Number(body.value) || 0,
        maxUses: Number(body.maxUses) || 0,
        usedCount: 0,
        expiresAt: body.expiresAt || "—",
        status: "فعال",
    };
    adminCoupons = [newCoupon, ...adminCoupons];
    return HttpResponse.json(newCoupon, { status: 201 });
    }),
    http.patch(`${API}/admin/coupons/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    const id = Number(params.id);
    adminCoupons = adminCoupons.map((c) => c.id === id ? { ...c, status } : c);
    return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/coupons/:id`, ({ params }) => {
    const id = Number(params.id);
    adminCoupons = adminCoupons.filter((c) => c.id !== id);
    return HttpResponse.json({ success: true });
    }),

    /* REVIEWS */
    http.get(`${API}/admin/reviews`, () => HttpResponse.json(adminReviews)),
    http.patch(`${API}/admin/reviews/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    const id = Number(params.id);
    adminReviews = adminReviews.map((r) => r.id === id ? { ...r, status } : r);
    return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/reviews/:id`, ({ params }) => {
    const id = Number(params.id);
    adminReviews = adminReviews.filter((r) => r.id !== id);
    return HttpResponse.json({ success: true });
    }),
];