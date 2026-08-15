import { http, HttpResponse } from "msw";
const API = "/api";

let adminWebinars = [
    { id: 1, title: "آشنایی با React 19", teacher: "استاد علی محمدی", registered: 87, status: "upcoming", date: "۱۴۰۵/۰۲/۱۵" },
    { id: 2, title: "وبینار JavaScript پیشرفته", teacher: "استاد سارا رضایی", registered: 142, status: "live", date: "۱۴۰۵/۰۲/۱۰" },
    { id: 3, title: "مسیر شغلی فرانت‌اند", teacher: "استاد علی محمدی", registered: 256, status: "ended", date: "۱۴۰۵/۰۱/۲۰" },
];

let adminClasses = [
    { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", students: 24, status: "فعال", date: "۱۴۰۵/۰۱/۱۰" },
    { id: 2, title: "جامع JavaScript", teacher: "استاد سارا رضایی", students: 31, status: "فعال", date: "۱۴۰۵/۰۱/۱۸" },
    { id: 3, title: "Python برای مبتدیان", teacher: "استاد علی محمدی", students: 0, status: "در انتظار تأیید", date: "۱۴۰۵/۰۲/۰۵" },
    { id: 4, title: "طراحی UI/UX با Figma", teacher: "استاد نگار کریمی", students: 12, status: "غیرفعال", date: "۱۴۰۴/۱۱/۲۲" },
];

let adminUsers = [
    { id: 1, name: "سارا احمدی", email: "sara@test.com", role: "participant", status: "فعال", date: "۱۴۰۵/۰۱/۱۵" },
    { id: 2, name: "علی محمدی", email: "ali@test.com", role: "presenter", status: "فعال", date: "۱۴۰۵/۰۱/۱۰" },
    { id: 3, name: "نگار رضایی", email: "negar@test.com", role: "participant", status: "غیرفعال", date: "۱۴۰۵/۰۲/۰۱" },
    { id: 4, name: "محمد حسینی", email: "mohammad@test.com", role: "presenter", status: "فعال", date: "۱۴۰۴/۱۲/۲۰" },
    { id: 5, name: "مدیر سیستم", email: "admin@test.com", role: "admin", status: "فعال", date: "۱۴۰۴/۱۰/۰۱" },
];

// NOTE: previously this was a static object returned inline. It's now a
// mutable record so PUT /admin/profile can actually persist changes for
// the mock server's lifetime (resets on page reload, same as the others).
let adminMessages = [
    { id: 1, name: "سارا احمدی", message: "مشکل در ورود به کلاس آنلاین دارم، لطفا راهنمایی کنید.", time: "۱ ساعت پیش", unread: true, status: "pending" },
    { id: 2, name: "علی محمدی", message: "درخواست افزایش ظرفیت وبینار جاوااسکریپت پیشرفته.", time: "۳ ساعت پیش", unread: true, status: "pending" },
    { id: 3, name: "نگار رضایی", message: "سوالی در مورد نحوه دریافت گواهینامه داشتم.", time: "دیروز", unread: false, status: "resolved" },
    { id: 4, name: "محمد حسینی", message: "امکان بازگشت وجه برای دوره‌ای که خریداری کردم وجود داره؟", time: "۲ روز پیش", unread: false, status: "pending" },
];

let messageThreads = {
    1: [
        { id: 1, text: "سلام، من نمی‌تونم وارد کلاس آنلاین بشم، خطای اتصال میده.", fromMe: false, time: "۰۹:۱۲" },
        { id: 2, text: "سلام، لطفاً نام مرورگر و سیستم عاملتون رو بفرمایید.", fromMe: true, time: "۰۹:۲۰" },
    ],
    2: [
        { id: 1, text: "سلام، امکانش هست ظرفیت وبینار جاوااسکریپت رو افزایش بدید؟", fromMe: false, time: "۱۱:۰۰" },
    ],
    3: [
        { id: 1, text: "سلام، گواهینامه من کی صادر میشه؟", fromMe: false, time: "۱۰:۰۰" },
        { id: 2, text: "با سلام، گواهینامه شما صادر شده و در پنلتون قابل مشاهده‌ست.", fromMe: true, time: "۱۰:۱۵" },
    ],
    4: [
        { id: 1, text: "سلام، دوره‌ای که خریدم مناسبم نبود، امکان بازگشت وجه هست؟", fromMe: false, time: "۰۸:۴۰" },
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

export const handlers = [
    http.get(`${API}/admin/profile`, () => {
        return HttpResponse.json(adminProfile);
    }),
    http.put(`${API}/admin/profile`, async({ request }) => {
        const body = await request.json();
        adminProfile = {...adminProfile, ...body };
        return HttpResponse.json(adminProfile);
    }),
    http.put(`${API}/admin/profile/password`, async({ request }) => {
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
    http.patch(`${API}/admin/users/:id/status`, async({ request, params }) => {
        const { status } = await request.json();
        adminUsers = adminUsers.map((u) => u.id === Number(params.id) ? {...u, status } : u);
        return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/users/:id`, ({ params }) => {
        adminUsers = adminUsers.filter((u) => u.id !== Number(params.id));
        return HttpResponse.json({ success: true });
    }),

    /* CLASSES */

    http.get(`${API}/admin/classes`, () => HttpResponse.json(adminClasses)),
    http.patch(`${API}/admin/classes/:id/status`, async({ request, params }) => {
        const { status } = await request.json();
        adminClasses = adminClasses.map((c) => c.id === Number(params.id) ? {...c, status } : c);
        return HttpResponse.json({ success: true });
    }),
    http.delete(`${API}/admin/classes/:id`, ({ params }) => {
        adminClasses = adminClasses.filter((c) => c.id !== Number(params.id));
        return HttpResponse.json({ success: true });
    }),

    /* WEBINARS */

    http.get(`${API}/admin/webinars`, () => HttpResponse.json(adminWebinars)),
    http.patch(`${API}/admin/webinars/:id/status`, async({ request, params }) => {
        const { status } = await request.json();
        adminWebinars = adminWebinars.map((w) => w.id === Number(params.id) ? {...w, status } : w);
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

    /* ASSIGNMENTS */
    http.get(`${API}/admin/assignments`, () => HttpResponse.json([
        { id: 1, title: "پروژه نهایی React", course: "آموزش React", user: "سارا احمدی", status: "تحویل شده", date: "۱۴۰۵/۰۲/۰۸" },
        { id: 2, title: "تمرین Async/Await", course: "جامع JavaScript", user: "نگار رضایی", status: "در انتظار", date: "۱۴۰۵/۰۲/۱۰" },
    ])),

    /* MESSAGES */
    http.get(`${API}/admin/messages`, () => HttpResponse.json(adminMessages)),

    http.get(`${API}/admin/messages/:id/thread`, ({ params }) => {
        const id = Number(params.id);
        // opening a conversation marks it as read
        adminMessages = adminMessages.map((m) => m.id === id ? {...m, unread: false } : m);
        return HttpResponse.json(messageThreads[id] || []);
    }),

    http.post(`${API}/admin/messages/:id/thread`, async({ request, params }) => {
        const id = Number(params.id);
        const { text } = await request.json();
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newMsg = { id: Date.now(), text, fromMe: true, time };
        messageThreads[id] = [...(messageThreads[id] || []), newMsg];
        adminMessages = adminMessages.map((m) => m.id === id ? {...m, message: text, time: "اکنون" } : m);
        return HttpResponse.json(newMsg);
    }),

    http.patch(`${API}/admin/messages/:id/status`, async({ request, params }) => {
        const { status } = await request.json();
        const id = Number(params.id);
        adminMessages = adminMessages.map((m) => m.id === id ? {...m, status } : m);
        return HttpResponse.json({ success: true });
    }),

    http.patch(`${API}/admin/messages/:id/read`, ({ params }) => {
        const id = Number(params.id);
        adminMessages = adminMessages.map((m) => m.id === id ? {...m, unread: false } : m);
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
    http.put(`${API}/admin/settings`, async({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
    }),

    /* CERTIFICATES */
    http.get(`${API}/admin/certificates`, () => HttpResponse.json([
        { id: 1, userName: "سارا احمدی", course: "گواهینامه UI/UX با Figma", score: 95 },
        { id: 2, userName: "علی محمدی", course: "گواهینامه HTML & CSS", score: 88 },
        { id: 3, userName: "نگار رضایی", course: "گواهینامه JavaScript پیشرفته", score: 92 },
    ])),
];