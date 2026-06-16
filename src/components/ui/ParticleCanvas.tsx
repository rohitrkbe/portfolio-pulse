'use client';

import { useEffect, useRef } from 'react';
import { PARTICLE_CONFIG } from '@/constants/particles';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

interface MousePos {
  x: number;
  y: number;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<MousePos>({ x: PARTICLE_CONFIG.OFF_SCREEN, y: PARTICLE_CONFIG.OFF_SCREEN });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = Array.from({ length: PARTICLE_CONFIG.COUNT }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-PARTICLE_CONFIG.BASE_SPEED, PARTICLE_CONFIG.BASE_SPEED),
      vy: rand(-PARTICLE_CONFIG.BASE_SPEED, PARTICLE_CONFIG.BASE_SPEED),
      r: rand(PARTICLE_CONFIG.RADIUS_MIN, PARTICLE_CONFIG.RADIUS_MAX),
      opacity: rand(PARTICLE_CONFIG.OPACITY_MIN, PARTICLE_CONFIG.OPACITY_MAX),
    }));

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouse.current = { x: PARTICLE_CONFIG.OFF_SCREEN, y: PARTICLE_CONFIG.OFF_SCREEN };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PARTICLE_CONFIG.MOUSE_RADIUS && dist > 0) {
          const force = (PARTICLE_CONFIG.MOUSE_RADIUS - dist) / PARTICLE_CONFIG.MOUSE_RADIUS;
          p.vx += (dx / dist) * force * PARTICLE_CONFIG.MOUSE_FORCE;
          p.vy += (dy / dist) * force * PARTICLE_CONFIG.MOUSE_FORCE;
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > PARTICLE_CONFIG.BASE_SPEED * PARTICLE_CONFIG.MAX_SPEED_MULTIPLIER) {
          p.vx = (p.vx / speed) * PARTICLE_CONFIG.BASE_SPEED * PARTICLE_CONFIG.MAX_SPEED_MULTIPLIER;
          p.vy = (p.vy / speed) * PARTICLE_CONFIG.BASE_SPEED * PARTICLE_CONFIG.MAX_SPEED_MULTIPLIER;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx!.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < PARTICLE_CONFIG.CONNECTION_DISTANCE) {
            const alpha = (1 - d / PARTICLE_CONFIG.CONNECTION_DISTANCE) * PARTICLE_CONFIG.LINE_OPACITY;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      const mx = mouse.current.x;
      const my = mouse.current.y;
      if (mx > 0 && mx < width && my > 0 && my < height) {
        const grad = ctx!.createRadialGradient(mx, my, 0, mx, my, PARTICLE_CONFIG.MOUSE_RADIUS * PARTICLE_CONFIG.GLOW_RADIUS_FACTOR);
        grad.addColorStop(0, PARTICLE_CONFIG.GLOW_COLOR_INNER);
        grad.addColorStop(1, PARTICLE_CONFIG.GLOW_COLOR_OUTER);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(mx, my, PARTICLE_CONFIG.MOUSE_RADIUS * PARTICLE_CONFIG.GLOW_RADIUS_FACTOR, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
    />
  );
}
