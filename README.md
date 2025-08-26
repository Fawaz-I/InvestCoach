# InvestCoach 📈

A comprehensive investment coaching platform built with Next.js, TypeScript, and Supabase for systematic portfolio management, position analysis, and data-driven investment decisions.

## Features

- **Portfolio Management**: Organize investments into multiple portfolios with different strategies
- **Position Tracking**: Track individual stock positions with detailed metrics and performance analysis
- **Decision Checklists**: Systematic evaluation tools for buy/hold/sell decisions
- **Real-time Data**: Live market data integration for up-to-date pricing and calculations
- **Smart Reports**: Automated analysis and insights for better investment decisions
- **Secure & Private**: Enterprise-grade security with complete data privacy

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time subscriptions)
- **State Management**: TanStack Query for server state management
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Styling**: Tailwind CSS with custom design system
- **Type Safety**: Full TypeScript implementation with database type generation

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Git for version control

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd InvestCoach
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key

# External API Keys (for future phases)
FINNHUB_API_KEY=your-finnhub-api-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
```

### 3. Database Setup

#### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the migration from `supabase/migrations/001_initial_schema.sql`
4. Optionally run the seed data from `supabase/seed.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db reset

# Or apply specific migration
supabase db push
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
InvestCoach/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility libraries and configurations
│   ├── query-client.ts    # TanStack Query client setup
│   └── supabase.ts        # Supabase client and utilities
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database schema types
├── supabase/              # Database configuration
│   ├── config.toml        # Supabase local configuration
│   ├── migrations/        # Database migrations
│   └── seed.sql           # Sample data for development
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Database Schema

The application uses the following main tables:

- **portfolios**: Investment portfolio containers
- **positions**: Individual stock/investment positions
- **checklists**: Decision-making evaluation templates
- **position_checklist_results**: Results from applying checklists
- **reports**: Generated analysis and insights

## Development Workflow

### Adding New Features

1. **Database Changes**: Add migrations to `supabase/migrations/`
2. **Type Updates**: Update `types/database.ts` to match schema changes
3. **API Functions**: Add utility functions to `lib/supabase.ts`
4. **Components**: Create reusable components in `components/`
5. **Pages**: Add new pages in the `app/` directory

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the established linting rules
- **Tailwind CSS**: Use utility classes with custom components in `globals.css`
- **Naming**: Use kebab-case for files, PascalCase for components

## Configuration Files

- **next.config.js**: Next.js configuration with TypeScript support
- **tailwind.config.ts**: Tailwind CSS customization and theme
- **tsconfig.json**: TypeScript compiler options and path mapping
- **supabase/config.toml**: Local Supabase development configuration

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code quality

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key (client-side)
- `SUPABASE_SECRET_KEY`: Supabase secret key (server-side only)

### Optional Variables (Future Phases)

- `FINNHUB_API_KEY`: For real-time market data
- `ALPHA_VANTAGE_API_KEY`: For historical financial data
- `NEXTAUTH_SECRET`: For NextAuth.js authentication
- `NEXTAUTH_URL`: Application URL for authentication callbacks

## Architecture Decisions

### State Management

- **TanStack Query**: Server state management with caching and synchronization
- **React Hooks**: Local component state management
- **Supabase Real-time**: Live data updates via WebSocket subscriptions

### Authentication

- **Supabase Auth**: Built-in authentication with multiple providers
- **Row Level Security**: Database-level security policies
- **JWT Tokens**: Secure API access with automatic token refresh

### Data Flow

1. Components use TanStack Query hooks for data fetching
2. Supabase client handles API calls and real-time subscriptions
3. TypeScript ensures type safety throughout the application
4. Tailwind CSS provides consistent styling and responsiveness

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## Roadmap

### Phase 1: Foundation ✅

- [x] Next.js application setup
- [x] Supabase database schema
- [x] Basic UI components
- [x] TypeScript configuration

### Phase 2: Core Features (Next)

- [ ] Portfolio CRUD operations
- [ ] Position management
- [ ] Real-time data integration
- [ ] Basic dashboard

### Phase 3: Advanced Features

- [ ] Checklist system implementation
- [ ] Report generation
- [ ] Data visualization
- [ ] Mobile responsiveness

### Phase 4: Analytics & Insights

- [ ] Performance analytics
- [ ] Risk assessment tools
- [ ] AI-powered insights
- [ ] Advanced reporting

## Support

For questions and support:

- Review the documentation in this README
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)
- Submit issues on the GitHub repository

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**InvestCoach** - Built with ❤️ for systematic investment management
