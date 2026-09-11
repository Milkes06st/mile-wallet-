with open('src/components/HomeView.tsx', 'r') as f:
    content = f.read()

content = content.replace("sumRub += amount * rateInfo.rub;", "sumRub += (Number(amount) || 0) * rateInfo.rub;")

with open('src/components/HomeView.tsx', 'w') as f:
    f.write(content)
