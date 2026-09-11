import re

def fullscreen_modal(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # The outer wrapper
    content = content.replace(
        '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">',
        '<div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col font-sans animate-in slide-in-from-bottom-2">'
    )
    
    # The inner box wrapper in Withdraw and Transfer that was 'w-full max-w-lg bg-[#111723]...'
    content = re.sub(
        r'<div className="w-full max-w-lg bg-\[#111723\].*?overflow-hidden">',
        '<div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 flex flex-col">',
        content, flags=re.DOTALL
    )

    with open(filepath, 'w') as f:
        f.write(content)

fullscreen_modal('src/components/WithdrawModal.tsx')
fullscreen_modal('src/components/TransferModal.tsx')
