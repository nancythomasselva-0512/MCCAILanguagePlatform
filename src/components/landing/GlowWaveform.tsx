import React, { useEffect, useRef } from 'react';

export const GlowWaveform: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const mouseRef = useRef({ intensity: 1, targetIntensity: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 450);
    let height = (canvas.height = 450);

    const handleMouseMove = () => {
      mouseRef.current.targetIntensity = 2.0; // dynamic active wave when mouse moves
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetIntensity = 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate intensity
      mouseRef.current.intensity += (mouseRef.current.targetIntensity - mouseRef.current.intensity) * 0.05;
      if (mouseRef.current.targetIntensity > 1) {
        mouseRef.current.targetIntensity -= 0.02; // decay back to normal
      }

      phaseRef.current += 0.015;
      const phase = phaseRef.current;
      const centerY = height / 2;

      // Define 4 waves with different colors, phase shifts, amplitudes
      const waves = [
        {
          amplitude: 45,
          frequency: 0.012,
          speed: 1,
          color: 'rgba(59, 130, 246, 0.65)',
          glow: 'rgba(59, 130, 246, 0.45)',
          lineWidth: 2.5,
        },
        {
          amplitude: 30,
          frequency: 0.02,
          speed: -1.4,
          color: 'rgba(168, 85, 247, 0.55)',
          glow: 'rgba(168, 85, 247, 0.35)',
          lineWidth: 1.8,
        },
        {
          amplitude: 25,
          frequency: 0.008,
          speed: 0.8,
          color: 'rgba(6, 182, 212, 0.6)',
          glow: 'rgba(6, 182, 212, 0.35)',
          lineWidth: 2.0,
        },
        {
          amplitude: 15,
          frequency: 0.035,
          speed: -2.2,
          color: 'rgba(96, 165, 250, 0.4)',
          glow: 'rgba(96, 165, 250, 0.2)',
          lineWidth: 1.2,
        },
      ];

      // Draw each wave
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        // Apply neon glow shadow
        ctx.shadowBlur = 12;
        ctx.shadowColor = w.glow;

        for (let x = 0; x < width; x++) {
          // Horizontal tapering: make waves smaller at the edges for a premium voice envelope look
          const scale = Math.sin((x / width) * Math.PI);
          const dynamicAmplitude = w.amplitude * scale * mouseRef.current.intensity;
          const y = centerY + Math.sin(x * w.frequency + phase * w.speed) * dynamicAmplitude;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw central orb/node overlay
      const gradient = ctx.createRadialGradient(width / 2, centerY, 5, width / 2, centerY, 55);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
      gradient.addColorStop(0.3, 'rgba(168, 85, 247, 0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(width / 2, centerY, 55, 0, Math.PI * 2);
      ctx.fill();

      // Draw floating nodes along the wave peak to represent voice data packets
      for (let i = 1; i <= 3; i++) {
        const xOffset = width * (0.25 * i);
        const scale = Math.sin((xOffset / width) * Math.PI);
        const yVal = centerY + Math.sin(xOffset * 0.015 + phase * 0.9) * 35 * scale;
        
        ctx.beginPath();
        ctx.arc(xOffset, yVal, 4, 0, Math.PI * 2);
        ctx.fillStyle = i === 1 ? '#06b6d4' : i === 2 ? '#3b82f6' : '#a855f7';
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
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
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[450px] aspect-square mx-auto">
      {/* Background radial blue glow */}
      <div className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20 bg-radial from-blue-500 via-cyan-500 to-transparent"></div>
      <canvas ref={canvasRef} className="w-full h-full animate-float select-none pointer-events-none" />
    </div>
  );
};
