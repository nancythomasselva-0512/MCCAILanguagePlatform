import React, { useEffect, useRef } from 'react';

export const SpaceBrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 450);
    let height = (canvas.height = 450);

    // Generate brain shape nodes (two lobes, left/right)
    const points: Array<{ x: number; y: number; z: number; lobe: 'L' | 'R'; spark: boolean }> = [];
    const numPoints = 140;

    for (let i = 0; i < numPoints; i++) {
      // Left lobe vs Right lobe
      const isLeft = i < numPoints / 2;
      const lobeSign = isLeft ? -1 : 1;

      // Ellipsoidal shell with contours to look like brain lobes
      const u = Math.random() * Math.PI;
      const v = Math.random() * Math.PI * 2;

      // Brain equations (custom organic shape parameters)
      const rX = 75 + Math.sin(v * 4) * 8; // lobe contour bumps
      const rY = 110 + Math.cos(u * 2) * 12;
      const rZ = 85 + Math.sin(u * 3) * 10;

      // Positioning Lobe coordinates
      const x = (rX * Math.sin(u) * Math.cos(v)) * 0.95 + (lobeSign * 24);
      const y = rY * Math.sin(u) * Math.sin(v) * 0.9;
      const z = rZ * Math.cos(u) * 0.9;

      points.push({
        x,
        y,
        z,
        lobe: isLeft ? 'L' : 'R',
        spark: Math.random() > 0.85,
      });
    }

    let angleY = 0.0045;
    let angleX = 0.002;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current.targetX = (e.clientX - cx) * 0.0018;
      mouseRef.current.targetY = (e.clientY - cy) * 0.0018;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const currentAngleY = angleY + mouseRef.current.x;
      const currentAngleX = angleX + mouseRef.current.y;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      const cx = width / 2;
      const cy = height / 2;

      // Rotate points
      const projected: Array<{
        x: number;
        y: number;
        z: number;
        lobe: 'L' | 'R';
        spark: boolean;
        rawX: number;
        rawY: number;
      }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        const scale = 320 / (320 + z2);
        const screenX = cx + p.x * scale;
        const screenY = cy + p.y * scale;

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          lobe: p.lobe,
          spark: p.spark,
          rawX: p.x,
          rawY: p.y,
        });
      }

      // Sort depth
      projected.sort((a, b) => b.z - a.z);

      // Connect nodes in the same lobe to create neural pathways
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        let links = 0;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p1.lobe !== p2.lobe) continue; // stay in hemisphere

          const dist3D = Math.hypot(p1.rawX - p2.rawX, p1.rawY - p2.rawY, p1.z - p2.z);

          if (dist3D < 38 && links < 4) {
            const alpha = (1 - dist3D / 38) * 0.16 * (1 - p1.z / 180);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Cyan lines for left lobe, Purple for right lobe
            ctx.strokeStyle = p1.lobe === 'L' ? `rgba(6, 182, 212, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = p1.spark && p2.spark ? 1.0 : 0.6;
            ctx.stroke();
            links++;
          }
        }
      }

      // Draw synapse node centers
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const size = (p.z > 0 ? 1.2 : 3.2) * (320 / (320 + p.z));

        // Synapse glow (pulsing spark)
        if (p.spark && Math.random() > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.lobe === 'L' ? '#22d3ee' : '#c084fc';
          ctx.globalAlpha = 0.25;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.lobe === 'L' ? '#06b6d4' : '#a855f7';
        // Fade depth
        const opacity = Math.max(0.1, 1 - (p.z + 120) / 240);
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw faint center connection lines (corpus callosum bridging lobes)
      for (let i = 0; i < 20; i++) {
        const pL = projected.find((p) => p.lobe === 'L' && p.z < 0);
        const pR = projected.find((p) => p.lobe === 'R' && p.z < 0);
        if (pL && pR) {
          ctx.beginPath();
          ctx.moveTo(pL.x, pL.y);
          ctx.lineTo(pR.x, pR.y);
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      const size = Math.min(450, canvas.parentElement?.clientWidth || 450);
      width = canvas.width = size;
      height = canvas.height = size;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[450px] aspect-square mx-auto">
      {/* Background radial cyan/purple aura */}
      <div className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20 bg-radial from-cyan-500 via-purple-500 to-transparent"></div>
      <canvas ref={canvasRef} className="w-full h-full animate-float select-none pointer-events-none" />
    </div>
  );
};
