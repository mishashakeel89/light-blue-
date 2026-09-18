import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  trail: { x: number; y: number }[];
};

type Flash = { x: number; y: number; life: number };

/**
 * Global click-to-firework layer: shimmering white sparks (#F0F5F6).
 * Renders in front of the invitation, behind the guestbook overlay.
 */
export function DiamondDust() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const flashes = useRef<Flash[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = (x: number, y: number) => {
      flashes.current.push({ x, y, life: 1 });
      const count = 70;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 1.6 + Math.random() * 4.4;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 70 + Math.random() * 60,
          size: 0.6 + Math.random() * 1.6,
          trail: [],
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-sparks]")) return;
      burst(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onPointerDown);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      flashes.current = flashes.current.filter((f) => {
        f.life -= 0.08;
        if (f.life <= 0) return false;
        const r = 26 * f.life + 6;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, `rgba(212,175,55,${0.9 * f.life})`);
        g.addColorStop(1, "rgba(212,175,55,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      particles.current = particles.current.filter((p) => {
        p.life += 1;
        if (p.life > p.maxLife) return false;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.vy += 0.028; // slow gravity
        p.vx *= 0.982;
        p.vy *= 0.982;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        const twinkle = 0.6 + Math.random() * 0.4;

        if (p.trail.length > 1) {
          ctx.strokeStyle = `rgba(212,175,55,${alpha * 0.25})`;
          ctx.lineWidth = p.size * 0.7;
          ctx.beginPath();
          p.trail.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(212,175,55,${alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20"
    />
  );
}
