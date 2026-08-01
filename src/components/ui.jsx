import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { C, display, body } from "../theme";
import { TJ_ROUTE_META, routeBadgesFor } from "../data/routes";

export function Pill({ children, tone = "navy" }) {
  const map = {
    navy: { bg: "#EAF0F5", fg: C.navy },
    amber: { bg: "#FBEDD6", fg: C.amberDeep },
    teal: { bg: "#E4EFEC", fg: C.teal },
  };
  const t = map[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, ...body }} className="text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1">
      {children}
    </span>
  );
}

export function RouteBadge({ id }) {
  const color = (TJ_ROUTE_META[id] && TJ_ROUTE_META[id].color) || C.navy;
  return (
    <span
      style={{ background: color, ...display }}
      className="inline-flex items-center justify-center text-[10px] font-bold text-white rounded px-1.5 py-0.5 leading-none shrink-0"
    >
      {id}
    </span>
  );
}

export function SearchSelect({ label, options, value, onChange, allowOther = false, placeholder = "Cari...", showRouteBadges = false, routeMode = false }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [otherMode, setOtherMode] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = options.filter(o => {
    if (routeMode) {
      const title = (TJ_ROUTE_META[o] && TJ_ROUTE_META[o].title) || "";
      return o.toLowerCase().includes(q.toLowerCase()) || title.toLowerCase().includes(q.toLowerCase());
    }
    return o.toLowerCase().includes(q.toLowerCase());
  });

  if (otherMode) {
    return (
      <div>
        {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label} <span style={{ color: "#D63384" }}>*</span></label>}
        <div className="flex gap-2">
          <input
            autoFocus
            value={value || ""}
            onChange={e => onChange(e.target.value)}
            placeholder="Ketik nama sendiri"
            style={{ ...body, borderColor: C.border, color: C.ink }}
            className="flex-1 border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2"
          />
          <button onClick={() => { setOtherMode(false); onChange(""); }} style={{ color: C.inkMuted }} className="px-2" aria-label="Batal isian lainnya">
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label} <span style={{ color: "#D63384" }}>*</span></label>}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ ...body, borderColor: C.border, color: value ? C.ink : C.inkMuted }}
        className="w-full flex items-center justify-between border rounded-xl px-3.5 py-2.5 text-sm bg-white text-left gap-2"
      >
        <span className="flex items-center gap-1.5 flex-wrap min-w-0">
          {routeMode && value && <RouteBadge id={value} />}
          <span className="truncate">
            {value ? (routeMode ? ((TJ_ROUTE_META[value] && TJ_ROUTE_META[value].title) || value) : value) : placeholder}
          </span>
          {showRouteBadges && value && routeBadgesFor(value).map(r => <RouteBadge key={r} id={r} />)}
        </span>
        <ChevronDown size={16} style={{ color: C.inkMuted }} className="shrink-0" />
      </button>
      {open && (
        <div style={{ borderColor: C.border }} className="absolute z-20 mt-1.5 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
          <div style={{ borderColor: C.border }} className="border-b p-2">
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Ketik untuk mencari..."
              style={{ ...body }}
              className="w-full px-2.5 py-1.5 text-sm outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map(o => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false); setQ(""); }}
                style={{ ...body, color: C.ink }}
                className="w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5 flex-wrap min-w-0">
                  {routeMode ? (
                    <>
                      <RouteBadge id={o} />
                      <span className="truncate">{(TJ_ROUTE_META[o] && TJ_ROUTE_META[o].title) || o}</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate">{o}</span>
                      {showRouteBadges && routeBadgesFor(o).map(r => <RouteBadge key={r} id={r} />)}
                    </>
                  )}
                </span>
                {value === o && <Check size={14} style={{ color: C.teal }} className="shrink-0" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ ...body, color: C.inkMuted }} className="px-3.5 py-2.5 text-sm">Tidak ditemukan</p>
            )}
            {allowOther && (
              <button
                onClick={() => { setOtherMode(true); setOpen(false); }}
                style={{ ...body, color: C.navy, borderColor: C.border }}
                className="w-full text-left px-3.5 py-2 text-sm border-t font-medium"
              >
                + Lainnya (isi sendiri)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DurationStepper({ value, onChange, label }) {
  function handleTyped(e) {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    onChange(digits === "" ? 0 : parseInt(digits, 10));
  }
  return (
    <div>
      {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label}</label>}
      <div style={{ borderColor: C.border }} className="flex items-center border rounded-xl overflow-hidden w-fit bg-white">
        <button onClick={() => onChange(Math.max(0, value - 5))} style={{ color: C.navy }} className="px-3 py-2 hover:bg-gray-50" aria-label="Kurangi 5 menit">−</button>
        <div style={{ borderColor: C.border }} className="flex items-baseline gap-1 px-2 border-x min-w-[76px] justify-center">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleTyped}
            onFocus={e => e.target.select()}
            style={{ ...display, color: C.ink }}
            className="text-sm font-semibold text-center outline-none bg-transparent w-9"
            aria-label={label || "Durasi dalam menit"}
          />
          <span style={{ ...body, color: C.inkMuted }} className="text-xs">mnt</span>
        </div>
        <button onClick={() => onChange(value + 5)} style={{ color: C.navy }} className="px-3 py-2 hover:bg-gray-50" aria-label="Tambah 5 menit">+</button>
      </div>
    </div>
  );
}


export function StepHeader({ step, total, label }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p style={{ ...body, color: C.inkMuted }} className="text-xs font-medium">Bagian {step} dari {total}</p>
        <p style={{ ...body, color: C.inkMuted }} className="text-xs">{Math.round((step / total) * 100)}%</p>
      </div>
      <div style={{ background: "#E1E6E2" }} className="h-1.5 rounded-full overflow-hidden">
        <div style={{ background: C.amber, width: `${(step / total) * 100}%` }} className="h-full rounded-full transition-all" />
      </div>
      <h2 style={{ ...display, color: C.ink }} className="text-xl font-semibold mt-4">{label}</h2>
    </div>
  );
}

export function Field({ label, children, required = true }) {
  return (
    <div>
      <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">
        {label}{required && <span style={{ color: "#D63384" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export function MultiChoiceGroup({ options, value, onChange, max = 3 }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const active = value.includes(o);
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              style={{
                ...body,
                background: active ? C.navy : "#fff",
                color: active ? "#fff" : C.ink,
                borderColor: active ? C.navy : C.border,
              }}
              className="border rounded-xl px-3.5 py-2 text-sm font-medium"
            >
              {o}
            </button>
          );
        })}
      </div>
      <p style={{ ...body, color: C.inkMuted }} className="text-xs mt-1.5">Pilih maksimal {max} — {value.length}/{max} terpilih</p>
    </div>
  );
}

export function ChoiceGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            ...body,
            background: value === o ? C.navy : "#fff",
            color: value === o ? "#fff" : C.ink,
            borderColor: value === o ? C.navy : C.border,
          }}
          className="border rounded-xl px-3.5 py-2 text-sm font-medium"
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function SatisfactionRow({ label, value, onChange }) {
  return (
    <div style={{ borderColor: C.border }} className="border rounded-xl p-3.5 bg-white">
      <p style={{ ...body, color: C.ink }} className="text-sm font-medium mb-2.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-label={`Nilai ${n} dari 5`}
            style={{
              ...display,
              background: value === n ? C.amber : "#fff",
              color: value === n ? C.navyDeep : C.inkMuted,
              borderColor: value === n ? C.amber : C.border,
            }}
            className="w-9 h-9 rounded-lg border text-sm font-semibold flex items-center justify-center"
          >
            {n}
          </button>
        ))}
        <div className="flex-1" />
      </div>
      <div className="flex justify-between mt-1.5">
        <p style={{ ...body, color: C.inkMuted }} className="text-[11px]">Sangat tidak puas</p>
        <p style={{ ...body, color: C.inkMuted }} className="text-[11px]">Sangat puas</p>
      </div>
    </div>
  );
}

