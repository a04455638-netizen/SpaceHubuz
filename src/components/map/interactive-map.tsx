"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CuratedVenue } from "../../server/mock-venues";

interface InteractiveMapProps {
  venues: CuratedVenue[];
  selectedVenueId?: string;
  onSelectVenue?: (venue: CuratedVenue) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function InteractiveMap({
  venues,
  selectedVenueId,
  onSelectVenue,
  center = [41.311081, 69.279737], // Tashkent city center
  zoom = 12,
  className = "h-[600px] w-full rounded-2xl",
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Custom modern SVG pin
    const createCustomIcon = (isSelected: boolean, category: string) => {
      const color = isSelected
        ? "#2563EB"
        : category === "sports"
        ? "#059669"
        : category === "meetings"
        ? "#7C3AED"
        : category === "events"
        ? "#DC2626"
        : "#2563EB";

      return L.divIcon({
        className: "custom-marker-icon",
        html: `
          <div style="
            background-color: ${color};
            color: white;
            font-weight: bold;
            padding: 6px 10px;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid white;
            font-size: 11px;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            transform: translate(-50%, -100%);
            cursor: pointer;
          ">
            <span>📍</span>
            <span>SpaceHub</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    };

    // Add markers for venues
    venues.forEach((v) => {
      if (!v.latitude || !v.longitude) return;

      const isSelected = v.id === selectedVenueId;
      const marker = L.marker([v.latitude, v.longitude], {
        icon: createCustomIcon(isSelected, v.category),
      }).addTo(map);

      // Popup card with photo, price and direction buttons
      const popupHtml = `
        <div style="font-family: inherit; width: 220px; padding: 2px;">
          <div style="height: 100px; width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${v.featuredImage}" alt="${v.name}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div style="font-weight: 800; font-size: 13px; line-height: 1.3; color: #0F172A; margin-bottom: 4px;">
            ${v.name}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
            📍 ${v.district}, ${v.city}
          </div>
          <div style="font-weight: bold; font-size: 13px; color: #2563EB; margin-bottom: 8px;">
            ${v.pricePerHour.toLocaleString()} UZS <span style="font-size: 10px; font-weight: normal; color: #64748B;">/ soat</span>
          </div>
          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <a href="/venues/${v.slug}" style="
              flex: 1;
              text-align: center;
              background-color: #2563EB;
              color: white;
              padding: 5px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
              text-decoration: none;
            ">Batafsil</a>
            <a href="https://maps.google.com/?q=${v.latitude},${v.longitude}" target="_blank" rel="noopener noreferrer" style="
              text-align: center;
              background-color: #F1F5F9;
              color: #0F172A;
              padding: 5px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
              text-decoration: none;
            ">Maps ↗</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        onSelectVenue?.(v);
      });

      markersRef.current.set(v.id, marker);

      if (isSelected) {
        marker.openPopup();
        map.setView([v.latitude, v.longitude], 15, { animate: true });
      }
    });

    return () => {
      // Don't destroy map on every small render
    };
  }, [venues, selectedVenueId, onSelectVenue, center, zoom]);

  return <div ref={mapContainerRef} className={className} />;
}
