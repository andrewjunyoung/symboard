import re
from collections import Counter

def count_tokens(text):
    pattern = r'\.([\\\-\'\/\_a-zA-Z0-9\+]+)'
    tokens = re.findall(pattern, text)
    return Counter(tokens)

with open('common.txt', 'r', encoding='utf-8') as f:
    content = f.read()

token_counts = count_tokens(content)

for token, count in sorted(token_counts.items(), key=lambda x: x[0]):
    print(f'{count/10000}: {token}')
