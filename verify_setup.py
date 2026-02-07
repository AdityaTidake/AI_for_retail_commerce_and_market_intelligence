#!/usr/bin/env python3
"""
MarketMind AI - Setup Verification Script
Run this to verify your environment is ready for the hackathon demo
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print("✅ Python version:", f"{version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print("❌ Python 3.8+ required. Current:", f"{version.major}.{version.minor}.{version.micro}")
        return False

def check_dependencies():
    """Check if required Python packages are installed"""
    required = [
        'fastapi',
        'uvicorn',
        'pandas',
        'numpy',
        'transformers',
        'openai',
        'pydantic'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package)
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} NOT installed")
            missing.append(package)
    
    return len(missing) == 0

def check_data_files():
    """Check if data files exist"""
    data_files = [
        'data/sales.csv',
        'data/inventory.csv',
        'data/reviews.csv',
        'data/pricing.csv'
    ]
    
    all_exist = True
    for file in data_files:
        if Path(file).exists():
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} NOT found")
            all_exist = False
    
    return all_exist

def check_env_file():
    """Check if .env file exists"""
    if Path('.env').exists():
        print("✅ .env file exists")
        
        # Check if API key is set
        with open('.env', 'r') as f:
            content = f.read()
            if 'OPENAI_API_KEY' in content and 'your_openai_api_key_here' not in content:
                print("✅ OpenAI API key appears to be configured")
                return True
            else:
                print("⚠️  OpenAI API key not configured in .env")
                return False
    else:
        print("❌ .env file NOT found")
        print("   Run: copy .env.example .env")
        return False

def check_backend_files():
    """Check if backend files exist"""
    backend_files = [
        'backend/main.py',
        'backend/forecasting.py',
        'backend/sentiment.py',
        'backend/recommendations.py',
        'backend/chat_copilot.py'
    ]
    
    all_exist = True
    for file in backend_files:
        if Path(file).exists():
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} NOT found")
            all_exist = False
    
    return all_exist

def check_frontend_files():
    """Check if frontend files exist"""
    if Path('frontend/package.json').exists():
        print("✅ frontend/package.json exists")
        
        if Path('frontend/node_modules').exists():
            print("✅ node_modules exists (npm install completed)")
            return True
        else:
            print("⚠️  node_modules NOT found")
            print("   Run: cd frontend && npm install")
            return False
    else:
        print("❌ frontend/package.json NOT found")
        return False

def main():
    print("=" * 60)
    print("🧠 MarketMind AI - Setup Verification")
    print("=" * 60)
    print()
    
    checks = {
        "Python Version": check_python_version(),
        "Python Dependencies": check_dependencies(),
        "Data Files": check_data_files(),
        "Environment File": check_env_file(),
        "Backend Files": check_backend_files(),
        "Frontend Setup": check_frontend_files()
    }
    
    print()
    print("=" * 60)
    print("📊 Summary")
    print("=" * 60)
    
    for check_name, passed in checks.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {check_name}")
    
    print()
    
    if all(checks.values()):
        print("🎉 All checks passed! You're ready to run MarketMind AI!")
        print()
        print("Next steps:")
        print("1. Terminal 1: python -m backend.main")
        print("2. Terminal 2: cd frontend && npm run dev")
        print("3. Open: http://localhost:3000")
        return 0
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print()
        print("Quick fixes:")
        print("- Install dependencies: pip install -r requirements.txt")
        print("- Setup frontend: cd frontend && npm install")
        print("- Configure API key: copy .env.example .env (then edit)")
        return 1

if __name__ == "__main__":
    sys.exit(main())
