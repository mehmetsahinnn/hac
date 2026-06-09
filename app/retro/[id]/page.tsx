"use client";

import RetroBoard from "@/components/RetroBoard";

export default function RetroPage({ params }: { params: { id: string } }) {
  return <RetroBoard retroId={params.id} />;
}
