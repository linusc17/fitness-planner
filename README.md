# AI Fitness Planner

A comprehensive fitness application powered by AI that generates personalized workout plans and Filipino-focused meal plans. Built with Next.js 14, TypeScript, and Google Gemini AI.

## 🌟 Features

- **AI-Powered Workouts**: Generate personalized workout plans based on fitness goals, experience level, available time, and equipment
- **Filipino Meal Plans**: Create authentic Filipino meal plans with traditional dishes and locally available ingredients
- **User Authentication**: Secure authentication with Google SSO and email/password options using Supabase Auth
- **Progress Tracking**: Track workout completion, progress logs, and fitness journey
- **Responsive Design**: Mobile-first responsive design with dark mode support
- **Real-time Updates**: Live activity feed and progress tracking
- **Comprehensive Navigation**: Breadcrumb navigation throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **AI Integration**: Google Gemini API (gemini-2.0-flash)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Library**: Shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Notifications**: Sonner
- **Theme**: Next-themes with dark mode default
- **Typography**: Inter font via next/font

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fitness-planner.git
cd fitness-planner
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database by running the SQL schema in your Supabase project (see `database-schema.sql`)

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
fitness-planner/
├── app/
│   ├── (auth)/
│   │   └── signin/          # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard with recent activity
│   ├── meals/               # Meal plan pages
│   ├── onboarding/          # User profile setup
│   ├── progress/            # Progress tracking
│   └── workouts/            # Workout plan pages
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── header.tsx           # Navigation header
│   └── page-breadcrumb.tsx  # Breadcrumb navigation
├── lib/
│   ├── ai.ts               # Gemini AI integration
│   ├── supabase/           # Database client setup
│   └── validations.ts      # Zod schemas
└── types/
    └── fitness.ts          # TypeScript type definitions
```

## 🎯 Key Features Details

### AI-Powered Workout Generation

- Personalized workout plans using Gemini AI
- Considers fitness goals, experience level, time constraints, and available equipment
- Detailed exercise descriptions with sets, reps, and rest periods

### Filipino Meal Planning

- Authentic Filipino cuisine focus
- Traditional ingredients and cooking methods
- Nutritionally balanced meal plans with calorie tracking
- 7-day comprehensive meal plans

### User Experience

- Clean, intuitive interface with consistent design system
- Mobile-responsive design optimized for all devices
- Dark mode by default with theme switching capability
- Real-time toast notifications for user feedback

## 🛡️ Security Features

- Row Level Security (RLS) policies in Supabase
- Input validation using Zod schemas
- Secure authentication flow with session management
- Environment variable protection for sensitive data
