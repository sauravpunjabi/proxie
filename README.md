# TurboTask

A modern, full-featured Task Management application built with SvelteKit, Supabase, and Shadcn Svelte.

## Features

-   **Authentication**: Secure Sign Up and Login powered by Supabase Auth.
-   **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
-   **Organization**: Filter tasks by status and sort by date or priority.
-   **Modern UI**: Beautiful, responsive interface with Dark Mode support.
-   **Real-time**: Fast and responsive interactions.

## Tech Stack

-   **Framework**: [SvelteKit](https://kit.svelte.dev/)
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **UI Components**: [Shadcn Svelte](https://next.shadcn-svelte.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide Svelte](https://lucide.dev/)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sauravpunjabi/proxie.git
    cd proxie
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    PUBLIC_SUPABASE_URL=your_supabase_url
    PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Deployment

This project is ready to be deployed on Vercel, Netlify, or any platform that supports SvelteKit.

## License

MIT
