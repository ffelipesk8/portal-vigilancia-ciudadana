"use client";

import { useEffect, useState } from "react";
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

function statusBadgeClass(status: string): string {
  if (status === "En verificación") return "badge badge-warn";
  if (status === "Seguimiento abierto") return "badge badge-info";
  return "badge badge-ok";
}

// ─── Hero Bat Visual ──────────────────────────────────────────────────────────

function BatVisual() {
  return (
    <div className="relative flex flex-col items-center anim-float" style={{ height: "210px" }}>
      {/* Glow halo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "130px",
          height: "170px",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(6,182,212,0.28) 0%, transparent 70%)",
          filter: "blur(18px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      {/* Handle */}
      <div
        style={{
          width: "14px",
          height: "90px",
          borderRadius: "999px",
          background: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)",
          position: "relative",
          zIndex: 1,
        }}
      />
      {/* Barrel */}
      <div
        style={{
          width: "68px",
          height: "148px",
          marginTop: "-3px",
          borderRadius: "40px 40px 16px 16px",
          background:
            "linear-gradient(175deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)",
          boxShadow:
            "0 12px 48px rgba(6,182,212,0.30), 0 4px 16px rgba(0,0,0,0.18)",
          position: "relative",
          zIndex: 1,
        }}
      />
      {/* Knob */}
      <div
        style={{
          width: "26px",
          height: "12px",
          marginTop: "-3px",
          borderRadius: "0 0 10px 10px",
          background: "#64748b",
          position: "relative",
          zIndex: 1,
        }}
      />
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

  // Scroll-aware navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load reports
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

  // Submit handler
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
          NAVBAR — fixed, scroll-aware
      ════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          background: scrolled ? "rgba(248,250,252,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(15,23,42,0.09)"
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
                color: scrolled ? "#94a3b8" : "rgba(255,255,255,0.45)",
                transition: "color 0.3s",
                fontFamily: "var(--font-heading), sans-serif",
              }}
            >
              Canal Ciudadano
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: scrolled ? "var(--navy)" : "#fff",
                transition: "color 0.3s",
                fontFamily: "var(--font-heading), sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Vigilancia Ciudadana
            </p>
          </div>

          {/* Nav links — desktop */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: scrolled ? "#64748b" : "rgba(255,255,255,0.75)",
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
                  ((e.target as HTMLAnchorElement).style.color = "var(--cyan)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = scrolled
                    ? "#64748b"
                    : "rgba(255,255,255,0.75)")
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
              background: "var(--cyan)",
              color: "var(--navy)",
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-heading), sans-serif",
              transition: "background 0.2s, transform 0.15s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#22d3ee";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--cyan)";
            }}
          >
            Denunciar <ArrowRight style={{ width: 13, height: 13 }} />
          </a>
        </div>
      </nav>

      <main>
        {/* ════════════════════════════════════════════
            HERO — dark, atmospheric, full-height
        ════════════════════════════════════════════ */}
        <section
          style={{
            position: "relative",
            minHeight: "100svh",
            background: "var(--navy)",
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
            className="hero-glow-cyan anim-glow"
            style={{ top: "25%", left: "-6%" }}
          />
          <div
            aria-hidden="true"
            className="hero-glow-navy"
            style={{ top: "-12%", right: "8%" }}
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
              className="lg:grid-cols-[1.15fr_0.85fr] lg:items-center"
            >
              {/* ── Left: Headline column ── */}
              <div className="anim-fade-up" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Badge */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid rgba(6,182,212,0.30)",
                      background: "rgba(6,182,212,0.09)",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--cyan-light)",
                      fontFamily: "var(--font-heading), sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--cyan)",
                        display: "inline-block",
                        animation: "glowPulse 2s ease-in-out infinite",
                      }}
                    />
                    Portal Cívico · Veeduría Ciudadana
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
                  <span style={{ color: "var(--cyan)" }}>BATE</span>
                  <br />
                  la corrupción.
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "#94a3b8",
                    lineHeight: 1.75,
                    maxWidth: "520px",
                  }}
                >
                  Plataforma de vigilancia ciudadana: perfil público del concejal{" "}
                  <span style={{ color: "#e2e8f0", fontWeight: 500 }}>
                    Andrés Gury Rodríguez
                  </span>{" "}
                  y canal de denuncia anónima con revisión editorial independiente.
                </p>

                {/* CTA row */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a
                    href="#denuncia"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--cyan)",
                      color: "var(--navy)",
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
                        "#22d3ee";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--cyan)";
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
                          color: "#fff",
                          fontFamily: "var(--font-heading), sans-serif",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {m.value}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#64748b",
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

              {/* ── Right: Editorial card ── */}
              <div className="anim-fade-up-2 hidden lg:flex lg:justify-end">
                <div
                  style={{
                    width: "100%",
                    maxWidth: "380px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "20px",
                    padding: "28px",
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.625rem",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "var(--cyan-light)",
                        fontWeight: 600,
                        fontFamily: "var(--font-heading), sans-serif",
                      }}
                    >
                      Símbolo editorial
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "0.7rem",
                        color: "var(--cyan)",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--cyan)",
                          animation: "glowPulse 2s ease-in-out infinite",
                        }}
                      />
                      activo
                    </span>
                  </div>

                  {/* Bat visual */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "16px 0 24px",
                    }}
                  >
                    <BatVisual />
                  </div>

                  {/* Platform pillars */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      paddingTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {[
                      {
                        icon: BadgeCheck,
                        text: "Perfil público en tono factual e institucional.",
                      },
                      {
                        icon: Shield,
                        text: "Denuncia anónima con aviso legal y moderación previa.",
                      },
                      {
                        icon: Eye,
                        text: "Reportes con trazabilidad y seguimiento ciudadano.",
                      },
                    ].map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                      >
                        <Icon
                          style={{
                            width: 15,
                            height: 15,
                            color: "var(--cyan-light)",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        />
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "rgba(255,255,255,0.65)",
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
          </div>

          {/* Desktop metrics strip */}
          <div
            className="hidden lg:block"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.09)",
              position: "relative",
            }}
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
                  style={{
                    padding: "2rem 0",
                    borderRight:
                      i < 2 ? "1px solid rgba(255,255,255,0.09)" : "none",
                    paddingRight: i < 2 ? "2rem" : 0,
                    paddingLeft: i > 0 ? "2rem" : 0,
                  }}
                  className="anim-fade-up-3"
                >
                  <p
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "var(--font-heading), sans-serif",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {m.value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "#64748b",
                      marginTop: "6px",
                    }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PROFILE SECTION — white bg
        ════════════════════════════════════════════ */}
        <section
          id="portal"
          style={{ background: "var(--surface)", padding: "6rem 0" }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2.5rem",
            }}
          >
            {/* Section header */}
            <div style={{ marginBottom: "3.5rem", maxWidth: "640px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>
                Sobre la plataforma
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "var(--navy)",
                }}
              >
                Un espacio cívico de información y control social.
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
              className="lg:grid-cols-2"
            >
              {/* Profile narrative — dark card */}
              <div
                style={{
                  background: "var(--navy)",
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
                    color: "var(--cyan)",
                    fontWeight: 600,
                    fontFamily: "var(--font-heading), sans-serif",
                    marginBottom: "12px",
                  }}
                >
                  Perfil público
                </p>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    color: "#fff",
                    marginBottom: "1.25rem",
                  }}
                >
                  Andrés Gury Rodríguez, concejal
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#94a3b8",
                    lineHeight: 1.75,
                    marginBottom: "2rem",
                  }}
                >
                  Esta página propone una lectura informativa: agenda pública,
                  compromisos anunciados y apertura a denuncias ciudadanas. La
                  figura del concejal aparece como impulsor de vigilancia pública,
                  no como sustituto de autoridades ni juez de los casos reportados.
                </p>

                {/* Profile data rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    {
                      icon: Users,
                      label: "Posición",
                      value: "Concejal municipal en ejercicio",
                    },
                    {
                      icon: FileText,
                      label: "Agenda",
                      value: "Transparencia y control ciudadano",
                    },
                    {
                      icon: CheckCircle,
                      label: "Canal",
                      value: "Denuncia anónima habilitada",
                    },
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
                      <Icon
                        style={{
                          width: 15,
                          height: 15,
                          color: "var(--cyan-light)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontSize: "0.625rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#475569",
                            fontWeight: 600,
                            fontFamily: "var(--font-heading), sans-serif",
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#e2e8f0",
                            fontWeight: 500,
                            marginTop: "2px",
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commitments */}
              <div>
                <p
                  className="section-label"
                  style={{ marginBottom: "1.5rem" }}
                >
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
                          background: "rgba(6,182,212,0.10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--cyan-mid)",
                          fontFamily: "var(--font-heading), sans-serif",
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "#475569",
                          lineHeight: 1.7,
                        }}
                      >
                        {c}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Editorial notice */}
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
                  <AlertCircle
                    style={{
                      width: 17,
                      height: 17,
                      color: "#d97706",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#92400e",
                        marginBottom: "4px",
                      }}
                    >
                      Aviso editorial
                    </p>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        color: "#b45309",
                        lineHeight: 1.6,
                      }}
                    >
                      El portal no representa a la administración municipal. Es
                      una iniciativa de veeduría ciudadana con criterio editorial
                      independiente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — light gray bg
        ════════════════════════════════════════════ */}
        <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2.5rem",
            }}
          >
            <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>
                Cómo funciona
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "var(--navy)",
                }}
              >
                Tres pasos para activar la vigilancia.
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
              }}
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
                  {/* Step number (large bg) */}
                  <p
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 700,
                      color: "#f1f5f9",
                      fontFamily: "var(--font-heading), sans-serif",
                      lineHeight: 1,
                      marginBottom: "1rem",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.number}
                  </p>

                  {/* Icon */}
                  <div
                    style={{
                      position: "absolute",
                      top: "2rem",
                      right: "2rem",
                      width: 42,
                      height: 42,
                      background: "var(--navy)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <step.icon
                      style={{
                        width: 18,
                        height: 18,
                        color: "var(--cyan-light)",
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--navy)",
                      marginBottom: "12px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Connector arrow */}
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
                      <ChevronRight
                        style={{
                          width: 14,
                          height: 14,
                          color: "#94a3b8",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            ANONYMOUS REPORT FORM — dark navy bg
        ════════════════════════════════════════════ */}
        <section
          id="denuncia"
          style={{ background: "var(--navy)", padding: "6rem 0" }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2.5rem",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "3.5rem", maxWidth: "640px" }}>
              <p
                className="section-label-light"
                style={{ marginBottom: "12px" }}
              >
                Canal de denuncia
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#fff",
                }}
              >
                Denuncia anónima con reglas claras.
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
              className="lg:grid-cols-[0.9fr_1.1fr]"
            >
              {/* ── Left: Context panel ── */}
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
                  <p
                    className="section-label-light"
                    style={{ marginBottom: "1.75rem" }}
                  >
                    Antes de enviar
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    {[
                      {
                        icon: Lock,
                        title: "Tu identidad está protegida",
                        text: "No compartas nombre, documento, dirección ni datos privados de terceros.",
                      },
                      {
                        icon: AlertCircle,
                        title: "No reemplaza canales oficiales",
                        text: "No es fiscalía ni procuraduría. Es un espacio de control social y trazabilidad pública.",
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
                      <div
                        key={title}
                        style={{ display: "flex", gap: "14px" }}
                      >
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
                          <Icon
                            style={{
                              width: 15,
                              height: 15,
                              color: "var(--cyan-light)",
                            }}
                          />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "#e2e8f0",
                              marginBottom: "4px",
                            }}
                          >
                            {title}
                          </p>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "#64748b",
                              lineHeight: 1.65,
                            }}
                          >
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badge */}
                <div
                  style={{
                    border: "1px solid rgba(6,182,212,0.20)",
                    background: "rgba(6,182,212,0.06)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <Shield
                    style={{
                      width: 16,
                      height: 16,
                      color: "var(--cyan)",
                      flexShrink: 0,
                    }}
                  />
                  <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                    <span
                      style={{
                        color: "var(--cyan)",
                        fontWeight: 600,
                      }}
                    >
                      Confianza pública.
                    </span>{" "}
                    Diseño editorial con peso institucional y archivo cívico.
                  </p>
                </div>
              </div>

              {/* ── Right: Form ── */}
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
                  {/* Title */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--navy)",
                      }}
                    >
                      Título breve{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      required
                      className="field-input"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Ej. Posible irregularidad en contratación de obras"
                    />
                  </div>

                  {/* Category + Location */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                    className="grid-cols-1 sm:grid-cols-2"
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "var(--navy)",
                        }}
                      >
                        Categoría
                      </label>
                      <select
                        className="field-input"
                        value={form.category}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, category: e.target.value }))
                        }
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
                          color: "var(--navy)",
                        }}
                      >
                        Zona o dependencia{" "}
                        <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      <input
                        required
                        className="field-input"
                        value={form.location}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, location: e.target.value }))
                        }
                        placeholder="Ej. Comuna 3 o Secretaría de Infraestructura"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--navy)",
                      }}
                    >
                      Hechos y contexto{" "}
                      <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      required
                      className="field-textarea"
                      value={form.summary}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, summary: e.target.value }))
                      }
                      placeholder="Describe qué pasó, cuándo ocurrió y qué evidencia existe. Evita nombres propios si no son indispensables."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: submitting ? "#94a3b8" : "var(--navy)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "999px",
                      padding: "14px 28px",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      fontFamily: "var(--font-heading), sans-serif",
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "background 0.2s, transform 0.15s",
                      width: "100%",
                      letterSpacing: "-0.01em",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "var(--navy-mid)";
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "var(--navy)";
                    }}
                  >
                    <Send style={{ width: 15, height: 15 }} />
                    {submitting
                      ? "Enviando denuncia..."
                      : "Enviar denuncia anónima"}
                  </button>

                  {/* Feedback */}
                  {feedback && (
                    <div
                      style={{
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        background:
                          feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                        color:
                          feedback.type === "success" ? "#15803d" : "#dc2626",
                        border:
                          feedback.type === "success"
                            ? "1px solid rgba(22,163,74,0.20)"
                            : "1px solid rgba(220,38,38,0.20)",
                      }}
                    >
                      {feedback.message}
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      lineHeight: 1.6,
                    }}
                  >
                    Al enviar, aceptas que tu reporte será revisado
                    editorialmente antes de publicarse. No almacenamos datos
                    personales ni de identificación.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            REPORTS FEED — white bg
        ════════════════════════════════════════════ */}
        <section
          id="reportes"
          style={{ background: "var(--surface)", padding: "6rem 0" }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2.5rem",
            }}
          >
            {/* Header */}
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
                <h2
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    color: "var(--navy)",
                  }}
                >
                  Muestra pública de denuncias moderadas.
                </h2>
              </div>
              <p
                style={{
                  maxWidth: "320px",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                El feed visibiliza movimiento ciudadano real. En producción
                estará conectado a una base de datos con flujo de moderación.
              </p>
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "20px",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      className="skeleton"
                      style={{ height: 12, width: "40%", marginBottom: 16 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 22, width: "80%", marginBottom: 10 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 10, width: "30%", marginBottom: 20 }}
                    />
                    <div className="skeleton" style={{ height: 10, width: "100%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "85%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: "60%" }} />
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              /* Empty state */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px dashed #e2e8f0",
                  borderRadius: "20px",
                  padding: "5rem 2rem",
                  textAlign: "center",
                }}
              >
                <FileText
                  style={{
                    width: 40,
                    height: 40,
                    color: "#cbd5e1",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    color: "#64748b",
                    marginBottom: "8px",
                  }}
                >
                  Sin reportes publicados aún
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    marginBottom: "1.5rem",
                  }}
                >
                  Sé el primero en activar la vigilancia ciudadana.
                </p>
                <a
                  href="#denuncia"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--navy)",
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
              /* Report cards */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.25rem",
                }}
              >
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
                    {/* Status + date */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <span className={statusBadgeClass(r.status)}>
                        {r.status}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-light)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.createdAt}
                      </span>
                    </div>

                    {/* Category */}
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

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "1.0625rem",
                        color: "var(--navy)",
                        lineHeight: 1.35,
                        marginBottom: "12px",
                      }}
                    >
                      {r.title}
                    </h3>

                    {/* Summary */}
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

                    {/* Location */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "14px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#cbd5e1",
                          flexShrink: 0,
                        }}
                      />
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-muted)",
                          fontWeight: 500,
                        }}
                      >
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
            FAQ — light gray bg
        ════════════════════════════════════════════ */}
        <section style={{ background: "var(--bg-alt)", padding: "6rem 0" }}>
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "0 2.5rem",
            }}
          >
            <div style={{ marginBottom: "3.5rem", maxWidth: "520px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>
                Preguntas frecuentes
              </p>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "var(--navy)",
                }}
              >
                Lo que debes saber.
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
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
                  <h3
                    style={{
                      fontSize: "1.0625rem",
                      color: "var(--navy)",
                      lineHeight: 1.4,
                      marginBottom: "1rem",
                    }}
                  >
                    {item.question}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.75,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER / CTA — dark navy
        ════════════════════════════════════════════ */}
        <footer style={{ background: "var(--navy)" }}>
          {/* CTA band */}
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "6rem 0",
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
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ maxWidth: "620px" }}>
                <p
                  className="section-label-light"
                  style={{ marginBottom: "12px" }}
                >
                  Actúa ahora
                </p>
                <h2
                  style={{
                    fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                    color: "#fff",
                    marginBottom: "1rem",
                  }}
                >
                  Activa la vigilancia ciudadana.
                </h2>
                <p
                  style={{
                    fontSize: "1.125rem",
                    color: "#64748b",
                    lineHeight: 1.7,
                  }}
                >
                  Cada reporte cuenta. La transparencia es un derecho colectivo
                  que se construye con evidencia, no con silencio.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <a
                  href="#denuncia"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "var(--cyan)",
                    color: "var(--navy)",
                    padding: "16px 36px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    fontFamily: "var(--font-heading), sans-serif",
                    transition: "background 0.2s, transform 0.15s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "#22d3ee";
                    (e.currentTarget as HTMLAnchorElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "var(--cyan)";
                    (e.currentTarget as HTMLAnchorElement).style.transform =
                      "translateY(0)";
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
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }}
                >
                  Ver reportes
                </a>
              </div>
            </div>
          </div>

          {/* Legal footer */}
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
                  Portal Vigilancia Ciudadana
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#334155",
                    marginTop: "4px",
                  }}
                >
                  Iniciativa editorial independiente de veeduría cívica.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 16px",
                  fontSize: "0.75rem",
                  color: "#334155",
                  alignItems: "center",
                }}
              >
                <span>No es entidad gubernamental</span>
                <span style={{ color: "#1e293b" }}>·</span>
                <span>Contenido sujeto a moderación editorial</span>
                <span style={{ color: "#1e293b" }}>·</span>
                <span>© {new Date().getFullYear()} Todos los derechos reservados</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
