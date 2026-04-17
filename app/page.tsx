"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle, ArrowRight, BadgeCheck, CheckCircle,
  ChevronRight, Clock, Eye, FileText, Lock, Send, Shield, Users,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Report = { id:string; title:string; category:string; location:string; summary:string; status:string; createdAt:string; };
type Feedback = { type:"success"|"error"; message:string };

/* ─── Static Data ───────────────────────────────────────────────────────── */
const steps = [
  { number:"01", title:"Cuéntalo", icon:FileText,
    description:"Resume el hecho, la zona y por qué lo consideras irregular. No necesitas pruebas definitivas." },
  { number:"02", title:"Protege la evidencia", icon:Shield,
    description:"Describe documentos, fechas o contratos sin revelar tu identidad. Sé concreto y verificable." },
  { number:"03", title:"Activa el seguimiento", icon:Eye,
    description:"El equipo editorial revisa, clasifica y decide si publica o remite el caso a la autoridad competente." },
];

const metrics = [
  { value:"24h",      label:"Meta de primera revisión" },
  { value:"100%",     label:"Sin exigir identidad" },
  { value:"3 filtros",label:"Antes de publicar" },
];

const faq = [
  { question:"¿Es realmente anónimo?",
    answer:"El formulario no pide nombre ni documento. Evita incluir datos personales tuyos dentro del texto." },
  { question:"¿Se publica todo?",
    answer:"No. Cada caso pasa por moderación para reducir contenido falso o material que afecte procesos legales en curso." },
  { question:"¿Sirve como denuncia penal?",
    answer:"No reemplaza los canales oficiales. Cuando corresponda, se recomienda escalar a fiscalía, procuraduría o personería." },
];

const categories = ["Contratación pública","Abuso de poder","Uso de recursos públicos","Presión política","Otro"];

const denounceable = [
  { icon:BadgeCheck, text:"Contratos con sobrecostos, irregularidades o adjudicación indebida." },
  { icon:Shield,     text:"Uso indebido de bienes, presupuesto o infraestructura pública." },
  { icon:Eye,        text:"Presión política, clientelismo o intimidación a servidores públicos." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BAT 3D  —  canvas with bezier-curve baseball bat profile + metallic shading
═══════════════════════════════════════════════════════════════════════════ */
function Bat3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const W = 260, H = 520, CX = W / 2;
    canvas.width  = W;
    canvas.height = H;

    let angle = Math.PI * 0.2;
    let raf: number;

    /* ─ Particle pool ─ */
    type Particle = { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; size:number };
    const particles: Particle[] = Array.from({ length: 14 }, () => ({
      x: CX + (Math.random() - 0.5) * 70,
      y: 60  + Math.random() * 380,
      vx: (Math.random() - 0.5) * 0.9,
      vy: -(Math.random() * 1.4 + 0.4),
      life: Math.random() * 80,
      maxLife: 70 + Math.random() * 70,
      size: 1 + Math.random() * 1.8,
    }));

    /* ─ Bat profile: radius at a given y ─ */
    function batR(y: number): number {
      if (y <= 20)  return 0;
      if (y <= 32)  return ((y - 20) / 12) * 38;       // top cap flare
      if (y <= 178) return 38;                           // barrel
      if (y <= 234) return 38 - ((y - 178) / 56) * 26; // shoulder taper
      if (y <= 395) return 12;                           // handle
      if (y <= 428) return 12 + ((y - 395) / 33) * 10; // knob build-up
      if (y <= 458) return 22 - ((y - 428) / 30) * 22; // knob bottom
      return 0;
    }

    /* ─ Build clipping path ─ */
    function buildPath(xM: number) {
      ctx.beginPath();
      ctx.moveTo(CX, 18);
      ctx.quadraticCurveTo(CX - 44*xM, 26, CX - 40*xM, 50);
      ctx.lineTo(CX - 40*xM, 176);
      ctx.bezierCurveTo(CX - 39*xM, 212, CX - 13*xM, 235, CX - 12*xM, 262);
      ctx.lineTo(CX - 12*xM, 396);
      ctx.quadraticCurveTo(CX - 12*xM, 416, CX - 22*xM, 430);
      ctx.quadraticCurveTo(CX - 24*xM, 452, CX - 9*xM,  464);
      ctx.lineTo(CX, 467);
      ctx.lineTo(CX +  9*xM,  464);
      ctx.quadraticCurveTo(CX + 24*xM, 452, CX + 22*xM, 430);
      ctx.quadraticCurveTo(CX + 12*xM, 416, CX + 12*xM, 396);
      ctx.lineTo(CX + 12*xM, 262);
      ctx.bezierCurveTo(CX + 13*xM, 235, CX + 39*xM, 212, CX + 40*xM, 176);
      ctx.lineTo(CX + 40*xM, 50);
      ctx.quadraticCurveTo(CX + 44*xM, 26, CX, 18);
      ctx.closePath();
    }

    function draw(a: number) {
      ctx.clearRect(0, 0, W, H);

      const cosA = Math.cos(a);
      const xM   = Math.max(0.045, Math.abs(cosA));
      const lit  = cosA >= 0;
      const gx1  = CX - 46 * xM;
      const gx2  = CX + 46 * xM;

      /* ── Ambient glow behind bat ── */
      const aura = ctx.createRadialGradient(CX, 250, 20, CX, 250, 130);
      aura.addColorStop(0,   lit ? 'rgba(212,168,32,0.28)' : 'rgba(0,60,20,0.18)');
      aura.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.ellipse(CX, 250, 130, 250, 0, 0, Math.PI * 2);
      ctx.fill();

      /* ── Main bat body (clipped) ── */
      ctx.save();
      buildPath(xM);
      ctx.clip();

      // Layer 1 – base metallic colour
      const base = ctx.createLinearGradient(gx1, 0, gx2, 0);
      if (lit) {
        base.addColorStop(0,    '#0e0700');
        base.addColorStop(0.10, '#4a2c04');
        base.addColorStop(0.26, '#8B5E0E');
        base.addColorStop(0.40, '#D4A820');
        base.addColorStop(0.50, '#FFE870');  // specular peak
        base.addColorStop(0.60, '#D4A820');
        base.addColorStop(0.74, '#8B5E0E');
        base.addColorStop(0.90, '#4a2c04');
        base.addColorStop(1,    '#0e0700');
      } else {
        base.addColorStop(0,    '#060300');
        base.addColorStop(0.38, '#221504');
        base.addColorStop(0.55, '#4a3008');
        base.addColorStop(0.72, '#221504');
        base.addColorStop(1,    '#060300');
      }
      ctx.fillStyle = base;
      ctx.fillRect(gx1 - 2, 0, gx2 - gx1 + 4, H);

      // Layer 2 – specular hot-spot (tight vertical band that shifts with rotation)
      if (lit) {
        const spX = gx1 + (gx2 - gx1) * (0.42 + cosA * 0.08);
        const sp  = ctx.createLinearGradient(spX - 18*xM, 0, spX + 18*xM, 0);
        sp.addColorStop(0,    'rgba(255,255,220,0)');
        sp.addColorStop(0.35, 'rgba(255,255,220,0.55)');
        sp.addColorStop(0.50, 'rgba(255,255,255,0.88)');
        sp.addColorStop(0.65, 'rgba(255,255,220,0.55)');
        sp.addColorStop(1,    'rgba(255,255,220,0)');
        ctx.fillStyle = sp;
        ctx.fillRect(gx1, 22, gx2 - gx1, 420);
      }

      // Layer 3 – subtle vertical striations (metallic texture)
      if (xM > 0.15) {
        const alpha = Math.min(0.18, (xM - 0.15) * 0.6);
        for (let s = 0; s < 6; s++) {
          const sx = gx1 + (gx2 - gx1) * (0.08 + s * 0.165);
          const st = ctx.createLinearGradient(sx - 1.5, 0, sx + 1.5, 0);
          st.addColorStop(0,   `rgba(255,230,120,0)`);
          st.addColorStop(0.5, `rgba(255,230,120,${alpha})`);
          st.addColorStop(1,   `rgba(255,230,120,0)`);
          ctx.fillStyle = st;
          ctx.fillRect(sx - 1.5, 22, 3, 420);
        }
      }

      // Layer 4 – Fresnel rim light (bright right-edge when lit)
      if (lit) {
        const rim = ctx.createLinearGradient(gx2 - 14*xM, 0, gx2 + 2, 0);
        rim.addColorStop(0,  'rgba(255,240,160,0)');
        rim.addColorStop(0.5,'rgba(255,240,160,0.65)');
        rim.addColorStop(1,  'rgba(255,255,240,0.92)');
        ctx.fillStyle = rim;
        ctx.fillRect(gx2 - 14*xM, 28, 14*xM + 2, 440);
      }

      // Layer 5 – ambient occlusion on both edges
      const aoL = ctx.createLinearGradient(gx1, 0, gx1 + 14*xM, 0);
      aoL.addColorStop(0, 'rgba(0,0,0,0.72)');
      aoL.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aoL;
      ctx.fillRect(gx1, 0, 14*xM, H);

      const aoR = ctx.createLinearGradient(gx2 - 14*xM, 0, gx2, 0);
      aoR.addColorStop(0, 'rgba(0,0,0,0)');
      aoR.addColorStop(1, lit ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.65)');
      ctx.fillStyle = aoR;
      ctx.fillRect(gx2 - 14*xM, 0, 14*xM, H);

      ctx.restore(); // end clip

      /* ── Antioquia stripe at shoulder ── */
      const sW = batR(258) * xM;
      if (sW > 0.8) {
        ctx.save();
        const sg = ctx.createLinearGradient(CX - sW, 0, CX + sW, 0);
        sg.addColorStop(0,    'rgba(0,20,10,0.7)');
        sg.addColorStop(0.30, '#00572a');
        sg.addColorStop(0.55, '#00c060');
        sg.addColorStop(0.70, '#00572a');
        sg.addColorStop(1,    'rgba(0,20,10,0.7)');
        ctx.fillStyle = sg;
        ctx.fillRect(CX - sW, 257, sW * 2, 11);
        const sg2 = ctx.createLinearGradient(CX - sW, 0, CX + sW, 0);
        sg2.addColorStop(0,   'rgba(50,30,0,0.5)');
        sg2.addColorStop(0.50,'#F0C840');
        sg2.addColorStop(1,   'rgba(50,30,0,0.5)');
        ctx.fillStyle = sg2;
        ctx.fillRect(CX - sW, 270, sW * 2, 4);
        ctx.restore();
      }

      /* ── Cross-section ellipses ── */
      // Barrel top cap
      const btW = 40 * xM;
      if (btW > 1) {
        ctx.save();
        ctx.shadowColor = lit ? 'rgba(255,220,60,0.9)' : 'rgba(0,0,0,0.4)';
        ctx.shadowBlur  = 8;
        const be = ctx.createLinearGradient(CX - btW, 0, CX + btW, 0);
        if (lit) {
          be.addColorStop(0,   '#2a1600'); be.addColorStop(0.25,'#B8820A');
          be.addColorStop(0.52,'#FFE870'); be.addColorStop(0.75,'#B8820A');
          be.addColorStop(1,   '#2a1600');
        } else {
          be.addColorStop(0,'#100800'); be.addColorStop(0.5,'#5a3808'); be.addColorStop(1,'#100800');
        }
        ctx.beginPath();
        ctx.ellipse(CX, 34, btW, 11, 0, 0, Math.PI * 2);
        ctx.fillStyle = be; ctx.fill();
        ctx.restore();
      }

      // Barrel-shoulder ring
      if (btW > 1) {
        ctx.save();
        ctx.globalAlpha = lit ? 0.55 : 0.3;
        ctx.beginPath();
        ctx.ellipse(CX, 176, 40*xM, 7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = lit ? '#D4A820' : '#4a3000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Knob bottom cap
      const kbW = 22 * xM;
      if (kbW > 1) {
        ctx.save();
        ctx.shadowColor = 'rgba(212,168,32,0.6)';
        ctx.shadowBlur  = 10;
        const ke = ctx.createLinearGradient(CX - kbW, 0, CX + kbW, 0);
        if (lit) {
          ke.addColorStop(0,'#1e1000'); ke.addColorStop(0.35,'#C8900A');
          ke.addColorStop(0.55,'#FFE060'); ke.addColorStop(0.75,'#C8900A');
          ke.addColorStop(1,'#1e1000');
        } else {
          ke.addColorStop(0,'#0c0600'); ke.addColorStop(0.5,'#3a2604'); ke.addColorStop(1,'#0c0600');
        }
        ctx.beginPath();
        ctx.ellipse(CX, 460, kbW, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = ke; ctx.fill();
        ctx.restore();
      }

      /* ── Gold spark particles ── */
      ctx.save();
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy -= 0.008; // gravity-like deceleration
        p.life++;
        const dead = p.life > p.maxLife || p.y < -15 || p.x < -15 || p.x > W + 15;
        if (dead) {
          const side = Math.random() > 0.5 ? 1 : -1;
          p.x       = CX + side * batR(120 + Math.random() * 250) * xM * 0.9;
          p.y       = 90 + Math.random() * 340;
          p.vx      = side * (Math.random() * 1.8 + 0.4);
          p.vy      = -(Math.random() * 0.8 + 0.2);
          p.life    = 0;
          p.maxLife = 55 + Math.random() * 80;
          p.size    = 0.8 + Math.random() * 1.6;
        }
        const t  = p.life / p.maxLife;
        const al = Math.sin(t * Math.PI) * (lit ? 0.85 : 0.45);
        const r  = p.size * (1 + Math.sin(t * Math.PI) * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        const hue = 40 + Math.random() * 20;
        ctx.fillStyle = `hsla(${hue},100%,${55 + t * 20}%,${al})`;
        ctx.fill();
      }
      ctx.restore();
    }

    function loop() {
      try { angle += 0.012; draw(angle); } catch (_) { /* skip */ }
      raf = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={canvasRef} width={260} height={520}
      style={{ display:'block', margin:'0 auto' }} />
  );
}

function BatHUD() {
  return (
    <div className="bat-hud" style={{ width:290 }}>
      {/* corner brackets */}
      {(["tl","tr","bl","br"] as const).map(p => (
        <span key={p} className={`bat-hud-corner ${p}`} />
      ))}

      {/* header */}
      <div style={{
        position:"relative", zIndex:2,
        padding:"10px 16px 6px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:"1px solid rgba(212,168,32,0.18)",
      }}>
        <div>
          <div style={{ fontFamily:"var(--font-heading)", fontSize:11, fontWeight:700,
            letterSpacing:"0.14em", color:"var(--gold)", textTransform:"uppercase" }}>
            comBATE
          </div>
          <div style={{ fontSize:9, letterSpacing:"0.12em", color:"rgba(212,168,32,0.55)",
            textTransform:"uppercase", marginTop:1 }}>
            Arma Cívica
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)",
            animation:"glowPulse 1.8s ease infinite" }} />
          <span style={{ fontSize:9, letterSpacing:"0.1em",
            color:"rgba(212,168,32,0.7)", textTransform:"uppercase" }}>Live</span>
        </div>
      </div>

      {/* bat canvas */}
      <div style={{ position:"relative", zIndex:2, padding:"8px 0 4px" }}>
        <Bat3D />
      </div>

      {/* bullets */}
      <div style={{
        position:"relative", zIndex:2,
        margin:"0 12px 10px",
        borderTop:"1px solid rgba(212,168,32,0.15)",
        paddingTop:10,
      }}>
        <div style={{ fontSize:8, letterSpacing:"0.14em", color:"rgba(212,168,32,0.6)",
          textTransform:"uppercase", marginBottom:7 }}>
          Puedes denunciar
        </div>
        {denounceable.map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display:"flex", gap:7, marginBottom:6, alignItems:"flex-start" }}>
            <Icon size={10} color="rgba(212,168,32,0.7)" style={{ flexShrink:0, marginTop:2 }} />
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)", lineHeight:1.45 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{
        position:"relative", zIndex:2,
        padding:"8px 16px 10px",
        borderTop:"1px solid rgba(212,168,32,0.15)",
        display:"flex", justifyContent:"space-between",
      }}>
        <span style={{ fontSize:9, color:"rgba(212,168,32,0.55)",
          textTransform:"uppercase", letterSpacing:"0.1em" }}>TIPO: Ciudadano</span>
        <span style={{ fontSize:9, color:"rgba(212,168,32,0.55)",
          textTransform:"uppercase", letterSpacing:"0.1em" }}>
          <span style={{ color:"#4ade80" }}>●</span> Activo
        </span>
      </div>

      {/* scanlines overlay */}
      <div style={{
        position:"absolute", inset:0, borderRadius:4, pointerEvents:"none", zIndex:3,
        background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div style={{
        maxWidth:1200, margin:"0 auto",
        padding:"0 32px",
        height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        {/* Brand */}
        <a href="#" style={{ textDecoration:"none" }}>
          <span style={{
            fontFamily:"var(--font-heading)", fontWeight:700, fontSize:18,
            color: scrolled ? "#111810" : "white",
            letterSpacing:"-0.02em", transition:"color 0.3s",
          }}>
            com<span style={{ color:"var(--gold)" }}>BATE</span>
            <span style={{
              marginLeft:8, fontSize:10, fontWeight:500,
              letterSpacing:"0.08em", textTransform:"uppercase",
              color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.5)",
            }}>
              Vigilancia Ciudadana
            </span>
          </span>
        </a>

        {/* Links */}
        <div style={{ display:"flex", alignItems:"center", gap:32 }}>
          {[
            { label:"Cómo funciona", href:"#como-funciona" },
            { label:"Denunciar", href:"#denuncia" },
            { label:"Reportes", href:"#reportes" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily:"var(--font-heading)", fontSize:13, fontWeight:500,
                color: scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.70)",
                textDecoration:"none", transition:"color 0.2s",
              }}
              onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "var(--gold)")}
              onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color =
                scrolled ? "var(--text-muted)" : "rgba(255,255,255,0.70)")}
            >
              {label}
            </a>
          ))}

          <a
            href="#denuncia"
            style={{
              fontFamily:"var(--font-heading)", fontWeight:600, fontSize:13,
              background:"var(--gold)", color:"#111", textDecoration:"none",
              padding:"9px 20px", borderRadius:6,
              transition:"background 0.2s, transform 0.15s",
              display:"inline-block",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold-bright)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            Hacer una denuncia
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REPORT FORM
═══════════════════════════════════════════════════════════════════════════ */
function ReportForm() {
  const [form, setForm] = useState({ title:"", category:"", location:"", summary:"" });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.category) {
      setFeedback({ type:"error", message:"Completa título, categoría y descripción." });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/reports", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFeedback({ type:"success", message:"Denuncia recibida. Revisaremos en las próximas 24h." });
        setForm({ title:"", category:"", location:"", summary:"" });
      } else {
        setFeedback({ type:"error", message:"Error al enviar. Intenta de nuevo." });
      }
    } catch {
      setFeedback({ type:"error", message:"Sin conexión. Revisa tu red." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="denuncia" style={{
      background:"var(--bg-alt)",
      padding:"96px 32px",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* section header */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div className="section-label-light" style={{ marginBottom:16 }}>
            Formulario de denuncia
          </div>
          <h2 style={{
            fontFamily:"var(--font-heading)", fontSize:"clamp(32px,4vw,48px)",
            fontWeight:700, color:"var(--text)", letterSpacing:"-0.03em", lineHeight:1.15,
          }}>
            Habla. Nosotros<br />
            <span style={{ color:"var(--green-deep)" }}>escuchamos.</span>
          </h2>
          <p style={{
            marginTop:16, fontSize:16, color:"var(--text-muted)",
            maxWidth:500, margin:"16px auto 0", lineHeight:1.7,
          }}>
            No necesitas cuenta, nombre ni cédula. Tu relato pasa por
            moderación antes de publicarse.
          </p>
        </div>

        {/* two-column layout */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1.6fr",
          gap:40,
          alignItems:"start",
        }}>

          {/* left: context panel */}
          <div style={{
            background:"var(--dark)",
            borderRadius:16,
            padding:32,
            color:"white",
          }}>
            <div style={{
              fontFamily:"var(--font-heading)", fontSize:11, fontWeight:600,
              letterSpacing:"0.12em", textTransform:"uppercase",
              color:"var(--gold)", marginBottom:20,
            }}>
              Antes de denunciar
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[
                { icon:Lock, title:"Total anonimato",
                  desc:"No almacenamos IP ni datos de sesión. Evita incluir tu nombre dentro del texto." },
                { icon:CheckCircle, title:"Moderación previa",
                  desc:"Cada reporte es revisado antes de publicarse para proteger procesos legales activos." },
                { icon:FileText, title:"Complementa con canales oficiales",
                  desc:"Esta plataforma es veeduría ciudadana, no reemplaza fiscalía o procuraduría." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{
                    flexShrink:0, width:36, height:36, borderRadius:8,
                    background:"rgba(212,168,32,0.12)", border:"1px solid rgba(212,168,32,0.2)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <Icon size={16} color="var(--gold)" />
                  </div>
                  <div>
                    <div style={{ fontFamily:"var(--font-heading)", fontWeight:600,
                      fontSize:13, color:"white", marginBottom:4 }}>{title}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: form */}
          <div style={{
            background:"var(--surface)",
            borderRadius:16,
            padding:36,
            boxShadow:"var(--shadow-card)",
            border:"1px solid var(--border)",
          }}>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* title */}
              <div>
                <label style={{ fontFamily:"var(--font-heading)", fontSize:12, fontWeight:600,
                  color:"var(--text-muted)", letterSpacing:"0.06em",
                  textTransform:"uppercase", display:"block", marginBottom:8 }}>
                  Título del hecho *
                </label>
                <input
                  className="field-input"
                  placeholder="Ej. Contrato sin licitación en Municipio X"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title:e.target.value }))}
                />
              </div>

              {/* category + location */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={{ fontFamily:"var(--font-heading)", fontSize:12, fontWeight:600,
                    color:"var(--text-muted)", letterSpacing:"0.06em",
                    textTransform:"uppercase", display:"block", marginBottom:8 }}>
                    Categoría *
                  </label>
                  <select
                    className="field-input"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category:e.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily:"var(--font-heading)", fontSize:12, fontWeight:600,
                    color:"var(--text-muted)", letterSpacing:"0.06em",
                    textTransform:"uppercase", display:"block", marginBottom:8 }}>
                    Zona / Municipio
                  </label>
                  <input
                    className="field-input"
                    placeholder="Ej. Bello, Antioquia"
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location:e.target.value }))}
                  />
                </div>
              </div>

              {/* summary */}
              <div>
                <label style={{ fontFamily:"var(--font-heading)", fontSize:12, fontWeight:600,
                  color:"var(--text-muted)", letterSpacing:"0.06em",
                  textTransform:"uppercase", display:"block", marginBottom:8 }}>
                  Descripción *
                </label>
                <textarea
                  className="field-textarea"
                  rows={6}
                  placeholder="Describe el hecho con el mayor detalle posible: fechas, lugares, personas involucradas (sin revelar tu identidad), documentos o evidencias que sustenten el caso."
                  value={form.summary}
                  onChange={e => setForm(p => ({ ...p, summary:e.target.value }))}
                />
              </div>

              {/* legal notice */}
              <p style={{ fontSize:11, color:"var(--text-muted)", lineHeight:1.6,
                padding:"12px 14px", background:"var(--bg-alt)", borderRadius:8,
                borderLeft:"3px solid var(--gold)" }}>
                Al enviar confirmas que la información es verídica según tu conocimiento.
                Los reportes con datos falsos o que afecten procesos legales activos
                no serán publicados.
              </p>

              {/* feedback */}
              {feedback && (
                <div style={{
                  display:"flex", gap:10, alignItems:"flex-start",
                  padding:"12px 16px", borderRadius:8,
                  background: feedback.type === "success"
                    ? "rgba(0,87,42,0.08)" : "rgba(200,40,40,0.08)",
                  border: `1px solid ${feedback.type === "success"
                    ? "rgba(0,87,42,0.2)" : "rgba(200,40,40,0.2)"}`,
                }}>
                  {feedback.type === "success"
                    ? <CheckCircle size={16} color="#00572a" style={{ flexShrink:0, marginTop:1 }} />
                    : <AlertCircle size={16} color="#c82828" style={{ flexShrink:0, marginTop:1 }} />
                  }
                  <span style={{ fontSize:13, color: feedback.type === "success" ? "#00572a" : "#c82828" }}>
                    {feedback.message}
                  </span>
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={sending}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  background: sending ? "rgba(212,168,32,0.5)" : "var(--gold)",
                  color:"#111", border:"none", borderRadius:8,
                  fontFamily:"var(--font-heading)", fontWeight:700, fontSize:14,
                  padding:"14px 24px", cursor: sending ? "not-allowed" : "pointer",
                  transition:"background 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.background = "var(--gold-bright)"; }}
                onMouseLeave={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; }}
              >
                <Send size={15} />
                {sending ? "Enviando..." : "Enviar denuncia anónima"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REPORTS FEED
═══════════════════════════════════════════════════════════════════════════ */
function ReportsFeed() {
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then((d: unknown) => {
      const arr = Array.isArray(d) ? d as Report[]
        : Array.isArray((d as {reports?:Report[]}).reports)
          ? (d as {reports:Report[]}).reports
          : [];
      setReports(arr); setLoading(false);
    })
      .catch(() => setLoading(false));
  }, []);

  const statusMeta: Record<string, { label:string; cls:string }> = {
    pending:   { label:"Pendiente",  cls:"badge-pending"   },
    review:    { label:"En revisión",cls:"badge-review"    },
    published: { label:"Publicado",  cls:"badge-published" },
    closed:    { label:"Cerrado",    cls:"badge-closed"    },
  };

  const timeAgo = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 3600)  return `hace ${Math.floor(diff/60)}m`;
    if (diff < 86400) return `hace ${Math.floor(diff/3600)}h`;
    return `hace ${Math.floor(diff/86400)}d`;
  };

  return (
    <section id="reportes" style={{ padding:"96px 32px", background:"var(--bg)" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:48 }}>
          <div>
            <div className="section-label-light" style={{ marginBottom:14 }}>
              Reportes ciudadanos
            </div>
            <h2 style={{
              fontFamily:"var(--font-heading)", fontSize:"clamp(28px,3.5vw,40px)",
              fontWeight:700, color:"var(--text)", letterSpacing:"-0.025em",
            }}>
              Casos en seguimiento
            </h2>
          </div>
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            fontFamily:"var(--font-heading)", fontSize:12, color:"var(--text-muted)",
          }}>
            <Users size={14} />
            <span>{reports.length} reportes</span>
          </div>
        </div>

        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background:"var(--surface)", borderRadius:12, padding:24,
                border:"1px solid var(--border)",
              }}>
                <div className="skeleton" style={{ height:16, width:"60%", marginBottom:12 }} />
                <div className="skeleton" style={{ height:12, width:"40%", marginBottom:8 }} />
                <div className="skeleton" style={{ height:12, width:"80%" }} />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"64px 32px",
            color:"var(--text-muted)", fontFamily:"var(--font-heading)",
          }}>
            Aún no hay reportes publicados.
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {reports.map(r => {
              const meta = statusMeta[r.status] ?? { label:r.status, cls:"badge-closed" };
              const open = expanded === r.id;
              return (
                <div
                  key={r.id}
                  className="card-lift"
                  style={{
                    background:"var(--surface)", borderRadius:12,
                    border:"1px solid var(--border)",
                    overflow:"hidden",
                    transition:"border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,87,42,0.25)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                  }}
                >
                  <button
                    onClick={() => setExpanded(open ? null : r.id)}
                    style={{
                      width:"100%", background:"none", border:"none",
                      padding:"20px 24px",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      cursor:"pointer", textAlign:"left",
                    }}
                  >
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                        <span className={`badge ${meta.cls}`}>{meta.label}</span>
                        <span style={{ fontSize:11, color:"var(--text-muted)" }}>
                          {r.category}
                        </span>
                      </div>
                      <div style={{
                        fontFamily:"var(--font-heading)", fontWeight:600,
                        fontSize:15, color:"var(--text)", lineHeight:1.3,
                      }}>
                        {r.title}
                      </div>
                    </div>
                    <div style={{
                      display:"flex", alignItems:"center", gap:16,
                      flexShrink:0, marginLeft:16,
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5,
                        fontSize:11, color:"var(--text-muted)" }}>
                        <Clock size={11} />
                        {timeAgo(r.createdAt)}
                      </div>
                      <ChevronRight
                        size={16}
                        color="var(--text-muted)"
                        style={{ transform: open ? "rotate(90deg)" : "none",
                          transition:"transform 0.2s" }}
                      />
                    </div>
                  </button>

                  {open && (
                    <div style={{
                      padding:"0 24px 20px",
                      borderTop:"1px solid var(--border)",
                    }}>
                      <div style={{ display:"flex", gap:16, marginBottom:12, paddingTop:16 }}>
                        {r.location && (
                          <span style={{ fontSize:12, color:"var(--text-muted)" }}>
                            📍 {r.location}
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize:14, color:"var(--text-muted)",
                        lineHeight:1.7, margin:0,
                      }}>{r.summary}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main>

        {/* ═══ HERO ══════════════════════════════════════════════════════ */}
        <section className="hero-section">
          {/* dot grid */}
          <div className="dot-grid" />

          {/* glow orbs */}
          <div className="hero-glow-gold"
            style={{ top:"-10%", left:"-5%", opacity:0.7 }} />
          <div className="hero-glow-green"
            style={{ bottom:"-15%", right:"-5%", opacity:0.8 }} />

          <div style={{
            position:"relative", zIndex:1,
            maxWidth:1200, margin:"0 auto",
            padding:"120px 32px 80px",
            width:"100%",
            display:"grid",
            gridTemplateColumns:"1.15fr 1fr",
            gap:64,
            alignItems:"center",
          }}>
            {/* ── Left column ── */}
            <div>
              {/* label */}
              <div className="section-label" style={{ marginBottom:28 }}>
                <span style={{ width:6, height:6, borderRadius:"50%",
                  background:"var(--gold)",
                  display:"inline-block", flexShrink:0,
                  animation:"glowPulse 2s ease infinite" }} />
                Veeduría ciudadana · Antioquia
              </div>

              {/* headline */}
              <h1 style={{
                fontFamily:"var(--font-heading)",
                fontSize:"clamp(44px,5.5vw,76px)",
                fontWeight:800,
                color:"white",
                lineHeight:1.05,
                letterSpacing:"-0.04em",
                marginBottom:24,
              }}>
                Denuncia.<br />
                Sin miedo.<br />
                <span style={{ color:"var(--gold)" }}>Sin nombre.</span>
              </h1>

              {/* subtitle */}
              <p style={{
                fontSize:"clamp(15px,1.5vw,18px)",
                color:"rgba(255,255,255,0.60)",
                lineHeight:1.75,
                maxWidth:480,
                marginBottom:40,
              }}>
                Plataforma de veeduría ciudadana para reportar hechos de
                corrupción en Antioquia. Anónima. Sin registro.
                Con trazabilidad editorial.
              </p>

              {/* CTAs */}
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:52 }}>
                <a href="#denuncia" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"var(--gold)", color:"#111",
                  fontFamily:"var(--font-heading)", fontWeight:700, fontSize:14,
                  padding:"14px 28px", borderRadius:8, textDecoration:"none",
                  transition:"background 0.2s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold-bright)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}>
                  Hacer una denuncia
                  <ArrowRight size={15} />
                </a>

                <a href="#reportes" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"transparent",
                  border:"1.5px solid rgba(212,168,32,0.45)",
                  color:"rgba(255,255,255,0.80)",
                  fontFamily:"var(--font-heading)", fontWeight:600, fontSize:14,
                  padding:"14px 24px", borderRadius:8, textDecoration:"none",
                  transition:"border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--gold)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "white";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,168,32,0.45)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.80)";
                }}>
                  Ver reportes
                  <ChevronRight size={14} />
                </a>
              </div>

              {/* stats */}
              <div style={{
                display:"flex", gap:0,
                borderTop:"1px solid rgba(255,255,255,0.10)",
                paddingTop:32,
              }}>
                {metrics.map(({ value, label }, i) => (
                  <div key={value} style={{
                    flex:1,
                    paddingRight: i < metrics.length - 1 ? 28 : 0,
                    marginRight:  i < metrics.length - 1 ? 28 : 0,
                    borderRight:  i < metrics.length - 1
                      ? "1px solid rgba(255,255,255,0.10)" : "none",
                  }}>
                    <div style={{
                      fontFamily:"var(--font-heading)", fontWeight:800,
                      fontSize:"clamp(22px,2.5vw,30px)",
                      color:"var(--gold)", letterSpacing:"-0.03em", lineHeight:1,
                    }}>
                      {value}
                    </div>
                    <div style={{
                      fontSize:11, color:"rgba(255,255,255,0.45)",
                      marginTop:4, lineHeight:1.4, letterSpacing:"0.02em",
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: bat ── */}
            <div style={{ display:"flex", justifyContent:"center" }}>
              <BatHUD />
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ══════════════════════════════════════════════ */}
        <section id="como-funciona" style={{
          background:"var(--bg)", padding:"96px 32px",
        }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:60 }}>
              <div className="section-label-light" style={{ marginBottom:16 }}>
                Proceso
              </div>
              <h2 style={{
                fontFamily:"var(--font-heading)",
                fontSize:"clamp(30px,3.5vw,46px)",
                fontWeight:700, color:"var(--text)",
                letterSpacing:"-0.03em", lineHeight:1.15,
              }}>
                Así funciona
              </h2>
            </div>

            <div style={{
              display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:28,
            }}>
              {steps.map(({ number, title, icon: Icon, description }) => (
                <div
                  key={number}
                  className="card-lift"
                  style={{
                    background:"var(--surface)",
                    border:"1px solid var(--border)",
                    borderRadius:16, padding:32,
                    boxShadow:"var(--shadow-card)",
                    position:"relative", overflow:"hidden",
                  }}
                >
                  {/* big number watermark */}
                  <div style={{
                    position:"absolute", top:-12, right:16,
                    fontFamily:"var(--font-heading)", fontWeight:800,
                    fontSize:80, color:"rgba(0,87,42,0.05)",
                    lineHeight:1, userSelect:"none", letterSpacing:"-0.05em",
                  }}>
                    {number}
                  </div>

                  <div style={{
                    width:44, height:44, borderRadius:10,
                    background:"rgba(0,87,42,0.07)",
                    border:"1px solid rgba(0,87,42,0.15)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:20,
                  }}>
                    <Icon size={20} color="var(--green-deep)" />
                  </div>

                  <div style={{
                    fontFamily:"var(--font-heading)", fontWeight:700,
                    fontSize:18, color:"var(--text)", marginBottom:10,
                    letterSpacing:"-0.015em",
                  }}>
                    {title}
                  </div>
                  <p style={{ fontSize:14, color:"var(--text-muted)", lineHeight:1.7, margin:0 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FORM ══════════════════════════════════════════════════════ */}
        <ReportForm />

        {/* ═══ FEED ══════════════════════════════════════════════════════ */}
        <ReportsFeed />

        {/* ═══ FAQ ═══════════════════════════════════════════════════════ */}
        <section style={{ background:"var(--bg-alt)", padding:"80px 32px" }}>
          <div style={{ maxWidth:720, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <div className="section-label-light" style={{ marginBottom:14 }}>
                Preguntas frecuentes
              </div>
              <h2 style={{
                fontFamily:"var(--font-heading)",
                fontSize:"clamp(26px,3vw,38px)", fontWeight:700,
                color:"var(--text)", letterSpacing:"-0.025em",
              }}>
                Resolvemos tus dudas
              </h2>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {faq.map(({ question, answer }, i) => {
                const open = faqOpen === i;
                return (
                  <div key={i} style={{
                    background:"var(--surface)", borderRadius:12,
                    border: open ? "1px solid rgba(0,87,42,0.25)" : "1px solid var(--border)",
                    overflow:"hidden", transition:"border-color 0.2s",
                  }}>
                    <button
                      onClick={() => setFaqOpen(open ? null : i)}
                      style={{
                        width:"100%", background:"none", border:"none",
                        padding:"20px 24px",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        cursor:"pointer", textAlign:"left",
                      }}
                    >
                      <span style={{
                        fontFamily:"var(--font-heading)", fontWeight:600,
                        fontSize:15, color:"var(--text)",
                      }}>
                        {question}
                      </span>
                      <ChevronRight
                        size={16}
                        color="var(--text-muted)"
                        style={{ flexShrink:0, marginLeft:16,
                          transform: open ? "rotate(90deg)" : "none",
                          transition:"transform 0.2s" }}
                      />
                    </button>
                    {open && (
                      <div style={{ padding:"0 24px 20px" }}>
                        <p style={{ fontSize:14, color:"var(--text-muted)",
                          lineHeight:1.75, margin:0 }}>
                          {answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FOOTER CTA ════════════════════════════════════════════════ */}
        <footer style={{
          background:"var(--dark)", padding:"80px 32px 48px",
          position:"relative", overflow:"hidden",
        }}>
          <div className="hero-glow-gold"
            style={{ top:"-40%", left:"50%", transform:"translateX(-50%)", opacity:0.35 }} />

          <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center",
            position:"relative", zIndex:1 }}>
            <div style={{
              width:48, height:48, borderRadius:12,
              background:"rgba(212,168,32,0.15)",
              border:"1px solid rgba(212,168,32,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px",
            }}>
              <Shield size={22} color="var(--gold)" />
            </div>

            <h2 style={{
              fontFamily:"var(--font-heading)", fontWeight:800,
              fontSize:"clamp(28px,4vw,52px)",
              color:"white", letterSpacing:"-0.04em", lineHeight:1.1,
              marginBottom:16,
            }}>
              El control social<br />
              <span style={{ color:"var(--gold)" }}>empieza contigo.</span>
            </h2>

            <p style={{
              fontSize:16, color:"rgba(255,255,255,0.50)",
              lineHeight:1.7, maxWidth:440, margin:"0 auto 36px",
            }}>
              Cada denuncia es un paso hacia la transparencia.
              Sin nombre. Sin miedo. Con impacto.
            </p>

            <a href="#denuncia" style={{
              display:"inline-flex", alignItems:"center", gap:10,
              background:"var(--gold)", color:"#111",
              fontFamily:"var(--font-heading)", fontWeight:700, fontSize:15,
              padding:"16px 36px", borderRadius:8, textDecoration:"none",
              transition:"background 0.2s, transform 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold-bright)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}>
              Hacer una denuncia ahora
              <ArrowRight size={16} />
            </a>

            <div style={{
              marginTop:64,
              paddingTop:32,
              borderTop:"1px solid rgba(255,255,255,0.08)",
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span style={{
                fontFamily:"var(--font-heading)", fontWeight:700,
                fontSize:15, color:"rgba(255,255,255,0.6)",
              }}>
                com<span style={{ color:"var(--gold)" }}>BATE</span>
              </span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>
                Vigilancia Ciudadana · Antioquia · {new Date().getFullYear()}
              </span>
              <a href="#" style={{
                fontSize:12, color:"rgba(255,255,255,0.30)",
                textDecoration:"none",
              }}>
                Política de privacidad
              </a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
