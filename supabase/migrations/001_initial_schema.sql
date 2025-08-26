-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create portfolios table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create positions table
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  shares DECIMAL(15,4) NOT NULL CHECK (shares > 0),
  entry_price DECIMAL(10,2) NOT NULL CHECK (entry_price > 0),
  thesis TEXT,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checklists table
CREATE TABLE checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  strategy TEXT NOT NULL,
  questions_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create position_checklist_results table
CREATE TABLE position_checklist_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  results_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure unique combination of position and checklist per result
  UNIQUE(position_id, checklist_id, created_at)
);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_positions_portfolio_id ON positions(portfolio_id);
CREATE INDEX idx_positions_ticker ON positions(ticker);
CREATE INDEX idx_position_checklist_results_position_id ON position_checklist_results(position_id);
CREATE INDEX idx_position_checklist_results_checklist_id ON position_checklist_results(checklist_id);
CREATE INDEX idx_reports_position_id ON reports(position_id);
CREATE INDEX idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX idx_positions_created_at ON positions(created_at DESC);
CREATE INDEX idx_checklists_strategy ON checklists(strategy);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_portfolios_updated_at 
  BEFORE UPDATE ON portfolios 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_positions_updated_at 
  BEFORE UPDATE ON positions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_position_checklist_results_updated_at 
  BEFORE UPDATE ON position_checklist_results 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_reports_updated_at 
  BEFORE UPDATE ON reports 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_checklist_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - can be restricted later with auth)
CREATE POLICY "Allow all operations on portfolios" ON portfolios FOR ALL USING (true);
CREATE POLICY "Allow all operations on positions" ON positions FOR ALL USING (true);
CREATE POLICY "Allow all operations on checklists" ON checklists FOR ALL USING (true);
CREATE POLICY "Allow all operations on position_checklist_results" ON position_checklist_results FOR ALL USING (true);
CREATE POLICY "Allow all operations on reports" ON reports FOR ALL USING (true);

-- Create views for common queries
CREATE VIEW portfolio_summary AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.created_at,
  p.updated_at,
  COUNT(pos.id) as total_positions,
  COALESCE(SUM(pos.shares * pos.entry_price), 0) as total_invested
FROM portfolios p
LEFT JOIN positions pos ON p.id = pos.portfolio_id
GROUP BY p.id, p.name, p.description, p.created_at, p.updated_at;

-- Create function to get portfolio performance (placeholder for future market data integration)
CREATE OR REPLACE FUNCTION get_portfolio_performance(input_portfolio_id UUID)
RETURNS TABLE (
  portfolio_id UUID,
  total_positions BIGINT,
  total_invested NUMERIC,
  current_value NUMERIC,
  unrealized_pnl NUMERIC,
  unrealized_pnl_percent NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as portfolio_id,
    COUNT(pos.id) as total_positions,
    COALESCE(SUM(pos.shares * pos.entry_price), 0) as total_invested,
    -- Placeholder for current market value calculation
    COALESCE(SUM(pos.shares * pos.entry_price), 0) as current_value,
    -- Placeholder for unrealized P&L calculation
    0::NUMERIC as unrealized_pnl,
    -- Placeholder for unrealized P&L percentage calculation
    0::NUMERIC as unrealized_pnl_percent
  FROM public.portfolios p
  LEFT JOIN public.positions pos ON p.id = pos.portfolio_id
  WHERE p.id = input_portfolio_id
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create function to calculate position metrics (placeholder for future market data integration)
CREATE OR REPLACE FUNCTION get_position_metrics(input_position_id UUID)
RETURNS TABLE (
  position_id UUID,
  current_price NUMERIC,
  market_value NUMERIC,
  unrealized_pnl NUMERIC,
  unrealized_pnl_percent NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pos.id as position_id,
    -- Placeholder for current price (will be integrated with market data APIs)
    pos.entry_price as current_price,
    pos.shares * pos.entry_price as market_value,
    0::NUMERIC as unrealized_pnl,
    0::NUMERIC as unrealized_pnl_percent
  FROM public.positions pos
  WHERE pos.id = input_position_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Add comments to tables for documentation
COMMENT ON TABLE portfolios IS 'Investment portfolios grouping related positions';
COMMENT ON TABLE positions IS 'Individual stock/investment positions within portfolios';
COMMENT ON TABLE checklists IS 'Decision-making checklists with questions and strategies';
COMMENT ON TABLE position_checklist_results IS 'Results from applying checklists to positions';
COMMENT ON TABLE reports IS 'Generated reports and analysis for positions';

COMMENT ON COLUMN positions.shares IS 'Number of shares held (supports fractional shares)';
COMMENT ON COLUMN positions.entry_price IS 'Average price per share at entry';
COMMENT ON COLUMN positions.thesis IS 'Investment thesis and reasoning';
COMMENT ON COLUMN positions.theme IS 'Investment theme or category';
COMMENT ON COLUMN checklists.questions_json IS 'JSON structure containing checklist questions';
COMMENT ON COLUMN position_checklist_results.results_json IS 'JSON structure containing checklist answers and results';