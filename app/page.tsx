"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Lock,
  Send,
  Shield,
  Users,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Report = {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  status: string;
  createdAt: string;
};

type Feedback = { type: "success" | "error"; message: string };

// ─── Static Data ─────────────────────────────────────────────────────────────

const commitments = [
  "Publicar rutas claras de seguimiento y respuesta para cada denuncia ciudadana.",
  "Separar el discurso político del tratamiento editorial de los reportes recibidos.",
  "Promover control social con evidencias, contexto y protección del anonimato.",
];

const steps = [
  {
    number: "01",
    title: "Cuéntalo",
    icon: FileText,
    description:
      "Resume el hecho, la zona y por qué consideras que amerita revisión pública. No necesitas pruebas definitivas para reportar.",
  },
  {
    number: "02",
    title: "Protege la evidencia",
    icon: Shield,
    description:
      "Describe documentos, fechas, contratos o testigos sin revelar tu identidad. La narrativa debe ser concreta y verificable.",
  },
  {
    number: "03",
    title: "Activa el seguimiento",
    icon: Eye,
    description:
      "El equipo editorial revisa, clasifica y decide si publica o remite el caso a la autoridad competente. Transparencia en cada paso.",
  },
];

const metrics = [
  { value: "24h", label: "Meta de primera revisión editorial" },
  { value: "100%", label: "Recepción sin exigir identidad" },
  { value: "3 filtros", label: "Validación antes de publicar" },
];

const faq = [
  {
    question: "¿La denuncia es realmente anónima?",
    answer:
      "El formulario no pide nombre ni documento. Aun así, evita incluir datos personales tuyos o de terceros dentro del texto del reporte.",
  },
  {
    question: "¿Se publica todo lo recibido?",
    answer:
      "No. Cada caso pasa por moderación inicial para reducir contenido falso, información sensible o material que pueda afectar procesos legales en curso.",
  },
  {
    question: "¿Sirve como denuncia penal formal?",
    answer:
      "No reemplaza los canales oficiales. Es un espacio de veeduría ciudadana. Cuando corresponda, se recomienda escalar a fiscalía, procuraduría o personería.",
  },
];

const categories = [
  "Contratación pública",
  "Abuso de poder",
  "Uso de recursos públicos",
  "Presión política",
  "Otro",
];

// Qué puede denunciar el ciudadano — hero card bullets
const denounceable = [
  {
    icon: BadgeCheck,
    text: "Contratos con sobrecostos, irregularidades o adjudicación indebida.",
  },
  {
    icon: Shield,
    text: "Uso indebido de bienes, presupuesto o infraestructura pública.",
  },
  {
    icon: Eye,
    text: "Presión política, clientelismo o intimidación a servidores públicos.",
  },
];

function statusBadgeClass(status: string): string {
  if (status === "En verificación") return "badge badge-warn";
  if (status === "Seguimiento abierto") return "badge badge-info";
  return "badge badge-ok";
}

// ─── 3D Bat Canvas ────────────────────────────────────────────────────────────

function Bat3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 200;
    const H = 370;
    const cx = W / 2;
    let angle = 0;
    let raf: number;

    // Draw a filled ellipse helper
    function ell(
      x: number,
      y: number,
      rx: number,
      ry: number,
      color: string
    ) {
      if (rx < 0.5) return;
      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(0.5, rx), ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw(a: number) {
      ctx.clearRect(0, 0, W, H);

      const cosA = Math.cos(a);
      const xM = Math.abs(cosA); // foreshortening factor
      const facing = cosA >= 0; // true = facing viewer

      // ── Geometry ──────────────────────────────────────────────────────────

      // Barrel (top of bat, hitting end)
      const bTopY = 28;
      const bBotY = 188;
      const bTopR = 30;
      const bBotR = 18;
      const bTopX = bTopR * xM;
      const bBotX = bBotR * xM;

      // Handle
      const hTopY = bBotY;
      const hBotY = 308;
      const hR = 8.5;
      const hX = hR * xM;

      // Knob
      const kY = 325;
      const kR = 14;
      const kX = kR * xM;

      // ── Metallic gradient factory ─────────────────────────────────────────
      function barrelGrad(leftW: number, rightW: number) {
        const g = ctx.createLinearGradient(
          cx - Math.max(leftW, 1),
          0,
          cx + Math.max(rightW, 1),
          0
        );
        const hl = (cosA + 1) / 2; // highlight position 0-1

        if (facing) {
          g.addColorStop(0, "#2a1200");
          g.addColorStop(Math.max(0.05, hl * 0.5), "#9B7010");
          g.addColorStop(hl * 0.78, "#D4A820");
          g.addColorStop(Math.min(0.92, hl * 0.88 + 0.04), "#FFE050");
          g.addColorStop(Math.min(0.95, hl * 0.95 + 0.03), "#D4A820");
          g.addColorStop(1, "#2a1200");
        } else {
          g.addColorStop(0, "#160900");
          g.addColorStop(0.5, "#5a3808");
          g.addColorStop(1, "#160900");
        }
        return g;
      }

      function handleGrad(w: number) {
        const g = ctx.createLinearGradient(
          cx - Math.max(w, 1),
          0,
          cx + Math.max(w, 1),
          0
        );
        if (facing) {
          g.addColorStop(0, "#1e0e00");
          g.addColorStop(0.35, "#8B6010");
          g.addColorStop(0.6, "#D4A820");
          g.addColorStop(1, "#1e0e00");
        } else {
          g.addColorStop(0, "#0e0600");
          g.addColorStop(0.5, "#4a2e08");
          g.addColorStop(1, "#0e0600");
        }
        return g;
      }

      // ── GLOW layer ────────────────────────────────────────────────────────
      const glowCol = facing
        ? "rgba(212,168,32,0.38)"
        : "rgba(0,100,40,0.28)";
      const glowGrad = ctx.createRadialGradient(cx, 175, 0, cx, 175, 75);
      glowGrad.addColorStop(0, glowCol);
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(cx - 80, 80, 160, 200);

      // ── Draw with canvas shadow (bloom) ───────────────────────────────────
      ctx.save();
      ctx.shadowColor = facing ? "#D4A820" : "#005520";
      ctx.shadowBlur = facing ? 22 : 14;

      // Barrel body (tapered trapezoid)
      if (bTopX > 0.5 || bBotX > 0.5) {
        ctx.beginPath();
        ctx.moveTo(cx - bTopX, bTopY + 10);
        ctx.lineTo(cx - bBotX, bBotY);
        ctx.lineTo(cx + bBotX, bBotY);
        ctx.lineTo(cx + bTopX, bTopY + 10);
        ctx.closePath();
        ctx.fillStyle = barrelGrad(bTopX, bTopX);
        ctx.fill();
      }

      // Handle body
      if (hX > 0.5) {
        ctx.beginPath();
        ctx.rect(cx - hX, hTopY, hX * 2, hBotY - hTopY);
        ctx.fillStyle = handleGrad(hX);
        ctx.fill();
      }

      // Knob body (disc rim)
      if (kX > 0.5) {
        ctx.beginPath();
        ctx.rect(cx - kX, kY - 10, kX * 2, 10);
        ctx.fillStyle = facing ? "#B88A10" : "#5a3808";
        ctx.fill();
      }

      ctx.restore(); // clear shadow

      // ── End caps ─────────────────────────────────────────────────────────
      // Barrel top cap
      ell(
        cx,
        bTopY + 10,
        bTopX,
        10,
        facing ? "#FFE870" : "#6B4808"
      );

      // Barrel shoulder
      ell(cx, bBotY, bBotX, 7, facing ? "#C8900A" : "#6a4200");

      // Knob ellipse
      ell(cx, kY, kX, 6, facing ? "#C8900A" : "#6a4200");

      // ── Antioquia stripe: verde + dorado ──────────────────────────────────
      const stripeW = Math.max(0, bBotX * 1.05);
      if (stripeW > 0.5) {
        // Verde
        ctx.fillStyle = facing ? "#00aa44" : "#003d18";
        ctx.fillRect(cx - stripeW, bBotY - 18, stripeW * 2, 9);
        // Dorado
        ctx.fillStyle = facing ? "#D4A820" : "#7a5000";
        ctx.fillRect(cx - stripeW, bBotY - 9, stripeW * 2, 9);
      }

      // ── Specular highlight (white streak on barrel) ───────────────────────
      if (cosA > 0.12 && bTopX > 3) {
        const sX = cx - 7 * cosA;
        const sW = 5;
        const sG = ctx.createLinearGradient(sX - sW, 0, sX + sW, 0);
        sG.addColorStop(0, "rgba(255,255,255,0)");
        sG.addColorStop(0.5, `rgba(255,255,255,${(cosA * 0.65).toFixed(2)})`);
        sG.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sG;
        ctx.fillRect(sX - sW, bTopY + 18, sW * 2, bBotY - bTopY - 28);
      }

      // Specular on handle
      if (cosA > 0.2 && hX > 1.5) {
        const sX2 = cx - 3 * cosA;
        const sG2 = ctx.createLinearGradient(sX2 - 3, 0, sX2 + 3, 0);
        sG2.addColorStop(0, "rgba(255,255,255,0)");
        sG2.addColorStop(0.5, `rgba(255,255,255,${(cosA * 0.4).toFixed(2)})`);
        sG2.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sG2;
        ctx.fillRect(sX2 - 3, hTopY + 4, 6, hBotY - hTopY - 8);
      }

      // ── Edge outline stroke (crispness) ───────────────────────────────────
      if (bTopX > 1 || bBotX > 1) {
        ctx.beginPath();
        ctx.moveTo(cx - bTopX, bTopY + 10);
        ctx.lineTo(cx - bBotX, bBotY);
        ctx.strokeStyle = `rgba(255,220,50,${(xM * 0.25).toFixed(2)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + bTopX, bTopY + 10);
        ctx.lineTo(cx + bBotX, bBotY);
        ctx.stroke();
      }
    }

    function loop() {
      angle += 0.016;
      draw(angle);
      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={370}
      aria-label="Logo bate 3D rotando — símbolo editorial del portal"
      style={{ display: "block", width: "200px", height: "370px" }}
    />
  );
}

// ─── Game HUD wrapper para el bate ───────────────────────────────────────────

function BatHUD() {
  return (
    <div
      className="bat-hud"
      style={{ width: "100%", maxWidth: "300px", padding: "0" }}
    >
      {/* Corner brackets */}
      <div className="bat-hud-corner tl" aria-hidden="true" />
      <div className="bat-hud-corner tr" aria-hidden="true" />
      <div className="bat-hud-corner bl" aria-hidden="true" />
      <div className="bat-hud-corner br" aria-hidden="true" />

      {/* HUD header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px 12px",
          borderBottom: "1px solid rgba(212,168,32,0.20)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--gold)",
              animation: "glowPulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: "0.625rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--gold)",
              fontWeight: 700,
              fontFamily: "var(--font-heading), sans-serif",
            }}
          >
            com<span style={{ color: "#ffffff" }}>BATE</span>
          </span>
        </div>
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(212,168,32,0.55)",
            fontFamily: "var(--font-heading), sans-serif",
          }}
        >
          ARMA CÍVICA
        </span>
      </div>

      {/* Bat canvas — centered */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 20px 16px",
          position: "relative",
        }}
      >
        {/* Subtle scan line effect */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
            pointerEvents: "none",
          }}
        />
        <Bat3D />
      </div>

      {/* HUD stats footer */}
      <div
        style={{
          borderTop: "1px solid rgba(212,168,32,0.18)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
        }}
      >
        {[
          { label: "TIPO", value: "Ciudadano" },
          { label: "ESTADO", value: "● Activo" },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              padding: "10px 14px",
              borderRight: i === 0 ? "1px solid rgba(212,168,32,0.18)" : "none",
            }}
          >
            <p
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(212,168,32,0.45)",
                fontFamily: "var(--font-heading), sans-serif",
                marginBottom: "2px",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--gold)",
                fontFamily: "var(--font-heading), sans-serif",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    location: "",
    summary: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/reports");
        const data = (await res.json()) as { reports: Report[] };
        setReports(data.reports);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { message: string; report?: Report };
      if (!res.ok || !data.report) {
        setFeedback({ type: "error", message: data.message });
        return;
      }
      setReports((prev) => [data.report as Report, ...prev]);
      setForm({ title: "", category: categories[0], location: "", summary: "" });
      setFeedback({ type: "success", message: data.message });
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          background: scrolled ? "rgba(247,249,245,0.90)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,87,42,0.10)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontSize: "0.625rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: scrolled ? "#8aa090" : "rgba(255,255,255,0.45)",
                transition: "color 0.3s",
                fontFamily: "var(--font-heading), sans-serif",
              }}
            >
              Canal Ciudadano · Antioquia
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: scrolled ? "var(--dark)" : "#fff",
                transition: "color 0.3s",
                fontFamily: "var(--font-heading), sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              com<span style={{ color: scrolled ? "var(--gold)" : "var(--gold-bright)" }}>BATE</span> la Corrupción
            </p>
          </div>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: scrolled ? "#546a5c" : "rgba(255,255,255,0.78)",
              transition: "color 0.3s",
            }}
            className="hidden md:flex"
          >
            {[
              { label: "El Portal", href: "#portal" },
              { label: "Denunciar", href: "#denuncia" },
              { label: "Reportes", href: "#reportes" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{ transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "var(--gold)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = scrolled
                    ? "#546a5c"
                    : "rgba(255,255,255,0.78)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#denuncia"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--gold)",
              color: "var(--dark)",
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-heading), sans-serif",
              transition: "background 0.2s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "var(--gold-bright)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background =
                "var(--gold)")
            }
          >
            Denunciar <ArrowRight style={{ width: 13, height: 13 }} />
          </a>
        </div>
      </nav>

      <main>
        {/* ════════════════════════════════════════════
            HERO — dark green, atmospheric, full-height
        ════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "100svh",
            background: "var(--dark)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingTop: "64px",
          }}
        >
          {/* Background layers */}
          <div aria-hidden="true" className="hero-dot-grid" />
          <div
            aria-hidden="true"
            className="hero-glow-gold anim-glow"
            style={{ top: "22%", left: "-4%" }}
          />
          <div
            aria-hidden="true"
            className="hero-glow-green"
            style={{ top: "-15%", right: "5%" }}
          />
          <div aria-hidden="true" className="hero-fade-bottom" />

          {/* Main content */}
          <div
            style={{
              flex: 1,
              maxWidth: "1280px",
              margin: "0 auto",
              width: "100%",
              padding: "0 2.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "3rem",
                padding: "5rem 0",
              }}
              className="lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
            >
              {/* ── Left: Headline ── */}
              <div
                className="anim-fade-up"
                style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
              >
                {/* Badge */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid rgba(212,168,32,0.32)",
                      background: "rgba(212,168,32,0.09)",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--gold-bright)",
                      fontFamily: "var(--font-heading), sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--gold)",
                        display: "inline-block",
                        animation: "glowPulse 2s ease-in-out infinite",
                      }}
                    />
                    Portal Cívico · Antioquia · Veeduría Ciudadana
                  </span>
                </div>

                {/* H1 */}
                <h1
                  style={{
                    fontSize: "clamp(3.2rem, 7vw, 5.5rem)",
                    color: "#fff",
                    lineHeight: 1.04,
                    letterSpacing: "-0.03em",
                    maxWidth: "680px",
                  }}
                >
                  com
                  <span style={{ color: "var(--gold)" }}>BATE</span>
                  <br />
                  la corrupción.
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "#7a9080",
                    lineHeight: 1.75,
                    maxWidth: "520px",
                  }}
                >
                  Plataforma de vigilancia ciudadana: perfil público del concejal{" "}
                  <span style={{ color: "#d4e8da", fontWeight: 500 }}>
                    Andrés Gury Rodríguez
                  </span>{" "}
                  y canal de denuncia anónima con revisión editorial independiente.
                </p>

                {/* CTAs */}
                <div
                  style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                >
                  <a
                    href="#denuncia"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--gold)",
                      color: "var(--dark)",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      fontFamily: "var(--font-heading), sans-serif",
                      transition: "background 0.2s, transform 0.15s",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--gold-bright)";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--gold)";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    Hacer una denuncia
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </a>
                  <a
                    href="#reportes"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "#fff",
                      padding: "14px 28px",
                      borderRadius: "999px",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      fontFamily: "var(--font-heading), sans-serif",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.38)";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.18)";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                    }}
                  >
                    Ver reportes
                    <ChevronRight style={{ width: 15, height: 15 }} />
                  </a>
                </div>

                {/* Mobile metrics */}
                <div
                  className="lg:hidden"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    borderTop: "1px solid rgba(255,255,255,0.09)",
                    paddingTop: "1.5rem",
                  }}
                >
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <p
                        style={{
                          fontSize: "1.75rem",
                          fontWeight: 700,
                          color: "var(--gold)",
                          fontFamily: "var(--font-heading), sans-serif",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {m.value}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#546a5c",
                          marginTop: "4px",
                          lineHeight: 1.4,
                        }}
                      >
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: 3D Bat HUD + denounceable list ── */}
              <div
                className="anim-fade-up-2 hidden lg:flex"
                style={{
                  flexDirection: "column",
                  gap: "1.25rem",
                  alignItems: "center",
                }}
              >
                {/* 3D Bat game card */}
                <BatHUD />

                {/* What citizens can denounce */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "var(--gold-bright)",
                      fontWeight: 600,
                      fontFamily: "var(--font-heading), sans-serif",
                    }}
                  >
                    Puedes denunciar
                  </p>
                  {denounceable.map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
                    >
                      <Icon
                        style={{
                          width: 14,
                          height: 14,
                          color: "var(--gold)",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "rgba(255,255,255,0.62)",
                          lineHeight: 1.6,
                        }}
                      >
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop metrics strip */}
          <div
            className="hidden lg:block"
            style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
          >
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 2.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="anim-fade-up-3"
                  style={{
                    padding: "2rem 0",
                    borderRight:
                      i < 2 ? "1px solid rgba(255,255,255,0.09)" : "none",
                    paddingRight: i < 2 ? "2rem" : 0,
                    paddingLeft: i > 0 ? "2rem" : 0,
                  }}
                >
                  <p
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      fontFamily: "var(--font-heading), sans-serif",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {m.value}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "#546a5c", marginTop: "6px" }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PROFILE SECTION
        ════════════════════════════════════════════ */}
        <section id="portal" style={{ background: "var(--surface)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ marginBottom: "3.5rem", maxWidth: "640px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>
                Sobre la plataforma
              </p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)" }}>
                Un espacio cívico de información y control social.
              </h2>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
              className="lg:grid-cols-2"
            >
              {/* Profile narrative */}
              <div
                style={{
                  background: "var(--dark)",
                  borderRadius: "20px",
                  padding: "2.25rem",
                  color: "#fff",
                }}
              >
                <p
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    fontWeight: 600,
                    fontFamily: "var(--font-heading), sans-serif",
                    marginBottom: "12px",
                  }}
                >
                  Perfil público
                </p>
                <h3 style={{ fontSize: "1.5rem", color: "#fff", marginBottom: "1.25rem" }}>
                  Andrés Gury Rodríguez, concejal
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#7a9080", lineHeight: 1.75, marginBottom: "2rem" }}>
                  Esta página propone una lectura informativa: agenda pública,
                  compromisos anunciados y apertura a denuncias ciudadanas. La
                  figura del concejal aparece como impulsor de vigilancia pública,
                  no como sustituto de autoridades ni juez de los casos reportados.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { icon: Users, label: "Posición", value: "Concejal municipal en ejercicio" },
                    { icon: FileText, label: "Agenda", value: "Transparencia y control ciudadano" },
                    { icon: CheckCircle, label: "Canal", value: "Denuncia anónima habilitada" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                      }}
                    >
                      <Icon style={{ width: 15, height: 15, color: "var(--gold-bright)", flexShrink: 0 }} />
                      <div>
                        <p
                          style={{
                            fontSize: "0.625rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#3a5040",
                            fontWeight: 600,
                            fontFamily: "var(--font-heading), sans-serif",
                          }}
                        >
                          {label}
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "#c8ddd0", fontWeight: 500, marginTop: "2px" }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitments */}
              <div>
                <p className="section-label" style={{ marginBottom: "1.5rem" }}>
                  Compromisos visibles
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  {commitments.map((c, i) => (
                    <div
                      key={i}
                      className="card-lift"
                      style={{
                        display: "flex",
                        gap: "16px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        borderRadius: "16px",
                        padding: "20px 22px",
                        boxShadow: "var(--shadow-sm)",
                        cursor: "default",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(212,168,32,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#9a7018",
                          fontFamily: "var(--font-heading), sans-serif",
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontSize: "0.9375rem", color: "#546a5c", lineHeight: 1.7 }}>
                        {c}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid rgba(217,119,6,0.20)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <AlertCircle style={{ width: 17, height: 17, color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#92400e", marginBottom: "4px" }}>
                      Aviso editorial
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "#b45309", lineHeight: 1.6 }}>
                      El portal no representa a la administración municipal. Es una
                      iniciativa de veeduría ciudadana con criterio editorial independiente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════ */}
        <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>Cómo funciona</p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)" }}>
                Tres pasos para activar la vigilancia.
              </h2>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
              className="lg:grid-cols-3"
            >
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className="card-lift"
                  style={{
                    position: "relative",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    borderRadius: "20px",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "3.5rem",
                        fontWeight: 700,
                        color: "#e8ede5",
                        fontFamily: "var(--font-heading), sans-serif",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {step.number}
                    </p>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        background: "var(--dark)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <step.icon style={{ width: 18, height: 18, color: "var(--gold-bright)" }} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--dark)", marginBottom: "12px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                  {i < 2 && (
                    <div
                      className="hidden lg:flex"
                      style={{
                        position: "absolute",
                        right: "-20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        width: 36,
                        height: 36,
                        border: "1px solid var(--border)",
                        background: "#fff",
                        borderRadius: "50%",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <ChevronRight style={{ width: 14, height: 14, color: "#94a3b8" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            ANONYMOUS REPORT FORM
        ════════════════════════════════════════════ */}
        <section id="denuncia" style={{ background: "var(--dark)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ marginBottom: "3.5rem", maxWidth: "640px" }}>
              <p className="section-label-light" style={{ marginBottom: "12px" }}>
                Canal de denuncia
              </p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff" }}>
                Denuncia anónima con reglas claras.
              </h2>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
              className="lg:grid-cols-[0.9fr_1.1fr]"
            >
              {/* Context panel */}
              <div>
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "20px",
                    padding: "2.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p className="section-label-light" style={{ marginBottom: "1.75rem" }}>
                    Antes de enviar
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                      {
                        icon: Lock,
                        title: "Tu identidad está protegida",
                        text: "No compartas nombre, documento, dirección ni datos privados de terceros.",
                      },
                      {
                        icon: AlertCircle,
                        title: "No reemplaza canales oficiales",
                        text: "No es fiscalía ni procuraduría. Es un espacio de control social y trazabilidad.",
                      },
                      {
                        icon: Eye,
                        title: "Moderación previa a publicación",
                        text: "Cada reporte pasa por revisión editorial para reducir riesgo de difamación.",
                      },
                      {
                        icon: Clock,
                        title: "Tiempo estimado de revisión",
                        text: "Meta de revisión inicial dentro de las primeras 24 horas de recibido.",
                      },
                    ].map(({ icon: Icon, title, text }) => (
                      <div key={title} style={{ display: "flex", gap: "14px" }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            border: "1px solid rgba(255,255,255,0.09)",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon style={{ width: 15, height: 15, color: "var(--gold-bright)" }} />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8e0", marginBottom: "4px" }}>
                            {title}
                          </p>
                          <p style={{ fontSize: "0.8125rem", color: "#546a5c", lineHeight: 1.65 }}>
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(212,168,32,0.22)",
                    background: "rgba(212,168,32,0.06)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <Shield style={{ width: 16, height: 16, color: "var(--gold)", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.8125rem", color: "#546a5c" }}>
                    <span style={{ color: "var(--gold)", fontWeight: 600 }}>Confianza pública.</span>{" "}
                    Diseño editorial con peso institucional y archivo cívico.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "2.25rem",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      Título breve <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      required
                      className="field-input"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Ej. Posible irregularidad en contratación de obras"
                    />
                  </div>

                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                    className="grid-cols-1 sm:grid-cols-2"
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        Categoría
                      </label>
                      <select
                        className="field-input"
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      >
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--dark)",
                        }}
                      >
                        Zona o dependencia <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        required
                        className="field-input"
                        value={form.location}
                        onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                        placeholder="Ej. Comuna 3 o Secretaría de Infraestructura"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      Hechos y contexto <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      required
                      className="field-textarea"
                      value={form.summary}
                      onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                      placeholder="Describe qué pasó, cuándo ocurrió y qué evidencia existe. Evita nombres propios si no son indispensables."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: submitting ? "#7a9080" : "var(--dark)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "999px",
                      padding: "14px 28px",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      fontFamily: "var(--font-heading), sans-serif",
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "background 0.2s",
                      width: "100%",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "var(--green-deep)";
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "var(--dark)";
                    }}
                  >
                    <Send style={{ width: 15, height: 15 }} />
                    {submitting ? "Enviando denuncia..." : "Enviar denuncia anónima"}
                  </button>

                  {feedback && (
                    <div
                      style={{
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                        color: feedback.type === "success" ? "#15803d" : "#dc2626",
                        border:
                          feedback.type === "success"
                            ? "1px solid rgba(22,163,74,0.20)"
                            : "1px solid rgba(220,38,38,0.20)",
                      }}
                    >
                      {feedback.message}
                    </div>
                  )}

                  <p style={{ fontSize: "0.75rem", color: "#8aa090", lineHeight: 1.6 }}>
                    Al enviar, aceptas que tu reporte será revisado editorialmente antes de
                    publicarse. No almacenamos datos personales ni de identificación.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            REPORTS FEED
        ════════════════════════════════════════════ */}
        <section id="reportes" style={{ background: "var(--surface)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "2rem",
                marginBottom: "3.5rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ maxWidth: "560px" }}>
                <p className="section-label" style={{ marginBottom: "12px" }}>
                  Reportes ciudadanos
                </p>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)" }}>
                  Muestra pública de denuncias moderadas.
                </h2>
              </div>
              <p style={{ maxWidth: "320px", fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                El feed visibiliza movimiento ciudadano real. En producción estará conectado a una
                base de datos con flujo de moderación.
              </p>
            </div>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "20px", padding: "1.5rem" }}>
                    <div className="skeleton" style={{ height: 12, width: "40%", marginBottom: 16 }} />
                    <div className="skeleton" style={{ height: 22, width: "80%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 10, width: "30%", marginBottom: 20 }} />
                    <div className="skeleton" style={{ height: 10, width: "100%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "85%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "60%" }} />
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px dashed #c8d8c0",
                  borderRadius: "20px",
                  padding: "5rem 2rem",
                  textAlign: "center",
                }}
              >
                <FileText style={{ width: 40, height: 40, color: "#b0c8b8", marginBottom: "1rem" }} />
                <p style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#546a5c", marginBottom: "8px" }}>
                  Sin reportes publicados aún
                </p>
                <p style={{ fontSize: "0.875rem", color: "#8aa090", marginBottom: "1.5rem" }}>
                  Sé el primero en activar la vigilancia ciudadana.
                </p>
                <a
                  href="#denuncia"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--dark)",
                    color: "#fff",
                    padding: "10px 22px",
                    borderRadius: "999px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-heading), sans-serif",
                  }}
                >
                  Hacer una denuncia <ArrowRight style={{ width: 14, height: 14 }} />
                </a>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {reports.map((r) => (
                  <article
                    key={r.id}
                    className="card-lift"
                    style={{
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                      boxShadow: "var(--shadow-sm)",
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <span className={statusBadgeClass(r.status)}>{r.status}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-light)", whiteSpace: "nowrap" }}>
                        {r.createdAt}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--text-light)",
                        fontWeight: 600,
                        fontFamily: "var(--font-heading), sans-serif",
                        marginBottom: "8px",
                      }}
                    >
                      {r.category}
                    </p>
                    <h3 style={{ fontSize: "1.0625rem", color: "var(--dark)", lineHeight: 1.35, marginBottom: "12px" }}>
                      {r.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                        marginBottom: "1.25rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.summary}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "14px",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#b0c8b8", flexShrink: 0 }} />
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>
                        {r.location}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════ */}
        <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ marginBottom: "3.5rem", maxWidth: "520px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>Preguntas frecuentes</p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--dark)" }}>
                Lo que debes saber.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="card-lift"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    borderRadius: "20px",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                    cursor: "default",
                  }}
                >
                  <h3 style={{ fontSize: "1.0625rem", color: "var(--dark)", lineHeight: 1.4, marginBottom: "1rem" }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER / CTA
        ════════════════════════════════════════════ */}
        <footer style={{ background: "var(--dark)" }}>
          {/* CTA band */}
          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "6rem 0" }}>
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ maxWidth: "620px" }}>
                <p className="section-label-light" style={{ marginBottom: "12px" }}>Actúa ahora</p>
                <h2 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", color: "#fff", marginBottom: "1rem" }}>
                  Activa la vigilancia ciudadana.
                </h2>
                <p style={{ fontSize: "1.125rem", color: "#546a5c", lineHeight: 1.7 }}>
                  Cada reporte cuenta. La transparencia es un derecho colectivo que se
                  construye con evidencia, no con silencio.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a
                  href="#denuncia"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "var(--gold)",
                    color: "var(--dark)",
                    padding: "16px 36px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    fontFamily: "var(--font-heading), sans-serif",
                    transition: "background 0.2s, transform 0.15s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold-bright)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  }}
                >
                  Hacer una denuncia <ArrowRight style={{ width: 16, height: 16 }} />
                </a>
                <a
                  href="#reportes"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#fff",
                    padding: "16px 36px",
                    borderRadius: "999px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    fontFamily: "var(--font-heading), sans-serif",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.38)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      "rgba(255,255,255,0.18)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                >
                  Ver reportes
                </a>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div style={{ padding: "2rem 0" }}>
            <div
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "var(--font-heading), sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Portal Vigilancia Ciudadana · Antioquia
                </p>
                <p style={{ fontSize: "0.75rem", color: "#243028", marginTop: "4px" }}>
                  Iniciativa editorial independiente de veeduría cívica.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 16px",
                  fontSize: "0.75rem",
                  color: "#243028",
                  alignItems: "center",
                }}
              >
                <span>No es entidad gubernamental</span>
                <span>·</span>
                <span>Contenido sujeto a moderación editorial</span>
                <span>·</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   