#!/bin/bash
curl -X POST 'http://192.168.56.1:53105/reset' -H 'Content-Type: application/json' -d '{"users": [{"id": 1, "name": "Test User"}], "books": {"1": {"id": "1", "title": "Test Book"}}}'
