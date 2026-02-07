from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.forecasting import get_demand_forecast
from backend.sentiment import analyze_sentiment
from backend.recommendations import get_stock_alerts, get_pricing_suggestions
from backend.chat_copilot import chat_with_copilot

app = FastAPI(title="MarketMind AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {
        "message": "MarketMind AI - Retail Intelligence API",
        "version": "1.0.0",
        "endpoints": [
            "/forecast",
            "/stock-alerts",
            "/sentiment",
            "/pricing-suggestions",
            "/chat"
        ]
    }

@app.get("/forecast")
def get_forecast():
    """Get 7-day demand forecast"""
    try:
        result = get_demand_forecast()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stock-alerts")
def get_alerts():
    """Get inventory alerts and reorder recommendations"""
    try:
        result = get_stock_alerts()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sentiment")
def get_sentiment():
    """Get customer sentiment analysis"""
    try:
        result = analyze_sentiment()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pricing-suggestions")
def get_pricing():
    """Get pricing recommendations"""
    try:
        result = get_pricing_suggestions()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat(request: ChatRequest):
    """AI Copilot chat endpoint"""
    try:
        result = chat_with_copilot(request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
