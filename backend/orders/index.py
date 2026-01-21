import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для работы с заказами: создание и получение статистики'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT o.*, 
                           json_agg(json_build_object(
                               'name', oi.item_name,
                               'price', oi.item_price,
                               'quantity', oi.quantity,
                               'subtotal', oi.subtotal
                           )) as items
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    GROUP BY o.id
                    ORDER BY o.created_at DESC
                    LIMIT 100
                """)
                
                orders = cur.fetchall()
                
                result = []
                for order in orders:
                    result.append({
                        'id': order['id'],
                        'user_name': order['user_name'],
                        'user_phone': order['user_phone'],
                        'delivery_type': order['delivery_type'],
                        'delivery_address': order['delivery_address'],
                        'subtotal': float(order['subtotal']),
                        'delivery_fee': float(order['delivery_fee']),
                        'discount': float(order['discount']),
                        'total': float(order['total']),
                        'promo_code': order['promo_code'],
                        'status': order['status'],
                        'created_at': order['created_at'].isoformat() if order['created_at'] else None,
                        'items': order['items']
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'orders': result}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO orders (
                        user_name, user_phone, user_email, delivery_address, delivery_type,
                        comment, subtotal, delivery_fee, discount, promo_code, total, status
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id""",
                    (
                        body['user_name'],
                        body['user_phone'],
                        body.get('user_email'),
                        body.get('delivery_address'),
                        body['delivery_type'],
                        body.get('comment'),
                        body['subtotal'],
                        body['delivery_fee'],
                        body.get('discount', 0),
                        body.get('promo_code'),
                        body['total'],
                        'pending'
                    )
                )
                order_id = cur.fetchone()[0]
                
                for item in body['items']:
                    cur.execute(
                        """INSERT INTO order_items (
                            order_id, item_name, item_price, quantity, subtotal
                        ) VALUES (%s, %s, %s, %s, %s)""",
                        (
                            order_id,
                            item['name'],
                            item['price'],
                            item['quantity'],
                            item['price'] * item['quantity']
                        )
                    )
                
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'order_id': order_id, 'message': 'Order created'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
