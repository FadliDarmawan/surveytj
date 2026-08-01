import { MapPin, Clock } from "lucide-react";
import { C, display, body } from "../theme";
import { Pill, RouteBadge } from "./ui";

export default function JourneyTimeline({ nodes }) {
  const totalTime = nodes.reduce((s, n) => s + (n.legDuration || 0), 0);
  return (
    <div style={{ background: C.navyDeep }} className="rounded-2xl p-5 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <p style={{ ...body, color: "#AEC3D6" }} className="text-xs font-medium uppercase tracking-wide">Ringkasan perjalanan</p>
        <Pill tone="amber"><Clock size={12} /> {totalTime} menit total</Pill>
      </div>
      <div className="flex items-stretch min-w-max pb-1">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center" style={{ width: 108 }}>
              <div
                style={{
                  background: n.kind === "stop" ? "#fff" : "transparent",
                  border: n.kind === "stop" ? `2px solid ${C.amber}` : "none",
                  color: n.kind === "stop" ? C.navy : "#fff",
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                {n.icon ? <n.icon size={16} /> : <MapPin size={16} />}
              </div>
              <p style={{ ...display, color: "#fff" }} className="text-[13px] font-semibold text-center mt-2 leading-tight flex items-center justify-center gap-1">
                {n.routeId ? <RouteBadge id={n.routeId} /> : n.title}
              </p>
              {n.subtitle && <p style={{ ...body, color: "#8FA6BA" }} className="text-[11px] text-center mt-0.5 leading-tight">{n.subtitle}</p>}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center -mt-5" style={{ width: 56 }}>
                <div style={{ background: "#3C5A78" }} className="h-0.5 w-full" />
                {nodes[i + 1].legDuration != null && (
                  <p style={{ ...body, color: "#AEC3D6" }} className="text-[10px] mt-1 whitespace-nowrap">{nodes[i + 1].legDuration} mnt</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

