with open('src/components/TransactionDetailsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-black/60 backdrop-blur-sm p-4 sm:p-6', 'bg-[#0a0d14]')
content = content.replace('max-w-md w-full bg-[#10141a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden', 'w-full h-full bg-[#0a0d14] flex flex-col pt-safe pb-safe')

with open('src/components/TransactionDetailsModal.tsx', 'w') as f:
    f.write(content)
