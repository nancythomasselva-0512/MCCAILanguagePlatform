import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export const FooterParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll hook targeting the main section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scrollYProgress from [0, 1] to [-50, 150] for the truck layer
  const truckY = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  return (
    <div className="w-full bg-[#f8f9fa] font-sans antialiased">
      {/* Inject Google Font Inter */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />



      {/* ── 3. MAIN PARALLAX CONTAINER ──────────────────────────────────────── */}
      <section
        ref={containerRef}
        className="relative h-screen w-full bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260430_115327_3f256636-9e63-4885-8d0b-09317dc2b0a5.png&w=1280&q=85')`,
        }}
      >
        {/* ── 4. THE TOP-ALIGNED FOOTER CARD ───────────────────────────────── */}
        <div className="absolute top-0 w-full px-4 pt-12 md:pt-24 lg:pt-12 z-30">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl md:rounded-3xl overflow-hidden"
          >
            {/* Footer Content (Top Half) */}
            <div className="p-6 md:p-10 lg:p-12 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
              
              {/* Logo Area - Our Platform Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img
                  src="/logo.png?v=3"
                  alt="Fluentia Logo"
                  className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-display text-xl md:text-2xl font-black tracking-tight text-gray-900 leading-none">
                    Fluentia
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mt-1 text-teal-600">
                    AI Language Platform
                  </span>
                </div>
              </div>

              {/* Links Area */}
              <div className="flex flex-wrap gap-8 sm:gap-10 md:gap-12 lg:gap-16">
                {/* Column 1: Company */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                    Company
                  </h4>
                  <ul className="space-y-2.5">
                    {['Founding', 'Platform', 'Testify'].map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Mobile */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                    Mobile
                  </h4>
                  <ul className="space-y-2.5">
                    {['Get Apple App', 'Get Google App'].map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Contracts */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                    Contracts
                  </h4>
                  <ul className="space-y-2.5">
                    {['Private Data', 'User Consent'].map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: Contact Us */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                    Contact Us
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=aachinancy@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                      >
                        <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>aachinancy@gmail.com</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+18005550199"
                        className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                      >
                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>+1 (800) 555-0199</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://maps.google.com/?q=MMIP,MCC,Tambaram,600059"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors duration-200"
                      >
                        <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>MMIP, MCC, Tambaram 600059</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Footer Content (Bottom Bar) */}
            <div className="border-t border-gray-100 bg-white px-6 md:px-10 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 font-medium">
                © 2026 Fluentia. All Rights Reserved.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-1.3.7-1.97 1.6-1.97.9 0 1.45.67 1.45 1.97v4.93h2.89M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.81a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
                  </svg>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FooterParallax;
