import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - InvestCoach',
  description:
    'Your investment portfolio dashboard with performance metrics and position insights.',
};

export default function HomePage() {
  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <section className='text-center py-12'>
        <div className='space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
            Welcome to <span className='text-primary'>InvestCoach</span>
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Your intelligent investment coaching platform for systematic
            portfolio management, position analysis, and data-driven decision
            making.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='portfolio-card text-center'>
          <div className='text-3xl font-bold text-primary mb-2'>0</div>
          <div className='text-sm text-muted-foreground'>Total Portfolios</div>
        </div>
        <div className='portfolio-card text-center'>
          <div className='text-3xl font-bold text-primary mb-2'>0</div>
          <div className='text-sm text-muted-foreground'>Active Positions</div>
        </div>
        <div className='portfolio-card text-center'>
          <div className='text-3xl font-bold metric-neutral mb-2'>$0.00</div>
          <div className='text-sm text-muted-foreground'>Total Value</div>
        </div>
        <div className='portfolio-card text-center'>
          <div className='text-3xl font-bold metric-neutral mb-2'>0.00%</div>
          <div className='text-sm text-muted-foreground'>Total Return</div>
        </div>
      </section>

      {/* Feature Overview */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>📊</div>
          <h3 className='text-lg font-semibold mb-2'>Portfolio Tracking</h3>
          <p className='text-muted-foreground text-sm'>
            Organize your investments into multiple portfolios and track
            performance across different strategies and themes.
          </p>
        </div>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>🎯</div>
          <h3 className='text-lg font-semibold mb-2'>Position Analysis</h3>
          <p className='text-muted-foreground text-sm'>
            Deep dive into individual positions with detailed metrics, thesis
            tracking, and performance analysis.
          </p>
        </div>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>✅</div>
          <h3 className='text-lg font-semibold mb-2'>Decision Checklists</h3>
          <p className='text-muted-foreground text-sm'>
            Systematic decision-making tools to evaluate positions before
            buying, holding, or selling.
          </p>
        </div>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>📈</div>
          <h3 className='text-lg font-semibold mb-2'>Real-time Data</h3>
          <p className='text-muted-foreground text-sm'>
            Live market data integration for up-to-date pricing and performance
            calculations.
          </p>
        </div>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>📋</div>
          <h3 className='text-lg font-semibold mb-2'>Smart Reports</h3>
          <p className='text-muted-foreground text-sm'>
            Automated reports and insights to help you make better investment
            decisions.
          </p>
        </div>
        <div className='portfolio-card'>
          <div className='text-2xl mb-4'>🔒</div>
          <h3 className='text-lg font-semibold mb-2'>Secure & Private</h3>
          <p className='text-muted-foreground text-sm'>
            Your financial data is secure with enterprise-grade security and
            complete data privacy.
          </p>
        </div>
      </section>

      {/* Getting Started */}
      <section className='text-center py-8 border-t border-border'>
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-foreground'>
            Ready to Get Started?
          </h2>
          <p className='text-muted-foreground'>
            Create your first portfolio and start tracking your investments with
            InvestCoach.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button className='bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors'>
              Create Portfolio
            </button>
            <button className='bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors'>
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Status Note */}
      <section className='text-center py-4'>
        <div className='inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm'>
          <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
          System initialized - Ready for portfolio setup
        </div>
      </section>
    </div>
  );
}
