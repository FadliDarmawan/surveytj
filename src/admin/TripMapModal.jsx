import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { C, display, body } from "../theme";
import { STOPS as SURVEY_STOPS } from "../data/routes";

// Survey answers store the pretty *display* name (e.g. "Ambarukmo (Selatan
// Jalan)"), but the map's internal geometry functions key everything off
// the *raw* stop_name from stops.json (e.g. "Ambarukmo - A"). This table
// already has both (it was extracted from the same stops.json), so we just
// look up the reverse mapping here instead of needing anything new.
function displayToRaw(displayName) {
  const hit = SURVEY_STOPS.find((s) => s.display === displayName);
  return hit ? hit.raw : displayName;
}

export default function TripMapModal({ row, onClose }) {
  const iframeRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ok | empty | error

  const legs = (row.legs || [])
    .filter((l) => l && l.route && l.board && l.alight)
    .map((l) => ({
      routeId: l.route,
      from: displayToRaw(l.board),
      to: displayToRaw(l.alight),
    }));

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function tryRender() {
      const win = iframe.contentWindow;
      if (!win || typeof win.renderReportedTrip !== "function") return false;
      if (!legs.length) { setStatus("empty"); return true; }
      const ok = win.renderReportedTrip(legs);
      setStatus(ok ? "ok" : "error");
      return true;
    }

    function onReady() { tryRender(); }

    function onLoad() {
      const win = iframe.contentWindow;
      if (win.cartographyReady) { tryRender(); return; }
      win.addEventListener("cartography:ready", onReady, { once: true });
      // Safety net in case the ready flag flips just before our listener attaches.
      const poll = setInterval(() => {
        if (tryRender()) clearInterval(poll);
      }, 250);
      setTimeout(() => clearInterval(poll), 15000);
    }

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,32,56,0.55)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.card }}
        className="w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        <div style={{ background: C.navy, ...body }} className="px-4 py-3 flex items-center justify-between text-white flex-none">
          <div>
            <p style={{ ...display }} className="text-sm font-semibold">Visualisasi rute — #{row.id}</p>
            <p className="text-xs opacity-80">
              {row.origin} &rarr; {row.destination} &middot;{" "}
              {legs.length ? legs.map((l) => l.routeId).join(" + ") : "tidak ada leg naik bus"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="relative flex-1">
          {status === "loading" && (
            <div style={{ ...body, color: C.inkMuted }} className="absolute inset-0 flex items-center justify-center text-sm z-10 bg-white/70">
              Memuat peta...
            </div>
          )}
          {status === "empty" && (
            <div style={{ ...body, color: C.inkMuted }} className="absolute inset-0 flex items-center justify-center text-sm z-10 bg-white/90 px-6 text-center">
              Responden ini tidak mencatat leg naik bus (mis. hanya jalan kaki), jadi tidak ada rute untuk digambar.
            </div>
          )}
          {status === "error" && (
            <div style={{ ...body, color: "#D63384" }} className="absolute inset-0 flex items-center justify-center text-sm z-10 bg-white/90 px-6 text-center">
              Gagal menggambar rute — kemungkinan data stops/routes peta belum lengkap untuk halte/rute ini.
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="Peta rute Trans Jogja"
            src="/map/index.html"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
