# 🪟 MarketMind AI - Windows Setup Guide

## Quick Setup for Windows Users

### Step 1: Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment
```powershell
# Create .env file
copy .env.example .env

# Open .env in notepad and add your OpenAI API key
notepad .env
```

Add this line to .env:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 4: Verify Setup
```powershell
python verify_setup.py
```

### Step 5: Start the Application

**Option A: Using Batch Scripts (Easiest)**

Open two PowerShell/CMD windows:

**Window 1 - Backend:**
```powershell
.\start_backend.bat
```

**Window 2 - Frontend:**
```powershell
.\start_frontend.bat
```

**Option B: Manual Start**

**Window 1 - Backend:**
```powershell
python -m backend.main
```

**Window 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Open Browser
```
http://localhost:3000
```

## Common Windows Issues

### Issue: "pip is not recognized"
**Solution:**
```powershell
# Use full Python path
python -m pip install -r requirements.txt
```

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org

### Issue: PowerShell execution policy error
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Port already in use
**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

## Windows-Specific Commands

### Stop Servers
Press `Ctrl+C` in each window

### Check if servers are running
```powershell
# Check backend
curl http://localhost:8000

# Check frontend
curl http://localhost:3000
```

### Clear npm cache (if install fails)
```powershell
cd frontend
npm cache clean --force
npm install
cd ..
```

## Quick Reference

| Task | Command |
|------|---------|
| Install Python deps | `pip install -r requirements.txt` |
| Install frontend deps | `cd frontend ; npm install ; cd ..` |
| Create .env | `copy .env.example .env` |
| Start backend | `python -m backend.main` |
| Start frontend | `cd frontend ; npm run dev` |
| Verify setup | `python verify_setup.py` |

## Success Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] All dependencies installed
- [ ] .env file created with API key
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Browser shows dashboard at localhost:3000

## Need Help?

See TROUBLESHOOTING.md for detailed solutions to common problems.

---

**You're ready to go! 🚀**
