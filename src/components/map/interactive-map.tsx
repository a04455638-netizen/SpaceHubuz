"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CuratedVenue } from "@/server/mock-venues";
import { formatPrice } from "@/lib/format-price";

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

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Official OpenStreetMap tile provider - 100% free, zero API key, zero watermarks
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const currentMap = mapInstanceRef.current;

    return () => {
      // Clean up map instance on unmount
      if (currentMap) {
        currentMap.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // 2. Synchronize Markers with Venues and Selected State
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const categoryIcons: Record<string, { bg: string; icon: string }> = {
      coworking: { bg: "#2563EB", icon: "💻" },
      sports: { bg: "#059669", icon: "⚽" },
      meetings: { bg: "#7C3AED", icon: "👥" },
      events: { bg: "#DC2626", icon: "🎉" },
    };

    const createPin = (venue: CuratedVenue, isSelected: boolean) => {
      const cat = categoryIcons[venue.category] || { bg: "#2563EB", icon: "📍" };
      const color = isSelected ? "#0F172A" : cat.bg;
      const border = isSelected ? "3px solid #F59E0B" : "2px solid #FFFFFF";
      const scale = isSelected ? "scale(1.15)" : "scale(1)";
      const zIndex = isSelected ? 1000 : 100;

      return L.divIcon({
        className: "spacehub-leaflet-pin",
        html: `
          <div style="
            transform: translate(-50%, -100%) ${scale};
            transform-origin: bottom center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: ${zIndex};
            cursor: pointer;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="
              background-color: ${color};
              color: #FFFFFF;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-weight: 700;
              font-size: 11px;
              padding: 5px 9px;
              border-radius: 9999px;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
              border: ${border};
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 5px;
            ">
              <span style="font-size: 12px;">${cat.icon}</span>
              <span>${formatPrice(venue.pricePerHour)} UZS</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid ${color};
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -42],
      });
    };

    const bounds = L.latLngBounds([]);
    let hasValidCoords = false;

    venues.forEach((v) => {
      if (!v.latitude || !v.longitude) return;

      const latLng = L.latLng(v.latitude, v.longitude);
      bounds.extend(latLng);
      hasValidCoords = true;

      const isSelected = v.id === selectedVenueId;
      const marker = L.marker(latLng, {
        icon: createPin(v, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      // Popup with photo, rating, price, and maps navigation
      const popupContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 240px;
          padding: 2px;
          color: #0F172A;
        ">
          <div style="
            position: relative;
            height: 110px;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 8px;
            background-color: #E2E8F0;
          ">
            <img
              src="${v.featuredImage}"
              alt="${v.name}"
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              loading="lazy"
            />
          </div>
          <div style="font-weight: 800; font-size: 13px; line-height: 1.3; margin-bottom: 4px; color: #0F172A;">
            ${v.name}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span>${v.district}, ${v.city}</span>
          </div>
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #E2E8F0;
          ">
            <div style="font-weight: 800; font-size: 13px; color: #059669;">
              ${formatPrice(v.pricePerHour)} UZS
              <span style="font-size: 10px; font-weight: normal; color: #64748B;">/ soat</span>
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #D97706;">
              ★ ${v.rating.toFixed(1)}
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <a
              href="/venues/${v.slug}"
              style="
                flex: 1;
                text-align: center;
                background-color: #2563EB;
                color: #FFFFFF;
                padding: 6px 8px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 700;
                text-decoration: none;
                display: block;
              "
            >Batafsil</a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${v.latitude},${v.longitude}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                flex: 1;
                text-align: center;
                background-color: #F1F5F9;
                color: #0F172A;
                padding: 6px 8px;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 600;
                text-decoration: none;
                display: block;
                border: 1px solid #CBD5E1;
              "
              title="Open directions in Google Maps"
            >Yo‘nalish (Directions) ↗</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 260,
        className: "spacehub-popup",
      });

      marker.on("click", () => {
        onSelectVenue?.(v);
      });

      markersRef.current.set(v.id, marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // Auto-fit bounds if we have venues and no specific venue is explicitly selected
    if (hasValidCoords && !selectedVenueId && venues.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [venues, selectedVenueId, onSelectVenue]);

  // 3. Smooth Pan to Selected Venue when selectedVenueId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVenueId) return;

    const marker = markersRef.current.get(selectedVenueId);
    if (marker) {
      const latLng = marker.getLatLng();
      map.setView(latLng, Math.max(map.getZoom(), 14), { animate: true });
      marker.openPopup();
    }
  }, [selectedVenueId]);

  return <div ref={mapContainerRef} className={className} />;
}
