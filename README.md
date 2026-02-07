# 🧠 MarketMind AI - Retail Intelligence Copilot

An AI-powered retail intelligence platform that provides demand forecasting, inventory optimization, customer sentiment analysis, pricing recommendations, and an intelligent chat copilot for data-driven retail decision-making.

## 🎯 Problem Statement
Retail businesses struggle with:
- Unpredictable demand leading to stockouts or overstock
- Manual inventory management causing inefficiencies
- Difficulty understanding customer sentiment at scale
- Suboptimal pricing strategies
- Fragmented data requiring expert analysis

## 💡 Solution
MarketMind AI consolidates retail intelligence into a single dashboard with:
- **Demand Forecasting**: 7-day predictions with trend analysis
- **Inventory Alerts**: Automated stockout risk detection
- **Sentiment Analysis**: NLP-powered customer feedback insights
- **Pricing Intelligence**: Data-driven pricing recommendations
- **AI Copilot**: Natural language interface for business questions

## 🚀 Features

### 1. Demand Forecasting
- Moving average algorithm with trend detection
- 7-day forward predictions
- Automatic spike detection for trending products
- Visual line charts for easy interpretation

### 2. Inventory Management
- Real-time stock risk assessment (HIGH/MEDIUM/LOW)
- Automated reorder quantity calculations
- Days-until-stockout predictions
- Filterable alerts dashboard

### 3. Customer Sentiment Intelligence
- HuggingFace DistilBERT sentiment analysis
- Automatic issue categorization (delivery, quality, packaging, price)
- Product-level sentiment breakdown
- Visual sentiment distribution charts

### 4. Pricing Recommendations
- Competitor price monitoring
- Demand-based pricing suggestions
- Rule-based optimization engine
- Margin improvement opportunities

### 5. AI Retail Copilot
- OpenAI GPT-3.5 powered chat assistant
- Context-aware responses using live business data
- Actionable recommendations
- Natural language business queries

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Pandas & NumPy (data processing)
- HuggingFace Transformers (NLP)
- OpenAI API (chat copilot)
- Uvicorn (ASGI server)

**Frontend:**
- React 18 (UI framework)
- TailwindCSS (styling)
- Recharts (data visualization)
- Axios (HTTP client)
- Vite (build tool)

**Data:**
- CSV datasets (sales, inventory, reviews, pricing)

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. Install Python dependencies:
```powershell
pip install -r requirements.txt
```

2. Create `.env` file:
```powershell
copy .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the backend server:
```powershell
python -m backend.main
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start development server:
```powershell
npm run dev
```

4. Return to root (for other commands):
```powershell
cd ..
```

Frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Start Backend**: Run `python -m backend.main` from project root
2. **Start Frontend**: Run `npm run dev` from `frontend/` directory
3. **Access Dashboard**: Open `http://localhost:3000` in your browser
4. **Explore Features**:
   - Overview: See key metrics and alerts
   - Forecasting: View demand predictions
   - Inventory: Check stock alerts
   - Customer Insights: Analyze sentiment
   - AI Copilot: Ask business questions

## 📊 Sample Questions for AI Copilot

- "What should I restock this week?"
- "Which products are trending?"
- "Summarize customer complaints"
- "What are the pricing recommendations?"
- "Show me inventory risks"
- "Why are sales dropping for USB-C Cable?"
- "Which product has the best customer satisfaction?"

## 📁 Project Structure

```
marketmind-ai/
├── backend/
│   ├── main.py              # FastAPI app & routes
│   ├── forecasting.py       # Demand forecasting logic
│   ├── sentiment.py         # NLP sentiment analysis
│   ├── recommendations.py   # Inventory & pricing logic
│   └── chat_copilot.py      # AI chat assistant
├── frontend/
│   ├── src/
│   │   ├── pages/           # React page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── data/
│   ├── sales.csv            # Historical sales data
│   ├── inventory.csv        # Current stock levels
│   ├── reviews.csv          # Customer reviews
│   └── pricing.csv          # Pricing data
├── requirements.txt         # Python dependencies
├── requirements.md          # Feature requirements
├── design.md               # Architecture documentation
└── README.md               # This file
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/forecast` | GET | Get 7-day demand forecast |
| `/stock-alerts` | GET | Get inventory alerts |
| `/sentiment` | GET | Get sentiment analysis |
| `/pricing-suggestions` | GET | Get pricing recommendations |
| `/chat` | POST | Chat with AI copilot |

## 🎨 UI Screenshots

### Dashboard Overview
- Real-time metrics cards
- Critical alerts feed
- Trending products display
- Top customer issues

### Forecasting Page
- Interactive demand charts
- Product selector
- Growth rate indicators

### Inventory Page
- Risk-level filtering
- Reorder recommendations
- Stockout predictions

### Customer Insights
- Sentiment pie charts
- Issue frequency bars
- Product sentiment breakdown

### AI Copilot
- Chat interface
- Suggested questions
- Action items extraction

## 🚧 Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] User authentication & multi-tenancy
- [ ] Real-time data streaming
- [ ] Advanced forecasting (Prophet, ARIMA)
- [ ] Email alert notifications
- [ ] PDF report generation
- [ ] Mobile app (React Native)
- [ ] A/B testing framework
- [ ] Advanced analytics (cohort analysis, CLV)

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📄 License

MIT License - feel free to use for your hackathon or learning projects

## 🏆 Hackathon Ready

This project is designed to be:
- ✅ Quick to set up (<10 minutes)
- ✅ Easy to demo (5 distinct features)
- ✅ Visually impressive (modern UI)
- ✅ Technically sound (real AI/ML)
- ✅ Practical use case (retail intelligence)

## 💬 Support

For issues or questions:
1. Check `requirements.md` for feature details
2. Check `design.md` for architecture info
3. Ensure all dependencies are installed
4. Verify OpenAI API key is configured

## 🎉 Demo Tips

1. **Start with Overview**: Show the dashboard with all metrics
2. **Highlight Forecasting**: Demonstrate demand predictions
3. **Show Inventory Alerts**: Explain risk-based recommendations
4. **Present Sentiment**: Show NLP-powered insights
5. **Finale with AI Copilot**: Ask impressive questions and show intelligent responses

Good luck with your hackathon! 🚀
