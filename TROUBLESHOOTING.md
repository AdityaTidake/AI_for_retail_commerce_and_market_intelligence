# 🔧 MarketMind AI - Troubleshooting Guide

## Quick Diagnostics

Run this first to check your setup:
```bash
python verify_setup.py
```

## Common Issues & Solutions

### 🐍 Backend Issues

#### Issue: "ModuleNotFoundError: No module named 'fastapi'"
**Cause**: Python dependencies not installed  
**Solution**:
```bash
pip install -r requirements.txt
```

#### Issue: "Address already in use" (Port 8000)
**Cause**: Another process using port 8000  
**Solution**:
```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in backend/main.py:
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

#### Issue: "OPENAI_API_KEY not found"
**Cause**: Environment variable not set  
**Solution**:
```bash
# 1. Create .env file
copy .env.example .env

# 2. Edit .env and add your key:
OPENAI_API_KEY=sk-your-actual-key-here

# 3. Restart backend
```

#### Issue: "FileNotFoundError: data/sales.csv"
**Cause**: Running from wrong directory  
**Solution**:
```bash
# Make sure you're in project root
cd path/to/marketmind-ai
python -m backend.main
```

#### Issue: Sentiment analysis is very slow
**Cause**: First-time model download  
**Solution**: Wait 1-2 minutes for HuggingFace to download DistilBERT model. Subsequent calls will be fast.

#### Issue: "ImportError: cannot import name 'OpenAI'"
**Cause**: Wrong OpenAI package version  
**Solution**:
```bash
pip install --upgrade openai
```

### ⚛️ Frontend Issues

#### Issue: "npm: command not found"
**Cause**: Node.js not installed  
**Solution**: Install Node.js from https://nodejs.org (version 16+)

#### Issue: npm install fails with errors
**Cause**: Dependency conflicts  
**Solution**:
```bash
cd frontend
npm install --legacy-peer-deps
```

#### Issue: "Port 3000 is already in use"
**Cause**: Another app using port 3000  
**Solution**: Vite will automatically prompt for alternative port (e.g., 3001)

#### Issue: Blank page after npm run dev
**Cause**: Build errors or wrong directory  
**Solution**:
```bash
# Check console for errors
# Make sure you're in frontend directory
cd frontend
npm run dev
```

#### Issue: "Failed to fetch" errors in browser
**Cause**: Backend not running  
**Solution**:
```bash
# Start backend first
python -m backend.main

# Then start frontend
cd frontend
npm run dev
```

#### Issue: Charts not rendering
**Cause**: Recharts not installed  
**Solution**:
```bash
cd frontend
npm install recharts
```

### 🔗 Integration Issues

#### Issue: API calls return 404
**Cause**: Backend not running or wrong URL  
**Solution**:
1. Verify backend is running: http://localhost:8000
2. Check API docs: http://localhost:8000/docs
3. Verify proxy in vite.config.js

#### Issue: CORS errors in browser console
**Cause**: CORS misconfiguration  
**Solution**: Check backend/main.py has CORS middleware:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Issue: Chat copilot returns errors
**Cause**: OpenAI API key invalid or quota exceeded  
**Solution**:
1. Verify API key is correct
2. Check OpenAI account has credits
3. Test key at https://platform.openai.com

### 💾 Data Issues

#### Issue: "Empty DataFrame" errors
**Cause**: CSV files corrupted or empty  
**Solution**: Verify CSV files in data/ folder have content

#### Issue: Forecast shows no data
**Cause**: Insufficient historical data  
**Solution**: Ensure sales.csv has at least 7 days of data per product

#### Issue: Sentiment analysis returns no results
**Cause**: reviews.csv empty or malformed  
**Solution**: Check reviews.csv has proper format:
```csv
product,review_text
Product Name,Review text here
```

### 🖥️ Windows-Specific Issues

#### Issue: Python command not found
**Cause**: Python not in PATH  
**Solution**:
```bash
# Use full path
C:\Python39\python.exe -m backend.main

# Or add Python to PATH in System Environment Variables
```

#### Issue: Scripts won't run (.bat files)
**Cause**: Execution policy or wrong directory  
**Solution**:
```bash
# Run from project root
start_backend.bat
start_frontend.bat
```

#### Issue: "python" vs "python3" command
**Cause**: Multiple Python installations  
**Solution**: Use whichever works:
```bash
python --version
python3 --version

# Use the one that shows 3.8+
```

### 🌐 Browser Issues

#### Issue: Page loads but no data
**Cause**: API calls failing silently  
**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

#### Issue: Styles look broken
**Cause**: TailwindCSS not building  
**Solution**:
```bash
cd frontend
npm install tailwindcss postcss autoprefixer
npm run dev
```

#### Issue: Charts show "Loading..." forever
**Cause**: API endpoint returning errors  
**Solution**:
1. Check backend terminal for errors
2. Test endpoint directly: http://localhost:8000/forecast
3. Check browser console for error messages

## 🔍 Debugging Tips

### Backend Debugging
```bash
# Run with verbose output
python -m backend.main

# Test individual endpoints
curl http://localhost:8000/forecast
curl http://localhost:8000/stock-alerts
curl http://localhost:8000/sentiment
```

### Frontend Debugging
```javascript
// Add to browser console
fetch('/api/forecast')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### Check Logs
- **Backend**: Look at terminal running backend
- **Frontend**: Check browser DevTools Console
- **Network**: Check browser DevTools Network tab

## 🚨 Emergency Fixes

### Nuclear Option: Fresh Install
```bash
# Backend
pip uninstall -r requirements.txt -y
pip install -r requirements.txt

# Frontend
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
cd ..
```

### Quick Test
```bash
# Test backend
curl http://localhost:8000

# Test frontend
# Open http://localhost:3000 in browser
```

## 📞 Still Stuck?

### Checklist
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] All dependencies installed
- [ ] .env file created with API key
- [ ] Running from project root
- [ ] Backend started first
- [ ] Frontend started second
- [ ] No port conflicts
- [ ] Firewall not blocking

### Verification Commands
```bash
# Check Python
python --version

# Check Node
node --version
npm --version

# Check project structure
dir

# Check backend
python -c "import fastapi; print('FastAPI OK')"

# Check frontend
cd frontend
npm list react
cd ..
```

### Last Resort
1. Restart computer
2. Fresh clone of project
3. Follow QUICKSTART.md exactly
4. Run verify_setup.py

## 💡 Pro Tips

### Performance
- First sentiment analysis call is slow (model loading)
- Subsequent calls are fast (model cached)
- Chat responses take 2-5 seconds (OpenAI API)

### Development
- Use browser DevTools for debugging
- Check both terminal outputs
- Test API endpoints directly
- Clear browser cache if needed

### Demo Day
- Test everything 30 minutes before
- Have backup screenshots ready
- Keep terminals visible
- Restart if anything seems slow

## 🎯 Quick Reference

### Start Commands
```bash
# Backend
python -m backend.main

# Frontend
cd frontend
npm run dev
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Key Files
- Backend config: backend/main.py
- Frontend config: frontend/vite.config.js
- Environment: .env
- Dependencies: requirements.txt, frontend/package.json

## ✅ Success Indicators

You know it's working when:
- ✅ Backend shows "Uvicorn running on http://0.0.0.0:8000"
- ✅ Frontend shows "Local: http://localhost:3000"
- ✅ Browser loads dashboard with data
- ✅ Charts render correctly
- ✅ Chat copilot responds to questions
- ✅ No errors in browser console

---

*If all else fails, run: `python verify_setup.py`*
