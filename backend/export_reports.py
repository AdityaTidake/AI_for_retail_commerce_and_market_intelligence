import pandas as pd
from datetime import datetime
import json

def export_to_excel(data_type, data):
    """Export data to Excel format"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{data_type}_report_{timestamp}.xlsx"
    
    if data_type == 'forecast':
        df = pd.DataFrame(data['forecasts'])
        rising_df = pd.DataFrame(data['rising_products'])
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Forecasts', index=False)
            rising_df.to_excel(writer, sheet_name='Rising Products', index=False)
    
    elif data_type == 'inventory':
        df = pd.DataFrame(data['alerts'])
        df.to_excel(filename, index=False)
    
    elif data_type == 'sentiment':
        reviews_df = pd.DataFrame(data['sample_reviews'])
        issues_df = pd.DataFrame(data['top_issues'])
        
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            reviews_df.to_excel(writer, sheet_name='Reviews', index=False)
            issues_df.to_excel(writer, sheet_name='Top Issues', index=False)
    
    elif data_type == 'pricing':
        df = pd.DataFrame(data['suggestions'])
        df.to_excel(filename, index=False)
    
    return filename

def generate_pdf_report(report_type, data):
    """Generate PDF report summary"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    report = {
        'title': f'{report_type.title()} Report',
        'generated_at': timestamp,
        'summary': {}
    }
    
    if report_type == 'forecast':
        report['summary'] = {
            'total_products': len(set(f['product'] for f in data['forecasts'])),
            'rising_products': len(data['rising_products']),
            'top_growth': data['rising_products'][0] if data['rising_products'] else None,
            'alerts': data['alerts']
        }
    
    elif report_type == 'inventory':
        report['summary'] = {
            'critical_alerts': data['critical_count'],
            'warning_alerts': data['warning_count'],
            'total_products': len(data['alerts']),
            'high_risk_products': [a['product'] for a in data['alerts'] if a['risk_level'] == 'HIGH']
        }
    
    elif report_type == 'sentiment':
        total = data['overall_sentiment']['total_reviews']
        positive = data['overall_sentiment']['positive']
        report['summary'] = {
            'total_reviews': total,
            'positive_reviews': positive,
            'negative_reviews': data['overall_sentiment']['negative'],
            'satisfaction_rate': round((positive / total * 100), 2) if total > 0 else 0,
            'top_issues': [i['issue'] for i in data['top_issues'][:3]]
        }
    
    return report

def get_product_details(product_name):
    """Get comprehensive product details"""
    from backend.forecasting import load_sales_data, simple_moving_average_forecast
    from backend.sentiment import load_reviews_data
    from backend.recommendations import load_inventory_data, load_pricing_data
    
    # Sales data
    sales_df = load_sales_data()
    product_sales = sales_df[sales_df['product'] == product_name].sort_values('date')
    
    # Forecast
    forecast = simple_moving_average_forecast(sales_df, product_name)
    
    # Inventory
    inventory_df = load_inventory_data()
    inventory_row = inventory_df[inventory_df['product'] == product_name]
    stock_left = int(inventory_row.iloc[0]['stock_left']) if not inventory_row.empty else 0
    
    # Pricing
    pricing_df = load_pricing_data()
    pricing_row = pricing_df[pricing_df['product'] == product_name]
    pricing_info = {
        'current_price': float(pricing_row.iloc[0]['current_price']) if not pricing_row.empty else 0,
        'competitor_price': float(pricing_row.iloc[0]['competitor_price']) if not pricing_row.empty else 0
    }
    
    # Reviews
    reviews_df = load_reviews_data()
    product_reviews = reviews_df[reviews_df['product'] == product_name]
    
    # Calculate metrics
    recent_sales = product_sales.tail(7)['units_sold'].tolist()
    avg_daily_sales = sum(recent_sales) / len(recent_sales) if recent_sales else 0
    total_sales = int(product_sales['units_sold'].sum())
    
    return {
        'product': product_name,
        'stock_left': stock_left,
        'pricing': pricing_info,
        'sales_history': [
            {
                'date': row['date'].strftime('%Y-%m-%d'),
                'units_sold': int(row['units_sold'])
            }
            for _, row in product_sales.tail(14).iterrows()
        ],
        'forecast': forecast[:7] if forecast else [],
        'metrics': {
            'total_sales': total_sales,
            'avg_daily_sales': round(avg_daily_sales, 2),
            'days_of_stock': int(stock_left / avg_daily_sales) if avg_daily_sales > 0 else 999,
            'total_reviews': len(product_reviews)
        },
        'reviews': [
            {'text': row['review_text']}
            for _, row in product_reviews.head(10).iterrows()
        ]
    }
