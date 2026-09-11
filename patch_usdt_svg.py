with open('src/components/CryptoIcons.tsx', 'r') as f:
    content = f.read()

import re
# Regex to find USDT case and replace it
new_usdt_case = """case 'USDT':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="100" cy="100" r="100" fill="#26A17B"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M106.857 91.5644C131.706 90.7203 150.323 85.5925 150.323 79.4312C150.323 73.084 130.686 67.8105 104.57 67.0945V51H147.247V31H52.7529V51H93.364V67.0945C67.2483 67.8105 47.6111 73.084 47.6111 79.4312C47.6111 85.5925 66.2285 90.7203 91.0772 91.5644V169H106.857V91.5644ZM104.57 78.4311C128.847 77.671 140.686 74.0766 140.686 70.0774C140.686 66.0781 128.847 62.4837 104.57 61.7236V78.4311ZM93.364 61.7236C69.087 62.4837 57.2483 66.0781 57.2483 70.0774C57.2483 74.0766 69.087 77.671 93.364 78.4311V61.7236Z" fill="white"/>
        </svg>
      );"""

# I need to match everything between `case 'USDT':` and `case 'BTC':`
content = re.sub(r"case 'USDT':.*?(?=case 'BTC':)", new_usdt_case + "\n    ", content, flags=re.DOTALL)

with open('src/components/CryptoIcons.tsx', 'w') as f:
    f.write(content)
