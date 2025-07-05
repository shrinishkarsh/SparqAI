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
- **Lead Scoring**: AI-powered lead prioritization with scoring analytics
- **Templates**: Email template management with performance tracking and A/B testing
- **Sequence Builder**: Visual drag-and-drop email sequence creation with conditional workflows
- **Integrations**: Third-party service connections and API management
- **Analytics**: Advanced performance analytics and insights
- **Settings**: User preferences and account configuration
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

## Recent Changes
- July 05, 2025: Navigation Simplification and Tab Consolidation
  - **Merged Campaigns and Sequences**: Combined campaigns and sequences into a single tab with tabbed interface for better organization
  - **Simplified Navigation**: Removed Lead Scoring and Templates sections from main navigation for cleaner interface
  - **Unified Campaign Management**: Users can now manage both campaigns and email sequences from one centralized location
  - **Maintained Functionality**: All existing campaign and sequence features preserved within the new tabbed interface
  - **Updated Page Structure**: Campaigns page now includes tabs for switching between campaigns and sequences views

- July 04, 2025: Replit Auth Integration Successfully Completed
  - **Complete Replit Auth Integration**: Fully functional OAuth authentication system with secure session management
  - **Fixed Critical Routing Issues**: Resolved Vite middleware conflicts that were preventing API communication
  - **Authentication Flow Working**: Users can now log in through Replit OAuth and access protected routes
  - **API Communication Restored**: All API endpoints now return proper JSON responses instead of HTML
  - **Database Integration**: PostgreSQL session storage with proper user management for string-based user IDs
  - **Landing Page Restored**: Reverted to original landing page design for unauthenticated users with seamless login flow
  - **Security Implementation**: Protected routes with proper 401/403 responses and authentication middleware
  - **User Interface Consistency**: Maintained existing dashboard layout and navigation structure as requested

- July 04, 2025: Major Platform Enhancement and Advanced Features
  - **Advanced Email Templates System**: Comprehensive template management with categories, performance tracking, and A/B testing capabilities
  - **AI-Powered Lead Scoring**: Smart lead prioritization system with grade-based scoring, demographic and behavioral analysis
  - **Visual Sequence Builder**: Drag-and-drop email sequence creation with conditional logic and branching workflows
  - **Real-time Notification Center**: Live notification system with categorization, filtering, and action-based alerts
  - **Enhanced Navigation**: Added new pages for Templates, Lead Scoring, and Sequence Builder with professional sidebar integration
  - **Performance Analytics**: Advanced analytics for template performance, lead scoring insights, and sequence effectiveness
  - **User Experience Upgrades**: Improved interface with notification badges, progress indicators, and interactive dashboards

- July 03, 2025: Authentication System and Security Implementation
  - **Complete Authentication System**: Implemented session-based user authentication with login/register pages
  - **Session Management**: Added PostgreSQL session storage with secure HTTP-only cookies
  - **Authentication Middleware**: Protected all API routes with authentication requirements
  - **User State Management**: Real-time authentication status with React Query integration
  - **Login/Register Pages**: Beautiful branded authentication pages with form validation
  - **Logout Functionality**: Secure logout with session cleanup and navigation redirect
  - **User Profile Integration**: Dynamic sidebar showing authenticated user information
  - **Route Protection**: Automatic redirection to login for unauthenticated users

- July 03, 2025: Database Integration and Major Platform Enhancements
  - **PostgreSQL Database Added**: Successfully integrated PostgreSQL database with Drizzle ORM
  - **Database Schema Deployed**: All tables created and seeded with demo data
  - **Storage Layer Updated**: Switched from in-memory storage to DatabaseStorage implementation
  - **Restructured Navigation**: Made Integrations a standalone main tab, moved from Settings
  - **Built Comprehensive Analytics**: Fully functional Analytics page with animated metrics, charts, and AI insights
  - **Enhanced Logo Design**: Custom SVG logo with gradient and spark effects for SparqAI branding
  - **Implemented User Onboarding**: 5-step onboarding flow collecting company info, target market, goals, processes, and channel preferences
  - **Personalized Dashboard Setup**: Dashboard now configures based on user onboarding responses
  - **Animation System**: Added CSS animations for fade-in, slide-up, and counter effects throughout platform
  - **Streamlined Settings**: Consolidated to just Integrations and Settings tabs with comprehensive functionality

## Changelog
- July 02, 2025. Initial setup and comprehensive feature development

## User Preferences

Preferred communication style: Simple, everyday language.