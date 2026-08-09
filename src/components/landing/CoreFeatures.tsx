import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';

interface CoreFeaturesProps {
  onLaunchTool?: (tab: ActiveTabType) => void;
}

export const CoreFeatures: React.FC<CoreFeaturesProps> = ({ onLaunchTool }) => {
  const { setActiveTab, user, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleLaunch = (tab: ActiveTabType) => {
    if (onLaunchTool) {
      onLaunchTool(tab);
    } else {
      setActiveTab(tab);
      if (user) logout();
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="c1-section">
      {/* Inject Google Font Inter */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .c1-section * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .c1-section {
          background-color: #ffffff;
          padding: 48px 24px 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }

        .c1-container {
          max-width: 1360px;
          width: 100%;
          text-align: left;
          margin: 0 auto;
        }

        .c1-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .c1-badge-num {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #0f172a;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .c1-badge-pill {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          padding: 6px 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .c1-title {
          font-size: clamp(1.75rem, 5vw, 4.2rem);
          font-weight: 500;
          color: #111827;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
          line-height: 1.12;
          text-align: left;
        }

        .c1-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 400;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 24px;
          text-align: left;
        }

        /* TOGGLE SWITCH STYLES - OUR THEME (#0f172a + SLATE) */
        .c1-toggle-container {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1.5px solid #0f172a;
          padding: 5px;
          border-radius: 40px;
          margin-bottom: 42px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .c1-toggle-btn {
          border: none;
          background: transparent;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #64748b;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .c1-toggle-btn:hover {
          color: #0f172a;
        }

        .c1-toggle-btn.c1-toggle-active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.3);
        }

        .c1-save-badge {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          font-size: 0.66rem;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 14px;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }

        .c1-toggle-active .c1-save-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }

        .c1-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        @media (max-width: 1150px) {
          .c1-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .c1-title {
            font-size: 2.85rem;
          }
        }

        @media (max-width: 640px) {
          .c1-grid {
            grid-template-columns: 1fr;
          }
          .c1-title {
            font-size: 2.2rem;
          }
        }

        .c1-card {
          border-radius: 24px;
          height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          overflow: hidden;
          text-align: left;
          background: #F4F8F9;
          box-shadow: 0 12px 36px -10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .c1-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px -10px rgba(0,0,0,0.16);
        }

        .c1-card h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
          padding: 20px 24px 28px 24px;
          z-index: 2;
          margin: 0;
        }

        /* CARD RADIAL BACKGROUND GRADIENTS */
        .c1-card-1 {
          background: radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%);
        }
        .c1-card-2 {
          background: radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%);
        }
        .c1-card-3 {
          background: radial-gradient(circle at 50% 0%, #F9ED96 0%, #E5A1F5 30%, #F4F8F9 60%, #F4F8F9 100%);
        }
        .c1-card-4 {
          background: radial-gradient(circle at 50% 0%, #F8ACA0 0%, #FFB347 30%, #F4F8F9 60%, #F4F8F9 100%);
        }

        .c1-prompt-box {
          background: #ffffff;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
          box-shadow: 0 8px 22px rgba(0,0,0,0.05);
          position: absolute;
          top: 68px;
          left: 22px;
          right: 22px;
          text-align: left;
        }

        .c1-blur-text {
          background: linear-gradient(90deg, #FFB347, #E5A1F5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .c1-pill-btn, .c1-search {
          position: absolute;
          top: 20px;
          left: 22px;
          background: #ffffff;
          border: 1px solid #000000;
          padding: 5px 10px 5px 14px;
          border-radius: 24px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1e293b;
          box-shadow: 0 4px 18px rgba(0,0,0,0.09);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
        }

        /* HIGHLIGHTED PRICE TEXT (NO BLACK BG, RUPEES COLOR ONLY) */
        .c1-price-highlight {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0;
          margin-left: 2px;
        }

        .c1-mesh {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 18px 18px;
          mask-image: radial-gradient(circle at center top, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center top, black 0%, transparent 80%);
        }

        /* METADATA / TAGS SECTION INSIDE CARDS */
        .c1-card-meta {
          padding: 0 18px 24px 18px;
          z-index: 2;
        }

        .c1-stats-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .c1-stats-left {
          color: #64748b;
        }
        .c1-stats-right {
          color: #10b981;
        }

        .c1-tag-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .c1-meta-tag {
          font-size: 11px;
          font-weight: 600;
          color: #334155;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 5px 6px;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }
      `}</style>

      <div className="c1-container">
        {/* Header Block */}
        <div className="c1-badge-row">
          <div className="c1-badge-num">3</div>
          <span className="c1-badge-pill">Flexible Pricing Plans</span>
        </div>
        <h2 className="c1-title">Choose the Perfect Plan for You</h2>
        <p className="c1-subtitle">
          Start for free with a 7-day trial, or scale up with flexible monthly plans<br />
          tailored for your speech, translation, and AI processing needs.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="c1-toggle-container">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`c1-toggle-btn ${billingCycle === 'monthly' ? 'c1-toggle-active' : ''}`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`c1-toggle-btn ${billingCycle === 'yearly' ? 'c1-toggle-active' : ''}`}
          >
            YEARLY <span className="c1-save-badge">SAVE 30%</span>
          </button>
        </div>

        {/* 4 Gradient Cards Grid combining Prompt Specification Box UI + AI Models Content */}
        <div className="c1-grid">
          
          {/* CARD 1: FREE PLAN */}
          <div className="c1-card c1-card-1" onClick={() => handleLaunch('voice-to-text')}>
            <div className="c1-pill-btn">
              <span style={{ color: '#10b981', fontSize: '1rem' }}>✦</span> Free Plan — <span className="c1-price-highlight" style={{ color: '#059669' }}>₹0/mo</span>
            </div>

            <div className="c1-prompt-box">
              <span className="c1-blur-text">7 Days Free Trial</span> with{' '}
              <span className="c1-blur-text">15 mins audio</span>, 10k translation chars, 5k TTS synthesis &amp; 50 MB storage.
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">BASIC TIER</span>
                <span className="c1-stats-right">ACTIVE PLAN</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 15 mins audio</span>
                <span className="c1-meta-tag">✓ 10k translation</span>
                <span className="c1-meta-tag">✓ 5k TTS chars</span>
                <span className="c1-meta-tag">✓ 50 MB storage</span>
              </div>
            </div>
          </div>

          {/* CARD 2: STARTER PLAN */}
          <div className="c1-card c1-card-2" onClick={() => handleLaunch('text-to-speech')}>
            <div className="c1-pill-btn">
              <span style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span> Starter Plan — <span className="c1-price-highlight" style={{ color: '#d97706' }}>
                {billingCycle === 'yearly' ? '₹13/mo' : '₹19/mo'}
              </span>
            </div>

            <div className="c1-prompt-box" style={{ background: 'rgba(255,255,255,0.92)' }}>
              <span className="c1-blur-text">Starter Plan</span>: <span className="c1-blur-text">60 mins audio processing</span>, 100k translation chars, 50k TTS synthesis &amp; 500 MB secure storage.
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">STARTER TIER</span>
                <span className="c1-stats-right" style={{ color: '#f59e0b' }}>RECOMMENDED</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 60 mins audio</span>
                <span className="c1-meta-tag">✓ 100k translation</span>
                <span className="c1-meta-tag">✓ 50k TTS chars</span>
                <span className="c1-meta-tag">✓ 500 MB storage</span>
              </div>
            </div>
          </div>

          {/* CARD 3: PROFESSIONAL PLAN */}
          <div className="c1-card c1-card-3" onClick={() => handleLaunch('translation')}>
            <div className="c1-mesh" />

            <div className="c1-search">
              <span style={{ color: '#a855f7', fontWeight: 700 }}>✦ Professional Plan — </span>
              <span className="c1-price-highlight" style={{ color: '#7c3aed' }}>
                {billingCycle === 'yearly' ? '₹34/mo' : '₹49/mo'}
              </span>
            </div>

            <div className="c1-prompt-box" style={{ background: 'rgba(255,255,255,0.92)' }}>
              <span className="c1-blur-text">Professional Plan</span>: <span className="c1-blur-text">300 mins audio processing</span>, 500k translation chars, 250k TTS synthesis &amp; 2000 MB storage.
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">PRO TIER</span>
                <span className="c1-stats-right" style={{ color: '#a855f7' }}>HIGH CAPACITY</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 300 mins audio</span>
                <span className="c1-meta-tag">✓ 500k translation</span>
                <span className="c1-meta-tag">✓ 250k TTS chars</span>
                <span className="c1-meta-tag">✓ 2000 MB storage</span>
              </div>
            </div>
          </div>

          {/* CARD 4: ENTERPRISE PLAN */}
          <div className="c1-card c1-card-4" onClick={() => handleLaunch('audio-transcription')}>
            <div className="c1-pill-btn">
              <span style={{ color: '#ec4899', fontSize: '1rem' }}>✦</span> Enterprise Plan — <span className="c1-price-highlight" style={{ color: '#db2777' }}>
                {billingCycle === 'yearly' ? '₹104/mo' : '₹149/mo'}
              </span>
            </div>

            <div className="c1-prompt-box">
              <span className="c1-blur-text">Enterprise Plan</span>: <span className="c1-blur-text">1200 mins audio processing</span>, 2000k translation chars, 1000k TTS synthesis &amp; 10 GB storage.
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">ENTERPRISE TIER</span>
                <span className="c1-stats-right" style={{ color: '#ec4899' }}>UNLIMITED SCALING</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 1200 mins audio</span>
                <span className="c1-meta-tag">✓ 2000k translation</span>
                <span className="c1-meta-tag">✓ 1000k TTS chars</span>
                <span className="c1-meta-tag">✓ 10 GB storage</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoreFeatures;
