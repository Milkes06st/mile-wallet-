with open('src/App.tsx', 'r') as f:
    content = f.read()

# I will replace the last few lines to make sure it's well-formed
# The original end was probably:
#       </nav>
#     </div>
#   );
# }

import re
content = re.sub(r'      </nav>\n    </div>\n      </div>\n    </BalanceProvider>\n  \);\n}',
                 '      </nav>\n    </div>\n    </BalanceProvider>\n  );\n}', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
