import React, { useEffect, useRef } from 'react';

const GLYPHS = ['A', 'ஆ', '文', 'Ω', '♫', '語', 'हिं', 'EN', 'ES', 'FR', 'AR'];

export const HeroNeuralSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 500);
    let height = (canvas.height = 500);

    // Core Sphere Points
    const corePoints: Array<{ x: number; y: number; z: number; color: string }> = [];
    const numCorePoints = 160;
    const rCore = 120; // sphere radius

    for (let i = 0; i < numCorePoints; i++) {
      const phi = Math.acos(1 - (2 * i) / numCorePoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      corePoints.push({
        x: rCore * Math.cos(theta) * Math.sin(phi),
        y: rCore * Math.sin(theta) * Math.sin(phi),
        z: rCore * Math.cos(phi),
        color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#a855f7' : '#06b6d4',
      });
    }

    // Orbiting Glyphs (on outer tilted rings)
    const glyphs: Array<{ angle: number; r: number; glyph: string; speed: number; yOffset: number }> = [];
    for (let i = 0; i < GLYPHS.length; i++) {
      glyphs.push({
        angle: (i * (Math.PI * 2)) / GLYPHS.length,
        r: 170,
        glyph: GLYPHS[i],
        speed: 0.006 + Math.random() * 0.004,
        yOffset: (Math.random() - 0.5) * 50,
      });
    }

    // Waveform dots orbiting the equator
    const waveDots: Array<{ angle: number; r: number }> = [];
    const numWaveDots = 45;
    for (let i = 0; i < numWaveDots; i++) {
      waveDots.push({
        angle: (i * (Math.PI * 2)) / numWaveDots,
        r: 145,
      });
    }

    let angleY = 0.003;
    let angleX = 0.0015;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current.targetX = (e.clientX - cx) * 0.0015;
      mouseRef.current.targetY = (e.clientY - cy) * 0.0015;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Soft mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleY = angleY + mouseRef.current.x;
      const currentAngleX = angleX + mouseRef.current.y;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // Rotate and Project Core Sphere Points
      const projectedCore: Array<{ x: number; y: number; z: number; color: string; rx: number; ry: number }> = [];
      for (let i = 0; i < corePoints.length; i++) {
        const p = corePoints[i];

        // Spin Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Spin X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Update positions
        p.x = x1;
        p.y = y2;
        p.z = z2;

        const scale = 360 / (360 + z2);
        projectedCore.push({
          x: cx + p.x * scale,
          y: cy + p.y * scale,
          z: z2,
          color: p.color,
          rx: p.x,
          ry: p.y,
        });
      }

      // 3D Sort for Sphere Points
      projectedCore.sort((a, b) => b.z - a.z);

      // Draw Sphere Core Connective Net (Back / Mid points)
      for (let i = 0; i < projectedCore.length; i++) {
        const p1 = projectedCore[i];
        if (p1.z > 50) continue; // skip deep-back connections for clarity

        let connections = 0;
        for (let j = i + 1; j < projectedCore.length; j++) {
          const p2 = projectedCore[j];
          
          const dx = p1.rx - p2.rx;
          const dy = p1.ry - p2.ry;
          const dz = p1.z - p2.z;
          const distSqr = dx * dx + dy * dy + dz * dz;

          // 38 * 38 = 1444. Avoid Math.sqrt unless points are close
          if (distSqr < 1444 && connections < 3) {
            const dist3D = Math.sqrt(distSqr);
            const alpha = (1 - dist3D / 38) * 0.12 * (1 - p1.z / 150);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw Core Sphere nodes
      for (let i = 0; i < projectedCore.length; i++) {
        const p = projectedCore[i];
        const size = (p.z > 0 ? 1.2 : 2.8) * (360 / (360 + p.z));
        const alpha = Math.max(0.1, 1 - (p.z + rCore) / (rCore * 2));

        if (p.z < 0) {
          // Glow on front points
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.12;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Equatorial Waveform Orbit
      const time = Date.now() * 0.003;
      const waveProjected: Array<{ x: number; y: number; z: number }> = [];
      
      for (let i = 0; i < waveDots.length; i++) {
        const wd = waveDots[i];
        wd.angle += 0.002; // slow orbit

        // Calculate dynamic wave amplitude
        const waveAmp = 15 * Math.sin(wd.angle * 6 + time);
        
        // Base coordinate around equator
        const rawX = wd.r * Math.cos(wd.angle);
        const rawZ = wd.r * Math.sin(wd.angle);
        const rawY = waveAmp; // dynamic y offset

        // Rotate wave
        let x1 = rawX * cosY - rawZ * sinY;
        let z1 = rawZ * cosY + rawX * sinY;
        let y2 = rawY * cosX - z1 * sinX;
        let z2 = z1 * cosX + rawY * sinX;

        const scale = 360 / (360 + z2);
        waveProjected.push({
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
        });
      }

      // Draw continuous wavy outline path
      ctx.beginPath();
      for (let i = 0; i < waveProjected.length; i++) {
        const pt = waveProjected[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw wave nodes
      for (let i = 0; i < waveProjected.length; i++) {
        const pt = waveProjected[i];
        const alpha = Math.max(0.1, 1 - (pt.z + 150) / 300);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.z < 0 ? 2.5 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Orbiting Glyphs (Front vs Back rendering)
      glyphs.forEach((g) => {
        g.angle += g.speed;
        
        // Coordinates (tilted orbits)
        const rawX = g.r * Math.cos(g.angle);
        const rawZ = g.r * Math.sin(g.angle);
        const rawY = g.yOffset + g.r * Math.sin(g.angle * 0.5) * 0.2; // organic slant

        // Rotate
        let x1 = rawX * cosY - rawZ * sinY;
        let z1 = rawZ * cosY + rawX * sinY;
        let y2 = rawY * cosX - z1 * sinX;
        let z2 = z1 * cosX + rawY * sinX;

        const scale = 360 / (360 + z2);
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;

        // Font size and transparency based on depth
        const fontSize = Math.max(9, Math.floor(14 * scale));
        const alpha = Math.max(0.12, 1 - (z2 + 180) / 360);

        ctx.font = `black ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = z2 < 0 ? '#ffffff' : '#94a3b8';
        ctx.globalAlpha = alpha;
        
        // Central glow behind front glyphs
        if (z2 < -50) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#06b6d4';
        }
        
        ctx.fillText(g.glyph, sx, sy);
        ctx.shadowBlur = 0; // reset
        ctx.globalAlpha = 1.0;

        // Draw dotted flight trail from glyph back into sphere
        if (z2 < 0 && Math.random() > 0.98) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(cx, cy);
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Draw central core halo
      const coreGradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 75);
      coreGradient.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
      coreGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      coreGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      const size = Math.min(500, canvas.parentElement?.clientWidth || 500);
      width = canvas.width = size;
      height = canvas.height = size;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[500px] aspect-square mx-auto">
      {/* Background radial glowing ambient aura */}
      <div className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-30 bg-radial from-teal-500/20 via-emerald-500/10 to-transparent"></div>
      <canvas ref={canvasRef} className="w-full h-full select-none pointer-events-none" />
    </div>
  );
};
