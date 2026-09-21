import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  opacity: number;
}

const SAKURA_COLORS = [
  '#fbcfe8', // pink-200
  '#f9a8d4', // pink-300
  '#fda4af', // rose-300
  '#f472b6', // pink-400
  '#ffb7c5', // classic sakura pink
  '#ffe4e6', // rose-100
];

export const SakuraEffect: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
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

    const petalCount = Math.min(45, Math.floor(width / 35));
    const petals: Petal[] = [];

    const createPetal = (startY?: number): Petal => {
      const size = Math.random() * 8 + 7; // 7 to 15px
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 1.2 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
        color: SAKURA_COLORS[Math.floor(Math.random() * SAKURA_COLORS.length)],
        opacity: Math.random() * 0.45 + 0.45,
      };
    };

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal());
    }

    let windTime = 0;

    const drawPetal = (petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.scale(Math.cos(petal.flip), 1);

      ctx.beginPath();
      ctx.moveTo(0, -petal.size);
      // Delicate cherry blossom petal shape (with gentle top notch and rounded bottom)
      ctx.bezierCurveTo(
        petal.size * 0.8,
        -petal.size * 0.8,
        petal.size * 0.9,
        petal.size * 0.6,
        0,
        petal.size
      );
      ctx.bezierCurveTo(
        -petal.size * 0.9,
        petal.size * 0.6,
        -petal.size * 0.8,
        -petal.size * 0.8,
        0,
        -petal.size
      );

      ctx.fillStyle = petal.color;
      ctx.globalAlpha = petal.opacity;
      ctx.fill();

      // Subtle center vein
      ctx.beginPath();
      ctx.moveTo(0, -petal.size * 0.6);
      ctx.lineTo(0, petal.size * 0.6);
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      windTime += 0.01;
      const wind = Math.sin(windTime) * 0.8;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX + wind * 0.5;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Reset if off screen
        if (p.y > height + 20) {
          petals[i] = createPetal(-20);
        }
        if (p.x > width + 30) {
          p.x = -20;
        } else if (p.x < -30) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      id="sakura-canvas-overlay"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
