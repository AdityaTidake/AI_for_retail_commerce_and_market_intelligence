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
- Groq API powered chat assistant (LLaMA models)
- Floating robot button accessible from all pages
- Context-aware responses using live business data
- Voice input support (Web Speech API)
- Suggested question chips for quick queries
- Glassmorphism design with smooth animations
- Actionable recommendations
- Natural language business queries

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- Pandas & NumPy (data processing)
- HuggingFace Transformers (NLP)
- Groq API (chat copilot with LLaMA models)
- Uvicorn (ASGI server)

**Frontend:**
- React 18 (UI framework)
- TailwindCSS (styling)
- Recharts (data visualization)
- Axios (HTTP client)
- Vite (build tool)
- Web Speech API (voice input)

**Data:**
- CSV datasets (sales, inventory, reviews, pricing)

## 📦 Installation

### Prerequisites
- Python 3.11+ (Python 3.13 recommended)
- Node.js 16+
- Groq API key (free at https://console.groq.com)

### Backend Setup

1. Install Python dependencies:
```powershell
pip install -r requirements.txt
```

For Windows with Python 3.13, the requirements.txt has been updated with compatible versions.

2. Create `.env` file:
```powershell
copy .env.example .env
```

3. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_api_key_here
```

4. Run the backend server:
```powershell
python -m backend.main
```

Or use the batch file:
```powershell
.\start_backend.bat
```

Backend will run on `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

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

Or use the batch file from project root:
```powershell
.\start_frontend.bat
```

Frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Start Backend**: Run `.\start_backend.bat` or `python -m backend.main` from project root
2. **Start Frontend**: Run `.\start_frontend.bat` or `npm run dev` from `frontend/` directory
3. **Access Dashboard**: Open `http://localhost:3000` in your browser
4. **Explore Features**:
   - Overview: See key metrics and alerts
   - Forecasting: View demand predictions
   - Inventory: Check stock alerts
   - Customer Insights: Analyze sentiment
   - **Floating AI Copilot**: Click the robot button (🤖) at bottom-right to chat
5. **Try Voice Input**: Click the microphone button in the chat to speak your questions
6. **Use Suggested Questions**: Click any suggestion chip for quick queries

## 📊 Sample Questions for AI Copilot

Try these questions with the floating AI Copilot (click the 🤖 button):

- "What are the sales trends?"
- "Which products need restocking?"
- "Show pricing recommendations"
- "What is customer sentiment?"
- "Top performing products?"
- "Generate sales forecast"
- "What should I restock this week?"
- "Summarize customer complaints"
- "Why are sales dropping for USB-C Cable?"
- "Which product has the best customer satisfaction?"

You can also use voice input by clicking the microphone button!

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
│   │   ├── components/
│   │   │   └── FloatingCopilot.jsx  # Global AI chat widget
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
├── requirements-windows.txt # Windows-specific versions
├── requirements-py313.txt   # Python 3.13 compatible versions
├── start_backend.bat        # Windows backend launcher
├── start_frontend.bat       # Windows frontend launcher
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
- Floating robot button (bottom-right corner)
- Slide-in chat panel with glassmorphism design
- Welcome message and suggested question chips
- Voice input support
- Typing animation indicator

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
4. Verify Groq API key is configured in `.env`
5. For Python 3.13 on Windows, use the updated `requirements.txt`

## 🎉 Demo Tips

1. **Start with Overview**: Show the dashboard with all metrics
2. **Highlight Forecasting**: Demonstrate demand predictions
3. **Show Inventory Alerts**: Explain risk-based recommendations
4. **Present Sentiment**: Show NLP-powered insights
5. **Finale with Floating AI Copilot**: 
   - Click the robot button at bottom-right
   - Try suggested question chips
   - Demonstrate voice input
   - Show intelligent, context-aware responses


