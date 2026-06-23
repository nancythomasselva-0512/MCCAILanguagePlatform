import React, { useEffect, useRef } from 'react';

export const SpaceGlobe: React.FC = () => {
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

    // Generate points on a sphere
    const points: Array<{ x: number; y: number; z: number; baseColor: string }> = [];
    const numPoints = 180;
    const r = 140; // Globe radius

    // Fibonacci sphere algorithm for even distribution
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * i) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      points.push({
        x: r * Math.cos(theta) * Math.sin(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi),
        baseColor: i % 4 === 0 ? '#3b82f6' : i % 4 === 1 ? '#a855f7' : i % 4 === 2 ? '#06b6d4' : '#60a5fa',
      });
    }

    let angleY = 0.003;
    let angleX = 0.001;

    // Follow cursor
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current.targetX = (e.clientX - cx) * 0.0015;
      mouseRef.current.targetY = (e.clientY - cy) * 0.0015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tilt
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleY = angleY + mouseRef.current.x;
      const currentAngleX = angleX + mouseRef.current.y;

      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);

      // Center of canvas
      const cx = width / 2;
      const cy = height / 2;

      // Project and rotate points
      const projected: Array<{ x: number; y: number; z: number; color: string; rawX: number; rawY: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Update point state so it continues spinning
        p.x = x1;
        p.y = y2;
        p.z = z2;

        // Perspective projection
        const scale = 300 / (300 + z2); // Projection distance
        const screenX = cx + p.x * scale;
        const screenY = cy + p.y * scale;

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          rawX: p.x,
          rawY: p.y,
          color: p.baseColor,
        });
      }

      // Sort by depth (back to front) for visual accuracy
      projected.sort((a, b) => b.z - a.z);

      // Draw lines between close points
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z > 80) continue; // Don't connect points at the very back to keep clean

        let connections = 0;
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist3D = Math.hypot(p1.rawX - p2.rawX, p1.rawY - p2.rawY, p1.z - p2.z);

          if (dist3D < 40 && connections < 3) {
            const alpha = (1 - dist3D / 40) * 0.15 * (1 - p1.z / 150); // Fade with depth
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw points
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const size = (p.z > 0 ? 1.5 : 3.5) * (300 / (300 + p.z)); // Bigger at front

        // Draw glow for front points
        if (p.z < 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.15;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Fade out points at the back
        const opacity = Math.max(0.12, 1 - (p.z + 140) / 280);
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw equatorial glowing rings
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      const gradient = ctx.createLinearGradient(0, cy - r, width, cy + r);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.08)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();

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
      {/* Background radial neon aura */}
      <div className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20 bg-radial from-teal-500 via-emerald-500 to-transparent"></div>
      <canvas ref={canvasRef} className="w-full h-full animate-float select-none pointer-events-none" />
    </div>
  );
};
