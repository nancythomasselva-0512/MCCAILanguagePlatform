import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Clock, ShieldCheck, Send, CheckCircle2, Sparkles, MessageSquare, User, Building } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    module: 'Voice to Text',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in both your name and work email.');
      return;
    }

    setIsSubmitting(true);
    // Simulate sending inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', module: 'Voice to Text', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="relative bg-[#FAFAFC] dark:bg-[#040814] py-12 sm:py-16 overflow-hidden border-b border-gray-100 dark:border-white/5">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start text-left mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12px] font-bold flex items-center justify-center shadow-sm">
              5
            </div>
            <span className="text-[13px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-4 py-1.5 bg-white dark:bg-slate-900 shadow-sm">
              Get in Touch
            </span>
          </div>

          <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-900 dark:text-white max-w-[760px]">
            Have Questions? Let's Talk AI.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-[620px] leading-[1.6]">
            Need custom enterprise deployments, API integration assistance, or tailored neural model training? Reach out to our engineering team.
          </p>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Contact Details & Badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-4"
          >
            {/* Direct Email Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Direct Email Support
                  </h4>
                  <a
                    href="mailto:support@mccai.com"
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    support@mccai.com
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Available 24/7 for technical and billing support.
                  </p>
                </div>
              </div>
            </div>

            {/* SLA Response Time Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Response Time
                    </h4>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Average response: &lt; 2 hours
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Rapid resolution SLA for enterprise tier subscribers.
                  </p>
                </div>
              </div>
            </div>

            {/* Enterprise SLA Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Enterprise SLA &amp; Privacy
                  </h4>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Custom AI &amp; API Deployments
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Zero data training, dedicated servers, and custom language vocabulary fine-tuning.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Glassmorphism Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Inquiry Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Our engineering team has received your message and will respond to your work email within 2 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 rounded-full px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors cursor-pointer"
                  >
                    Send Another Message →
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      Send an Inquiry
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      * Required fields
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Alex Morgan"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="alex@company.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Module Selection Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Interested Module / Service
                    </label>
                    <select
                      name="module"
                      value={formData.module}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                    >
                      <option value="Voice to Text">Voice to Text (Live Speech)</option>
                      <option value="Text to Voice">Text to Voice (Neural Synthesis)</option>
                      <option value="Text Translation">Text &amp; Dialect Translation</option>
                      <option value="Audio Transcription">Audio File Transcription</option>
                      <option value="Custom API">Enterprise Custom API Integration</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Message / Project Details
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements or custom integration needs..."
                      className="w-full p-3 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry →</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
