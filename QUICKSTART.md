# 🚀 Quick Start Guide - MarketMind AI

## Prerequisites Check
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] OpenAI API key ready

## Setup (5 minutes)

### Step 1: Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Go back to root
cd ..
```

### Step 3: Start the Application

**Option A: Using Scripts (Windows)**
```bash
# Terminal 1: Start backend
start_backend.bat

# Terminal 2: Start frontend
start_frontend.bat
```

**Option B: Manual Start**
```bash
# Terminal 1: Start backend
python -m backend.main

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Step 4: Access the Application
- Open browser: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## First Time Usage

1. **Overview Page**: See the dashboard with all metrics
2. **Try Forecasting**: Select different products to see demand predictions
3. **Check Inventory**: Filter by risk level (HIGH/MEDIUM/LOW)
4. **View Insights**: Explore customer sentiment analysis
5. **Chat with AI**: Ask questions like:
   - "What should I restock this week?"
   - "Which products are trending?"
   - "Summarize customer complaints"

## Troubleshooting

### Backend Issues
- **Import errors**: Run `pip install -r requirements.txt`
- **Port 8000 in use**: Change port in `backend/main.py`
- **OpenAI errors**: Check your API key in `.env`

### Frontend Issues
- **npm install fails**: Try `npm install --legacy-peer-deps`
- **Port 3000 in use**: Vite will prompt for alternative port
- **API connection fails**: Ensure backend is running on port 8000

### Common Errors
- **"OPENAI_API_KEY not found"**: Add key to `.env` file
- **"Module not found"**: Install missing dependencies
- **CORS errors**: Check backend CORS configuration

## Demo Checklist

Before your hackathon demo:
- [ ] Backend running without errors
- [ ] Frontend loads successfully
- [ ] All 5 pages accessible
- [ ] Charts rendering correctly
- [ ] AI Copilot responding (test with a question)
- [ ] Data showing in all modules

## Quick Test

Run this in your browser console on `http://localhost:3000`:
```javascript
// Test API connection
fetch('/api/forecast')
  .then(r => r.json())
  .then(d => console.log('✅ API Working:', d))
  .catch(e => console.error('❌ API Error:', e))
```

## Performance Tips

- First load may be slow (ML model loading)
- Subsequent requests will be faster
- Chat responses take 2-5 seconds (OpenAI API)
- Keep both terminals open during demo

## Need Help?

1. Check `README.md` for detailed documentation
2. Check `requirements.md` for feature specifications
3. Check `design.md` for architecture details
4. Review error messages in terminal

## Ready to Demo! 🎉

Your MarketMind AI platform is now running and ready to impress!

Key talking points:
- 5 AI-powered features
- Real-time retail intelligence
- Natural language interface
- Production-ready architecture
- Scalable design
