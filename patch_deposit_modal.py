import re
with open('src/components/DepositModal.tsx', 'r') as f:
    content = f.read()

old_header = """      {/* Top Header */}
      <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-30 bg-[#000000]">
        <div className="flex items-center gap-4">
          <ArrowLeft className="w-6 h-6 text-white cursor-pointer" onClick={onClose} />
          <div className="flex items-center gap-1.5 cursor-pointer">
            <span className="font-semibold text-lg text-white tracking-wide">Wallet</span>
            
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ChevronDown className="w-6 h-6 text-white cursor-pointer" />
          <MoreVertical className="w-6 h-6 text-white cursor-pointer" />
        </div>
      </div>"""

new_header = """      {/* Top Header */}
      <div className="w-full px-4 pt-4 pb-2 flex items-center justify-end sticky top-0 z-30 bg-[#000000]">
        <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>"""

content = content.replace(old_header, new_header)

if "import { X " not in content:
    content = content.replace("import {\n  ArrowLeft,", "import {\n  X,\n  ArrowLeft,")

with open('src/components/DepositModal.tsx', 'w') as f:
    f.write(content)
