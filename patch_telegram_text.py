import re

# Patch TransferModal.tsx
with open('src/components/TransferModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("Telegram @username", "@username")
content = content.replace("или Telegram ID", "или ID")

with open('src/components/TransferModal.tsx', 'w') as f:
    f.write(content)

# Patch CheckView.tsx
with open('src/components/CheckView.tsx', 'r') as f:
    content = f.read()

content = content.replace(", TelegramVerifiedBadge", "")
content = re.sub(r'<TelegramVerifiedBadge size=\{18\} />', '', content)

with open('src/components/CheckView.tsx', 'w') as f:
    f.write(content)

