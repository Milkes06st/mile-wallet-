import re
with open('server.ts', 'r') as f:
    content = f.read()

content = re.sub(r"params\.join\('.*?\).digest\('hex'\);", r"params.join('\\n')).digest('hex');", content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)
