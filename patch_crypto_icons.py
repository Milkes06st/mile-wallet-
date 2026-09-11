import re

with open('src/components/CryptoIcons.tsx', 'r') as f:
    content = f.read()

# Replace TON
ton_old = """    case 'TON':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M40 12L24 40L8 12H40Z" fill="#0098EA" />
          <path d="M24 12L24 40L40 12H24Z" fill="#2CA5E0" />
          <path d="M24 12L8 12L17.5 24.5L24 12Z" fill="#0088CC" />
          <path d="M24 12L40 12L30.5 24.5L24 12Z" fill="#38BDF8" />
          <path d="M17.5 24.5L24 40L30.5 24.5H17.5Z" fill="#0077B5" />
        </svg>
      );"""

ton_new = """    case 'TON':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
          <path d="M37.56 15.62H18.44C14.93 15.62 12.72 19.42 14.47 22.45L26.31 42.95C27.12 44.35 28.98 44.35 29.79 42.95L41.63 22.45C43.28 19.42 41.07 15.62 37.56 15.62ZM26.33 36.8L23.73 31.8L17.53 20.7C17.13 20 17.63 19.1 18.53 19.1H26.33V36.8ZM38.47 20.7L32.27 31.8L29.67 36.8V19.1H37.47C38.37 19.1 38.87 20 38.47 20.7Z" fill="white"/>
        </svg>
      );"""

# Replace USDT
usdt_old = """    case 'USDT':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M26.7 26.5C26.3 26.6 25.2 26.7 24 26.7C22.7 26.7 21.8 26.6 21.3 26.5V23.7C24.1 23.9 26.7 23.7 26.7 23.7V26.5ZM26.7 21.8C26.2 21.9 25.1 22 24 22C22.8 22 21.8 21.9 21.3 21.8V19.3H26.7V21.8ZM33.5 19.3H28.4V15.5H35.8V12H12.2V15.5H19.6V19.3H14.5C9.8 19.3 6 20.8 6 22.8C6 24.8 9.8 26.3 14.5 26.3H19.6V36H24.4V26.3H28.4C33.2 26.3 37 24.8 37 22.8C37 20.8 33.2 19.3 33.5 19.3Z"
            fill="#26A17B"
          />
        </svg>
      );"""

usdt_new = """    case 'USDT':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="24" cy="24" r="24" fill="#26A17B"/>
          <path
            d="M26.7 27.5C26.3 27.6 25.2 27.7 24 27.7C22.7 27.7 21.8 27.6 21.3 27.5V24.7C24.1 24.9 26.7 24.7 26.7 24.7V27.5ZM26.7 22.8C26.2 22.9 25.1 23 24 23C22.8 23 21.8 22.9 21.3 22.8V20.3H26.7V22.8ZM33.5 20.3H28.4V16.5H35.8V13H12.2V16.5H19.6V20.3H14.5C9.8 20.3 6 21.8 6 23.8C6 25.8 9.8 27.3 14.5 27.3H19.6V37H24.4V27.3H28.4C33.2 27.3 37 25.8 37 23.8C37 21.8 33.2 20.3 33.5 20.3Z"
            fill="white"
          />
        </svg>
      );"""

content = content.replace(ton_old, ton_new)
content = content.replace(usdt_old, usdt_new)

with open('src/components/CryptoIcons.tsx', 'w') as f:
    f.write(content)
