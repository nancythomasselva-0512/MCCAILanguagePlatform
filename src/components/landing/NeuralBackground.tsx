import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

const FLOATING_CHARS = ['0', '1', 'A', 'Ω', 'ஆ', '♫', '文', '★'];

export const NeuralBackground: React.FC = () => {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];
    const particleCount = Math.min(50, Math.floor((width * height) / 30000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.8,
        color: i % 3 === 0 ? 'rgba(59, 130, 246, 0.25)' : i % 3 === 1 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(6, 182, 212, 0.25)',
      });
    }

    // Floating symbols
    const symbols: Array<{
      x: number;
      y: number;
      char: string;
      speed: number;
      size: number;
      alpha: number;
      angle: number;
    }> = [];
    for (let i = 0; i < 15; i++) {
      symbols.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: FLOATING_CHARS[Math.floor(Math.random() * FLOATING_CHARS.length)],
        speed: 0.15 + Math.random() * 0.2,
        size: 9 + Math.random() * 8,
        alpha: 0.05 + Math.random() * 0.08,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Dynamic light beams
    const beams: Array<{ x: number; width: number; speed: number; alpha: number; maxAlpha: number }> = [];
    for (let i = 0; i < 3; i++) {
      beams.push({
        x: Math.random() * width,
        width: 150 + Math.random() * 250,
        speed: 0.1 + Math.random() * 0.15,
        alpha: 0,
        maxAlpha: 0.02 + Math.random() * 0.03,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      frameCount++;

      const mouse = mouseRef.current;
      const isDark = themeRef.current === 'dark';

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // ── 1. DRAW DYNAMIC AURORA GRADIENTS ───────────────────────────────────
      const auroraX1 = width * 0.2 + Math.sin(frameCount * 0.002) * 100;
      const auroraY1 = height * 0.3 + Math.cos(frameCount * 0.003) * 80;
      const radialGlow1 = ctx.createRadialGradient(auroraX1, auroraY1, 10, auroraX1, auroraY1, width * 0.6);
      if (isDark) {
        radialGlow1.addColorStop(0, 'rgba(30, 58, 138, 0.14)');
        radialGlow1.addColorStop(0.5, 'rgba(88, 28, 135, 0.06)');
        radialGlow1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      } else {
        radialGlow1.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        radialGlow1.addColorStop(0.5, 'rgba(147, 51, 234, 0.03)');
        radialGlow1.addColorStop(1, 'rgba(245, 247, 251, 0)');
      }
      ctx.fillStyle = radialGlow1;
      ctx.fillRect(0, 0, width, height);

      const auroraX2 = width * 0.8 + Math.cos(frameCount * 0.0025) * 120;
      const auroraY2 = height * 0.7 + Math.sin(frameCount * 0.0018) * 90;
      const radialGlow2 = ctx.createRadialGradient(auroraX2, auroraY2, 10, auroraX2, auroraY2, width * 0.5);
      if (isDark) {
        radialGlow2.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
        radialGlow2.addColorStop(0.6, 'rgba(59, 130, 246, 0.03)');
        radialGlow2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      } else {
        radialGlow2.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
        radialGlow2.addColorStop(0.6, 'rgba(59, 130, 246, 0.02)');
        radialGlow2.addColorStop(1, 'rgba(245, 247, 251, 0)');
      }
      ctx.fillStyle = radialGlow2;
      ctx.fillRect(0, 0, width, height);

      // ── 2. DRAW SUBTLE PARALLAX GRID ───────────────────────────────────────
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(15, 23, 42, 0.05)';
      ctx.lineWidth = 0.8;
      const gridSpacing = 65;
      // Parallax shift calculation
      const gridShiftX = (mouse.x - width / 2) * -0.012;
      const gridShiftY = (mouse.y - height / 2) * -0.012;

      ctx.beginPath();
      // Vertical grid lines
      for (let x = gridShiftX % gridSpacing; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal grid lines
      for (let y = gridShiftY % gridSpacing; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // ── 3. DRAW DRIFTING LIGHT BEAMS ───────────────────────────────────────
      beams.forEach((b) => {
        b.x += b.speed;
        if (b.x > width + b.width) {
          b.x = -b.width;
          b.width = 150 + Math.random() * 250;
        }

        // Sinusoidal opacity fade-in-out
        b.alpha = Math.sin((b.x / width) * Math.PI) * b.maxAlpha;

        const beamGrad = ctx.createLinearGradient(b.x, 0, b.x + b.width, height);
        if (isDark) {
          beamGrad.addColorStop(0, `rgba(6, 182, 212, ${b.alpha})`);
          beamGrad.addColorStop(0.5, `rgba(139, 92, 246, ${b.alpha * 0.5})`);
          beamGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        } else {
          beamGrad.addColorStop(0, `rgba(59, 130, 246, ${b.alpha * 0.8})`);
          beamGrad.addColorStop(0.5, `rgba(147, 51, 234, ${b.alpha * 0.4})`);
          beamGrad.addColorStop(1, 'rgba(245, 247, 251, 0)');
        }
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // ── 4. DRAW FLOATING LANGUAGE & AI SYMBOLS ──────────────────────────────
      symbols.forEach((s) => {
        s.y -= s.speed; // drift upwards
        s.x += Math.sin(frameCount * 0.005 + s.angle) * 0.15; // horizontal wiggle

        if (s.y < -30) {
          s.y = height + 30;
          s.x = Math.random() * width;
        }

        ctx.font = `${s.size}px Inter, sans-serif`;
        ctx.fillStyle = isDark ? `rgba(148, 163, 184, ${s.alpha})` : `rgba(71, 85, 105, ${s.alpha * 1.8})`;
        ctx.fillText(s.char, s.x, s.y);
      });

      // ── 5. DRAW NEURAL PARTICLE NETWORK ────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gravity pull
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          // 260 * 260 = 67600. Avoid Math.sqrt unless mouse is close
          if (distSqr < 67600) {
            const dist = Math.sqrt(distSqr);
            if (dist > 0) {
              const force = (260 - dist) / 4500;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSqr = dx * dx + dy * dy;

          // 155 * 155 = 24025. Avoid Math.sqrt unless nodes are close
          if (distSqr < 24025) {
            const dist = Math.sqrt(distSqr);
            const alpha = (1 - dist / 155) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(148, 163, 184, ${alpha})` : `rgba(71, 85, 105, ${alpha * 1.8})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-30 h-full w-full opacity-65" />;
};
