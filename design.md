# MarketMind AI - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Overview │Forecast  │Inventory │ Insights │ Floating │  │
│  │          │          │          │          │ Copilot  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                         │                                    │
│                    Axios HTTP Client                         │
└─────────────────────────┼───────────────────────────────────┘
                          │
                    REST API (JSON)
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              main.py (API Routes)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│         │           │           │           │                │
│    ┌────▼───┐  ┌───▼────┐  ┌──▼─────┐  ┌──▼──────┐        │
│    │Forecast│  │Sentiment│  │Recom-  │  │Chat     │        │
│    │Module  │  │Module   │  │mendation│  │Copilot │        │
│    └────┬───┘  └───┬────┘  └──┬─────┘  └──┬──────┘        │
│         │          │           │            │                │
└─────────┼──────────┼───────────┼────────────┼───────────────┘
          │          │           │            │
     ┌────▼──────────▼───────────▼────────────▼────┐
     │         Data Layer (CSV Files)               │
     │  sales.csv | inventory.csv | reviews.csv    │
     │              pricing.csv                     │
     └──────────────────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │ External  │
                    │ Services  │
                    │ (Groq API)│
                    └───────────┘
```

## Module Design

### 1. Forecasting Module (`backend/forecasting.py`)

**Purpose**: Predict future demand using historical sales data

**Algorithm**: Simple Moving Average with Trend Analysis
- Calculate 7-day moving average of recent sales
- Detect trend by comparing recent vs older averages
- Project forward 7 days with trend adjustment

**Functions**:
- `load_sales_data()`: Load and parse CSV data
- `simple_moving_average_forecast(df, product, days=7)`: Generate forecast
- `get_demand_forecast()`: Main API function returning all forecasts
- `get_product_forecast_summary()`: Summary for other modules

**Output**:
```json
{
  "forecasts": [
    {"date": "2024-01-15", "product": "Laptop Pro", "forecasted_units": 95}
  ],
  "rising_products": [
    {"product": "Laptop Pro", "growth_rate": 45.2, "avg_daily_demand": 90}
  ],
  "alerts": ["Demand spike expected for Laptop Pro"]
}
```

### 2. Sentiment Analysis Module (`backend/sentiment.py`)

**Purpose**: Analyze customer reviews to extract sentiment and issues

**NLP Model**: DistilBERT (distilbert-base-uncased-finetuned-sst-2-english)
- Pre-trained sentiment classifier
- Fast inference suitable for hackathon
- Lazy loading for performance

**Issue Detection**: Keyword-based extraction
- Delivery issues: "delivery", "shipping", "late", "delayed"
- Packaging issues: "packaging", "damaged", "broken"
- Quality issues: "quality", "broke", "stopped working"
- Price issues: "overpriced", "expensive"

**Functions**:
- `get_sentiment_analyzer()`: Lazy load HuggingFace model
- `load_reviews_data()`: Load CSV reviews
- `analyze_sentiment()`: Main API function

**Output**:
```json
{
  "overall_sentiment": {
    "positive": 18,
    "negative": 7,
    "total_reviews": 25
  },
  "top_issues": [
    {"issue": "delivery", "count": 4, "percentage": 57.1}
  ],
  "product_sentiment": {
    "Laptop Pro": {"positive": 5, "negative": 1, "positive_rate": 83.3}
  }
}
```

### 3. Recommendations Module (`backend/recommendations.py`)

**Purpose**: Generate inventory and pricing recommendations

#### Inventory Alerts Logic:
```python
if stock_left < forecasted_demand * 0.5:
    risk_level = 'HIGH'
    reorder_qty = forecasted_demand * 2
elif stock_left < forecasted_demand:
    risk_level = 'MEDIUM'
    reorder_qty = forecasted_demand
else:
    risk_level = 'LOW'
    reorder_qty = 0
```

#### Pricing Logic:
```python
if competitor_price < current_price * 0.95:
    suggest_discount()
elif high_demand (>50 units/day):
    suggest_price_increase()
elif competitor_price > current_price * 1.1:
    suggest_margin_improvement()
```

**Functions**:
- `get_stock_alerts()`: Inventory risk analysis
- `get_pricing_suggestions()`: Pricing recommendations

### 4. Chat Copilot Module (`backend/chat_copilot.py`)

**Purpose**: AI assistant for retail decision-making

**Architecture**:
1. Gather business context from all modules
2. Build context summary for LLM
3. Send user question + context to Groq API
4. Extract action items from response
5. Return answer with metadata

**AI Engine**: Groq API with LLaMA models
- Fast inference for real-time chat
- Cost-effective alternative to OpenAI
- High-quality responses for business queries

**Context Grounding**:
```python
context_summary = f"""
You are MarketMind AI, a retail intelligence assistant.

DEMAND FORECAST: {forecast_data}
INVENTORY STATUS: {stock_data}
CUSTOMER SENTIMENT: {sentiment_data}
PRICING INSIGHTS: {pricing_data}

Answer with specific data and actionable recommendations.
"""
```

**Functions**:
- `get_business_context()`: Aggregate all module data
- `chat_with_copilot(question)`: Main chat function

## Frontend Architecture

### Component Hierarchy
```
App
├── Navigation
├── FloatingCopilot (Global Component)
└── Routes
    ├── Overview
    ├── Forecasting
    ├── Inventory
    └── CustomerInsights
```

### Floating AI Copilot Component
**Location**: `frontend/src/components/FloatingCopilot.jsx`

**Features**:
- Circular floating button at bottom-right corner
- Robot emoji icon (🤖)
- Glassmorphism design with gradient background
- Smooth slide-in animation from right
- Pulsing animation when closed
- Available on all pages

**Chat Panel UI**:
- Header with "AI Copilot Assistant" title
- Welcome message: "Hello! How can I assist you today?"
- 6 suggested question chips with icons:
  - 📈 What are the sales trends?
  - 📦 Which products need restocking?
  - 💰 Show pricing recommendations
  - 💬 What is customer sentiment?
  - 🎯 Top performing products?
  - 📊 Generate sales forecast
- Chat messages area with auto-scroll
- Text input field with send button
- Voice input button (Web Speech API)
- Typing indicator (animated dots)
- Close button (X) to hide panel

**Interactions**:
- Click robot button to open/close panel
- Click suggestion chip to populate input
- Type message and press Enter or click send
- Click microphone for voice input
- Voice input turns red and pulses while listening

### State Management
- Local component state using React hooks
- No global state management (suitable for MVP)
- API calls with Axios
- Loading states for async operations

### Styling System
- TailwindCSS utility classes
- Custom color palette:
  - Primary: Blue (#3b82f6)
  - Success: Green (#10b981)
  - Warning: Yellow (#f59e0b)
  - Danger: Red (#ef4444)

### Chart Components (Recharts)
- LineChart: Demand forecasting trends
- PieChart: Sentiment distribution
- BarChart: Customer issues frequency

## Data Flow

### Typical Request Flow:
1. User interacts with frontend component
2. Component calls API via Axios
3. FastAPI route receives request
4. Module loads CSV data
5. Module processes data (forecast/sentiment/etc.)
6. JSON response sent to frontend
7. Component updates state and re-renders
8. Charts/tables display updated data

### Chat Copilot Flow:
1. User clicks floating robot button
2. Chat panel slides in from right
3. User sees welcome message and suggested questions
4. User clicks suggestion chip or types/speaks question
5. POST request to `/chat` endpoint
6. Backend gathers context from all modules
7. Context + question sent to Groq API
8. LLaMA model generates contextual answer
9. Action items extracted via keyword matching
10. Response with answer + actions returned
11. Chat UI displays message with typing animation
12. Messages auto-scroll to bottom

## Performance Considerations

### Backend Optimizations:
- Lazy loading of ML models (sentiment analyzer)
- CSV caching in memory (for production, use database)
- Simple algorithms for fast computation
- Async FastAPI for concurrent requests

### Frontend Optimizations:
- Code splitting with React Router
- Lazy loading of chart libraries
- Debounced API calls where applicable
- Responsive design for mobile/tablet

## Security Considerations

### API Security:
- CORS configured for development
- Environment variables for API keys
- Input validation on all endpoints
- Error handling without exposing internals

### Data Privacy:
- Sample data only (no real customer data)
- API keys stored in `.env` (not committed)
- No authentication (MVP scope)

## Deployment Architecture (Production)

```
Frontend (Vercel/Netlify)
    ↓
Backend (Railway/Render)
    ↓
Database (PostgreSQL)
    ↓
External APIs (OpenAI)
```

## Future Enhancements

1. **Database Integration**: Replace CSV with PostgreSQL/MongoDB
2. **Authentication**: Add user login and role-based access
3. **Real-time Updates**: WebSocket for live data streaming
4. **Advanced Forecasting**: Prophet or ARIMA models
5. **Multi-tenant**: Support multiple retail businesses
6. **Export Features**: PDF reports, Excel exports
7. **Email Alerts**: Automated notifications for critical alerts
8. **Mobile App**: React Native companion app
9. **A/B Testing**: Pricing experiment framework
10. **Advanced Analytics**: Cohort analysis, customer lifetime value

## Development Workflow

1. **Backend Development**:
   - Create module in `backend/`
   - Add route in `main.py`
   - Test with curl/Postman
   - Document in this file

2. **Frontend Development**:
   - Create page component in `frontend/src/pages/`
   - Add route in `App.jsx`
   - Style with TailwindCSS
   - Test in browser

3. **Integration Testing**:
   - Start backend server
   - Start frontend dev server
   - Test full user flow
   - Fix bugs and iterate

## File Structure

```
marketmind-ai/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI app & routes
│   ├── forecasting.py       # Demand forecasting
│   ├── sentiment.py         # Sentiment analysis
│   ├── recommendations.py   # Inventory & pricing
│   └── chat_copilot.py      # AI chat assistant
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── FloatingCopilot.jsx  # Global AI chat
│   │   ├── pages/
│   │   │   ├── Overview.jsx
│   │   │   ├── Forecasting.jsx
│   │   │   ├── Inventory.jsx
│   │   │   └── CustomerInsights.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── data/
│   ├── sales.csv
│   ├── inventory.csv
│   ├── reviews.csv
│   └── pricing.csv
├── requirements.txt
├── requirements-windows.txt
├── requirements-py313.txt
├── .env.example
├── .gitignore
├── requirements.md
├── design.md
├── start_backend.bat
├── start_frontend.bat
└── README.md
```
