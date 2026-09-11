import re

with open('src/components/PrizeModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(", TelegramVerifiedBadge", "")
content = re.sub(r'<TelegramVerifiedBadge.*?/>', '', content)

with open('src/components/PrizeModal.tsx', 'w') as f:
    f.write(content)

