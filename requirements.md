# MarketMind AI - Project Requirements

## Overview
MarketMind AI is an AI-powered retail intelligence copilot designed to enhance decision-making, efficiency, and user experience in retail, commerce, and marketplace ecosystems.

## Core Features

### 1. Demand Forecasting Module
- **Input**: Historical sales data (date, product, units_sold)
- **Output**: 7-day demand forecast for all products
- **Algorithm**: Simple Moving Average with trend analysis
- **Visualization**: Line charts showing forecasted demand
- **Alerts**: Automatic detection of demand spikes for trending products

**API Endpoint**: `GET /forecast`
- Returns forecast values for next 7 days
- Lists top rising products with growth rates
- Provides demand spike alerts

### 2. Inventory Optimization & Stock Alerts
- **Input**: Inventory dataset (product, stock_left) + demand forecasts
- **Logic**: 
  - HIGH risk: stock < 50% of forecasted demand
  - MEDIUM risk: stock < forecasted demand
  - LOW risk: stock >= forecasted demand
- **Output**: 
  - Products needing reorder
  - Suggested reorder quantities
  - Days until stockout

**API Endpoint**: `GET /stock-alerts`
- Returns alerts with risk levels
- Provides reorder recommendations
- Calculates days until stockout

### 3. Customer Review Sentiment Intelligence
- **Input**: Reviews dataset (product, review_text)
- **NLP Engine**: HuggingFace DistilBERT sentiment analysis
- **Output**:
  - Positive/negative sentiment breakdown
  - Top complaint themes (delivery, packaging, quality, price)
  - Product-wise sentiment analysis
  - Sample reviews with sentiment labels

**API Endpoint**: `GET /sentiment`
- Returns overall sentiment summary
- Identifies common customer issues
- Provides product-level sentiment breakdown

### 4. Pricing Intelligence Recommendation Engine
- **Input**: Pricing dataset (product, current_price, competitor_price) + demand data
- **Logic** (Rule-based):
  - If competitor price < current price → suggest discount
  - If demand high (>50 units/day) → suggest price increase
  - If priced below market → suggest margin improvement
- **Output**: Pricing suggestions with reasoning

**API Endpoint**: `GET /pricing-suggestions`
- Returns suggested prices for each product
- Provides reasoning for recommendations
- Calculates potential price change percentage

### 5. AI Retail Copilot Chat Assistant
- **Input**: Natural language questions from retail managers
- **AI Engine**: Groq API with LLaMA models for fast inference
- **Context**: Integrates data from forecast, inventory, sentiment, and pricing modules
- **Output**: 
  - Intelligent answers based on business data
  - Actionable recommendations
  - Context metadata showing data sources used
- **UI Features**:
  - Floating robot button at bottom-right corner
  - Slide-in chat panel with glassmorphism design
  - Welcome message with suggested question chips
  - Voice input support (Web Speech API)
  - Typing indicator animation
  - Auto-scroll chat messages

**API Endpoint**: `POST /chat`
- Request: `{question: "..."}`
- Response: `{answer: "...", action_items: [...], context_used: {...}}`

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Data Processing**: Pandas, NumPy
- **Forecasting**: Simple Moving Average algorithm
- **NLP**: HuggingFace Transformers (DistilBERT)
- **AI Chat**: Groq API (LLaMA models)
- **Server**: Uvicorn ASGI server

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Data
- **Format**: CSV files
- **Datasets**:
  - `sales.csv`: Historical sales data
  - `inventory.csv`: Current stock levels
  - `reviews.csv`: Customer reviews
  - `pricing.csv`: Current and competitor pricing

## Frontend Pages

### 1. Overview Dashboard
- Total sales summary
- Key alerts (stockout risks, demand spikes)
- Critical inventory alerts
- Top customer issues
- Trending products

### 2. Forecasting Tab
- Interactive line chart of 7-day forecast
- Product selector dropdown
- Table of rising products with growth rates
- Forecast insights and alerts

### 3. Inventory Tab
- Stock alert summary cards
- Filterable table (ALL, HIGH, MEDIUM, LOW risk)
- Reorder recommendations
- Days until stockout calculations

### 4. Customer Insights Tab
- Sentiment distribution pie chart
- Top issues bar chart
- Product-wise sentiment breakdown
- Recent reviews with sentiment labels

### 5. Floating AI Copilot (Global)
- Circular floating robot button (bottom-right)
- Glassmorphism slide-in chat panel
- Welcome message with 6 suggested question chips:
  - 📈 What are the sales trends?
  - 📦 Which products need restocking?
  - 💰 Show pricing recommendations
  - 💬 What is customer sentiment?
  - 🎯 Top performing products?
  - 📊 Generate sales forecast
- Text input with send button
- Voice input support (microphone button)
- Typing indicator animation
- Auto-scroll chat messages
- Close button to hide panel

## Design Principles
- Clean, modern retail analytics theme
- Card-based layout for information hierarchy
- Color-coded risk levels (red=high, yellow=medium, green=low)
- Responsive design for desktop and tablet
- Professional color palette with blue primary theme

## Setup Requirements

### Backend Setup
1. Install Python 3.11+ (Python 3.13 recommended for latest features)
2. Install dependencies: `pip install -r requirements.txt`
   - For Windows with Python 3.13: Uses updated package versions
   - Prophet dependency removed (not used in code)
3. Create `.env` file with `GROQ_API_KEY`
4. Run server: `python -m backend.main` or `.\start_backend.bat`
5. Backend runs on: `http://localhost:8000`
6. API docs available at: `http://localhost:8000/docs`

### Frontend Setup
1. Install Node.js 16+
2. Navigate to frontend folder: `cd frontend`
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev` or use `.\start_frontend.bat` from root
5. Access at `http://localhost:3000`

## API Configuration
- Backend runs on: `http://localhost:8000`
- Frontend proxies `/api` requests to backend
- CORS enabled for development

## Success Metrics
- All 5 core features fully functional
- Clean, intuitive UI/UX
- Fast response times (<2s for API calls)
- Accurate sentiment analysis (>80%)
- Actionable business insights
- Demo-ready for hackathon presentation
