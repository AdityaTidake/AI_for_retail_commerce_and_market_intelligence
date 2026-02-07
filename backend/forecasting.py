import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def load_sales_data():
    """Load sales data from CSV"""
    df = pd.read_csv('data/sales.csv')
    df['date'] = pd.to_datetime(df['date'])
    return df

def simple_moving_average_forecast(df, product, days=7, window=7):
    """Simple moving average forecast for hackathon speed"""
    product_data = df[df['product'] == product].sort_values('date')
    
    if len(product_data) < window:
        return None
    
    recent_avg = product_data['units_sold'].tail(window).mean()
    trend = (product_data['units_sold'].tail(3).mean() - 
             product_data['units_sold'].head(3).mean()) / len(product_data)
    
    forecasts = []
    last_date = product_data['date'].max()
    
    for i in range(1, days + 1):
        forecast_date = last_date + timedelta(days=i)
        forecast_value = recent_avg + (trend * i)
        forecasts.append({
            'date': forecast_date.strftime('%Y-%m-%d'),
            'product': product,
            'forecasted_units': max(0, int(forecast_value))
        })
    
    return forecasts

def get_demand_forecast():
    """Get 7-day forecast for all products"""
    df = load_sales_data()
    products = df['product'].unique()
    
    all_forecasts = []
    rising_products = []
    
    for product in products:
        forecast = simple_moving_average_forecast(df, product)
        if forecast:
            all_forecasts.extend(forecast)
            
            # Calculate growth rate
            product_data = df[df['product'] == product]
            recent_avg = product_data['units_sold'].tail(7).mean()
            older_avg = product_data['units_sold'].head(7).mean()
            growth_rate = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
            
            if growth_rate > 10:
                rising_products.append({
                    'product': product,
                    'growth_rate': round(growth_rate, 2),
                    'avg_daily_demand': int(recent_avg)
                })
    
    rising_products.sort(key=lambda x: x['growth_rate'], reverse=True)
    
    return {
        'forecasts': all_forecasts,
        'rising_products': rising_products[:3],
        'alerts': [f"Demand spike expected for {p['product']}" for p in rising_products[:3]]
    }

def get_product_forecast_summary():
    """Get summary of forecasted demand per product"""
    df = load_sales_data()
    products = df['product'].unique()
    
    summary = []
    for product in products:
        forecast = simple_moving_average_forecast(df, product)
        if forecast:
            total_forecast = sum(f['forecasted_units'] for f in forecast)
            summary.append({
                'product': product,
                'next_7_days_demand': total_forecast,
                'daily_avg': int(total_forecast / 7)
            })
    
    return summary
