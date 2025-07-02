# SparqAI - AI-Powered Sales Development Platform

## Overview

SparqAI is a modern full-stack web application built for AI-powered sales development and outreach automation. The platform enables users to create and manage automated sales campaigns, track leads, and leverage AI insights to optimize outreach performance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and request processing

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (via Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage Pattern**: Repository pattern with in-memory fallback for development

## Key Components

### Database Schema
The application uses a relational database with the following main entities:
- **Users**: User accounts with authentication and profile information
- **Companies**: Business profiles linked to users
- **Campaigns**: Outreach campaigns with sequences and statistics
- **Contacts**: Lead contacts associated with campaigns
- **Activities**: Activity tracking for user actions and system events
- **Integrations**: Third-party service connections (LinkedIn, Email, CRM)

### Authentication System
- Simple email/password authentication (development implementation)
- Session-based authentication with user context
- User registration and login endpoints

### AI Services Integration
- OpenAI GPT-4o integration for content generation and insights
- Lead enrichment capabilities
- Email copy generation with personalization
- Performance optimization recommendations

### Frontend Pages
- **Dashboard**: Overview with metrics, charts, and activity feeds
- **Campaigns**: Campaign management and creation interface
- **Contacts**: Lead management and contact database
- **Setup**: Onboarding flow for new users

## Data Flow

1. **User Authentication**: Users authenticate via REST API endpoints
2. **Data Fetching**: TanStack Query manages server state with automatic caching
3. **Real-time Updates**: Activity feeds and metrics update via API polling
4. **AI Processing**: OpenAI service processes requests for content generation
5. **Database Operations**: Drizzle ORM handles all database interactions
6. **State Management**: React Query provides optimistic updates and error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **openai**: AI service integration
- **express**: Web server framework

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Chart and data visualization library
- **react-hook-form**: Form handling and validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Express server with custom middleware for API requests
- In-memory storage fallback for rapid prototyping
- Replit-specific plugins for cloud development

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- esbuild compiles server code to `dist/index.js`
- Static file serving via Express for production deployment
- Environment variable configuration for database and API keys

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **OPENAI_API_KEY**: OpenAI API authentication
- **NODE_ENV**: Environment mode (development/production)

## Changelog
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.