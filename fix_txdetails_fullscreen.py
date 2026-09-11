import re
with open('src/components/TransactionDetailsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">',
    '<div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2">'
)
content = re.sub(
    r'<div className="w-full max-w-md bg-\[#111723\].*?flex-col">',
    '<div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 flex flex-col">',
    content, flags=re.DOTALL
)

with open('src/components/TransactionDetailsModal.tsx', 'w') as f:
    f.write(content)
