import pandas as pd
from transformers import pipeline
from collections import Counter
import re

# Initialize sentiment analyzer (cached)
sentiment_analyzer = None

def get_sentiment_analyzer():
    """Lazy load sentiment analyzer"""
    global sentiment_analyzer
    if sentiment_analyzer is None:
        sentiment_analyzer = pipeline("sentiment-analysis", 
                                     model="distilbert-base-uncased-finetuned-sst-2-english")
    return sentiment_analyzer

def load_reviews_data():
    """Load reviews from CSV"""
    return pd.read_csv('data/reviews.csv')

def analyze_sentiment():
    """Analyze customer review sentiment"""
    df = load_reviews_data()
    analyzer = get_sentiment_analyzer()
    
    results = []
    for _, row in df.iterrows():
        sentiment = analyzer(row['review_text'][:512])[0]
        results.append({
            'product': row['product'],
            'review': row['review_text'],
            'sentiment': sentiment['label'],
            'confidence': sentiment['score']
        })
    
    # Calculate summary
    sentiment_counts = Counter([r['sentiment'] for r in results])
    
    # Extract common issues
    negative_reviews = [r['review'].lower() for r in results if r['sentiment'] == 'NEGATIVE']
    
    issue_keywords = {
        'delivery': ['delivery', 'shipping', 'late', 'delayed'],
        'packaging': ['packaging', 'damaged', 'broken', 'box'],
        'quality': ['quality', 'broke', 'stopped working', 'poor', 'terrible'],
        'price': ['overpriced', 'expensive', 'not worth']
    }
    
    issues = []
    for issue_type, keywords in issue_keywords.items():
        count = sum(1 for review in negative_reviews 
                   if any(keyword in review for keyword in keywords))
        if count > 0:
            issues.append({
                'issue': issue_type,
                'count': count,
                'percentage': round(count / len(negative_reviews) * 100, 1) if negative_reviews else 0
            })
    
    issues.sort(key=lambda x: x['count'], reverse=True)
    
    # Product-wise sentiment
    product_sentiment = {}
    for product in df['product'].unique():
        product_results = [r for r in results if r['product'] == product]
        positive = sum(1 for r in product_results if r['sentiment'] == 'POSITIVE')
        negative = sum(1 for r in product_results if r['sentiment'] == 'NEGATIVE')
        
        product_sentiment[product] = {
            'positive': positive,
            'negative': negative,
            'total': len(product_results),
            'positive_rate': round(positive / len(product_results) * 100, 1) if product_results else 0
        }
    
    return {
        'overall_sentiment': {
            'positive': sentiment_counts.get('POSITIVE', 0),
            'negative': sentiment_counts.get('NEGATIVE', 0),
            'total_reviews': len(results)
        },
        'top_issues': issues[:5],
        'product_sentiment': product_sentiment,
        'sample_reviews': results[:10]
    }
