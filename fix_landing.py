import sys

with open('src/components/landing/LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import X
content = content.replace('FileCode\n} from \'lucide-react\';', 'FileCode, X\n} from \'lucide-react\';')
content = content.replace('FileCode } from \'lucide-react\';', 'FileCode, X } from \'lucide-react\';')

# 2. Update useApp
content = content.replace('const { setViewMode, setActiveTab, globalConfig } = useApp();', 'const { user, setViewMode, setActiveTab, globalConfig, setIsAuthModalOpen, setAuthModalMode } = useApp();')

# 3. Add state
content = content.replace('const [activeTestimonial, setActiveTestimonial] = useState(0);', 'const [activeTestimonial, setActiveTestimonial] = useState(0);\n  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);')

# 4. launchTool
old_launchTool = '''const launchTool = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };'''
new_launchTool = '''const launchTool = (tab: ActiveTabType) => {
    setActiveTab(tab);
    if (!user) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };'''
content = content.replace(old_launchTool, new_launchTool)

# 5. Buttons (onClick replace)
old_onClick_1 = "onClick={() => { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}"
new_onClick_auth = "onClick={() => { if (!user) { setAuthModalMode('login'); setIsAuthModalOpen(true); } else { setViewMode('workspace'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}"

# Replace the first instance (Hero Launch)
content = content.replace(old_onClick_1, new_onClick_auth, 1)

# Now find the Explore Pricing Details button. It's inside PRICING & PLAN DETAILS SECTION
explore_idx = content.find('Explore Pricing Details')
if explore_idx != -1:
    btn_start = content.rfind('<button', 0, explore_idx)
    btn_end = content.find('</button>', explore_idx) + 9
    old_btn = content[btn_start:btn_end]
    new_btn = old_btn.replace(old_onClick_1, "onClick={() => setIsPlansModalOpen(true)}")
    content = content.replace(old_btn, new_btn)

# Now replace the remaining old_onClick_1 occurrences (Free Trial and CTA)
content = content.replace(old_onClick_1, new_onClick_auth)

# Add Modal at the end
modal_code = '''
      {isPlansModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-[#DDE5F0] dark:border-white/10">
            <button onClick={() => setIsPlansModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Premium Plan Details</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Starter Plan - $19/mo</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• 60 minutes of audio processing</li>
                  <li>• 100,000 characters translation</li>
                  <li>• 50,000 characters Text-to-Speech</li>
                  <li>• Secure isolated storage included</li>
                </ul>
              </div>
              
              <div className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Professional Plan - $49/mo</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• 300 minutes of audio processing</li>
                  <li>• 500,000 characters translation</li>
                  <li>• 250,000 characters Text-to-Speech</li>
                  <li>• Secure isolated storage included</li>
                </ul>
              </div>

              <div className="p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Enterprise Plan - $149/mo</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <li>• 1200 minutes of audio processing</li>
                  <li>• 2,000,000 characters translation</li>
                  <li>• 1,000,000 characters Text-to-Speech</li>
                  <li>• Secure isolated storage included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
'''

# insert before </main>
main_end = content.rfind('</main>')
if main_end != -1:
    content = content[:main_end] + modal_code + content[main_end:]

with open('src/components/landing/LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated LandingPage successfully')
