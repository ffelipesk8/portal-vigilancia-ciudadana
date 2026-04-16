import { NextResponse } from "next/server";

type Report = {
  id: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  status: string;
  createdAt: string;
};

const reports: Report[] = [
  {
    id: "r-101",
    title: "Contratación con sobrecostos en mantenimiento vial",
    category: "Contratación pública",
    location: "Comuna Centro",
    summary:
      "Se reporta diferencia entre el contrato publicado y la ejecución visible en campo. La denuncia fue anonimizada y está en revisión editorial.",
    status: "En verificación",
    createdAt: "Hace 2 días",
  },
  {
    id: "r-102",
    title: "Posible uso indebido de recursos logísticos",
    category: "Uso de recursos públicos",
    location: "Zona administrativa",
    summary:
      "El reporte incluye fechas, horarios y una descripción de vehículos oficiales usados fuera del contexto institucional.",
    status: "Recibida",
    createdAt: "Hace 5 días",
  },
  {
    id: "r-103",
    title: "Presión política en contratación de personal",
    category: "Abuso de poder",
    location: "Sector norte",
    summary:
      "Se describe un posible patrón de recomendación indebida para cargos temporales. El equipo solicita soportes adicionales.",
    status: "Seguimiento abierto",
    createdAt: "Hace 1 semana",
  },
];

export async function GET() {
  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{
    title: string;
    category: string;
    location: string;
    summary: string;
  }>;

  if (!body.title || !body.category || !body.location || !body.summary) {
    return NextResponse.json(
      { message: "Completa todos los campos obligatorios." },
      { status: 400 },
    );
  }

  const normalized = {
    id: `r-${Date.now()}`,
    title: body.title.trim(),
    category: body.category.trim(),
    location: body.location.trim(),
    summary: body.summary.trim(),
    status: "Recibida",
    createdAt: "Ahora mismo",
  };

  reports.unshift(normalized);

  return NextResponse.json(
    {
      message:
        "Tu denuncia fue recibida de forma anónima. Pasará por verificación antes de publicarse o escalarse.",
      report: normalized,
    },
    { status: 201 },
  );
}
