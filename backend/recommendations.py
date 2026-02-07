import pandas as pd
from backend.forecasting import get_product_forecast_summary

def load_inventory_data():
    """Load inventory from CSV"""
    return pd.read_csv('data/inventory.csv')

def load_pricing_data():
    """Load pricing data from CSV"""
    return pd.read_csv('data/pricing.csv')

def get_stock_alerts():
    """Generate inventory alerts and reorder recommendations"""
    inventory_df = load_inventory_data()
    forecast_summary = get_product_forecast_summary()
    
    alerts = []
    for forecast in forecast_summary:
        product = forecast['product']
        forecasted_demand = forecast['next_7_days_demand']
        
        inventory_row = inventory_df[inventory_df['product'] == product]
        if inventory_row.empty:
            continue
        
        stock_left = inventory_row.iloc[0]['stock_left']
        
        # Calculate risk level
        if stock_left < forecasted_demand * 0.5:
            risk_level = 'HIGH'
            reorder_qty = forecasted_demand * 2
        elif stock_left < forecasted_demand:
            risk_level = 'MEDIUM'
            reorder_qty = forecasted_demand
        else:
            risk_level = 'LOW'
            reorder_qty = 0
        
        alerts.append({
            'product': product,
            'stock_left': int(stock_left),
            'forecasted_demand_7d': forecasted_demand,
            'risk_level': risk_level,
            'reorder_qty': int(reorder_qty),
            'days_until_stockout': int(stock_left / forecast['daily_avg']) if forecast['daily_avg'] > 0 else 999
        })
    
    # Sort by risk level
    risk_order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}
    alerts.sort(key=lambda x: risk_order[x['risk_level']])
    
    return {
        'alerts': alerts,
        'critical_count': sum(1 for a in alerts if a['risk_level'] == 'HIGH'),
        'warning_count': sum(1 for a in alerts if a['risk_level'] == 'MEDIUM')
    }

def get_pricing_suggestions():
    """Generate pricing recommendations"""
    pricing_df = load_pricing_data()
    forecast_summary = get_product_forecast_summary()
    
    suggestions = []
    for _, row in pricing_df.iterrows():
        product = row['product']
        current_price = row['current_price']
        competitor_price = row['competitor_price']
        
        # Find demand trend
        forecast = next((f for f in forecast_summary if f['product'] == product), None)
        
        reason = ""
        suggested_price = current_price
        
        # Rule-based pricing logic
        if competitor_price < current_price * 0.95:
            suggested_price = competitor_price - 0.01
            reason = "Competitor pricing lower - suggest discount to stay competitive"
        elif forecast and forecast['daily_avg'] > 50:
            suggested_price = current_price * 1.05
            reason = "High demand detected - opportunity for price increase"
        elif competitor_price > current_price * 1.1:
            suggested_price = current_price * 1.08
            reason = "Priced below market - room for margin improvement"
        else:
            reason = "Current pricing is optimal"
        
        suggestions.append({
            'product': product,
            'current_price': round(current_price, 2),
            'competitor_price': round(competitor_price, 2),
            'suggested_price': round(suggested_price, 2),
            'potential_change': round(((suggested_price - current_price) / current_price * 100), 2),
            'reason': reason
        })
    
    return {'suggestions': suggestions}
