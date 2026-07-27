"use client"

import * as React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { colord } from 'colord';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const getCountryName = (code: string) => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
};

// Numeric ID map keys provided by world-atlas mapping to ISO alpha-2 codes
const ISO_COUNTRIES: Record<string, string> = {
  "050": "BD", "840": "US", "702": "SG", "356": "IN", "276": "DE",
  "076": "BR", "124": "CA", "250": "FR", "826": "GB", "036": "AU"
};

interface VisitorData {
  name: string;
  visitors: number;
}

interface DensityMapProps {
  data?: VisitorData[];
}

export default function DensityMap({ data = [] }: DensityMapProps) {
  const { dataMap, maxVisitors } = React.useMemo(() => {
    const resMap: Record<string, number> = {};
    let max = 1;

    data.forEach(item => {
      if (item.name) {
        const code = item.name.toUpperCase();
        resMap[code] = item.visitors;
        if (item.visitors > max) max = item.visitors;
      }
    });

    return { dataMap: resMap, maxVisitors: max };
  }, [data]);

  return (
    <Card>
      <CardHeader className="border-b border-black pb-4 font-mono">
        <CardTitle className="text-md font-bold uppercase tracking-tight">Geographic Density</CardTitle>
        <CardDescription className="text-xs">Visitor distribution by tracked origin node</CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 relative select-none">
        <ComposableMap 
          projection="geoEqualEarth" 
          className="w-full h-auto max-h-[380px] outline-none"
        >
          <ZoomableGroup 
            zoom={1} 
            minZoom={0.8} 
            maxZoom={3}
            center={[10, 10]} 
            filterZoomEvent={() => false}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const code = ISO_COUNTRIES[geo.id];
                  const geoName = geo.properties.name;

                  if (geoName?.toLowerCase() === "antarctica" || code === 'AQ') {
                    return null;
                  }

                  const count = code ? (dataMap[code] || 0) : 0;
                  const displayLabel = code ? getCountryName(code) : (geoName || "Unknown");

                  const baseFill = count > 0
                    ? colord("#3b82f6").lighten(0.35 * (1.0 - count / maxVisitors)).toHex()
                    : "#f4f4f5";

                  const hoverFill = count > 0 
                    ? colord(baseFill).darken(0.12).toHex() 
                    : "#e4e4e7";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={baseFill}
                      stroke="#ffffff"
                      strokeWidth={0.6}
                      className="transition-colors duration-150 outline-none cursor-crosshair"
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: hoverFill, outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                      data-tooltip-id="world-map-tooltip"
                      data-tooltip-content={`${displayLabel}|${count.toLocaleString()}`}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        <Tooltip 
          id="world-map-tooltip" 
          float 
          render={({ content }) => {
            if (!content) return null;
            const [label, hits] = (content as any).split('|');
            return (
              <div className="font-mono text-xs p-1">
                <span className="font-bold text-white">{label}</span>
                <span className="text-zinc-400 mx-1.5">•</span>
                <span className="text-primary-400 font-semibold">{hits} hits</span>
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}