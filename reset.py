import requests
test_data = {
    'users': [{ 'id': 1, 'name': 'Test User' }],
    'books': {'1': { 'id': '1', 'title': 'Test Book' }}
}
requests.post('http://your-api-url.com/reset', json=test_data)
