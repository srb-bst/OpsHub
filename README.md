# Nursery Management App

Internal application for managing leads, projects, scheduling, and operations.

## Features
- 📋 Lead Management & Assignment
- 📝 Blue Sheet Project Documentation  
- 📅 Job Scheduling with Outlook Integration
- 🚚 Delivery Management
- 🌱 Nursery Issue Tracking
- 📊 Dashboard & Analytics

## Quick Start

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/yourusername/nursery-management-app.git
   cd nursery-management-app
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

4. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Deployment

This app is designed to deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nursery-management-app)

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Calendar:** Outlook Integration

## Project Structure

\`\`\`
app/                 # Next.js App Router pages
components/          # Reusable UI components
lib/                # Utilities and configurations
hooks/              # Custom React hooks
\`\`\`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions, contact the development team.
