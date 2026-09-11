import re

with open('src/components/WithdrawModal.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { CryptoIcon } from './CryptoIcons';", "import { CryptoIcon } from './CryptoIcons';\nimport { validateAddress } from '../utils/validators';")

# Update handleConfirmWithdraw
old_validation = """    if (cleanAddress.length < 16) {
      setError('Некорректный адрес кошелька. Слишком короткая строка');
      return;
    }"""
new_validation = """    if (!validateAddress(cleanAddress, selectedNetwork)) {
      setError(`Указан некорректный адрес для сети ${selectedNetwork}`);
      return;
    }"""
content = content.replace(old_validation, new_validation)

# Check if there's a showConfirm state. The previous grep showed `showConfirm` exists.
# We need to make sure there's a warning modal with a warning icon.
# Let's see how showConfirm is rendered.
# First, let's grab the showConfirm rendering part.
with open('src/components/WithdrawModal.tsx', 'w') as f:
    f.write(content)
