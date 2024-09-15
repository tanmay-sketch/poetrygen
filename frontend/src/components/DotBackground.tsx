import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
}

const DotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: Dot[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateDots();
    };

    const generateDots = () => {
      dots = [];
      const spacing = 30;
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          dots.push({ x, y });
        }
      }
    };

    const drawDots = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const baseOpacity = 0.15;
      const pulseAmplitude = 0.05;
      const pulseFrequency = 0.001;
      
      dots.forEach((dot) => {
        const opacity = baseOpacity + Math.sin(time * pulseFrequency) * pulseAmplitude;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawDots);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawDots(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default DotBackground;