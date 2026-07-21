import React, { useEffect, useRef } from 'react';
import { HANGZHOU_SEASONS_DATA, SeasonType } from '../types';

interface BackgroundParticlesProps {
  activeSeason: SeasonType;
  styleMode: 'artistic' | 'geometric';
  windSpeed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rot: number;
  rotSpeed: number;
  type: 'petal' | 'leaf' | 'osmanthus' | 'snow' | 'digital';
  subType: 'peach' | 'willow' | 'lotus' | 'summer-leaf' | 'maple' | 'osmanthus' | 'snow' | 'plum' | 'digital';
  color: string;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  activeSeason,
  styleMode,
  windSpeed = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollYRef.current;
      scrollVelocityRef.current = diff;
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const maxParticles = styleMode === 'artistic' ? 50 : 70;
    const content = HANGZHOU_SEASONS_DATA.find((s) => s.id === activeSeason) || HANGZHOU_SEASONS_DATA[0];

    const generateParticle = (): Particle => {
      const isTech = content.particleType === 'digital';
      let subType: 'peach' | 'willow' | 'lotus' | 'summer-leaf' | 'maple' | 'osmanthus' | 'snow' | 'plum' | 'digital' = 'digital';
      let color = content.particlesColor;

      if (activeSeason === 'spring') {
        const rand = Math.random();
        if (rand < 0.55) {
          subType = 'peach';
          color = '#FCA5A5'; // Peach blossom pink
        } else {
          subType = 'willow';
          color = '#6EE7B7'; // Willow bud soft light green
        }
      } else if (activeSeason === 'summer') {
        const rand = Math.random();
        if (rand < 0.45) {
          subType = 'lotus';
          color = '#F472B6'; // Lotus pink
        } else {
          subType = 'summer-leaf';
          color = '#047857'; // Forest green shady leaf
        }
      } else if (activeSeason === 'autumn') {
        const rand = Math.random();
        if (rand < 0.5) {
          subType = 'maple';
          color = '#DC2626'; // Red leaf like fire
        } else {
          subType = 'osmanthus';
          color = '#F59E0B'; // Osmanthus amber/gold
        }
      } else if (activeSeason === 'winter') {
        const rand = Math.random();
        if (rand < 0.7) {
          subType = 'snow';
          color = '#a0b6cc'; // Silver snowy ink
        } else {
          subType = 'plum';
          color = '#E11D48'; // Red wintersweet plum blossom
        }
      } else {
        subType = 'digital';
        color = content.particlesColor;
      }

      return {
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.35) * (isTech ? 0.3 : 1.3),
        vy: (Math.random() * 0.9 + 0.5) * (isTech ? 1.6 : 1.2),
        size: Math.random() * (isTech ? 12 : 8) + 4,
        alpha: Math.random() * 0.5 + 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        type: content.particleType,
        subType,
        color,
      };
    };

    // Pre-populate particles
    for (let i = 0; i < maxParticles; i++) {
      const p = generateParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    const drawPeach = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.ellipse(0, 0, r, r / 1.5, Math.PI / 6, 0, Math.PI * 2);
      c.fill();
    };

    const drawWillow = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(-r, 0);
      c.quadraticCurveTo(0, -r / 2.5, r, 0);
      c.quadraticCurveTo(0, r / 2.5, -r, 0);
      c.fill();
    };

    const drawLotus = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(0, r);
      c.bezierCurveTo(-r * 0.8, r * 0.3, -r * 0.5, -r * 0.7, 0, -r);
      c.bezierCurveTo(r * 0.5, -r * 0.7, r * 0.8, r * 0.3, 0, r);
      c.fill();
    };

    const drawSummerLeaf = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(-r * 1.2, 0);
      c.bezierCurveTo(-r * 0.5, -r * 0.8, r * 0.5, -r * 0.8, r * 1.2, 0);
      c.bezierCurveTo(r * 0.5, r * 0.8, -r * 0.5, r * 0.8, -r * 1.2, 0);
      c.fill();
    };

    const drawMaple = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      c.beginPath();
      c.moveTo(0, -r);
      c.lineTo(r * 0.25, -r * 0.25);
      c.lineTo(r, -r * 0.35);
      c.lineTo(r * 0.35, 0);
      c.lineTo(r * 0.75, r * 0.45);
      c.lineTo(0, r * 0.2);
      c.lineTo(-r * 0.75, r * 0.45);
      c.lineTo(-r * 0.35, 0);
      c.lineTo(-r, -r * 0.35);
      c.lineTo(-r * 0.25, -r * 0.25);
      c.closePath();
      c.fill();
    };

    const drawOsmanthusCluster = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const px = Math.cos(angle) * r * 0.5;
        const py = Math.sin(angle) * r * 0.5;
        c.beginPath();
        c.arc(px, py, r * 0.35, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#EA580C';
      c.beginPath();
      c.arc(0, 0, r * 0.15, 0, Math.PI * 2);
      c.fill();
    };

    const drawPlum = (c: CanvasRenderingContext2D, r: number, colorStr: string) => {
      c.fillStyle = colorStr;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * r * 0.45;
        const py = Math.sin(angle) * r * 0.45;
        c.beginPath();
        c.arc(px, py, r * 0.4, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#FBBF24';
      c.beginPath();
      c.arc(0, 0, r * 0.15, 0, Math.PI * 2);
      c.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      scrollVelocityRef.current *= 0.94;
      const currentScrollWind = scrollVelocityRef.current * (styleMode === 'artistic' ? 1.6 : 2.5);

      if (styleMode === 'artistic') {
        // Soft ambient mountain fog
        ctx.fillStyle = 'rgba(235, 230, 220, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.7, height * 0.7, width, height * 0.6);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Parallax scroll-driven floating ink clouds
        const scrollOffset = lastScrollYRef.current;
        ctx.fillStyle = 'rgba(44, 42, 37, 0.015)';
        ctx.beginPath();
        const yOffset = (scrollOffset * 0.15) % height;
        ctx.moveTo(0, height * 0.35 + yOffset * 0.4);
        ctx.bezierCurveTo(width * 0.35, height * 0.3 - yOffset * 0.1, width * 0.65, height * 0.45 + yOffset * 0.2, width, height * 0.4);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
      }

      particles.forEach((p, idx) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.subType === 'peach') {
          drawPeach(ctx, p.size, p.color);
        } else if (p.subType === 'willow') {
          drawWillow(ctx, p.size, p.color);
        } else if (p.subType === 'lotus') {
          drawLotus(ctx, p.size, p.color);
        } else if (p.subType === 'summer-leaf') {
          drawSummerLeaf(ctx, p.size, p.color);
        } else if (p.subType === 'maple') {
          drawMaple(ctx, p.size, p.color);
        } else if (p.subType === 'osmanthus') {
          drawOsmanthusCluster(ctx, p.size, p.color);
        } else if (p.subType === 'snow') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.subType === 'plum') {
          drawPlum(ctx, p.size, p.color);
        } else if (p.subType === 'digital') {
          ctx.fillStyle = p.color;
          ctx.font = `${p.size + 4}px JetBrains Mono, Space Grotesk, monospace`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillText(idx % 2 === 0 ? '0' : '1', 0, 0);
        }

        ctx.restore();

        const windFactor = windSpeed / 50;
        p.x += p.vx * windFactor + currentScrollWind * (p.size / 10);
        p.y += p.vy * windFactor + Math.abs(currentScrollWind) * 0.15;
        p.rot += p.rotSpeed * windFactor + currentScrollWind * 0.008;

        if (p.y > height || p.x < -30 || p.x > width + 30) {
          particles[idx] = generateParticle();
        }
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSeason, styleMode, windSpeed]);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};
