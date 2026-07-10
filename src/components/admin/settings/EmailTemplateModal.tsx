import React, { useState, useEffect, useRef } from "react";
import { X, Send, Save, AlertTriangle } from "lucide-react";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import { apiRequest } from "../../../utils/api";

interface EmailTemplateModalProps {
  template: any;
  onClose: () => void;
  onSaved: () => void;
}

const TEMPLATE_VARIABLES: Record<string, string[]> = {
  "welcome": ["{{user_name}}", "{{tenant_name}}", "{{login_url}}", "{{company_name}}", "{{plan_name}}"],
  "invoice_generated": ["{{customer_name}}", "{{invoice_number}}", "{{invoice_date}}", "{{invoice_total}}", "{{currency}}", "{{download_invoice_url}}"],
  "payment_success": ["{{tenant_name}}", "{{plan_name}}", "{{amount}}", "{{payment_method}}", "{{payment_id}}", "{{transaction_id}}", "{{invoice_number}}", "{{expiry_date}}"],
  "otp_verification": ["{{otp}}", "{{expiry_minutes}}"],
  "reset_password": ["{{reset_link}}", "{{user_name}}"],
  "user_invitation": ["{{user_name}}", "{{tenant_name}}", "{{invite_link}}", "{{company_name}}"]
};

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ template, onClose, onSaved }) => {
  const [subject, setSubject] = useState(template.subject || "");
  const [bodyHtml, setBodyHtml] = useState(template.body_html || "");
  const [fromEmail, setFromEmail] = useState(template.from_email || "");
  const [replyTo, setReplyTo] = useState(template.reply_to || "");
  const [isEnabled, setIsEnabled] = useState(template.is_enabled ?? true);
  const [senders, setSenders] = useState<string[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [showTestInput, setShowTestInput] = useState(false);
  
  const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    fetchSenders();
  }, []);

  const fetchSenders = async () => {
    try {
      const res = await apiRequest("/super-admin/email-senders");
      if (res.senders && res.senders.length > 0) {
        setSenders(res.senders);
        if (!fromEmail) setFromEmail(res.senders[0]); // Auto select if empty
      }
    } catch (err) {
      console.error("Failed to fetch senders", err);
    }
  };

  const insertVariable = (variable: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertText(range.index, variable);
      editor.setSelection(range.index + variable.length, 0);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setNotification(null);
    try {
      await apiRequest(`/super-admin/email-templates/${template.template_type}`, {
        method: "PUT",
        body: JSON.stringify({
          subject,
          body_html: bodyHtml,
          from_email: fromEmail,
          reply_to: replyTo,
          is_enabled: isEnabled
        })
      });
      setNotification({ type: 'success', msg: 'Template saved successfully!' });
      setTimeout(() => {
        onSaved();
      }, 1500);
    } catch (err: any) {
      setNotification({ type: 'error', msg: err.message || 'Failed to save template' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      setNotification({ type: 'error', msg: 'Please enter a test email address' });
      return;
    }
    
    setIsSendingTest(true);
    setNotification(null);
    try {
      // Create some mock data based on the type
      const sampleData: Record<string, string> = {};
      const vars = TEMPLATE_VARIABLES[template.template_type] || [];
      vars.forEach(v => {
        const cleanVar = v.replace("{{", "").replace("}}", "");
        sampleData[cleanVar] = `[Sample ${cleanVar.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}]`;
      });
      
      await apiRequest(`/super-admin/email-templates/test`, {
        method: "POST",
        body: JSON.stringify({
          template_type: template.template_type,
          recipient_email: testEmail,
          sample_data: sampleData
        })
      });
      setNotification({ type: 'success', msg: 'Test email sent successfully!' });
      setShowTestInput(false);
    } catch (err: any) {
      setNotification({ type: 'error', msg: err.message || 'Failed to send test email' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit Template</h2>
            <p className="text-sm font-bold text-slate-500 capitalize">{template.template_type.replace('_', ' ')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          
          {notification && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold text-sm shadow-xl z-10 flex items-center gap-2 animate-slideDown ${notification.type === 'success' ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>
              {notification.type === 'error' && <AlertTriangle size={16} />}
              {notification.msg}
            </div>
          )}

          {/* Left: Editor Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">From Email</label>
                <select 
                  value={fromEmail} 
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none font-medium appearance-none"
                >
                  <option value="">-- Select Sender --</option>
                  {senders.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Reply-To Email (Optional)</label>
                <input 
                  type="email" 
                  value={replyTo} 
                  onChange={(e) => setReplyTo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Email Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none font-bold text-lg"
              />
            </div>

            <div className="flex flex-col h-[400px]">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Email Body</label>
              <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden quill-wrapper">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow"
                  value={bodyHtml}
                  onChange={setBodyHtml}
                  modules={modules}
                  className="h-full flex flex-col"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-500"></div>
                <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300">Enable Template</span>
              </label>
            </div>
          </div>

          {/* Right: Variables & Preview */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/30">
              <h3 className="text-sm font-black mb-3 text-slate-900 dark:text-white">Dynamic Variables</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Click any variable below to insert it into the email body.</p>
              
              <div className="flex flex-wrap gap-2">
                {(TEMPLATE_VARIABLES[template.template_type] || []).map(variable => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-0 border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col h-[300px]">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-black uppercase text-slate-500">Live Preview</h3>
              </div>
              <div className="flex-1 p-4 bg-white text-slate-900 overflow-y-auto" dangerouslySetInnerHTML={{__html: bodyHtml}} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <div className="flex gap-2 items-center relative">
            {showTestInput ? (
              <div className="flex gap-2 animate-fadeIn">
                <input 
                  type="email" 
                  placeholder="Recipient Email..." 
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  className="px-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none min-w-[250px]"
                />
                <button 
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors"
                >
                  {isSendingTest ? 'Sending...' : 'Confirm'}
                </button>
                <button onClick={() => setShowTestInput(false)} className="px-3 py-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowTestInput(true)}
                className="px-4 py-2.5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Send size={16} /> Send Test Email
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-white/5 rounded-xl transition-colors text-sm">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
      
      {/* Required CSS overrides for ReactQuill in dark mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .quill-wrapper .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: inherit !important;
          background: rgba(0,0,0,0.02);
        }
        .dark .quill-wrapper .ql-toolbar {
          background: rgba(255,255,255,0.02);
          border-bottom-color: rgba(255,255,255,0.1) !important;
        }
        .dark .quill-wrapper .ql-stroke { stroke: #94a3b8; }
        .dark .quill-wrapper .ql-fill { fill: #94a3b8; }
        .dark .quill-wrapper .ql-picker { color: #94a3b8; }
        .quill-wrapper .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: inherit !important;
          font-family: inherit;
          font-size: 14px;
        }
        .quill-wrapper .ql-editor { min-height: 200px; }
      `}} />
    </div>
  );
};
