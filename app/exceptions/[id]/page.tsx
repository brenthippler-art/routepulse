import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exceptions } from "@/lib/mock-data";
import { ExceptionDetail } from "@/components/ExceptionDetail";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const exception = exceptions.find((e) => e.id === id);
  return { title: exception ? `${exception.stopId} · RoutePulse` : "Exception not found · RoutePulse" };
}

export default async function ExceptionPage({ params }: PageProps) {
  const { id } = await params;
  const exception = exceptions.find((e) => e.id === id);

  if (!exception) notFound();

  return <ExceptionDetail exception={exception} />;
}