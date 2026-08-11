import { http, HttpResponse } from "msw";
const API = "/api";

let adminWebinars = [
  { id: 1, title: "آشنایی با React 19", teacher: "استاد علی محمدی", registered: 87, status: "upcoming", date: "۱۴۰۵/۰۲/۱۵" },
  { id: 2, title: "وبینار JavaScript پیشرفته", teacher: "استاد سارا رضایی", registered: 142, status: "live", date: "۱۴۰۵/۰۲/۱۰" },
  { id: 3, title: "مسیر شغلی فرانت‌اند", teacher: "استاد علی محمدی", registered: 256, status: "ended", date: "۱۴۰۵/۰۱/۲۰" },
];

let adminClasses = [
  { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", students: 24, status: "فعال", date: "۱۴۰۵/۰۱/۱۰" },
 
];

let adminUsers = [
  { id: 1, name: "سارا احمدی", email: "sara@test.com", role: "participant", status: "فعال", date: "۱۴۰۵/۰۱/۱۵" },
  { id: 2, name: "علی محمدی", email: "ali@test.com", role: "presenter", status: "فعال", date: "۱۴۰۵/۰۱/۱۰" },
  { id: 3, name: "نگار رضایی", email: "negar@test.com", role: "participant", status: "غیرفعال", date: "۱۴۰۵/۰۲/۰۱" },
  { id: 4, name: "محمد حسینی", email: "mohammad@test.com", role: "presenter", status: "فعال", date: "۱۴۰۴/۱۲/۲۰" },
];
export const handlers = [
    http.get(`${API}/admin/profile`, () => {
    return HttpResponse.json({
        name: "مدیر سیستم",
        role: "ادمین",
        avatar: "https://via.placeholder.com/40x40?text=Admin",
    });
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
        { id: 4, name: "محمد حسینی", role: "ارائه‌دهنده", date: "۱۴۰۵/۰۲/۰۷", status: "فعال" },
        ],
        recentClasses: [
        { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", students: 24, status: "فعال" },
        { id: 2, title: "جامع JavaScript", teacher: "استاد سارا رضایی", students: 31, status: "فعال" },
        { id: 3, title: "Python برای مبتدیان", teacher: "استاد علی محمدی", students: 18, status: "در انتظار تأیید" },
        ],
        pendingWithdrawals: [
        { id: 1, name: "استاد علی محمدی", amount: 2500000, date: "۱۴۰۵/۰۲/۱۰" },
        { id: 2, name: "استاد سارا رضایی", amount: 1800000, date: "۱۴۰۵/۰۲/۰۹" },
        ],
    });
    }),
    
    /* USERS */

    http.get(`${API}/admin/users`, () => HttpResponse.json(adminUsers)),
    http.patch(`${API}/admin/users/:id/status`, async ({ request, params }) => {
    const { status } = await request.json();
    adminUsers = adminUsers.map((u) => u.id === Number(params.id) ? { ...u, status } : u);
    return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/users/:id`, ({ params }) => {
    adminUsers = adminUsers.filter((u) => u.id !== Number(params.id));
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
    transactions: [
        { id: 1, title: "فروش کلاس React", amount: 4500000, type: "income", date: "۱۴۰۵/۰۲/۰۸" },
        { id: 2, title: "برداشت استاد علی", amount: 2500000, type: "withdraw", date: "۱۴۰۵/۰۲/۰۵" },
    ],
    })),
    http.post(`${API}/admin/finance/withdrawals/:id/approve`, ({ params }) => HttpResponse.json({ success: true })),
    http.post(`${API}/admin/finance/withdrawals/:id/reject`, ({ params }) => HttpResponse.json({ success: true })),

    /* CERTIFICATES */
    http.get(`${API}/admin/certificates`, () => HttpResponse.json([
    { id: 1, title: "گواهینامه UI/UX با Figma", user: "سارا احمدی", date: "۱۴۰۵/۰۲/۱۵", status: "صادر شده" },
    { id: 2, title: "گواهینامه HTML & CSS", user: "محمد رضایی", date: "۱۴۰۴/۱۱/۲۰", status: "صادر شده" },
    ])),

    /* ASSIGNMENTS */
    http.get(`${API}/admin/assignments`, () => HttpResponse.json([
    { id: 1, title: "پروژه نهایی React", course: "آموزش React", user: "سارا احمدی", status: "تحویل شده", date: "۱۴۰۵/۰۲/۰۸" },
    { id: 2, title: "تمرین Async/Await", course: "جامع JavaScript", user: "نگار رضایی", status: "در انتظار", date: "۱۴۰۵/۰۲/۱۰" },
    ])),

    /* MESSAGES */
    http.get(`${API}/admin/messages`, () => HttpResponse.json([
    { id: 1, from: "سارا احمدی", subject: "مشکل در ورود به کلاس", time: "۱ ساعت پیش", unread: true },
    { id: 2, from: "علی محمدی", subject: "درخواست افزایش ظرفیت", time: "۳ ساعت پیش", unread: true },
    { id: 3, from: "نگار رضایی", subject: "سوال در مورد گواهینامه", time: "دیروز", unread: false },
    ])),

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
];    