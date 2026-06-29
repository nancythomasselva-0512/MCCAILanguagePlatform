import sys

with open('src/components/landing/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update 14 days to 7 days
content = content.replace('14 Days Trial', '7 Days Trial')
content = content.replace('14-Day Free Trial', '7-Day Free Trial')
content = content.replace('14-day trial', '7-day trial')

# 2. Add billing cycle state
content = content.replace(
    'const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);',
    'const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);\n  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");'
)

# 3. Add toggle UI above the cards
toggle_ui = '''
        <div className="relative z-10 flex items-center justify-center gap-3 pt-2 mb-10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]'
                : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'
            }`}
          >
            Yearly
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
              billingCycle === 'yearly' ? 'bg-white/30 text-white' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            }`}>
              Save 30%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4 relative z-10 items-stretch">'''

content = content.replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4 relative z-10 items-stretch">',
    toggle_ui
)

# 4. Update the pricing in the cards based on billingCycle
# We need to replace the static price lines.
# For Starter Plan
content = content.replace(
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">$19/mo</span>',
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$13/mo" : "$19/mo"}</span>'
)
# For Professional Plan
content = content.replace(
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">$49/mo</span>',
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$34/mo" : "$49/mo"}</span>'
)
# For Enterprise Plan
content = content.replace(
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">$149/mo</span>',
    '<span className="text-base font-black text-teal-600 dark:text-teal-400">{billingCycle === "yearly" ? "$104/mo" : "$149/mo"}</span>'
)

# 5. Do the same for the Modal!
# The modal has text like "Starter Plan - $19/mo"
content = content.replace(
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Starter Plan - $19/mo</h4>',
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Starter Plan - {billingCycle === "yearly" ? "$13/mo" : "$19/mo"}</h4>'
)
content = content.replace(
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Professional Plan - $49/mo</h4>',
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Professional Plan - {billingCycle === "yearly" ? "$34/mo" : "$49/mo"}</h4>'
)
content = content.replace(
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Enterprise Plan - $149/mo</h4>',
    '<h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Enterprise Plan - {billingCycle === "yearly" ? "$104/mo" : "$149/mo"}</h4>'
)

with open('src/components/landing/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated LandingPage successfully')
