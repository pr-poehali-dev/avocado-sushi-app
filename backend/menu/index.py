import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для работы с меню: получение, добавление, обновление'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            category = event.get('queryStringParameters', {}).get('category')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if category:
                    cur.execute(
                        "SELECT * FROM menu_items WHERE category = %s AND is_active = true ORDER BY id",
                        (category,)
                    )
                else:
                    cur.execute("SELECT * FROM menu_items WHERE is_active = true ORDER BY category, id")
                
                items = cur.fetchall()
                
                result = []
                for item in items:
                    result.append({
                        'id': item['id'],
                        'name': item['name'],
                        'description': item['description'],
                        'price': float(item['price']),
                        'category': item['category'],
                        'image': item['image_url'],
                        'popular': item['is_popular']
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'items': result}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                cur.execute(
                    """INSERT INTO menu_items (name, description, price, category, image_url, is_popular)
                       VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
                    (
                        body['name'],
                        body.get('description', ''),
                        body['price'],
                        body['category'],
                        body.get('image', ''),
                        body.get('popular', False)
                    )
                )
                item_id = cur.fetchone()[0]
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': item_id, 'message': 'Item created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            item_id = body.get('id')
            
            with conn.cursor() as cur:
                cur.execute(
                    """UPDATE menu_items 
                       SET name = %s, description = %s, price = %s, category = %s,
                           image_url = %s, is_popular = %s, updated_at = CURRENT_TIMESTAMP
                       WHERE id = %s""",
                    (
                        body['name'],
                        body.get('description', ''),
                        body['price'],
                        body['category'],
                        body.get('image', ''),
                        body.get('popular', False),
                        item_id
                    )
                )
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Item updated'}),
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
