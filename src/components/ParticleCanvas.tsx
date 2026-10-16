import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Particle } from '../types/game';

export interface ParticleCanvasHandle {
  burst: (x: number, y: number, colorHex: string, count?: number) => void;
  celebrate: () => void;
}

interface ParticleCanvasProps {
  width: number;
  height: number;
}

export const ParticleCanvas = forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  ({ width, height }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      burst(x: number, y: number, colorHex: string, count = 16) {
        const particles = particlesRef.current;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5.5;
          const life = 28 + Math.floor(Math.random() * 20);

          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5, // slight upward bias
            size: 4 + Math.random() * 6,
            color: colorHex,
            alpha: 1,
            life,
            maxLife: life,
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.25,
            isSquare: Math.random() > 0.35, // Some square shards, some circular sparks
          });
        }
      },
      celebrate() {
        // High score celebratory burst from corners
        const colors = ['#f43f5e', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6', '#a855f7'];
        const particles = particlesRef.current;

        for (let i = 0; i < 48; i++) {
          const x = Math.random() * width;
          const y = height * 0.4 + Math.random() * (height * 0.3);
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 6;
          const life = 35 + Math.floor(Math.random() * 25);
          const color = colors[Math.floor(Math.random() * colors.length)];

          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 5 + Math.random() * 6,
            color,
            alpha: 1,
            life,
            maxLife: life,
            rotation: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 0.2,
            isSquare: true,
          });
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let running = true;

      const loop = () => {
        if (!running) return;

        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18; // gravity
          p.vx *= 0.98; // air drag
          p.rotation += p.vRot;
          p.life--;
          p.alpha = Math.max(0, p.life / p.maxLife);

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          if (p.isSquare) {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            // tiny bevel highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.3);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        running = false;
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }, [width, height]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="pointer-events-none absolute inset-0 z-30"
        style={{ width, height }}
      />
    );
  }
);

ParticleCanvas.displayName = 'ParticleCanvas';
