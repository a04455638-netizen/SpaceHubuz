"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  className = "h-[320px] w-full rounded-xl overflow-hidden border border-border",
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = [
        latitude || 41.311081,
        longitude || 69.279737,
      ];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Production-compatible CartoDB Voyager tiles (OpenStreetMap data, zero API key)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(map);

      // Custom draggable pin
      const createDraggableIcon = () =>
        L.divIcon({
          className: "spacehub-picker-pin",
          html: `
            <div style="
              transform: translate(-50%, -100%);
              cursor: grab;
              display: inline-flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                background-color: #2563EB;
                color: #FFFFFF;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-weight: 800;
                font-size: 11px;
                padding: 6px 12px;
                border-radius: 9999px;
                box-shadow: 0 6px 16px rgba(0,0,0,0.35);
                border: 2px solid #FFFFFF;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 5px;
              ">
                <span>📍</span>
                <span>Joylashuvni tanlang</span>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid #2563EB;
                margin-top: -1px;
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

      const marker = L.marker(initialCenter, {
        draggable: true,
        icon: createDraggableIcon(),
      }).addTo(map);

      // Click on map to move marker
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onChangeRef.current(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
      });

      // Drag marker to set exact location
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onChangeRef.current(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    const currentMap = mapInstanceRef.current;
    return () => {
      if (currentMap) {
        currentMap.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker position if external coordinates change
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (latitude && longitude) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitude) > 0.0001 ||
        Math.abs(currentPos.lng - longitude) > 0.0001
      ) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom(), {
          animate: true,
        });
      }
    }
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} className={className} />;
}
