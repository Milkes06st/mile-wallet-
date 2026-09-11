with open('src/components/HomeView.tsx', 'r') as f:
    content = f.read()

# Replace the hidden market price back to normal
content = content.replace(
    "{isBalanceHidden ? '••• ₽' : `${rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`}",
    "{rateInfo.rub.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽"
)

with open('src/components/HomeView.tsx', 'w') as f:
    f.write(content)
