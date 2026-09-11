import re
with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

missing_amount_config = """            </div>

            {/* Amount Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Общий банк чека ({cryptoId}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#151b27] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm outline-none focus:border-sky-500"
                />
              </div>"""

content = content.replace('              />\n            </div>\n\n              <div>\n                <label className="block text-xs', '              />\n' + missing_amount_config + '\n              <div>\n                <label className="block text-xs')

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
