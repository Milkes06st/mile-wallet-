import re
with open('src/components/CurrencyModal.tsx', 'r') as f:
    content = f.read()

new_currencies = """export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', name: 'Доллар США', symbol: '$', rate: 1 / 92, color: 'bg-emerald-500' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', rate: 1, color: 'bg-indigo-500' },
  { code: 'EUR', name: 'Евро', symbol: '€', rate: 1 / 100, color: 'bg-amber-500' },
  { code: 'BYN', name: 'Белорусский рубль', symbol: 'Br', rate: 1 / 28, color: 'bg-sky-500' },
  { code: 'UAH', name: 'Гривна', symbol: '₴', rate: 1 / 2.5, color: 'bg-emerald-400' },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', rate: 1 / 117, color: 'bg-indigo-400' },
  { code: 'CNY', name: 'Юань', symbol: '¥', rate: 1 / 12.8, color: 'bg-amber-500' },
  { code: 'KZT', name: 'Тенге', symbol: '₸', rate: 4.8, color: 'bg-sky-400' },
  { code: 'UZS', name: 'Узбекский сум', symbol: "so'm", rate: 136, color: 'bg-emerald-500' },
  { code: 'GEL', name: 'Лари', symbol: '₾', rate: 1 / 34, color: 'bg-indigo-400' },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', rate: 1 / 2.9, color: 'bg-amber-500' },
  { code: 'KRW', name: 'Вона', symbol: '₩', rate: 14.5, color: 'bg-sky-500' },
  { code: 'TJS', name: 'Сомони', symbol: 'SM', rate: 1 / 8.5, color: 'bg-emerald-400' },
  { code: 'PLN', name: 'Злотый', symbol: 'zł', rate: 1 / 23, color: 'bg-indigo-500' },
  { code: 'THB', name: 'Бат', symbol: '฿', rate: 1 / 2.5, color: 'bg-amber-500' },
];"""

content = re.sub(r'export const CURRENCIES: CurrencyConfig\[\] = \[.*?\];', new_currencies, content, flags=re.DOTALL)

with open('src/components/CurrencyModal.tsx', 'w') as f:
    f.write(content)
