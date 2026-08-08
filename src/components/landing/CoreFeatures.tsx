import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ActiveTabType } from '../../context/AppContext';

interface CoreFeaturesProps {
  onLaunchTool?: (tab: ActiveTabType) => void;
}

export const CoreFeatures: React.FC<CoreFeaturesProps> = ({ onLaunchTool }) => {
  const { setActiveTab, user, setIsAuthModalOpen, setAuthModalMode, logout } = useApp();

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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
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
          padding: 90px 24px;
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
          margin-bottom: 24px;
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
          margin-bottom: 20px;
          line-height: 1.12;
          text-align: left;
        }

        .c1-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 400;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 50px;
          text-align: left;
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
            font-size: 2.35rem;
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
          padding: 16px 18px;
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.6;
          box-shadow: 0 8px 22px rgba(0,0,0,0.05);
          position: absolute;
          top: 28px;
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

        .c1-pill-btn {
          position: absolute;
          top: 200px;
          left: 32px;
          background: #ffffff;
          border: 1px solid #000000;
          padding: 7px 16px;
          border-radius: 24px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          box-shadow: 0 4px 18px rgba(0,0,0,0.09);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 5;
        }

        .c1-cursor {
          position: absolute;
          top: 225px;
          left: 110px;
          width: 28px;
          height: 28px;
          z-index: 10;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }

        .c1-api-visual {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
        }

        .c1-network-img {
          width: 100%;
          height: 185px;
          object-fit: contain;
          margin-top: 10px;
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

        .c1-folder {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 175px;
          filter: drop-shadow(0 15px 25px rgba(0,0,0,0.08));
        }

        .c1-search {
          position: absolute;
          top: 210px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          border: 1px solid #000000;
          padding: 7px 18px;
          border-radius: 24px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
        }

        /* METADATA / TAGS SECTION INSIDE CARDS */
        .c1-card-meta {
          padding: 0 24px;
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
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .c1-meta-tag {
          font-size: 11.5px;
          font-weight: 600;
          color: #334155;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          padding: 3px 10px;
          border-radius: 14px;
          backdrop-filter: blur(4px);
        }
      `}</style>

      <div className="c1-container">
        {/* Header Block */}
        <div className="c1-badge-row">
          <div className="c1-badge-num">2</div>
          <span className="c1-badge-pill">Our AI Modules</span>
        </div>
        <h2 className="c1-title">Built for Speed &amp; Precision</h2>
        <p className="c1-subtitle">
          Everything you need for voice recognition, speech synthesis,<br />
          translation, and audio transcription.
        </p>

        {/* 4 Gradient Cards Grid combining Prompt Specification Box UI + AI Models Content */}
        <div className="c1-grid">
          
          {/* CARD 1: VOICE TO TEXT */}
          <div className="c1-card c1-card-1" onClick={() => handleLaunch('voice-to-text')}>
            <div className="c1-prompt-box">
              Convert live speech or voice recordings to{' '}
              <span className="c1-blur-text">accurate text in real-time</span> with{' '}
              <span className="c1-blur-text">automatic language detection</span>.
            </div>

            <div className="c1-pill-btn">
              <span style={{ color: '#a855f7', fontSize: '1rem' }}>✦</span> Launch Voice AI
            </div>

            <svg
              className="c1-cursor"
              viewBox="0 0 24 24"
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="1"
            >
              <path d="M4 2L20 11L11 13L9 22L4 2Z" />
            </svg>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">Real-Time Capturing</span>
                <span className="c1-stats-right">ONNX Engine Ready</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ Live recording</span>
                <span className="c1-meta-tag">✓ Auto detection</span>
                <span className="c1-meta-tag">✓ Download TXT</span>
              </div>
            </div>

            <h3>Voice to Text</h3>
          </div>

          {/* CARD 2: TEXT TO VOICE */}
          <div className="c1-card c1-card-2" onClick={() => handleLaunch('text-to-speech')}>
            <div className="c1-api-visual">
              <img
                src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg"
                alt="Voice Synthesis Network"
                className="c1-network-img"
              />
            </div>

            <div className="c1-pill-btn" style={{ top: '190px', left: '30px' }}>
              <span style={{ color: '#a855f7', fontSize: '1rem' }}>✦</span> Synthesize Speech
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">High-Fidelity Synthesis</span>
                <span className="c1-stats-right">12 Voices Loaded</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 20+ neural voices</span>
                <span className="c1-meta-tag">✓ Speed control</span>
                <span className="c1-meta-tag">✓ MP3 download</span>
              </div>
            </div>

            <h3>Text to Voice</h3>
          </div>

          {/* CARD 3: TEXT TRANSLATION */}
          <div className="c1-card c1-card-3" onClick={() => handleLaunch('translation')}>
            <div className="c1-mesh" />

            <img
              src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg"
              alt="Translation Folder"
              className="c1-folder"
            />

            <div className="c1-search">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>100+ Languages (English ⇄ Tamil)</span>
            </div>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">Multi-Lingual Mapping</span>
                <span className="c1-stats-right">Offline Translating</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ 100+ languages</span>
                <span className="c1-meta-tag">✓ Source detection</span>
                <span className="c1-meta-tag">✓ Audio output</span>
              </div>
            </div>

            <h3>Text Translation</h3>
          </div>

          {/* CARD 4: AUDIO TO TEXT */}
          <div className="c1-card c1-card-4" onClick={() => handleLaunch('audio-transcription')}>
            <div className="c1-prompt-box">
              Upload audio files (MP3, WAV, M4A) to generate{' '}
              <span className="c1-blur-text">accurate transcripts</span> equipped with{' '}
              <span className="c1-blur-text">automatic timestamps</span>.
            </div>

            <div className="c1-pill-btn">
              <span style={{ color: '#a855f7', fontSize: '1rem' }}>✦</span> Upload Audio File
            </div>

            <svg
              className="c1-cursor"
              viewBox="0 0 24 24"
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="1"
            >
              <path d="M4 2L20 11L11 13L9 22L4 2Z" />
            </svg>

            <div className="c1-card-meta">
              <div className="c1-stats-row">
                <span className="c1-stats-left">Timeline Segmentation</span>
                <span className="c1-stats-right">All Formats Supported</span>
              </div>
              <div className="c1-tag-list">
                <span className="c1-meta-tag">✓ Multiple formats</span>
                <span className="c1-meta-tag">✓ Timestamps</span>
                <span className="c1-meta-tag">✓ Inline editor</span>
              </div>
            </div>

            <h3>Audio to Text</h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoreFeatures;
