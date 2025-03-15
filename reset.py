
import requests
test_data = {
    'users': [{ 'id': 1, 'name': 'Test User' }],
    'books': {'1': { 'id': '1', 'title': 'Test Book' }}}
requests.post('http://192.168.56.1:30889/reset', json=test_data)
    