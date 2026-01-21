import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

import secrets

def handler(event: dict, context) -> dict:
    '''API для управления настройками сайта, промокодами, авторизации и оплаты'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        path = event.get('queryStringParameters', {}).get('action', '')
        
        if path == 'login':
            if method != 'POST':
                return {
                    'statusCode': 405,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Method not allowed'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            email = body.get('email', '')
            password = body.get('password', '')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, email, name, role FROM users WHERE email = %s AND role = 'admin'",
                    (email,)
                )
                user = cur.fetchone()
                
                if not user or password != 'admin123':
                    return {
                        'statusCode': 401,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                token = secrets.token_urlsafe(32)
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'email': user['email'],
                            'name': user['name'],
                            'role': user['role']
                        }
                    }),
                    'isBase64Encoded': False
                }
        
        elif path == 'payment':
            if method != 'POST':
                return {
                    'statusCode': 405,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Method not allowed'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            order_id = body.get('order_id')
            amount = body.get('amount')
            description = body.get('description', f'Заказ №{order_id}')
            
            payment_url = f"https://demo-payment.example.com/pay?order={order_id}&amount={amount}&desc={description}"
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'payment_url': payment_url,
                    'order_id': order_id,
                    'amount': amount
                }),
                'isBase64Encoded': False
            }
        
        elif path == 'promo-codes':
            if method == 'GET':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM promo_codes ORDER BY created_at DESC")
                    codes = cur.fetchall()
                    
                    result = []
                    for code in codes:
                        result.append({
                            'id': code['id'],
                            'code': code['code'],
                            'discount_percent': float(code['discount_percent']),
                            'is_active': code['is_active'],
                            'usage_limit': code['usage_limit'],
                            'usage_count': code['usage_count'],
                            'valid_until': code['valid_until'].isoformat() if code['valid_until'] else None
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'codes': result}),
                        'isBase64Encoded': False
                    }
            
            elif method == 'POST':
                body = json.loads(event.get('body', '{}'))
                
                with conn.cursor() as cur:
                    cur.execute(
                        """INSERT INTO promo_codes (code, discount_percent, is_active, usage_limit, valid_until)
                           VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                        (
                            body['code'].upper(),
                            body['discount_percent'],
                            body.get('is_active', True),
                            body.get('usage_limit'),
                            body.get('valid_until')
                        )
                    )
                    code_id = cur.fetchone()[0]
                    conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': code_id, 'message': 'Promo code created'}),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                code_id = body.get('id')
                
                with conn.cursor() as cur:
                    cur.execute(
                        """UPDATE promo_codes 
                           SET code = %s, discount_percent = %s, is_active = %s,
                               usage_limit = %s, valid_until = %s
                           WHERE id = %s""",
                        (
                            body['code'].upper(),
                            body['discount_percent'],
                            body.get('is_active', True),
                            body.get('usage_limit'),
                            body.get('valid_until'),
                            code_id
                        )
                    )
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Promo code updated'}),
                    'isBase64Encoded': False
                }
        
        elif path == 'promotions':
            if method == 'GET':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM promotions WHERE is_active = true ORDER BY created_at DESC")
                    promotions = cur.fetchall()
                    
                    result = []
                    for promo in promotions:
                        result.append({
                            'id': promo['id'],
                            'title': promo['title'],
                            'description': promo['description'],
                            'discount_text': promo['discount_text'],
                            'image_url': promo['image_url'],
                            'start_date': promo['start_date'].isoformat() if promo['start_date'] else None,
                            'end_date': promo['end_date'].isoformat() if promo['end_date'] else None
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'promotions': result}),
                        'isBase64Encoded': False
                    }
            
            elif method == 'POST':
                body = json.loads(event.get('body', '{}'))
                
                with conn.cursor() as cur:
                    cur.execute(
                        """INSERT INTO promotions (title, description, discount_text, image_url, start_date, end_date)
                           VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                        (
                            body['title'],
                            body.get('description'),
                            body.get('discount_text'),
                            body.get('image_url'),
                            body.get('start_date'),
                            body.get('end_date')
                        )
                    )
                    promo_id = cur.fetchone()[0]
                    conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'id': promo_id, 'message': 'Promotion created'}),
                    'isBase64Encoded': False
                }
        
        else:
            if method == 'GET':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("SELECT * FROM site_settings ORDER BY key")
                    settings = cur.fetchall()
                    
                    result = {}
                    for setting in settings:
                        result[setting['key']] = setting['value']
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'settings': result}),
                        'isBase64Encoded': False
                    }
            
            elif method == 'PUT':
                body = json.loads(event.get('body', '{}'))
                settings = body.get('settings', {})
                
                with conn.cursor() as cur:
                    for key, value in settings.items():
                        cur.execute(
                            """INSERT INTO site_settings (key, value, updated_at)
                               VALUES (%s, %s, CURRENT_TIMESTAMP)
                               ON CONFLICT (key) 
                               DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP""",
                            (key, value)
                        )
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Settings updated'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()