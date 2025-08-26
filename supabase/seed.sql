-- Seed data for InvestCoach development and testing
-- This file provides sample data to get started with the application

-- Insert sample portfolios
INSERT INTO portfolios (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Growth Portfolio', 'Focus on high-growth technology and innovation stocks'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Value Portfolio', 'Undervalued companies with strong fundamentals'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Dividend Portfolio', 'Income-generating dividend stocks for steady returns');

-- Insert sample positions
INSERT INTO positions (id, portfolio_id, ticker, shares, entry_price, thesis, theme) VALUES
  -- Growth Portfolio positions
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'AAPL', 50.0, 150.00, 'Leading technology company with strong ecosystem and innovation pipeline', 'Technology'),
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'TSLA', 25.0, 200.00, 'Electric vehicle leader with autonomous driving potential', 'Clean Energy'),
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'NVDA', 30.0, 300.00, 'AI chip leader benefiting from machine learning boom', 'Artificial Intelligence'),
  
  -- Value Portfolio positions
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'BRK.B', 100.0, 250.00, 'Warren Buffett''s diversified holding company trading below intrinsic value', 'Value Investing'),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'JPM', 75.0, 120.00, 'Largest US bank with strong balance sheet and competitive moats', 'Financial Services'),
  
  -- Dividend Portfolio positions
  ('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'KO', 200.0, 55.00, 'Consistent dividend payer with global brand recognition', 'Consumer Staples'),
  ('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'JNJ', 80.0, 160.00, 'Healthcare giant with diversified revenue streams and reliable dividends', 'Healthcare');

-- Insert sample checklists
INSERT INTO checklists (id, name, strategy, questions_json) VALUES
  ('550e8400-e29b-41d4-a716-446655440401', 'Growth Stock Evaluation', 'growth', '{
    "questions": [
      {
        "id": "revenue_growth",
        "question": "Is the company showing consistent revenue growth (>15% annually)?",
        "type": "boolean",
        "required": true,
        "weight": 20
      },
      {
        "id": "market_opportunity",
        "question": "Rate the size of the addressable market opportunity (1-10)",
        "type": "rating",
        "required": true,
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "weight": 15
      },
      {
        "id": "competitive_moat",
        "question": "Does the company have sustainable competitive advantages?",
        "type": "boolean",
        "required": true,
        "weight": 25
      },
      {
        "id": "management_quality",
        "question": "Rate the quality and track record of management (1-10)",
        "type": "rating",
        "required": true,
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "weight": 20
      },
      {
        "id": "valuation_reasonable",
        "question": "Is the current valuation reasonable given growth prospects?",
        "type": "boolean",
        "required": true,
        "weight": 20
      }
    ],
    "version": "1.0",
    "description": "Comprehensive evaluation checklist for growth stock investments"
  }'),
  
  ('550e8400-e29b-41d4-a716-446655440402', 'Value Stock Evaluation', 'value', '{
    "questions": [
      {
        "id": "pe_ratio",
        "question": "Is the P/E ratio below industry average?",
        "type": "boolean",
        "required": true,
        "weight": 20
      },
      {
        "id": "book_value",
        "question": "Is the stock trading below book value or at reasonable P/B ratio?",
        "type": "boolean",
        "required": true,
        "weight": 15
      },
      {
        "id": "debt_levels",
        "question": "Are debt levels manageable (debt-to-equity < 0.5)?",
        "type": "boolean",
        "required": true,
        "weight": 20
      },
      {
        "id": "cash_flow",
        "question": "Is the company generating positive free cash flow?",
        "type": "boolean",
        "required": true,
        "weight": 25
      },
      {
        "id": "catalyst_potential",
        "question": "Rate the potential for value realization catalyst (1-10)",
        "type": "rating",
        "required": true,
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "weight": 20
      }
    ],
    "version": "1.0",
    "description": "Evaluation checklist for value investing opportunities"
  }'),
  
  ('550e8400-e29b-41d4-a716-446655440403', 'Dividend Stock Evaluation', 'dividend', '{
    "questions": [
      {
        "id": "dividend_yield",
        "question": "Is the current dividend yield attractive (>3%)?",
        "type": "boolean",
        "required": true,
        "weight": 20
      },
      {
        "id": "dividend_history",
        "question": "Does the company have a consistent dividend payment history (>5 years)?",
        "type": "boolean",
        "required": true,
        "weight": 25
      },
      {
        "id": "payout_ratio",
        "question": "Is the payout ratio sustainable (<70%)?",
        "type": "boolean",
        "required": true,
        "weight": 20
      },
      {
        "id": "dividend_growth",
        "question": "Rate the dividend growth track record (1-10)",
        "type": "rating",
        "required": true,
        "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "weight": 20
      },
      {
        "id": "business_stability",
        "question": "Is the underlying business stable and predictable?",
        "type": "boolean",
        "required": true,
        "weight": 15
      }
    ],
    "version": "1.0",
    "description": "Evaluation checklist for dividend-focused investments"
  }');

-- Insert sample checklist results
INSERT INTO position_checklist_results (id, position_id, checklist_id, results_json) VALUES
  ('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440401', '{
    "answers": [
      {
        "question_id": "revenue_growth",
        "answer": true,
        "notes": "Apple consistently shows strong revenue growth driven by services and product ecosystem"
      },
      {
        "question_id": "market_opportunity",
        "answer": 9,
        "notes": "Massive global smartphone and services market opportunity"
      },
      {
        "question_id": "competitive_moat",
        "answer": true,
        "notes": "Strong ecosystem lock-in and brand loyalty create significant competitive advantages"
      },
      {
        "question_id": "management_quality",
        "answer": 8,
        "notes": "Strong leadership team with proven execution track record"
      },
      {
        "question_id": "valuation_reasonable",
        "answer": true,
        "notes": "Trading at reasonable multiples given growth prospects and cash generation"
      }
    ],
    "score": 88,
    "completed_at": "2024-01-15T10:30:00Z",
    "version": "1.0",
    "recommendation": "buy"
  }'),
  
  ('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440402', '{
    "answers": [
      {
        "question_id": "pe_ratio",
        "answer": true,
        "notes": "BRK.B trades at attractive P/E relative to S&P 500"
      },
      {
        "question_id": "book_value",
        "answer": false,
        "notes": "Trading slightly above book value but reasonable given quality of holdings"
      },
      {
        "question_id": "debt_levels",
        "answer": true,
        "notes": "Minimal debt with strong balance sheet"
      },
      {
        "question_id": "cash_flow",
        "answer": true,
        "notes": "Strong and consistent free cash flow generation"
      },
      {
        "question_id": "catalyst_potential",
        "answer": 7,
        "notes": "Market recognition of intrinsic value and potential for capital allocation improvements"
      }
    ],
    "score": 75,
    "completed_at": "2024-01-20T14:15:00Z",
    "version": "1.0",
    "recommendation": "buy"
  }');

-- Insert sample reports
INSERT INTO reports (id, position_id, content) VALUES
  ('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440101', 'Apple Inc. (AAPL) Position Analysis

## Executive Summary
Strong position in our growth portfolio with solid fundamentals and continued innovation in services and ecosystem products.

## Performance Metrics
- Entry Price: $150.00
- Current Price: $185.00 (estimated)
- Unrealized Gain: $1,750 (+23.3%)
- Position Size: 50 shares

## Key Developments
- Q4 2023 earnings beat expectations with strong services revenue growth
- New product launches including Vision Pro positioning for AR/VR market
- Continued expansion in emerging markets

## Investment Thesis Update
The original investment thesis remains intact. Apple continues to demonstrate:
1. Strong ecosystem effects driving customer retention
2. Growing services revenue with higher margins
3. Innovation in new product categories
4. Excellent capital allocation with buybacks and dividends

## Recommendation
HOLD - Continue monitoring for any changes in competitive positioning or margin pressure.'),

  ('550e8400-e29b-41d4-a716-446655440602', '550e8400-e29b-41d4-a716-446655440301', 'The Coca-Cola Company (KO) Position Analysis

## Executive Summary
Defensive dividend position providing steady income with global brand moat intact.

## Performance Metrics
- Entry Price: $55.00
- Current Price: $58.50 (estimated)
- Unrealized Gain: $700 (+6.4%)
- Position Size: 200 shares
- Annual Dividend: $1.84 per share ($368 annually)

## Key Developments
- Consistent dividend payments maintained through economic cycles
- Market share gains in key international markets
- Portfolio optimization with healthier beverage options

## Investment Thesis Update
Coca-Cola remains a reliable dividend stock with:
1. Global brand recognition and distribution network
2. Consistent cash flow generation
3. Dividend aristocrat status with 60+ years of increases
4. Defensive characteristics during market volatility

## Recommendation
HOLD - Maintain position for dividend income and portfolio stability.');

-- Update the updated_at timestamps to reflect recent activity
UPDATE portfolios SET updated_at = NOW() WHERE id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');
UPDATE positions SET updated_at = NOW() WHERE portfolio_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003');

-- Verify data insertion with summary queries
-- (These are comments for reference, not executed)
-- SELECT p.name, COUNT(pos.id) as position_count FROM portfolios p LEFT JOIN positions pos ON p.id = pos.portfolio_id GROUP BY p.id, p.name;
-- SELECT c.name, c.strategy FROM checklists c;
-- SELECT pos.ticker, pcr.results_json->>'recommendation' as recommendation FROM positions pos JOIN position_checklist_results pcr ON pos.id = pcr.position_id;