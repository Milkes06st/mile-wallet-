import re
with open('src/components/CheckView.tsx', 'r') as f:
    content = f.read()

bad_start = content.find('return (')
if bad_start != -1:
    good_start = content.find('{/* Main Content Area - Full Screen Responsive */}')
    if good_start != -1:
        new_content = content[:bad_start] + 'return (\n    <div className="w-full flex-1 min-h-screen bg-[#0a0d14] text-white flex flex-col justify-between relative select-none font-sans overflow-x-hidden">\n      ' + content[good_start:]
        with open('src/components/CheckView.tsx', 'w') as f:
            f.write(new_content)
