import os
from groq import Groq
from dotenv import load_dotenv
from backend.forecasting import get_demand_forecast
from backend.sentiment import analyze_sentiment
from backend.recommendations import get_stock_alerts, get_pricing_suggestions
import json

load_dotenv()

client = None

def get_groq_client():
    """Initialize Groq client"""
    global client
    if client is None:
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        client = Groq(api_key=api_key)
    return client

def get_business_context():
    """Gather all business intelligence data"""
    try:
        forecast_data = get_demand_forecast()
        stock_data = get_stock_alerts()
        sentiment_data = analyze_sentiment()
        pricing_data = get_pricing_suggestions()
        
        context = {
            'forecast': forecast_data,
            'inventory': stock_data,
            'sentiment': sentiment_data,
            'pricing': pricing_data
        }
        
        return context
    except Exception as e:
        return {'error': str(e)}

def chat_with_copilot(question: str):
    """AI copilot chat interface"""
    try:
        # Get business context
        context = get_business_context()
        
        if 'error' in context:
            return {
                'answer': f"I'm having trouble accessing the data: {context['error']}",
                'action_items': []
            }
        
        # Build context summary for LLM
        context_summary = f"""
You are MarketMind AI, a retail intelligence assistant. Answer questions using the following business data:

DEMAND FORECAST:
- Rising products: {', '.join([f"{p['product']} (+{p['growth_rate']}%)" for p in context['forecast']['rising_products']])}
- Alerts: {', '.join(context['forecast']['alerts'])}

INVENTORY STATUS:
- Critical stock alerts: {context['inventory']['critical_count']} products
- Warning alerts: {context['inventory']['warning_count']} products
- High-risk products: {', '.join([a['product'] for a in context['inventory']['alerts'] if a['risk_level'] == 'HIGH'])}

CUSTOMER SENTIMENT:
- Positive reviews: {context['sentiment']['overall_sentiment']['positive']}
- Negative reviews: {context['sentiment']['overall_sentiment']['negative']}
- Top issues: {', '.join([f"{i['issue']} ({i['count']} mentions)" for i in context['sentiment']['top_issues']])}

PRICING INSIGHTS:
- Products needing price adjustment: {len([s for s in context['pricing']['suggestions'] if s['potential_change'] != 0])}

Answer the user's question with specific data and actionable recommendations.
"""
        
        # Call Groq API
        ai_client = get_groq_client()
        response = ai_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Latest Groq model (updated)
            messages=[
                {"role": "system", "content": context_summary},
                {"role": "user", "content": question}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content
        
        # Extract action items (simple keyword matching)
        action_items = []
        if any(word in question.lower() for word in ['restock', 'inventory', 'stock']):
            high_risk = [a for a in context['inventory']['alerts'] if a['risk_level'] == 'HIGH']
            action_items = [f"Reorder {a['reorder_qty']} units of {a['product']}" for a in high_risk[:3]]
        
        if any(word in question.lower() for word in ['complaint', 'issue', 'problem']):
            action_items.extend([f"Address {i['issue']} issues" for i in context['sentiment']['top_issues'][:2]])
        
        return {
            'answer': answer,
            'action_items': action_items,
            'context_used': {
                'forecast_products': len(context['forecast']['rising_products']),
                'inventory_alerts': context['inventory']['critical_count'],
                'reviews_analyzed': context['sentiment']['overall_sentiment']['total_reviews']
            }
        }
    
    except Exception as e:
        return {
            'answer': f"I encountered an error: {str(e)}. Please make sure your GROQ_API_KEY is configured.",
            'action_items': [],
            'error': str(e)
        }
