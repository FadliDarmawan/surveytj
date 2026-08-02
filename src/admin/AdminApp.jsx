import { useState, useEffect } from "react";
import { Download, ChevronDown, ChevronUp, LogOut, RefreshCw, Lock, MapPin } from "lucide-react";
import { C, display, body } from "../theme";
import TripMapModal from "./TripMapModal";

const PAGE_SIZE = 50;

function authHeader(username, password) {
  return "Basic " + btoa(`${username}:${password}`);
}

function LoginForm({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <form
        onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }}
        style={{ background: C.card, borderColor: C.border }}
        className="w-full max-w-sm border rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <div style={{ background: C.navy }} className="w-9 h-9 rounded-xl flex items-center justify-center">
            <Lock size={16} color="#fff" />
          </div>
          <div>
            <h1 style={{ ...display, color: C.ink }} className="text-lg font-semibold leading-tight">Admin — Survei TfY</h1>
            <p style={{ ...body, color: C.inkMuted }} className="text-xs">Masuk untuk melihat hasil survei</p>
          </div>
        </div>

        <div>
          <label style={{ ...body, color: C.inkMuted }} className="text-xs font-medium block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ ...body, borderColor: C.border, color: C.ink }}
            className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
            autoFocus
          />
        </div>
        <div>
          <label style={{ ...body, color: C.inkMuted }} className="text-xs font-medium block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...body, borderColor: C.border, color: C.ink }}
            className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
          />
        </div>

        {error && <p style={{ ...body, color: "#D63384" }} className="text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading || !username || !password}
          style={{ background: C.amber, color: C.navyDeep, opacity: loading ? 0.7 : 1 }}
          className="w-full py-2.5 rounded-xl font-semibold text-sm"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

function SatisfactionMini({ s }) {
  if (!s) return null;
  const avg = ["waitTime", "fleetCondition", "routeCoverage", "stopComfort", "punctuality"]
    .map((k) => s[k] || 0)
    .filter(Boolean);
  if (!avg.length) return "-";
  return (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(1);
}

function RowDetail({ row }) {
  return (
    <tr style={{ background: "#FAFBFA" }}>
      <td colSpan={11} className="px-4 py-4">
        <div className="grid sm:grid-cols-2 gap-4 text-xs" style={{ ...body, color: C.inkMuted }}>
          <div>
            <p className="font-semibold mb-1" style={{ color: C.ink }}>Perjalanan</p>
            <p>Akses: {row.access_mode} · {row.access_duration} menit</p>
            <p>Egress: {row.egress_mode} · {row.egress_duration} menit</p>
            <p>Total estimasi: {row.self_reported_total} menit</p>
            <p className="mt-1 break-words">Rute/transit: {JSON.stringify(row.legs)}</p>
            <p className="mt-1 break-words">Wilayah asal: {row.origin_wilayah ? JSON.stringify(row.origin_wilayah) : "-"}</p>
            <p className="mt-1 break-words">Wilayah tujuan: {row.dest_wilayah ? JSON.stringify(row.dest_wilayah) : "-"}</p>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: C.ink }}>Penilaian & masukan</p>
            <p>Alasan: {(row.reasons || []).join(", ") || "-"}</p>
            <p>Kendala: {(row.pain_points || []).join(", ") || "-"}</p>
            <p>Prioritas: {(row.priorities || []).join(", ") || "-"}</p>
            <p>Mau pakai (rute langsung): {row.would_use_direct || "-"} · (feeder): {row.would_use_feeder || "-"}</p>
            <p className="mt-1 break-words">Usulan rute: {row.proposed_route || "-"}</p>
            <p className="mt-1 break-words">Masukan lain: {row.other_feedback || "-"}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

function Dashboard({ creds, onLogout }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [mapRow, setMapRow] = useState(null);

  async function loadPage(p) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/responses?page=${p}&pageSize=${PAGE_SIZE}`, {
        headers: { Authorization: authHeader(creds.username, creds.password) },
      });
      if (res.status === 401) throw new Error("Sesi tidak valid, silakan masuk kembali.");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat data.");
      setRows(data.rows);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      setError(err.message);
      if (err.message.includes("Sesi tidak valid")) onLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPage(1); }, []);

  async function handleExport() {
    setExporting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/export", {
        headers: { Authorization: authHeader(creds.username, creds.password) },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal mengekspor data.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hasil-survei-transjogja-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div style={{ background: C.navy, ...body }} className="px-5 sm:px-8 py-4 flex items-center justify-between text-white">
        <div>
          <h1 style={{ ...display }} className="text-lg font-semibold">Admin — Hasil Survei Trans Jogja</h1>
          <p className="text-xs opacity-80">{total} respons tersimpan</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPage(page)}
            className="p-2 rounded-lg hover:bg-white/10 inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Muat ulang
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || total === 0}
            style={{ background: C.amber, color: C.navyDeep, opacity: exporting ? 0.7 : 1 }}
            className="px-3 py-2 rounded-lg inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download size={14} /> {exporting ? "Menyiapkan..." : "Unduh .xlsx"}
          </button>
          <button onClick={onLogout} className="p-2 rounded-lg hover:bg-white/10" title="Keluar">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {error && (
          <div style={{ background: "#FDECEF", color: "#D63384", ...body }} className="rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl overflow-x-auto">
          <table className="w-full text-xs" style={{ ...body }}>
            <thead>
              <tr style={{ borderColor: C.border, color: C.inkMuted }} className="border-b text-left">
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Waktu</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Sesi</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Usia</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Kecamatan</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Pekerjaan</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Asal</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Tujuan</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Total (menit)</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">Rata² Puas</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap">IG</th>
                <th className="px-3 py-2.5 font-semibold whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <>
                  <tr key={r.id} style={{ borderColor: C.border, color: C.ink }} className="border-b last:border-0">
                    <td className="px-3 py-2.5 whitespace-nowrap">{new Date(r.created_at).toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.session_id}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.age_group}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.kecamatan}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.occupation}</td>
                    <td className="px-3 py-2.5 max-w-[160px] truncate">{r.origin}</td>
                    <td className="px-3 py-2.5 max-w-[160px] truncate">{r.destination}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.self_reported_total}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap"><SatisfactionMini s={r.satisfaction} /></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{r.instagram || "-"}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setMapRow(r)}
                          style={{ color: C.teal }}
                          className="inline-flex items-center gap-1 font-medium"
                          title="Buka visualisasi rute di peta"
                        >
                          <MapPin size={12} /> Peta
                        </button>
                        <button
                          onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                          style={{ color: C.navy }}
                          className="inline-flex items-center gap-1 font-medium"
                        >
                          Detail {expanded === r.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === r.id && <RowDetail key={`${r.id}-detail`} row={r} />}
                </>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={11} className="px-3 py-8 text-center" style={{ color: C.inkMuted }}>Belum ada respons masuk.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4 text-xs" style={{ ...body, color: C.inkMuted }}>
            <button
              onClick={() => loadPage(page - 1)}
              disabled={page <= 1 || loading}
              style={{ borderColor: C.border }}
              className="border px-3 py-1.5 rounded-lg disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span>Halaman {page} dari {totalPages}</span>
            <button
              onClick={() => loadPage(page + 1)}
              disabled={page >= totalPages || loading}
              style={{ borderColor: C.border }}
              className="border px-3 py-1.5 rounded-lg disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>

      {mapRow && <TripMapModal row={mapRow} onClose={() => setMapRow(null)} />}
    </div>
  );
}

export default function AdminApp() {
  const [creds, setCreds] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleLogin(username, password) {
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/responses?page=1&pageSize=1", {
        headers: { Authorization: authHeader(username, password) },
      });
      if (res.status === 401) throw new Error("Username atau password salah.");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");
      setCreds({ username, password });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  }

  if (!creds) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />;
  }

  return <Dashboard creds={creds} onLogout={() => setCreds(null)} />;
}
