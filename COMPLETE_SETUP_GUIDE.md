# 🚀 MarketMind AI - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Verification](#verification)
6. [First Use](#first-use)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

#### 1. Python 3.8 or higher
**Check if installed:**
```bash
python --version
```

**If not installed:**
- Windows: Download from https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

#### 2. Node.js 16 or higher
**Check if installed:**
```bash
node --version
npm --version
```

**If not installed:**
- Download from https://nodejs.org/
- Choose LTS (Long Term Support) version

#### 3. OpenAI API Key
**Get your key:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy and save it securely

**Note:** You'll need credits in your OpenAI account for the chat copilot to work.

---

## Installation

### Step 1: Navigate to Project Directory
```bash
cd path/to/marketmind-ai
```

### Step 2: Install Backend Dependencies

```bash
# Install Python packages
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.109.0 uvicorn-0.27.0 pandas-2.1.4 ...
```

**If you see errors:**
- Try: `pip install --upgrade pip`
- Then retry: `pip install -r requirements.txt`

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Return to project root
cd ..
```

**Expected output:**
```
added 234 packages in 45s
```

**If you see errors:**
- Try: `npm install --legacy-peer-deps`

---

## Configuration

### Step 1: Create Environment File

```bash
# Windows
copy .env.example .env

# Or manually create .env file
```

### Step 2: Add OpenAI API Key

Open `.env` file in a text editor and add your key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:**
- Replace `sk-your-actual-api-key-here` with your real key
- Don't add quotes around the key
- Don't commit this file to Git (it's in .gitignore)

### Step 3: Verify Setup

```bash
python verify_setup.py
```

**Expected output:**
```
✅ Python version: 3.9.0
✅ fastapi installed
✅ pandas installed
...
🎉 All checks passed!
```

---

## Running the Application

### Method 1: Using Batch Scripts (Windows - Recommended)

**Terminal 1 - Backend:**
```bash
start_backend.bat
```

**Terminal 2 - Frontend:**
```bash
start_frontend.bat
```

### Method 2: Manual Start

**Terminal 1 - Backend:**
```bash
python -m backend.main
```

**Expected output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.0.11  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Important Notes:
- Keep both terminals open while using the app
- Backend must start first
- Frontend will automatically proxy API calls to backend

---

## Verification

### Step 1: Check Backend
Open browser and go to:
```
http://localhost:8000
```

**Expected:** JSON response with API info

**Also check API docs:**
```
http://localhost:8000/docs
```

**Expected:** Interactive API documentation

### Step 2: Check Frontend
Open browser and go to:
```
http://localhost:3000
```

**Expected:** MarketMind AI dashboard loads

### Step 3: Test Features

#### Test 1: Overview Page
- Should show 4 metric cards
- Should display alerts
- Should show trending products

#### Test 2: Forecasting
- Click "Forecasting" tab
- Should show line chart
- Try selecting different products

#### Test 3: Inventory
- Click "Inventory" tab
- Should show stock alerts table
- Try filtering by risk level

#### Test 4: Customer Insights
- Click "Customer Insights" tab
- Should show pie chart and bar chart
- Should display product sentiment

#### Test 5: AI Copilot
- Click "AI Copilot" tab
- Type: "What should I restock this week?"
- Should get AI response (takes 2-5 seconds)

---

## First Use

### Recommended Demo Flow

1. **Start at Overview**
   - Familiarize yourself with the dashboard
   - Note the key metrics and alerts

2. **Explore Forecasting**
   - See demand predictions
   - Switch between products
   - Note rising products

3. **Check Inventory**
   - Review stock alerts
   - Filter by risk level
   - Note reorder recommendations

4. **Analyze Sentiment**
   - View sentiment distribution
   - Check top issues
   - Review product-level sentiment

5. **Try AI Copilot**
   - Ask suggested questions
   - Try custom questions
   - Note action items in responses

### Sample Questions for AI Copilot

```
"What should I restock this week?"
"Which products are trending?"
"Summarize customer complaints"
"What are the pricing recommendations?"
"Show me inventory risks"
"Why are customers unhappy with USB-C Cable?"
"Which product has the best reviews?"
```

---

## Troubleshooting

### Backend Won't Start

**Issue:** "ModuleNotFoundError"
```bash
# Solution:
pip install -r requirements.txt
```

**Issue:** "Port 8000 already in use"
```bash
# Solution: Kill the process or change port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Issue:** "OPENAI_API_KEY not found"
```bash
# Solution: Check .env file exists and has your key
type .env
```

### Frontend Won't Start

**Issue:** "npm: command not found"
```bash
# Solution: Install Node.js from nodejs.org
```

**Issue:** "npm install fails"
```bash
# Solution:
cd frontend
npm install --legacy-peer-deps
```

**Issue:** "Port 3000 already in use"
```bash
# Solution: Vite will prompt for alternative port
# Or kill the process using port 3000
```

### Application Issues

**Issue:** "Failed to fetch" in browser
```bash
# Solution: Make sure backend is running
# Check http://localhost:8000 works
```

**Issue:** Charts not showing
```bash
# Solution: Check browser console for errors
# Press F12 to open DevTools
```

**Issue:** Chat copilot errors
```bash
# Solution: Verify OpenAI API key is correct
# Check you have credits in OpenAI account
```

### Quick Diagnostic

Run this command to check everything:
```bash
python verify_setup.py
```

### Still Having Issues?

1. Check TROUBLESHOOTING.md for detailed solutions
2. Restart both backend and frontend
3. Clear browser cache
4. Try in incognito/private browser window

---

## Performance Notes

### First Time Usage
- **Sentiment analysis**: First call takes 1-2 minutes (downloading model)
- **Subsequent calls**: Fast (<1 second)
- **Chat responses**: 2-5 seconds (OpenAI API)

### Optimization Tips
- Keep terminals open during demo
- Test all features before presenting
- Have backup screenshots ready
- Clear browser cache if things seem slow

---

## File Structure Reference

```
marketmind-ai/
├── backend/              # Python backend
│   ├── main.py          # API routes
│   ├── forecasting.py   # Demand forecasting
│   ├── sentiment.py     # Sentiment analysis
│   ├── recommendations.py  # Inventory & pricing
│   └── chat_copilot.py  # AI chat
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main app
│   │   └── main.jsx    # Entry point
│   └── package.json    # Dependencies
│
├── data/               # CSV datasets
│   ├── sales.csv
│   ├── inventory.csv
│   ├── reviews.csv
│   └── pricing.csv
│
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (create this)
└── README.md          # Documentation
```

---

## Quick Reference

### Start Commands
```bash
# Backend
python -m backend.main

# Frontend
cd frontend
npm run dev
```

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Stop Commands
- Press `Ctrl+C` in each terminal

---

## Next Steps

After successful setup:

1. ✅ Read HACKATHON_DEMO.md for demo tips
2. ✅ Review PROJECT_SUMMARY.md for overview
3. ✅ Check ARCHITECTURE_DIAGRAM.md for system design
4. ✅ Practice your demo presentation
5. ✅ Prepare for Q&A using provided docs

---

## Success Checklist

Before your demo:
- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] All 5 pages accessible
- [ ] Charts rendering correctly
- [ ] AI Copilot responding
- [ ] No errors in browser console
- [ ] Tested all features
- [ ] Prepared demo script
- [ ] Ready to present!

---

## Support Resources

| Issue | Resource |
|-------|----------|
| Setup problems | QUICKSTART.md |
| Errors | TROUBLESHOOTING.md |
| Architecture | ARCHITECTURE_DIAGRAM.md |
| Features | requirements.md |
| Demo prep | HACKATHON_DEMO.md |

---

## 🎉 You're Ready!

If you've completed all steps and all checks pass, you're ready to demo MarketMind AI!

**Final Test:**
1. Open http://localhost:3000
2. Navigate through all 5 pages
3. Ask the AI Copilot a question
4. If everything works → You're good to go! 🚀

**Good luck with your hackathon! 🏆**

---

*For detailed troubleshooting, see TROUBLESHOOTING.md*
*For demo tips, see HACKATHON_DEMO.md*
