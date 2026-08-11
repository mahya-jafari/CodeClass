import { http, HttpResponse } from "msw";
const API = "/api";

/* ===================== WEBINARS ===================== */
let participantWebinars = [
  {
    id: 1,
    title: "آشنایی با React 19 و قابلیت‌های جدید",
    details: "بررسی ویژگی‌های جدید React 19 و نحوه استفاده در پروژه‌های واقعی",
    date: "۱۴۰۵/۰۲/۱۵",
    time: "۱۸:۰۰",
    capacity: 200,
    registered: 87,
    status: "upcoming",
    duration: "۹۰ دقیقه",
    joined: false,
    teacher: "استاد علی محمدی",
  }
];

let participantWallet = 350000;

let participantPayments = [
  { id: 1, title: "کلاس React از صفر تا پیشرفته", amount: 2500000, date: "۱۴۰۵/۰۱/۱۵", status: "موفق", method: "درگاه بانکی" },
];

let participantAssignments = [
  { id: 1, title: "پروژه نهایی React", course: "آموزش React از صفر تا پیشرفته", deadline: "۳ روز دیگر", status: "pending", fileUrl: "#" },
];

const participantMessagesList = [
  { id: 1, name: "استاد علی محمدی", message: "سلام، تکلیف جلسه قبل رو بررسی کردم. عالی بود!", time: "۱۵ دقیقه پیش", unread: true },
];

const participantChats = {
  1: [
    { id: 1, text: "سلام، تکلیف جلسه قبل رو بررسی کردم. عالی بود!", fromMe: false, time: "10:15" },
  ],
};

export const handlers = [
http.get(`${API}/participant/webinars`, () => HttpResponse.json(participantWebinars)),

http.post(`${API}/participant/webinars/:id/join`, ({ params }) => {
  participantWebinars = participantWebinars.map((w) => {
    if (w.id !== Number(params.id) || w.status === "ended" || w.status === "live") return w;
    return {
      ...w,
      joined: !w.joined,
      registered: w.joined ? w.registered - 1 : w.registered + 1,
    };
  });
  return HttpResponse.json({ success: true });
}),

/* ===================== PROFILE ===================== */
http.get(`${API}/participant/profile`, () => {
  return HttpResponse.json({
    name: "سارا احمدی",
    email: "sara@example.com",
    phone: "09121234567",
  });
}),

http.put(`${API}/participant/profile`, async ({ request }) => {
  const body = await request.json();
  return HttpResponse.json(body);
}),

http.post(`${API}/participant/change-password`, async () => {
  return HttpResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
}),

/* ===================== PAMPHLETS ===================== */
http.get(`${API}/participant/pamphlets`, () => {
  return HttpResponse.json([
    {
      id: 1,
      title: "جزوه جلسه ۱ - مقدمه React",
      className: "آموزش React از صفر تا پیشرفته",
      type: "pdf",
      size: "2.4 MB",
      date: "۱۴۰۵/۰۱/۱۲",
      url: "#",
    },
  ]);
}),

/* ===================== CLASSES ===================== */
http.get(`${API}/participant/classes`, () => {
  return HttpResponse.json([
    { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", progress: 75, students: 24, sessions: 18, status: "در حال برگزاری", image: "https://via.placeholder.com/80x80?text=React", color: "bg-blue-100" },
  ]);
}),

/* ===================== FINANCE ===================== */

http.get(`${API}/participant/finance`, () => {
  return HttpResponse.json({
    wallet: participantWallet,
    payments: participantPayments,
    summary: [
      { title: "موجودی کیف پول", value: participantWallet.toLocaleString("fa-IR"), unit: "تومان", color: "text-blue-600", bg: "bg-blue-50" },
      { title: "کل پرداخت‌ها", value: "۶,۸۰۰,۰۰۰", unit: "تومان", color: "text-purple-600", bg: "bg-purple-50" },
      { title: "فاکتورهای موفق", value: "۴", unit: "مورد", color: "text-green-600", bg: "bg-green-50" },
    ],
  });
}),

http.post(`${API}/participant/finance/charge`, async ({ request }) => {
  const body = await request.json();
  const amount = Number(body.amount);
  if (amount >= 1000) participantWallet += amount;
  return HttpResponse.json({ wallet: participantWallet });
}),

http.post(`${API}/participant/finance/payments/:id/retry`, ({ params }) => {
  participantPayments = participantPayments.map((p) =>
    p.id === Number(params.id) ? { ...p, status: "موفق" } : p
  );
  return HttpResponse.json({ success: true });
}),

/* ===================== CERTIFICATES ===================== */
http.get(`${API}/participant/certificates`, () => {
  return HttpResponse.json([
    { id: 1, title: "گواهینامه دوره UI/UX با Figma", date: "۱۴۰۵/۰۲/۱۵", instructor: "استاد سارا رضایی", image: "https://via.placeholder.com/300x200?text=Certificate" },
  ]);
}),

/* ===================== CALENDAR ===================== */
http.get(`${API}/participant/calendar`, () => {
  return HttpResponse.json([
    { day: 2, time: "۱۷:۰۰", title: "JavaScript - جلسه ۹", color: "bg-yellow-100 text-yellow-700" },
  ]);
}),

/* ===================== ASSIGNMENTS ===================== */

http.get(`${API}/participant/assignments`, () => HttpResponse.json(participantAssignments)),

http.post(`${API}/participant/assignments/:id/submit`, async ({ request, params }) => {
  const body = await request.json();
  participantAssignments = participantAssignments.map((a) =>
    a.id === Number(params.id)
      ? { ...a, status: "done", deadline: "تحویل شده", fileName: body.fileName || "uploaded-file" }
      : a
  );
  return HttpResponse.json({ success: true });
}),

/* ===================== MESSAGES ===================== */

http.get(`${API}/participant/messages`, () => HttpResponse.json(participantMessagesList)),

http.get(`${API}/participant/messages/:id`, ({ params }) => {
  return HttpResponse.json(participantChats[params.id] || []);
}),

http.post(`${API}/participant/messages/:id`, async ({ request, params }) => {
  const body = await request.json();
  const newMsg = {
    id: Date.now(),
    text: body.text || "",
    fromMe: true,
    time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    file: body.file || null,
  };
  if (!participantChats[params.id]) participantChats[params.id] = [];
  participantChats[params.id].push(newMsg);
  return HttpResponse.json(newMsg, { status: 201 });
}),

/* ===================== DASHBOARD ===================== */
http.get(`${API}/participant/dashboard`, () => {
  return HttpResponse.json({
    stats: [
      { title: "کلاس‌های ثبت‌نام شده", value: "۴", color: "text-blue-500", bg: "bg-blue-50" },
      { title: "جلسات پیش رو", value: "۲", color: "text-purple-500", bg: "bg-purple-50" },
      { title: "تکالیف تکمیل‌نشده", value: "۳", color: "text-orange-500", bg: "bg-orange-50" },
      { title: "ساعات یادگیری", value: "۲۸", color: "text-green-500", bg: "bg-green-50" },
    ],
    myClasses: [
      { id: 1, title: "آموزش React از صفر تا پیشرفته", teacher: "استاد علی محمدی", progress: 75, nextSession: "سه‌شنبه ۱۸:۰۰", image: "https://via.placeholder.com/60x60?text=React", color: "bg-blue-100" },
    ],
    webinars: [
      { id: 2, title: "وبینار رایگان JavaScript پیشرفته", status: "live", time: "الان" },
    ],
    upcoming: [
      { id: 1, title: "جلسه - React", time: "سه‌شنبه ۱۸:۰۰", tag: "React" },
    ],
    notifications: [
      { id: 1, text: "تکلیف جدید در کلاس React", time: "۲ ساعت پیش", href: "/participant/assignments" },
    ],
  });
}),

/* ===================== CLASSROOM ===================== */
http.get(`${API}/participant/classroom/:id/participants`, () => {
  return HttpResponse.json([
    { id: 1, name: "استاد کیشانی", mic: true },
    { id: 2, name: "شما", mic: false },
    { id: 3, name: "محیا جعفری", mic: false },
  ]);
}),

http.get(`${API}/participant/classroom/:id/messages`, () => {
  return HttpResponse.json([
    { id: 1, name: "استاد کیشانی", time: "10:32", text: "کسی سوالی داره؟", teacher: true },
  ]);
}),
];