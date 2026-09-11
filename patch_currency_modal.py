with open('src/components/CurrencyModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-700">',
    '<div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${activeCurrencyCode === currency.code ? \'border-sky-500\' : \'border-slate-700\'}`}>'
)

with open('src/components/CurrencyModal.tsx', 'w') as f:
    f.write(content)
