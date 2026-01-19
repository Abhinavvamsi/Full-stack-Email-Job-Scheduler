# Full-stack Email Job Scheduler

Built with ❤️ by **Abhinav Vamsi**

A powerful, production-grade email scheduling application built with a modern tech stack.

## 🚀 Connect

- **Author**: Abhinav Vamsi
- **Email**: abhinavvamsi2004@gmail.com
- **GitHub**: [Abhinavvamsi](https://github.com/Abhinavvamsi)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide Icons (Notion-style UI)
- **Backend**: Express.js, TypeScript, BullMQ, Redis
- **Database**: PostgreSQL (Prisma ORM)
- **Infrastructure**: Docker Compose

## ✨ Features

- **Bulk Scheduling**: Upload CSV files to schedule emails for thousands of recipients.
- **Smart Rate Limiting**: Intelligent worker queue that respects provider limits (e.g., 1 email/5s).
- **Responsive Dashboard**: Beautiful, minimalist UI for tracking scheduled and sent emails.
- **Robust Architecture**: Separation of concerns with a dedicated worker service.

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Abhinavvamsi/Full-stack-Email-Job-Scheduler.git
    cd Full-stack-Email-Job-Scheduler
    ```

2.  **Start Infrastructure**:
    ```bash
    docker compose up -d
    ```

3.  **Setup Backend**:
    ```bash
    cd apps/backend
    npm install
    # Set up .env (see .env.example)
    npx prisma db push
    npm run dev
    ```

4.  **Setup Frontend**:
    ```bash
    cd apps/frontend
    npm install
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000).

## 📄 License

MIT © Abhinav Vamsi
