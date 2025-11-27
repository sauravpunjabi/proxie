# Proxie - Task Management App

A full-featured Task Management application built with SvelteKit, Supabase, and Shadcn Svelte.

## Features (Planned)

- **Authentication**: Sign up, Login, Password Reset.
- **Task Management**: Create, Read, Update, Delete tasks.
- **Organization**: Filter by status, priority; Sort by due date.
- **UI**: Modern, responsive design with Dark Mode.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Proxie
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

4.  **Database Setup**:
    Run the SQL commands in `schema.sql` in your Supabase SQL Editor to set up the database.

5.  **Run the app**:
    ```bash
    npm run dev
    ```

## Tech Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn Svelte
- **Backend/DB**: Supabase
