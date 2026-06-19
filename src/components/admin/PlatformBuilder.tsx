import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { 
  Settings, Paintbrush, FileText, Menu, Sliders, Play, FormInput, 
  Mail, ShieldCheck, Code2, Users, FolderOpen, Plus, Trash2, 
  Save, Loader2, Image, Video, FileText as DocIcon
} from 'lucide-react';

type SectionType = 
  | 'branding' | 'theme' | 'website' | 'navigation' | 'landing' 
  | 'cms' | 'features' | 'dashboard' | 'forms' | 'emails' 
  | 'auth' | 'custom_code' | 'white_label' | 'media';

export const PlatformBuilder: React.FC = () => {
  const [activeSec, setActiveSec] = useState<SectionType>('branding');
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States for sub-managers
  // Branding
  const [brandingForm, setBrandingForm] = useState({
    platform_name: '', tagline: '', logo_url: '', logo_size: '32px',
    logo_position: 'left', favicon_url: '', app_icon_url: '',
    footer_text: '', copyright_text: ''
  });

  // Theme
  const [themeForm, setThemeForm] = useState({
    mode: 'dark', primary_color: '#2563EB', secondary_color: '#4F46E5',
    accent_color: '#06B6D4', success_color: '#10B981', warning_color: '#F59E0B',
    error_color: '#EF4444', font_family: 'Inter', font_size: '14px',
    border_radius: '16px', shadow_style: 'normal', card_style: 'glassmorphism',
    sidebar_width: '256px', navbar_height: '64px'
  });

  // Platform (Auth & CSS/JS)
  const [platformForm, setPlatformForm] = useState({
    invite_only: false, registration_approval: false,
    enable_email_login: true, enable_google_login: false,
    enable_microsoft_login: false, enable_otp_login: false,
    enable_magic_link: false, custom_css: '', custom_js: '',
    tracking_scripts: ''
  });

  // Website Pages
  const [newPage, setNewPage] = useState({ slug: '', title: '', subtitle: '', is_active: true });

  // Navigation Items
  const [newNavItem, setNewNavItem] = useState({ label: '', route: '', icon: '', order: 0, is_visible: true });

  // Custom Widget
  const [newWidget, setNewWidget] = useState({ title: '', widget_type: 'metric', config_json: '', order: 0 });

  // Custom Form
  const [newForm, setNewForm] = useState({ form_name: '', fields: [{ label: '', type: 'text', required: true }] });

  // CMS Posts (Mocked inside CMS view for now, using Website Pages or direct state)
  const [cmsPosts, setCmsPosts] = useState<any[]>([
    { id: '1', title: 'Welcome to our Language Hub', type: 'Announcement', is_active: true },
    { id: '2', title: 'Privacy Policy Updates', type: 'Policies', is_active: true },
    { id: '3', title: 'How to use translation tools', type: 'Documentation', is_active: true }
  ]);
  const [newCms, setNewCms] = useState({ title: '', type: 'Blog', is_active: true });

  // Email Template Edit
  const [selectedEmailType, setSelectedEmailType] = useState('welcome');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Tenant Branding setup
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  // Media File mock
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/platform-builder/config');
      setConfig(data);
      if (data.branding) setBrandingForm(data.branding);
      if (data.theme) setThemeForm(data.theme);
      if (data.platform) setPlatformForm(data.platform);
      
      // Seed default email contents if available
      const currentTpl = data.email_templates?.find((t: any) => t.template_type === selectedEmailType);
      if (currentTpl) {
        setEmailSubject(currentTpl.subject);
        setEmailBody(currentTpl.body_html);
      } else {
        setEmailSubject(getDefaultEmailSubject(selectedEmailType));
        setEmailBody(getDefaultEmailBody(selectedEmailType));
      }
    } catch (err) {
      console.error("Failed to load platform settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config?.email_templates) {
      const currentTpl = config?.email_templates.find((t: any) => t.template_type === selectedEmailType);
      if (currentTpl) {
        setEmailSubject(currentTpl.subject);
        setEmailBody(currentTpl.body_html);
      } else {
        setEmailSubject(getDefaultEmailSubject(selectedEmailType));
        setEmailBody(getDefaultEmailBody(selectedEmailType));
      }
    }
  }, [selectedEmailType, config]);

  const getDefaultEmailSubject = (type: string) => {
    return {
      welcome: "Welcome to our platform!",
      reset_password: "Reset your password",
      subscription: "Subscription confirmation",
      invoice: "Your monthly invoice",
      notification: "New notification alert"
    }[type] || "Platform Update";
  };

  const getDefaultEmailBody = (type: string) => {
    return `<h1>Hello user!</h1><p>This is a default html body for your ${type} email template.</p>`;
  };

  const handleSaveBranding = async () => {
    setSaving(true);
    try {
      await apiRequest('/platform-builder/branding', {
        method: 'PATCH',
        body: JSON.stringify(brandingForm)
      });
      alert('Branding settings saved successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to save branding settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      await apiRequest('/platform-builder/theme', {
        method: 'PATCH',
        body: JSON.stringify(themeForm)
      });
      alert('Theme settings saved successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to save theme settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatformSettings = async () => {
    setSaving(true);
    try {
      await apiRequest('/platform-builder/settings', {
        method: 'PATCH',
        body: JSON.stringify(platformForm)
      });
      alert('Platform settings saved successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to save platform settings.');
    } finally {
      setSaving(false);
    }
  };

  // Website Page CRUD
  const handleAddPage = async () => {
    if (!newPage.title || !newPage.slug) return alert('Fill title and slug');
    try {
      await apiRequest('/platform-builder/pages', {
        method: 'POST',
        body: JSON.stringify(newPage)
      });
      setNewPage({ slug: '', title: '', subtitle: '', is_active: true });
      fetchConfig();
    } catch (err) {
      alert('Failed to add page');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await apiRequest(`/platform-builder/pages/${id}`, { method: 'DELETE' });
      fetchConfig();
    } catch (err) {
      alert('Failed to delete page');
    }
  };

  const handleTogglePageActive = async (id: string, current: boolean) => {
    try {
      await apiRequest(`/platform-builder/pages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !current })
      });
      fetchConfig();
    } catch (err) {
      alert('Failed to toggle page status');
    }
  };

  // Navigation CRUD
  const handleAddNavItem = async () => {
    if (!newNavItem.label || !newNavItem.route) return alert('Fill label and route');
    try {
      await apiRequest('/platform-builder/navigation', {
        method: 'POST',
        body: JSON.stringify(newNavItem)
      });
      setNewNavItem({ label: '', route: '', icon: '', order: 0, is_visible: true });
      fetchConfig();
    } catch (err) {
      alert('Failed to add navigation item');
    }
  };

  const handleDeleteNavItem = async (id: string) => {
    try {
      await apiRequest(`/platform-builder/navigation/${id}`, { method: 'DELETE' });
      fetchConfig();
    } catch (err) {
      alert('Failed to delete navigation item');
    }
  };

  // Feature Flag toggle
  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      await apiRequest(`/platform-builder/features/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_enabled: !current })
      });
      fetchConfig();
    } catch (err) {
      alert('Failed to toggle feature');
    }
  };

  // Widget Builder
  const handleAddWidget = async () => {
    if (!newWidget.title) return alert('Enter widget title');
    try {
      await apiRequest('/platform-builder/widgets', {
        method: 'POST',
        body: JSON.stringify(newWidget)
      });
      setNewWidget({ title: '', widget_type: 'metric', config_json: '', order: 0 });
      fetchConfig();
    } catch (err) {
      alert('Failed to create widget');
    }
  };

  const handleDeleteWidget = async (id: string) => {
    try {
      await apiRequest(`/platform-builder/widgets/${id}`, { method: 'DELETE' });
      fetchConfig();
    } catch (err) {
      alert('Failed to delete widget');
    }
  };

  // Form Builder
  const handleAddFormField = () => {
    setNewForm({
      ...newForm,
      fields: [...newForm.fields, { label: '', type: 'text', required: true }]
    });
  };

  const handleRemoveFormField = (index: number) => {
    const fields = [...newForm.fields];
    fields.splice(index, 1);
    setNewForm({ ...newForm, fields });
  };

  const handleFieldChange = (index: number, key: string, val: any) => {
    const fields = [...newForm.fields];
    (fields[index] as any)[key] = val;
    setNewForm({ ...newForm, fields });
  };

  const handleSaveForm = async () => {
    if (!newForm.form_name) return alert('Enter form name');
    try {
      await apiRequest('/platform-builder/forms', {
        method: 'POST',
        body: JSON.stringify(newForm)
      });
      setNewForm({ form_name: '', fields: [{ label: '', type: 'text', required: true }] });
      fetchConfig();
    } catch (err) {
      alert('Failed to save form');
    }
  };

  const handleDeleteForm = async (id: string) => {
    try {
      await apiRequest(`/platform-builder/forms/${id}`, { method: 'DELETE' });
      fetchConfig();
    } catch (err) {
      alert('Failed to delete form');
    }
  };

  // Email Template Save
  const handleSaveEmailTemplate = async () => {
    setSaving(true);
    try {
      const existing = config?.email_templates?.find((t: any) => t.template_type === selectedEmailType);
      if (existing) {
        await apiRequest(`/platform-builder/email-templates/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ subject: emailSubject, body_html: emailBody })
        });
      } else {
        await apiRequest('/platform-builder/email-templates', {
          method: 'POST',
          body: JSON.stringify({ template_type: selectedEmailType, subject: emailSubject, body_html: emailBody })
        });
      }
      alert('Email template saved successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to save email template');
    } finally {
      setSaving(false);
    }
  };

  // White label Tenant Branding Save
  const handleSaveTenantBranding = async () => {
    if (!selectedTenantId || !customDomain) return alert('Select tenant and enter custom domain');
    setSaving(true);
    try {
      await apiRequest(`/platform-builder/tenant-branding/${selectedTenantId}`, {
        method: 'PATCH',
        body: JSON.stringify({ custom_domain: customDomain })
      });
      alert('Tenant domain branding mapped successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to update tenant white label branding');
    } finally {
      setSaving(false);
    }
  };

  // Media Library Upload mock
  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) return alert('Select a file first');
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', mediaFile);
      await apiRequest('/platform-builder/media', {
        method: 'POST',
        body: formData
      });
      setMediaFile(null);
      alert('Media uploaded successfully!');
      fetchConfig();
    } catch (err) {
      alert('Failed to upload media asset');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await apiRequest(`/platform-builder/media/${id}`, { method: 'DELETE' });
      fetchConfig();
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Syncing Builder Catalog...</p>
        </div>
      </div>
    );
  }

  const navSecs = [
    { id: 'branding', label: 'Branding Manager', icon: Settings },
    { id: 'theme', label: 'Theme Manager', icon: Paintbrush },
    { id: 'website', label: 'Website Builder', icon: FileText },
    { id: 'navigation', label: 'Navigation Builder', icon: Menu },
    { id: 'landing', label: 'Landing Page Builder', icon: Sliders },
    { id: 'cms', label: 'CMS (Content Management)', icon: Play },
    { id: 'features', label: 'Feature Manager', icon: ShieldCheck },
    { id: 'dashboard', label: 'Dashboard Builder', icon: Sliders },
    { id: 'forms', label: 'Form Builder', icon: FormInput },
    { id: 'emails', label: 'Email Templates', icon: Mail },
    { id: 'auth', label: 'Auth Configuration', icon: ShieldCheck },
    { id: 'custom_code', label: 'Custom CSS/JS', icon: Code2 },
    { id: 'white_label', label: 'White-Label Manager', icon: Users },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fadeIn">
      {/* Settings Navigation Menu */}
      <div className="lg:col-span-1 glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 h-fit space-y-1">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 mb-3">Platform Builder Modules</h3>
        {navSecs.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSec === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSec(sec.id as SectionType)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Panel Content */}
      <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white dark:bg-[#111827]/40 space-y-6">
        
        {/* 1. BRANDING MANAGER */}
        {activeSec === 'branding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Branding Manager</h3>
            <p className="text-[10px] text-slate-500">Customize global platform identities, names, copyright texts, and logo parameters dynamically.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Platform Name</label>
                <input
                  type="text"
                  value={brandingForm.platform_name}
                  onChange={(e) => setBrandingForm({ ...brandingForm, platform_name: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tagline</label>
                <input
                  type="text"
                  value={brandingForm.tagline}
                  onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Logo URL</label>
                <input
                  type="text"
                  value={brandingForm.logo_url}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_url: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Logo Size</label>
                <input
                  type="text"
                  value={brandingForm.logo_size}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_size: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Logo Position</label>
                <select
                  value={brandingForm.logo_position}
                  onChange={(e) => setBrandingForm({ ...brandingForm, logo_position: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Favicon URL</label>
                <input
                  type="text"
                  value={brandingForm.favicon_url}
                  onChange={(e) => setBrandingForm({ ...brandingForm, favicon_url: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Footer Text</label>
                <input
                  type="text"
                  value={brandingForm.footer_text}
                  onChange={(e) => setBrandingForm({ ...brandingForm, footer_text: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Copyright Text</label>
                <input
                  type="text"
                  value={brandingForm.copyright_text}
                  onChange={(e) => setBrandingForm({ ...brandingForm, copyright_text: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSaveBranding}
              disabled={saving}
              className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Branding Settings
            </button>
          </div>
        )}

        {/* 2. THEME MANAGER */}
        {activeSec === 'theme' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Theme Manager</h3>
            <p className="text-[10px] text-slate-500">Pick premium SaaS color schemes, typography, layout heights, spacing, and border radius ratios dynamically.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Mode</label>
                <select
                  value={themeForm.mode}
                  onChange={(e) => setThemeForm({ ...themeForm, mode: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Color</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={themeForm.primary_color}
                    onChange={(e) => setThemeForm({ ...themeForm, primary_color: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={themeForm.primary_color}
                    onChange={(e) => setThemeForm({ ...themeForm, primary_color: e.target.value })}
                    className="flex-grow px-2 py-1 rounded-lg text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Secondary Color</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={themeForm.secondary_color}
                    onChange={(e) => setThemeForm({ ...themeForm, secondary_color: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={themeForm.secondary_color}
                    onChange={(e) => setThemeForm({ ...themeForm, secondary_color: e.target.value })}
                    className="flex-grow px-2 py-1 rounded-lg text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Accent Color</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={themeForm.accent_color}
                    onChange={(e) => setThemeForm({ ...themeForm, accent_color: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={themeForm.accent_color}
                    onChange={(e) => setThemeForm({ ...themeForm, accent_color: e.target.value })}
                    className="flex-grow px-2 py-1 rounded-lg text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Font Family</label>
                <select
                  value={themeForm.font_family}
                  onChange={(e) => setThemeForm({ ...themeForm, font_family: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Inter">Inter (SaaS Standard)</option>
                  <option value="Outfit">Outfit (Premium Rounded)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Border Radius</label>
                <input
                  type="text"
                  value={themeForm.border_radius}
                  onChange={(e) => setThemeForm({ ...themeForm, border_radius: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSaveTheme}
              disabled={saving}
              className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Theme Settings
            </button>
          </div>
        )}

        {/* 3. WEBSITE BUILDER */}
        {activeSec === 'website' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Create New Page</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Page title (e.g. Features)"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Page slug (e.g. features)"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <button
                  onClick={handleAddPage}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Page
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-400 uppercase">Existent Custom Pages</h4>
              <div className="space-y-2">
                {config?.pages?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{p.title}</p>
                      <span className="text-[9px] text-slate-400 font-mono">Slug: /{p.slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePageActive(p.id, p.is_active)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          p.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Draft'}
                      </button>
                      <button
                        onClick={() => handleDeletePage(p.id)}
                        className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. NAVIGATION BUILDER */}
        {activeSec === 'navigation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Add Menu Navigation Link</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Label (e.g. AI Tools)"
                  value={newNavItem.label}
                  onChange={(e) => setNewNavItem({ ...newNavItem, label: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Route (e.g. /tools)"
                  value={newNavItem.route}
                  onChange={(e) => setNewNavItem({ ...newNavItem, route: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="text"
                  placeholder="Lucide Icon Name"
                  value={newNavItem.icon}
                  onChange={(e) => setNewNavItem({ ...newNavItem, icon: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <button
                  onClick={handleAddNavItem}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-400 uppercase">Navigation Menu Layout</h4>
              <div className="space-y-2">
                {config?.navigation?.map((nav: any) => (
                  <div key={nav.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                        <Menu size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">{nav.label}</p>
                        <span className="text-[9px] text-slate-400 font-mono">Route: {nav.route}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteNavItem(nav.id)}
                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. LANDING PAGE BUILDER */}
        {activeSec === 'landing' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Landing Page Section Builder</h3>
            <p className="text-[10px] text-slate-500">Enable, disable, rename or re-order core sections of the dynamic corporate landing page.</p>
            <div className="space-y-2">
              {['Hero Section', 'Feature Cards', 'Statistics', 'Testimonials', 'Pricing Plan Cards', 'FAQ Section', 'Contact Form', 'Footer Layout'].map((sect, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{sect}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-blue-500/15 text-blue-400 border border-blue-500/20">Order: {i+1}</span>
                    <button className="px-2.5 py-1 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400">Enabled</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CMS (Content Management) */}
        {activeSec === 'cms' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">CMS Article/Announcement Builder</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newCms.title}
                  onChange={(e) => setNewCms({ ...newCms, title: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <select
                  value={newCms.type}
                  onChange={(e) => setNewCms({ ...newCms, type: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Blog">Blog Post</option>
                  <option value="Announcement">Announcement</option>
                  <option value="News">News Alert</option>
                  <option value="FAQ">FAQ Item</option>
                  <option value="Policies">Policy</option>
                  <option value="Documentation">Documentation</option>
                </select>
                <button
                  onClick={() => {
                    if (!newCms.title) return alert('Enter title');
                    setCmsPosts([...cmsPosts, { id: Date.now().toString(), ...newCms }]);
                    setNewCms({ title: '', type: 'Blog', is_active: true });
                  }}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add CMS Entry
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase">Current CMS Entries</h4>
              <div className="space-y-2">
                {cmsPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{post.title}</p>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">{post.type}</span>
                    </div>
                    <button
                      onClick={() => setCmsPosts(cmsPosts.filter(c => c.id !== post.id))}
                      className="p-1.5 rounded bg-red-500/10 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. FEATURE MANAGER */}
        {activeSec === 'features' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Feature Manager</h3>
            <p className="text-[10px] text-slate-500">Toggle SaaS core capability features, or rename them dynamically across the workstation tabs.</p>
            <div className="space-y-2">
              {config?.features?.map((f: any) => (
                <div key={f.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{f.display_name}</p>
                    <span className="text-[8px] text-slate-400 font-mono">{f.name}</span>
                  </div>
                  <button
                    onClick={() => handleToggleFeature(f.id, f.is_enabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      f.is_enabled 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {f.is_enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. DASHBOARD BUILDER */}
        {activeSec === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Add Custom Dashboard Widget</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Widget Title (e.g. Conversion)"
                  value={newWidget.title}
                  onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <select
                  value={newWidget.widget_type}
                  onChange={(e) => setNewWidget({ ...newWidget, widget_type: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="metric">Metric Stat</option>
                  <option value="chart">Analytical Chart</option>
                  <option value="table">List Table</option>
                </select>
                <input
                  type="text"
                  placeholder="Config JSON String"
                  value={newWidget.config_json}
                  onChange={(e) => setNewWidget({ ...newWidget, config_json: e.target.value })}
                  className="px-3 py-2 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
                <button
                  onClick={handleAddWidget}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Widget
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase">Dashboard Layout Widgets</h4>
              <div className="space-y-2">
                {config?.widgets?.map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{w.title}</p>
                      <span className="text-[9px] text-slate-400">Type: {w.widget_type}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteWidget(w.id)}
                      className="p-1.5 rounded bg-red-500/10 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. FORM BUILDER */}
        {activeSec === 'forms' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Dynamic Visual Form Builder</h3>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Form Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Intake Form"
                  value={newForm.form_name}
                  onChange={(e) => setNewForm({ ...newForm, form_name: e.target.value })}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between items-center">
                  <span>Form Fields Schema</span>
                  <button
                    onClick={handleAddFormField}
                    className="text-blue-400 flex items-center gap-1 hover:underline text-[9px] font-black"
                  >
                    <Plus size={10} /> Add Field
                  </button>
                </label>
                
                {newForm.fields.map((fld, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center bg-white/20 dark:bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                    <input
                      type="text"
                      placeholder="Field Label"
                      value={fld.label}
                      onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                      className="flex-grow px-2 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-950/40 border border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                    />
                    <select
                      value={fld.type}
                      onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                      className="px-2 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-950/40 border border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                    >
                      <option value="text">Text Input</option>
                      <option value="textarea">Textarea Box</option>
                      <option value="email">Email address</option>
                      <option value="number">Numeric Val</option>
                      <option value="select">Dropdown Select</option>
                    </select>
                    <button
                      onClick={() => handleRemoveFormField(idx)}
                      className="p-1.5 rounded bg-red-500/10 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveForm}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save size={13} /> Save Custom Form Schema
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase">Existing Dynamic Forms</h4>
              <div className="space-y-2">
                {config?.forms?.map((frm: any) => (
                  <div key={frm.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{frm.form_name}</p>
                      <span className="text-[9px] text-slate-400 font-mono">Endpoint: /submit/{frm.id}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteForm(frm.id)}
                      className="p-1.5 rounded bg-red-500/10 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. EMAIL TEMPLATE BUILDER */}
        {activeSec === 'emails' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Email Template Builder</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Email Scenario</label>
                <select
                  value={selectedEmailType}
                  onChange={(e) => setSelectedEmailType(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="welcome">Welcome User Email</option>
                  <option value="reset_password">Password Reset Request</option>
                  <option value="subscription">Subscription Upgrade Invoice</option>
                  <option value="invoice">Monthly Payment Billing</option>
                  <option value="notification">Core System Alert Notify</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subject line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Body HTML Markup</label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none font-mono"
              />
            </div>
            <button
              onClick={handleSaveEmailTemplate}
              disabled={saving}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Email Template
            </button>
          </div>
        )}

        {/* 11. AUTHENTICATION CONFIG */}
        {activeSec === 'auth' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Authentication & Registration settings</h3>
            <p className="text-[10px] text-slate-500">Manage global / tenant access configuration rules. Toggle single-sign-on (SSO), OTP, or registration approval workflows.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Invite-Only Access</p>
                  <span className="text-[8px] text-slate-400">Strictly registration only by invitation code</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.invite_only}
                  onChange={(e) => setPlatformForm({ ...platformForm, invite_only: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Registration Approval Required</p>
                  <span className="text-[8px] text-slate-400">Manual approval for every register account</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.registration_approval}
                  onChange={(e) => setPlatformForm({ ...platformForm, registration_approval: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Email Password Login</p>
                  <span className="text-[8px] text-slate-400">Standard email password credential login</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.enable_email_login}
                  onChange={(e) => setPlatformForm({ ...platformForm, enable_email_login: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Google OAuth Login</p>
                  <span className="text-[8px] text-slate-400">Enable Google SSO sign-in support</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.enable_google_login}
                  onChange={(e) => setPlatformForm({ ...platformForm, enable_google_login: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">OTP Verification Login</p>
                  <span className="text-[8px] text-slate-400">One-time password authentication logins</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.enable_otp_login}
                  onChange={(e) => setPlatformForm({ ...platformForm, enable_otp_login: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Magic Link Login</p>
                  <span className="text-[8px] text-slate-400">Send passwordless magic token link via email</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformForm.enable_magic_link}
                  onChange={(e) => setPlatformForm({ ...platformForm, enable_magic_link: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleSavePlatformSettings}
              disabled={saving}
              className="mt-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save Access Control Settings
            </button>
          </div>
        )}

        {/* 12. CUSTOM CSS/JS MANAGER */}
        {activeSec === 'custom_code' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Custom CSS / JS / Tracking script manager</h3>
            <p className="text-[10px] text-slate-500">Inject styling and client analytics tags globally onto the head/body without rewriting production components.</p>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Inject custom CSS</label>
              <textarea
                rows={4}
                placeholder="body { font-family: monospace; }"
                value={platformForm.custom_css}
                onChange={(e) => setPlatformForm({ ...platformForm, custom_css: e.target.value })}
                className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Inject custom Javascript</label>
              <textarea
                rows={4}
                placeholder="console.log('White label platform script injected');"
                value={platformForm.custom_js}
                onChange={(e) => setPlatformForm({ ...platformForm, custom_js: e.target.value })}
                className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Analytics/Tracking scripts (Google Analytics / Pixel)</label>
              <textarea
                rows={3}
                placeholder="<!-- Global site tag (gtag.js) -->"
                value={platformForm.tracking_scripts}
                onChange={(e) => setPlatformForm({ ...platformForm, tracking_scripts: e.target.value })}
                className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none font-mono"
              />
            </div>
            <button
              onClick={handleSavePlatformSettings}
              disabled={saving}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Inject Code scripts
            </button>
          </div>
        )}

        {/* 13. WHITE LABEL MANAGER */}
        {activeSec === 'white_label' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Tenant White Label Workspace Domains</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Workspace Tenant</label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <option value="" className="text-slate-950 dark:text-white bg-white dark:bg-slate-950">Select tenant...</option>
                    {config?.tenants?.map((t: any) => (
                      <option key={t.id} value={t.id} className="text-slate-950 dark:text-white bg-white dark:bg-slate-950">{t.name} (/{t.slug})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Custom Domain URL</label>
                  <input
                    type="text"
                    placeholder="tenant-a.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-xl text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSaveTenantBranding}
                    disabled={saving}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 h-9"
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Bind Domain
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase">Active Branded Tenants</h4>
              <div className="space-y-2">
                {config?.tenants?.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{t.name}</p>
                      <span className="text-[9px] text-slate-400 font-mono">Workspace Slug: /{t.slug}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">Branded Tenant</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 14. MEDIA LIBRARY */}
        {activeSec === 'media' && (
          <div className="space-y-6">
            <form onSubmit={handleUploadMedia} className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upload Brand Assets</h3>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                  className="text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={saving || !mediaFile}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  Upload Media Asset
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase">Uploaded Files Library</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {config?.media?.map((m: any) => {
                  const isImage = m.file_type === 'image';
                  const isVideo = m.file_type === 'video';
                  return (
                    <div key={m.id} className="relative rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/40 p-3 flex flex-col justify-between h-36">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">{m.file_type}</span>
                        <button
                          onClick={() => handleDeleteMedia(m.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      <div className="flex-grow flex items-center justify-center my-2">
                        {isImage ? (
                          <Image className="text-blue-500 opacity-60" size={32} />
                        ) : isVideo ? (
                          <Video className="text-violet-500 opacity-60" size={32} />
                        ) : (
                          <DocIcon className="text-amber-500 opacity-60" size={32} />
                        )}
                      </div>

                      <div className="truncate text-center">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate">{m.file_name}</p>
                        <span className="text-[8px] text-slate-400 select-all">{m.file_url}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
