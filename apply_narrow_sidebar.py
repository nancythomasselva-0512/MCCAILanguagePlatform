import re

# Update SidebarMenuNode.tsx
with open('c:/Users/nancy/Downloads/mcc-ai-language-platform-praveen/mcc-ai-language-platform-praveen/src/components/workspace/SidebarMenuNode.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the button a column layout
content = content.replace(
    'className={`w-full flex items-center justify-between py-1.5 px-4 rounded-xl text-sm font-semibold transition-all relative overflow-hidden select-none cursor-pointer ${isFolder',
    'className={`w-full flex flex-col items-center justify-center py-3 px-1 rounded-2xl gap-1.5 text-center transition-all relative overflow-hidden select-none cursor-pointer ${isFolder'
)

# Fix the inner container layout
content = content.replace(
    '<div className="flex items-center gap-2.5 relative z-10">',
    '<div className="flex flex-col items-center justify-center gap-1.5 relative z-10 w-full">'
)

# Increase icon size
content = content.replace('size={15}', 'size={24}')
content = content.replace('h-5 w-5', 'h-8 w-8')
content = content.replace('h-1.5 w-1.5', 'h-2 w-2')

# Center and shrink label
content = content.replace(
    '<span className="text-left leading-none">{node.label}</span>',
    '<span className="text-center text-[10px] leading-tight whitespace-normal break-words w-full">{node.label}</span>'
)

with open('c:/Users/nancy/Downloads/mcc-ai-language-platform-praveen/mcc-ai-language-platform-praveen/src/components/workspace/SidebarMenuNode.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Update WorkspacePage.tsx
with open('c:/Users/nancy/Downloads/mcc-ai-language-platform-praveen/mcc-ai-language-platform-praveen/src/components/workspace/WorkspacePage.tsx', 'r', encoding='utf-8') as f:
    wp_content = f.read()

# Shrink desktop sidebar width
wp_content = wp_content.replace(
    'className="hidden w-64 flex-shrink-0 sm:flex sm:flex-col justify-between p-6 rounded-none relative z-10"',
    'className="hidden w-[95px] flex-shrink-0 sm:flex sm:flex-col justify-between px-2 py-6 rounded-none relative z-10"'
)

# Redesign Desktop Header (Logo)
old_desktop_header = """          <div className="flex items-center gap-2.5 mb-6 select-none">
            <button
              onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40 hover:bg-white/20 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={14} />
            </button>
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={globalConfig?.branding?.logo_url || "/logo.png"}
                alt="Logo"
                className="h-8 w-8 rounded-full border border-white/40 object-cover flex-shrink-0"
                style={{ height: globalConfig?.branding?.logo_size || "32px", width: globalConfig?.branding?.logo_size || "32px" }}
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-display text-base font-black tracking-tight leading-none text-[var(--text-primary)] truncate flex items-center gap-0.5">
                  {globalConfig?.branding?.platform_name || "MCC AI"}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase mt-1 text-[var(--sidebar-panel-text)] opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                  {globalConfig?.branding?.tagline || "Language Platform"}
                </span>
              </div>
            </div>
          </div>"""

new_desktop_header = """          <div className="flex flex-col items-center gap-4 mb-6 select-none w-full">
            <div className="flex items-center justify-center overflow-hidden w-full">
              <img
                src={globalConfig?.branding?.logo_url || "/logo.png"}
                alt="Logo"
                className="h-10 w-10 rounded-full border border-white/40 object-cover flex-shrink-0"
                style={{ height: "40px", width: "40px" }}
              />
            </div>
            <button
              onClick={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40 hover:bg-white/20 border border-white/10 text-[var(--text-primary)] transition-all cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={14} />
            </button>
          </div>"""
wp_content = wp_content.replace(old_desktop_header, new_desktop_header)

# Redesign Desktop Section Dividers
old_desktop_section_header = """                        <div 
                          className="flex items-center justify-between px-4 mt-2 mb-1 cursor-pointer group select-none"
                          onClick={() => toggleExpanded(sectionId)}
                        >
                          <h4 className="text-[11px] font-bold tracking-[0.1em] text-teal-800 dark:text-teal-500 uppercase group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {section.title}
                          </h4>
                          <ChevronDown 
                            size={14} 
                            className={`text-teal-800/50 dark:text-teal-500/50 transition-transform duration-200 ${isSectionOpen ? 'rotate-180' : ''}`}
                          />
                        </div>"""

new_desktop_section_header = """                        <div className="w-full flex justify-center py-2 relative mt-1 mb-1">
                          <hr className="w-[60%] border-[rgba(255,255,255,0.1)] absolute top-1/2 -translate-y-1/2" style={{ borderColor: 'var(--sidebar-panel-border)' }} />
                          <span className="bg-[var(--sidebar-bg)] px-1 text-[8px] font-bold tracking-wider text-[var(--sidebar-panel-text)] opacity-60 uppercase z-10 text-center leading-tight max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {section.title}
                          </span>
                        </div>"""
wp_content = wp_content.replace(old_desktop_section_header, new_desktop_section_header)

# Update Mobile Header (optional but good to match)
old_mobile_header = """              <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{globalConfig?.branding?.platform_name || "MCC AI"} Workstation</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-white/40" style={{ color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>"""

new_mobile_header = """              <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                  <img src={globalConfig?.branding?.logo_url || "/logo.png"} alt="Logo" className="h-6 w-6 rounded-full" />
                  <span className="text-sm font-bold text-[var(--text-primary)]">{globalConfig?.branding?.platform_name || "MCC AI"}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-white/40" style={{ color: '#ffffff' }}>
                  <X size={18} />
                </button>
              </div>"""
wp_content = wp_content.replace(old_mobile_header, new_mobile_header)

# In mobile, change the width to be narrow too? Or keep it wide since it's an overlay?
# An overlay is usually wide enough to be readable. Let's make mobile width narrower too.
wp_content = wp_content.replace('w-72', 'w-[100px]')
# For mobile dividers, apply same replacement
wp_content = wp_content.replace(old_desktop_section_header, new_desktop_section_header)

with open('c:/Users/nancy/Downloads/mcc-ai-language-platform-praveen/mcc-ai-language-platform-praveen/src/components/workspace/WorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(wp_content)
