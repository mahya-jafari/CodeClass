import { http, HttpResponse } from "msw";
import { users } from "./data/users";

const API = "/api";

/* ===================== Mock Data ===================== */
let webinars = [
  {
    id: 1,
    title: "آشنایی با React 19 و قابلیت‌های جدید",
    date: "۱۴۰۵/۰۲/۱۵",
    time: "۱۸:۰۰",
    capacity: 200,
    registered: 87,
    status: "upcoming",
    duration: "۹۰ دقیقه",
  },
];

let pamphlets = [
  {
    id: 1,
    title: "جزوه جلسه ۱ - مقدمه React",
    className: "آموزش React از صفر تا پیشرفته",
    type: "pdf",
    size: "2.4 MB",
    date: "۱۴۰۵/۰۱/۱۲",
    url: "#",
  },
];

/* ===================== MY CLASSES ===================== */
let classes = [
  { id: 1, title: "آموزش React از صفر تا پیشرفته", category: "برنامه‌نویسی وب", students: 24, sessions: 18, status: "فعال", image: "https://via.placeholder.com/80x80?text=React", color: "bg-blue-100" },
];

const CLASSES_DETAIL = {
  1: {
    id: 1,
    title: "آموزش React از صفر تا پیشرفته",
    category: "برنامه‌نویسی وب",
    students: 24,
    sessions: 18,
    status: "فعال",
    level: "متوسط تا پیشرفته",
    price: "۴,۵۰۰,۰۰۰ تومان",
    description: "در این دوره از صفر تا صد React را یاد می‌گیرید. شامل Hooks، Context، Router و پروژه‌های واقعی.",
    image: "https://via.placeholder.com/400x220?text=React",
    nextSession: "سه‌شنبه ۱۸:۰۰",
    studentsList: [ "علی کیانی"],
    sessionsList: [
      { id: 1, title: "مقدمه و نصب محیط", date: "۱۴۰۵/۰۱/۱۲", done: true },
      { id: 3, title: "State و Lifecycle", date: "۱۴۰۵/۰۱/۱۹", done: false },
    ],
  },
};

const messagesList = [
  { id: 1, name: "محیا جعفری", message: "سلام، جلسه بعدی چه زمانی برگزار می‌شود؟", time: "۱۰ دقیقه پیش", unread: true },
];

const chats = {
  1: [
    { id: 1, text: "سلام، جلسه بعدی چه زمانی برگزار می‌شود؟", fromMe: false, time: "10:20" },
  ],
};

let banks = [
  { id: 1, name: "بانک ملت", sheba: "IR120170000000123456789001", card: "۶۱۰۴-****-****-۱۲۳۴" },
];

const transactions = [
  { id: 1, title: "فروش کلاس React پیشرفته", type: "income", source: "class", amount: 4500000, date: "۱۴۰۵/۰۲/۰۸", status: "موفق", detail: "۳ دانشجو × ۱,۵۰۰,۰۰۰" },
  { id: 2, title: "فروش وبینار JavaScript", type: "income", source: "webinar", amount: 1800000, date: "۱۴۰۵/۰۲/۰۳", status: "موفق", detail: "۱۲ شرکت‌کننده" },
];

/* ===================== Handlers ===================== */
export const handlers = [
  /* LOGIN */
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = await request.json();
    const { email, password, role } = body;

    const user = users.find(
      (u) =>
        (u.email === email || u.phone === email) &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      return HttpResponse.json(
        { message: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const { password: _, ...safeUser } = user;
    return HttpResponse.json({
      token: `fake-token-${user.id}`,
      user: safeUser,
    });
  }),

  /* REGISTER */
  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = await request.json();
    const { name, email, phone, password, role } = body;

    if (users.some((u) => u.email === email)) {
      return HttpResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password,
      role: role === "participant" ? "participant" : "presenter",
    };
    users.push(newUser);

    const { password: _, ...safeUser } = newUser;
    return HttpResponse.json({
      token: `fake-token-${newUser.id}`,
      user: safeUser,
    });
  }),

  /* PRESENTERS CALENDAR */
  http.get(`${API}/presenter/calendar`, () => {
    return HttpResponse.json([
      {
        day: 1,
        time: "۱۰:۰۰",
        title: "React - جلسه ۱۲",
        color: "bg-blue-100 text-blue-700",
      },
    ]);
  }),

  /* ===================== WEBINARS ===================== */
  http.get(`${API}/presenter/webinars`, () => {
    return HttpResponse.json(webinars);
  }),

  http.post(`${API}/presenter/webinars`, async ({ request }) => {
    const body = await request.json();
    const newWebinar = {
      id: Date.now(),
      title: body.title,
      details: body.details || "",
      date: body.date || "—",
      time: body.time || "—",
      capacity: Number(body.capacity) || 100,
      registered: 0,
      status: "upcoming",
      duration: "۶۰ دقیقه",
    };
    webinars = [newWebinar, ...webinars];
    return HttpResponse.json(newWebinar, { status: 201 });
  }),

  http.delete(`${API}/presenter/webinars/:id`, ({ params }) => {
    webinars = webinars.filter((w) => w.id !== Number(params.id));
    return HttpResponse.json({ success: true });
  }),

  /* ===================== PAMPHLETS ===================== */
  http.get(`${API}/presenter/pamphlets`, () => {
    return HttpResponse.json(pamphlets);
  }),

  http.post(`${API}/presenter/pamphlets`, async ({ request }) => {
    const body = await request.json();
    const newItem = {
      id: Date.now(),
      title: body.title,
      className: body.className || "بدون کلاس",
      type: body.type || "file",
      size: body.size || "0 MB",
      date: body.date || new Date().toLocaleDateString("fa-IR"),
      url: body.url || "#",
    };
    pamphlets = [newItem, ...pamphlets];
    return HttpResponse.json(newItem, { status: 201 });
  }),

  http.delete(`${API}/presenter/pamphlets/:id`, ({ params }) => {
    pamphlets = pamphlets.filter((p) => p.id !== Number(params.id));
    return HttpResponse.json({ success: true });
  }),

  /* ===================== PROFILE / SETTINGS ===================== */
  http.get(`${API}/presenter/profile`, () => {
    return HttpResponse.json({
      name: "علی محمدی",
      email: "ali@example.com",
      phone: "09123456789",
    });
  }),

  http.put(`${API}/presenter/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.post(`${API}/presenter/change-password`, async () => {
    return HttpResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  }),

  /* ===================== CREATE CLASS ===================== */
  http.post(`${API}/presenter/classes`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: Date.now(), ...body, message: "کلاس با موفقیت ایجاد شد" },
      { status: 201 }
    );
  }),

  /* ===================== MY CLASSES ===================== */
  http.get(`${API}/presenter/classes`, () => {
    return HttpResponse.json(classes);
  }),

  http.get(`${API}/presenter/classes/:id`, ({ params }) => {
    const data = CLASSES_DETAIL[params.id];
    if (!data) return HttpResponse.json({ message: "کلاس پیدا نشد" }, { status: 404 });
    return HttpResponse.json(data);
  }),

  http.delete(`${API}/presenter/classes/:id`, ({ params }) => {
    classes = classes.filter((c) => c.id !== Number(params.id));
    return HttpResponse.json({ success: true });
  }),

  /* ===================== MESSAGES ===================== */
  http.get(`${API}/presenter/messages`, () => {
    return HttpResponse.json(messagesList);
  }),

  http.get(`${API}/presenter/messages/:id`, ({ params }) => {
    return HttpResponse.json(chats[params.id] || []);
  }),

  http.post(`${API}/presenter/messages/:id`, async ({ request, params }) => {
    const body = await request.json();
    const newMsg = {
      id: Date.now(),
      text: body.text || "",
      fromMe: true,
      time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
      file: body.file || null,
    };
    if (!chats[params.id]) chats[params.id] = [];
    chats[params.id].push(newMsg);
    return HttpResponse.json(newMsg, { status: 201 });
  }),

  /* ===================== FINANCE ===================== */

  http.get(`${API}/presenter/finance/summary`, () => {
    return HttpResponse.json([
      { title: "موجودی قابل برداشت", value: "۱۲,۴۵۰,۰۰۰", color: "text-green-600", bg: "bg-green-50" },
      { title: "درآمد این ماه", value: "۸,۲۰۰,۰۰۰", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "در انتظار تسویه", value: "۳,۱۰۰,۰۰۰", color: "text-orange-500", bg: "bg-orange-50" },
    ]);
  }),

  http.get(`${API}/presenter/finance/transactions`, () => {
    return HttpResponse.json(transactions);
  }),

  http.get(`${API}/presenter/finance/banks`, () => {
    return HttpResponse.json(banks);
  }),

  http.post(`${API}/presenter/finance/banks`, async ({ request }) => {
    const body = await request.json();
    const newBank = { id: Date.now(), ...body };
    banks = [...banks, newBank];
    return HttpResponse.json(newBank, { status: 201 });
  }),

  http.delete(`${API}/presenter/finance/banks/:id`, ({ params }) => {
    banks = banks.filter((b) => b.id !== Number(params.id));
    return HttpResponse.json({ success: true });
  }),

  /* ===================== DASHBOARD ===================== */
  http.get(`${API}/presenter/dashboard/stats`, () => {
    return HttpResponse.json([
      { title: "جلسات این هفته", value: "۱۲", color: "text-blue-500" },
      { title: "کلاس‌های فعال", value: "۸", color: "text-purple-500" },
      { title: "کل دانشجویان", value: "۲۳۶", color: "text-green-500" },
      { title: "درآمد این ماه", value: "۱۲.۴M", color: "text-emerald-500" },
    ]);
  }),

  http.get(`${API}/presenter/dashboard/classes`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "آموزش React از صفر تا پیشرفته",
        category: "برنامه‌نویسی وب",
        students: 24,
        sessions: 18,
        status: "فعال",
        image: "https://via.placeholder.com/80x80?text=React",
        color: "bg-blue-100",
      },
    ]);
  }),

  http.get(`${API}/presenter/dashboard/webinars`, () => {
    return HttpResponse.json([
      { id: 2, title: "وبینار رایگان JavaScript پیشرفته", status: "live", time: "الان" },
    ]);
  }),

  /* ===================== CLASSROOM ===================== */
  http.get(`${API}/presenter/classroom/:id/participants`, () => {
    return HttpResponse.json([
      { id: 1, name: "استاد کیشانی", mic: true, canEdit: true, isSelf: true },
      { id: 2, name: "محیا جعفری", mic: false, canEdit: false },
      { id: 3, name: "فاطمه قاسمی", mic: false, canEdit: false },
      { id: 4, name: "مریم حسینی", mic: false, canEdit: false },
    ]);
  }),

  http.get(`${API}/presenter/classroom/:id/messages`, () => {
    return HttpResponse.json([
      { id: 1, name: "محیا جعفری", time: "10:30", text: "من متوجه نشدم", teacher: false },
      { id: 2, name: "استاد کیشانی", time: "10:32", text: "دوباره توضیح میدم", teacher: true },
    ]);
  }),

  http.post(`${API}/presenter/classroom/:id/messages`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        id: Date.now(),
        name: "استاد کیشانی",
        time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
        text: body.text,
        teacher: true,
      },
      { status: 201 }
    );
  }),
];