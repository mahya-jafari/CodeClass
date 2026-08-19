# CodeClass 🎓💻

**CodeClass** is an online programming education and virtual classroom platform designed for instructors and students.

The platform provides separate dashboards for **Admins, Presenters, and Participants**, along with an interactive online classroom for programming courses.

## ✨ Features

* 👨‍💼 Admin dashboard and management
* 👨‍🏫 Presenter dashboard and class management
* 👨‍🎓 Participant dashboard and course access
* 💻 Online programming classroom
* 📝 Interactive code editor with Monaco
* 📄 PDF viewer and presentation
* 🎨 Interactive whiteboard
* 📅 Calendar and webinars

## 🛠️ Technologies

* **Next.js 16**
* **React 19**
* **JavaScript**
* **Tailwind CSS**
* **Redux Toolkit & RTK Query**
* **Mock Service Worker (MSW)**

## 🧭 Main Routes

### Authentication

```text
/login
/register
/admin/dashboard
/presenter/dashboard
/participant/dashboard
/presenter/classroom/1
/participant/classroom/1
```

## 🏗️ Project Structure

```text
src/
├── app/          # Application routes
├── components/   # Reusable UI components
├── features/     # Feature-specific logic
├── hooks/        # Custom hooks
├── mocks/        # MSW mock APIs
└── store/        # Redux & RTK Query
```

## 🚀 Getting Started

```bash
git clone https://github.com/mahya-jafari/CodeClass.git
cd CodeClass/codeclass
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```
