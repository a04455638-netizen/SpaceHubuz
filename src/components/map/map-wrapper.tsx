"use client";

import dynamic from "next/dynamic";
import type { CuratedVenue } from "../../server/mock-venues";

const InteractiveMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center rounded-2xl border border-border bg-surface-muted animate-pulse">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 mx-auto rounded-full bg-accent/20 animate-spin" />
        <p className="text-xs font-semibold text-ink-muted">Interaktiv xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  venues: CuratedVenue[];
  selectedVenueId?: string;
  onSelectVenue?: (venue: CuratedVenue) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function MapWrapper(props: MapWrapperProps) {
  return <InteractiveMap {...props} />;
}
