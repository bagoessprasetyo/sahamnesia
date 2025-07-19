# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Sahamnesia" - a React/TypeScript application for Indonesian stock market education. The app serves as a landing page for a stock learning platform with an integrated AI chatbot powered by OpenAI.

## Common Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Architecture & Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui components with Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: OpenAI API for chatbot functionality

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui base components
│   ├── Header.tsx       # Main navigation
│   ├── Hero.tsx         # Landing page hero
│   ├── Chatbot.tsx      # AI chatbot widget
│   └── ...              # Other landing page sections
├── pages/               # Route components (Blog, News, Contact)
├── hooks/               # Custom React hooks
│   └── useChat.ts       # Chat functionality hook
├── services/            # External API services
│   └── openai.ts        # OpenAI API integration
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## Key Features

- **Simple State-Based Routing**: Uses React state for navigation (not React Router)
- **AI Chatbot**: Indonesian stock market education assistant using OpenAI API
- **Landing Page Sections**: Hero, features, how-it-works, blog, testimonials, CTA
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Stock Ticker**: Animated stock price display component

## Development Notes

- **Path Aliases**: Uses `@/*` for `src/*` imports (configured in vite.config.ts and tsconfig.json)
- **Styling**: Custom color scheme with primary (green) and secondary (red) colors for stock market theme
- **Environment Variables**: Requires `VITE_OPENAI_API_KEY` for chatbot functionality
- **Component Pattern**: Uses functional components with hooks throughout
- **State Management**: Local state with React hooks, localStorage for chat history

## API Integration

The OpenAI service (`src/services/openai.ts`) handles chatbot interactions with:
- Indonesian language system prompt for stock market education
- Error handling for API failures
- Rate limiting and network error responses
- GPT-3.5-turbo model configuration

## Navigation System

The app uses a simple state-based routing system in `App.tsx`:
- `currentPage` state controls which component to render
- `handleNavigate` function manages page transitions
- Pages: 'home' (default), 'blog', 'news', 'contact'

## Chatbot Implementation

The chat system uses:
- `useChat` hook for state management
- Persistent chat history in localStorage
- Real-time message streaming
- Error handling with user-friendly Indonesian messages
- Abort controller for request cancellation

## TypeScript Configuration

- Relaxed TypeScript settings for rapid development
- Path mapping for clean imports
- Separate configs for app and build tooling