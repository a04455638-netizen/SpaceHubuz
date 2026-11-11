"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-border bg-surface-muted animate-pulse">
      <div className="text-center space-y-2">
        <div className="h-7 w-7 mx-auto rounded-full bg-accent/20 animate-spin" />
        <p className="text-xs font-semibold text-ink-muted">Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

interface LocationPickerWrapperProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

export function LocationPickerWrapper(props: LocationPickerWrapperProps) {
  return <LocationPicker {...props} />;
}
