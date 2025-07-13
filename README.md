<h1 align="center">Realtime Supabase To Do App</h1>

<p align="center">A beautiful, realtime Todo App built with React, Vite, and Supabase</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />

</p>

---

## 🚀 Features

- Realtime CRUD with Supabase
- Upload and display images for each task
- Responsive, modern UI with React & Vite
- Live updates with Supabase Realtime
- File upload with Supabase Storage

---

## 🛠️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/supabase-todo-app.git
   cd supabase-todo-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Supabase:**
   - Copy your Supabase project URL and anon/public key into `src/supabase-client.js`.
   - Make sure you have a `tasks` table and a `task-images` storage bucket in your Supabase project.
4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## 📝 Database Schema

### Table: `tasks`

| Column      | Type        | Description      |
| ----------- | ----------- | ---------------- |
| id          | bigint      | Primary Key      |
| title       | text        | Task title       |
| description | text        | Task description |
| image_url   | text        | Image URL        |
| created_at  | timestamptz | Auto-generated   |

### Storage Bucket: `task-images`

- Public or authenticated upload policy
- Used for storing task images

---

## 📸 Screenshot

<!-- Replace with your own screenshot if available -->

![App Screenshot](https://user-images.githubusercontent.com/6698252/273420011-2e2e7b2e-2e7e-4e2e-8e2e-2e2e7b2e2e7b.png)

---

## 🤝 License

MIT
