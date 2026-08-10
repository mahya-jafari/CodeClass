import { http, HttpResponse } from "msw";
import { users } from "./data/users";

const API = "/api";

export const handlers = [
  // LOGIN
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

  // REGISTER
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
];