import requests
headers = {"x-tenant-slug": "default-tenant"}
data = {"text": "Hello world", "source_lang": "Auto Detect", "target_lang": "Spanish"}
r = requests.post("http://localhost:8000/api/tools/translate", data=data, headers=headers)
print(r.status_code)
print(r.text)
