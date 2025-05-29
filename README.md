# BrightPair AI Tutor

🎓 A personalized AI-powered tutoring platform built with React, TypeScript, and
Supabase.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)

## 🚀 Features

- **AI-Powered Tutoring**: Interactive chat with an AI tutor specialized in
  mathematics
- **Multi-Role Support**: Student, Tutor, and Parent dashboards with
  role-specific features
- **Curriculum Management**: Structured learning paths with skills tracking
- **Homework System**: Create, assign, and grade homework with AI assistance
- **Flashcards & Quizzes**: AI-generated study materials from topics or uploaded
  documents
- **Progress Tracking**: Visual progress monitoring with skill mastery metrics
- **Document Processing**: Extract content from PDFs and generate lessons
- **Real-time Messaging**: Communication between tutors and parents
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Prerequisites

- Node.js 18+ (or Bun 1.0+)
- Supabase account
- OpenAI API key (for AI features)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/brightpair-ai-tutor.git
cd brightpair-ai-tutor
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Setup

Copy the environment example file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

### 4. Database Setup

The project includes database migrations for all required tables and RLS
policies.

For local development with Supabase CLI:

```bash
supabase start
supabase db push
```

For cloud deployment:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
brightpair-ai-tutor/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts for state management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route-based page components
│   ├── routes/         # Route definitions and guards
│   ├── services/       # API and service layers
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── supabase/
│   ├── functions/      # Edge functions for AI operations
│   └── migrations/     # Database schema migrations
└── public/            # Static assets
```

## 🔑 Key Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI Integration**: OpenAI GPT-4
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Math Rendering**: KaTeX

## 📱 Features by Role

### Students

- AI tutor chat with personalized learning
- View and complete homework assignments
- Practice with AI-generated quizzes
- Study with flashcards
- Track learning progress

### Tutors

- Create and manage homework assignments
- Monitor student progress
- Send messages to parents
- Generate student reports
- Access curriculum management tools

### Parents

- View children's progress
- Receive updates from tutors
- Access learning reports
- Monitor homework completion

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Type checking
npm run typecheck
```

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting provider

3. Set up environment variables on your hosting platform

## 🔒 Security Considerations

- All API routes are protected with Supabase RLS policies
- Authentication is handled by Supabase Auth
- Environment variables are used for sensitive configuration
- Input validation on all forms
- XSS protection through React's default escaping

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 📞 Support

For support, email support@brightpair.com or join our Discord community.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [OpenAI](https://openai.com) for AI capabilities

---

Built with ❤️ by the BrightPair team
