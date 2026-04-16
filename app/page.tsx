"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Shield,
  Siren,
  Trophy,
} from "lucide-react";

type Report = {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  status: string;
  createdAt: string;
};

const commitments = [
  "Publicar rutas claras de seguimiento y respuesta para cada denuncia ciudadana.",
  "Separar el discurso político del tratamiento editorial de los reportes recibidos.",
  "Promover control social con evidencias, contexto y protección del anonimato.",
];

const metrics = [
  { value: "24h", label: "Meta de primera revisión editorial" },
  { value: "100%", label: "Recepción sin exigir identidad personal" },
  { value: "3 filtros", label: "Validación básica antes de publicación" },
];

const faq = [
  {
    question: "¿La denuncia es realmente anónima?",
    answer:
      "El formulario no pide nombre ni documento. Aun así, evita incluir datos personales tuyos o de terceros dentro del texto.",
  },
  {
    question: "¿Se publica todo lo recibido?",
    answer:
      "No. Cada caso pasa por una moderación inicial para reducir contenido falso, información sensible o material que pueda afectar procesos legales.",
  },
  {
    question: "¿Sirve como denuncia penal formal?",
    answer:
      "No reemplaza los canales oficiales. El portal es informativo y de veeduría ciudadana; cuando corresponda, se recomienda escalar a autoridades competentes.",
  },
];

const categories = [
  "Contratación pública",
  "Abuso de poder",
  "Uso de recursos públicos",
  "Presión política",
  "Otro",
];

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    location: "",
    summary: "",
  });

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/reports");
      const data = (await response.json()) as { reports: Report[] };
      setReports(data.reports);
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = (await response.json()) as {
      message: string;
      report?: Report;
    };

    if (!response.ok || !data.report) {
      setFeedback(data.message);
      setSubmitting(false);
      return;
    }

    setReports((current) => [data.report as Report, ...current]);
    setForm({
      title: "",
      category: categories[0],
      location: "",
      summary: "",
    });
    setFeedback(data.message);
    setSubmitting(false);
  }

  return (
    <main className="overflow-hidden">
      <section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/50 bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Canal Ciudadano
            </p>
            <p className="text-sm font-semibold text-[var(--primary)]">
              Vigilancia, memoria y denuncia
            </p>
          </div>
          <a
            href="#denuncia"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]"
          >
            Denunciar ahora <ArrowRight className="h-4 w-4" />
          </a>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-7">
            <span className="inline-flex rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              comBATE la corrupción
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl leading-none text-[var(--primary)] sm:text-6xl lg:text-7xl">
                Una tribuna cívica para golpear la corrupción con evidencia, no con silencio.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                Sitio informativo sobre la agenda pública del concejal Andrés Gury Rodríguez
                y un canal ciudadano para dejar reportes anónimos que luego pasan por
                verificación editorial.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/70 bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-soft)]"
                >
                  <p className="text-3xl font-semibold text-[var(--primary)]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(13,35,42,0.96),rgba(29,61,71,0.92))] p-7 text-white shadow-[var(--shadow-strong)]">
            <div className="absolute inset-x-10 top-8 h-px bg-white/15" />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Símbolo editorial
                </span>
                <Siren className="h-5 w-5 text-[var(--accent-soft)]" />
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6">
                <div className="mb-5 flex items-end gap-3">
                  <div className="h-28 w-4 rounded-full bg-[linear-gradient(180deg,#e7c4a8,#a86d3f)]" />
                  <div className="h-40 w-20 rounded-[999px] rounded-bl-[2rem] bg-[linear-gradient(180deg,#f2d9c2,#b17a4d)] shadow-[0_20px_50px_rgba(0,0,0,0.16)]" />
                </div>
                <p className="font-semibold uppercase tracking-[0.22em] text-[var(--accent-soft)]">
                  El bate como metáfora
                </p>
                <p className="mt-3 text-sm leading-7 text-white/76">
                  La narrativa visual toma el bate como emblema de confrontar la corrupción
                  con control ciudadano, trazabilidad y presión pública informada.
                </p>
              </div>
              <div className="grid gap-3 text-sm leading-7 text-white/76">
                <div className="flex gap-3">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-soft)]" />
                  <p>Perfil público del concejal en tono factual e institucional.</p>
                </div>
                <div className="flex gap-3">
                  <Shield className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-soft)]" />
                  <p>Denuncia anónima con aviso legal y moderación previa a difusión.</p>
                </div>
                <div className="flex gap-3">
                  <Activity className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-soft)]" />
                  <p>Sección de reportes recientes para demostrar movimiento y seguimiento.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <article className="rounded-[2rem] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Perfil público
          </p>
          <h2 className="mt-4 text-4xl text-[var(--primary)]">
            Andrés Gury Rodríguez, presentado desde una narrativa de control ciudadano.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            Esta página propone una lectura informativa: agenda pública, compromisos
            anunciados y apertura a denuncias ciudadanas. La figura del concejal aparece
            como impulsor de vigilancia pública, no como sustituto de autoridades ni juez
            de los casos reportados.
          </p>
        </article>

        <article className="rounded-[2rem] border border-[var(--line)] bg-white/50 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
            Compromisos visibles
          </p>
          <div className="mt-5 grid gap-4">
            {commitments.map((commitment) => (
              <div
                key={commitment}
                className="rounded-[1.5rem] bg-white/80 p-5 text-base leading-7 text-[var(--foreground)] shadow-[var(--shadow-soft)]"
              >
                {commitment}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["1", "Cuéntalo", "Resume el hecho, la zona y por qué consideras que amerita revisión."],
            ["2", "Protege la evidencia", "Describe documentos, fechas, contratos o testigos sin revelar tu identidad."],
            ["3", "Activa seguimiento", "El equipo editorial revisa, clasifica y decide si publica o remite el caso."],
          ].map(([step, title, copy]) => (
            <article
              key={step}
              className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-soft)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Paso {step}
              </p>
              <h3 className="mt-4 text-3xl text-[var(--primary)]">{title}</h3>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="denuncia"
        className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10"
      >
        <article className="rounded-[2rem] bg-[linear-gradient(180deg,#1d3d47,#10272f)] p-8 text-white shadow-[var(--shadow-strong)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-soft)]">
            Antes de enviar
          </p>
          <h2 className="mt-4 text-4xl">Canal anónimo con reglas claras.</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/78">
            <p>
              No compartas tu nombre, número de documento, dirección ni datos privados de
              terceros.
            </p>
            <p>
              El portal no reemplaza fiscalía, procuraduría ni personerías. Sirve como
              espacio de control social y trazabilidad pública.
            </p>
            <p>
              La publicación de reportes depende de revisión editorial para reducir riesgo
              de difamación o exposición indebida.
            </p>
          </div>
          <div className="mt-8 rounded-[1.5rem] bg-white/8 p-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-[var(--accent-soft)]" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-soft)]">
                Confianza pública
              </p>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/76">
              El diseño editorial está inspirado en la propuesta visual generada en Stitch
              para dar peso institucional, lectura cómoda y una sensación de archivo cívico.
            </p>
          </div>
        </article>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/70 bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
                Título breve
              </label>
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 outline-none transition focus:border-[var(--primary)]"
                placeholder="Ej. Posible irregularidad en contratación de obras"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
                  Categoría
                </label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 outline-none transition focus:border-[var(--primary)]"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
                  Zona o dependencia
                </label>
                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, location: event.target.value }))
                  }
                  className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 outline-none transition focus:border-[var(--primary)]"
                  placeholder="Ej. Comuna 3 o Secretaría de Infraestructura"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
                Hechos y contexto
              </label>
              <textarea
                required
                value={form.summary}
                onChange={(event) =>
                  setForm((current) => ({ ...current, summary: event.target.value }))
                }
                className="min-h-40 w-full rounded-[1.5rem] border border-[var(--line)] bg-white px-4 py-4 outline-none transition focus:border-[var(--primary)]"
                placeholder="Describe qué pasó, cuándo ocurrió y qué evidencia existe. Evita nombres propios si no son indispensables."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Enviando denuncia..." : "Enviar denuncia anónima"}
            </button>

            {feedback ? (
              <p className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--primary)]">
                {feedback}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              Reportes recientes
            </p>
            <h2 className="mt-3 text-4xl text-[var(--primary)]">
              Muestra pública de denuncias moderadas o en revisión.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
            El feed visibiliza movimiento ciudadano. En producción conviene conectarlo a una
            base de datos persistente y a un flujo real de moderación.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {(loading ? [] : reports).map((report) => (
            <article
              key={report.id}
              className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                <span>{report.category}</span>
                <span>{report.createdAt}</span>
              </div>
              <h3 className="mt-4 text-2xl text-[var(--primary)]">{report.title}</h3>
              <p className="mt-3 text-sm font-semibold text-[var(--critical)]">{report.status}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{report.summary}</p>
              <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
                Ubicación: {report.location}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {faq.map((item) => (
          <article
            key={item.question}
            className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-6"
          >
            <h3 className="text-2xl text-[var(--primary)]">{item.question}</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
