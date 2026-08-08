'use client';

import React, { useEffect, useRef } from 'react';

export const HeroShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles/Orbs for ChromaFlow (#ff5f03 momentum flow)
    const orbs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.8, vy: 0.6, radius: 280, color: 'rgba(255, 95, 3, 0.22)' },
      { x: width * 0.8, y: height * 0.4, vx: -0.7, vy: 0.5, radius: 320, color: 'rgba(255, 115, 20, 0.18)' },
      { x: width * 0.5, y: height * 0.7, vx: 0.5, vy: -0.8, radius: 360, color: 'rgba(242, 101, 34, 0.20)' },
      { x: width * 0.3, y: height * 0.8, vx: -0.6, vy: -0.4, radius: 240, color: 'rgba(255, 130, 40, 0.15)' }
    ];

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Base background color light gray #EFEFEF
      ctx.fillStyle = '#EFEFEF';
      ctx.fillRect(0, 0, width, height);

      // 1. Swirl & Waves (#ffffff & #f0f0f0 detail swirl)
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const y = Math.sin(x * 0.003 + time * 0.8) * 120 + Math.cos(x * 0.002 - time * 0.5) * 80 + height * 0.4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. ChromaFlow (#ff5f03 orange flow hotspots)
      orbs.forEach((orb) => {
        orb.x += orb.vx * 0.8;
        orb.y += orb.vy * 0.8;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(0.6, 'rgba(255, 95, 3, 0.05)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. FlutedGlass Vertical Ridge Shader lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      const ridgeWidth = 24;
      for (let x = 0; x < width; x += ridgeWidth * 2) {
        ctx.fillRect(x + Math.sin(time + x * 0.01) * 6, 0, ridgeWidth, height);
      }

      // 4. FilmGrain noise simulation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
      for (let i = 0; i < 400; i++) {
        const gx = Math.random() * width;
        const gy = Math.random() * height;
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-90 dark:opacity-40 transition-opacity duration-500"
    />
  );
};
