# 🎭 Theater Insider: Script Evaluation Pipeline

A secure, full-stack internal platform built with **Next.js** for theater companies to manage script submissions, assign them to evaluators, and collect structured feedback.

## 🚀 Overview
This project solves the "IP Leak" problem in theater by ensuring scripts are never stored in public directories. Evaluators can only access scripts assigned to them via a secure, session-validated streaming API.

### Key Features
* **Secure Script Vault:** Scripts are stored outside the web root on the server disk.
* **Gatekeeper API:** Role-based access control (RBAC) to prevent unauthorized downloads.
* **Evaluator Dashboard:** A clean UI for reading assigned scripts and submitting rubrics.
* **Admin Control Room:** Upload scripts, manage evaluator assignments, and track progress.
* **Automated Workflow:** Status updates from "Pending" to "Evaluated" upon form submission.

---

## 🛠️ The Tech Stack
* **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
* **Database:** [Prisma](https://www.prisma.io/) with SQLite (for single-server simplicity) or PostgreSQL.
* **Auth:** [Auth.js (NextAuth)](https://authjs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **File Handling:** Node.js `fs` & `stream` modules.

---

## 📂 Project Structure
```text
├── /script-vault          # PRIVATE: Physical PDF storage (Outside /src)
├── /prisma                # Database schema and migrations
├── /src
│   ├── /app
│   │   ├── /admin         # Admin-only upload & assignment pages
│   │   ├── /evaluate      # Evaluator-only feedback forms
│   │   └── /api/download  # The Gatekeeper: Streams files securely
│   ├── /components        # Shared UI components
│   ├── /lib               # Server-side logic & "Documentation Class"
│   └── middleware.ts      # Global route protection
└── .env                   # Sensitive credentials (DATABASE_URL, AUTH_SECRET)
```

---

## 🔒 Security Architecture
1.  **Non-Public Storage:** Scripts are saved in `/script-vault`, which is inaccessible via standard browser URLs.
2.  **UUID Obfuscation:** Files are renamed to random UUIDs upon upload to prevent "ID guessing" attacks.
3.  **Signed Streaming:** When an evaluator clicks "Download," the server verifies their identity and the script assignment before streaming the file buffer directly to the client.
4.  **Server Actions:** All database mutations happen on the server, minimizing exposure of API endpoints.

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/theatre-insider.git
   cd theatre-insider
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root and add:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   # Add your Auth providers (GitHub, Google, or Credentials)
   ```

4. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---