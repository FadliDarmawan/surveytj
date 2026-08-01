import { C, display, body } from "../theme";
import { SearchSelect, Field } from "./ui";
import { WILAYAH, WILAYAH_DISPLAY } from "../data/wilayah";

export default function WilayahPicker({ label, value, onChange }) {
  const manual = value && value.manual;

  if (manual) {
    return (
      <div className="space-y-3">
        <Field label={`${label} — kelurahan/desa (luar DIY, isi manual)`}>
          <input
            value={value.kelurahan || ""}
            onChange={e => onChange({ ...value, kelurahan: e.target.value })}
            placeholder="Nama kelurahan/desa"
            style={{ ...body, borderColor: C.border, color: C.ink }}
            className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kecamatan">
            <input
              value={value.kecamatan || ""}
              onChange={e => onChange({ ...value, kecamatan: e.target.value })}
              style={{ ...body, borderColor: C.border, color: C.ink }}
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>
          <Field label="Kabupaten/Kota">
            <input
              value={value.kabupaten || ""}
              onChange={e => onChange({ ...value, kabupaten: e.target.value })}
              style={{ ...body, borderColor: C.border, color: C.ink }}
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none"
            />
          </Field>
        </div>
        <button
          onClick={() => onChange(null)}
          style={{ ...body, color: C.navy }}
          className="text-xs font-medium underline"
        >
          Kembali cari dari daftar wilayah DIY
        </button>
      </div>
    );
  }

  return (
    <div>
      <SearchSelect
        label={`${label} — kelurahan/desa`}
        options={WILAYAH_DISPLAY}
        value={value ? value.display : ""}
        onChange={v => {
          const w = WILAYAH.find(x => x.display === v);
          onChange(w ? { ...w, manual: false } : null);
        }}
        placeholder="Cari kelurahan/desa..."
      />
      <button
        onClick={() => onChange({ kelurahan: "", kecamatan: "", kabupaten: "", manual: true })}
        style={{ ...body, color: C.navy }}
        className="text-xs font-medium underline mt-1.5 inline-block"
      >
        Lokasi di luar DIY? Isi manual
      </button>
      {value && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Field label="Kecamatan (otomatis)">
            <div style={{ borderColor: C.border, color: C.inkMuted, ...body }} className="w-full border rounded-xl px-3.5 py-2.5 text-sm bg-gray-50">
              {value.kecamatan}
            </div>
          </Field>
          <Field label="Kabupaten/Kota (otomatis)">
            <div style={{ borderColor: C.border, color: C.inkMuted, ...body }} className="w-full border rounded-xl px-3.5 py-2.5 text-sm bg-gray-50">
              {value.kabupaten}
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}
