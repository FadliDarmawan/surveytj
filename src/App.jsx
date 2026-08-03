import { useState, useEffect, useRef } from "react";
import {
  MapPin, Bus, Footprints, ArrowRight, Plus, X,
  Check, Instagram, RefreshCw, ChevronLeft, ShieldCheck, Info, Mail
} from "lucide-react";
import { C, display, body } from "./theme";
import {
  Pill, RouteBadge, SearchSelect, DurationStepper,
  StepHeader, Field, MultiChoiceGroup, ChoiceGroup, SatisfactionRow
} from "./components/ui";
import JourneyTimeline from "./components/JourneyTimeline";
import WilayahPicker from "./components/WilayahPicker";
import TfYLogo from "./components/TfYLogo";
import InfoModal from "./components/InfoModal";
import { HALTE, RUTE, TJ_ROUTE_META, availableRoutesForStop, stopsForRoute } from "./data/routes";
import { MODE_ICON } from "./utils/modeIcon";
import { KECAMATAN } from "./data/wilayah";

export default function SurveiTransJogja() {
  const [modal, setModal] = useState(null); // 'about' | 'privacy' | 'contact'
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const sessionId = useRef("TJ-" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ block: "start" });
    window.scrollTo({ top: 0 });
  }, [step]);

  // profil
  const [ageGroup, setAgeGroup] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [occupation, setOccupation] = useState("");
  const [instagram, setInstagram] = useState("");

  // perjalanan
  const [origin, setOrigin] = useState("");
  const [originWilayah, setOriginWilayah] = useState(null);
  const [accessMode, setAccessMode] = useState("");
  const [accessDuration, setAccessDuration] = useState(0);
  const [legs, setLegs] = useState([
    { route: "", board: "", alight: "", wait: 0, ride: 0, sameStop: null, transferMode: "", transferDuration: 0 },
  ]);
  const [egressMode, setEgressMode] = useState("");
  const [egressDuration, setEgressDuration] = useState(0);
  const [destination, setDestination] = useState("");
  const [destWilayah, setDestWilayah] = useState(null);
  const [selfReportedTotal, setSelfReportedTotal] = useState(0);

  // penilaian & preferensi
  const [reasons, setReasons] = useState([]);
  const [painPoints, setPainPoints] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [satisfaction, setSatisfaction] = useState({
    waitTime: 0, fleetCondition: 0, routeCoverage: 0, stopComfort: 0, punctuality: 0,
  });
  const [wouldUseDirect, setWouldUseDirect] = useState("");
  const [wouldUseFeeder, setWouldUseFeeder] = useState("");
  const [proposedRoute, setProposedRoute] = useState("");
  const [otherFeedback, setOtherFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit() {
    if (!isAssessmentValid || submitting) return;
    setSubmitting(true);
    setSubmitError("");

    const payload = {
      sessionId: sessionId.current,
      ageGroup, kecamatan, occupation, instagram,
      origin, originWilayah, accessMode, accessDuration, legs,
      egressMode, egressDuration, destination, destWilayah, selfReportedTotal,
      reasons, painPoints, priorities, satisfaction,
      wouldUseDirect, wouldUseFeeder, proposedRoute, otherFeedback,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengirim survei.");

      setSubmitted(true);
      setStep(4);
    } catch (err) {
      setSubmitError(err.message || "Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMulti(list, setList, item, max = 3) {
    if (list.includes(item)) { setList(list.filter(x => x !== item)); return; }
    if (list.length >= max) return;
    setList([...list, item]);
  }

  function addLeg() {
    if (legs.length >= 5) return;
    setLegs([...legs, { route: "", board: "", alight: "", wait: 0, ride: 0, sameStop: null, transferMode: "", transferDuration: 0 }]);
  }
  function updateLeg(i, patch) {
    setLegs(ls => ls.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  }
  function removeLeg(i) {
    setLegs(ls => ls.filter((_, idx) => idx !== i));
  }

  // build timeline nodes
  const nodes = [];
  nodes.push({ kind: "point", title: origin, icon: MapPin });
  nodes.push({ kind: "point", title: accessMode, icon: MODE_ICON[accessMode] || Footprints, legDuration: accessDuration });
  legs.forEach((leg, i) => {
    const sameStop = i > 0 && leg.sameStop;
    const pindah = i > 0 && leg.sameStop === false;

    if (pindah) {
      nodes.push({ kind: "point", title: leg.transferMode || "Jalan kaki", subtitle: "pindah halte", icon: MODE_ICON[leg.transferMode] || Footprints, legDuration: leg.transferDuration || 0 });
      nodes.push({ kind: "stop", title: leg.board || "Halte naik" });
    } else if (i === 0) {
      nodes.push({ kind: "stop", title: leg.board || "Halte naik" });
    }
    // kalau sameStop: tidak perlu node baru, pakai node "halte turun" dari leg sebelumnya

    nodes.push({ kind: "point", title: null, routeId: leg.route, subtitle: "naik bus", icon: Bus, legDuration: leg.wait });
    nodes.push({ kind: "stop", title: leg.alight || "Halte turun", legDuration: leg.ride });
  });
  nodes.push({ kind: "point", title: egressMode, icon: MODE_ICON[egressMode] || Footprints, legDuration: egressDuration });
  nodes.push({ kind: "point", title: destination, icon: MapPin });
  const totalComputed = nodes.reduce((s, n) => s + (n.legDuration || 0), 0);

  // ---- validasi wajib isi per bagian --------------------------------
  function isWilayahFilled(w) {
    if (!w) return false;
    if (w.manual) return !!(w.kelurahan && w.kecamatan && w.kabupaten);
    return !!(w.kelurahan && w.kecamatan && w.kabupaten);
  }

  function isLegValid(leg, i) {
    const needsBoardPick = i === 0 || leg.sameStop === false;
    if (i > 0 && leg.sameStop === null) return false;
    if (needsBoardPick && !leg.board) return false;
    if (!leg.route) return false;
    if (!leg.alight) return false;
    if (i > 0 && leg.sameStop === false && !leg.transferMode) return false;
    return true;
  }

  const isProfileValid = ageGroup !== "" && occupation !== "" && kecamatan !== "";

  const isJourneyValid =
    origin.trim() !== "" &&
    accessMode !== "" &&
    isWilayahFilled(originWilayah) &&
    legs.every(isLegValid) &&
    egressMode !== "" &&
    destination.trim() !== "" &&
    isWilayahFilled(destWilayah);

  const isAssessmentValid =
    reasons.length > 0 &&
    painPoints.length > 0 &&
    Object.values(satisfaction).every(v => v > 0) &&
    wouldUseDirect !== "" &&
    wouldUseFeeder !== "" &&
    priorities.length > 0 &&
    proposedRoute.trim() !== "" &&
    otherFeedback.trim() !== "";

  const stepLabels = ["Selamat datang", "Profil singkat", "Perjalanan Anda", "Masukan & selesai"];

  return (
    <div ref={topRef} style={{ background: C.bg, minHeight: "100vh", ...body }} className="w-full overflow-hidden">
      {/* top bar */}
      <div style={{ background: C.navy }} className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TfYLogo color="#fff" className="h-5 w-auto shrink-0" />
          <div style={{ background: "rgba(255,255,255,0.2)" }} className="w-px h-6 shrink-0" />
          <div>
            <p style={{ ...display, color: "#fff" }} className="text-sm font-semibold leading-none">Survei Rute Trans Jogja</p>
            <p style={{ color: "#9FB4C6" }} className="text-[11px] mt-1">oleh Transport for Yogyakarta</p>
          </div>
        </div>
        <Pill tone="amber"><RefreshCw size={11} /> {sessionId.current}</Pill>
      </div>

      <div className="px-5 sm:px-8 py-6 sm:py-8">
        {step === 0 && (
          <div className="max-w-lg mx-auto text-center py-8">
            <div style={{ background: "#EAF0F5" }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Bus size={28} color={C.navy} />
            </div>
            <h1 style={{ ...display, color: C.ink }} className="text-2xl sm:text-3xl font-semibold mb-3">
              Ceritakan Perjalanan Trans Jogja Anda
            </h1>
            <p style={{ color: C.inkMuted }} className="text-sm leading-relaxed mb-6">
              Jawaban Anda akan membantu tim dalam merancang rute dan halte yang lebih sesuai dengan kebutuhan masyarakat.
              Nama asli tidak diperlukan. Pengisian membutuhkan waktu sekitar 5–8 menit dan dapat dilanjutkan kapan saja.
            </p>
            <div style={{ borderColor: C.border }} className="border rounded-xl p-4 mb-6 bg-white text-left">
              <Field label="Nama pengguna Instagram (opsional, untuk keperluan undian hadiah)" required={false}>
                <div className="relative">
                  <Instagram size={16} style={{ color: C.inkMuted }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="@username"
                    style={{ borderColor: C.border, color: C.ink }}
                    className="w-full border rounded-xl pl-9 pr-3.5 py-2.5 text-sm outline-none"
                  />
                </div>
              </Field>
            </div>
            <button
              onClick={() => setStep(1)}
              style={{ background: C.amber, color: C.navyDeep }}
              className="px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:brightness-95"
            >
              Mulai Survei <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-lg mx-auto">
            <StepHeader step={1} total={totalSteps} label="Profil Responden" />
            <div className="space-y-5">
              <Field label="Kelompok usia">
                <ChoiceGroup options={["<17", "17–24", "25–34", "35–44", "45–54", "≥55"]} value={ageGroup} onChange={setAgeGroup} />
              </Field>
              <Field label="Pekerjaan">
                <ChoiceGroup options={["Pelajar", "Mahasiswa", "ASN", "Pegawai swasta", "Wirausaha", "Lainnya"]} value={occupation} onChange={setOccupation} />
              </Field>
              <SearchSelect label="Kecamatan tempat tinggal" options={KECAMATAN} value={kecamatan} onChange={setKecamatan} allowOther placeholder="Cari kecamatan..." />
            </div>
            <div className="flex flex-col items-end mt-8 gap-2">
              <button
                onClick={() => isProfileValid && setStep(2)}
                disabled={!isProfileValid}
                style={{ background: isProfileValid ? C.navy : "#C7CDD1", color: "#fff", cursor: isProfileValid ? "pointer" : "not-allowed" }}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
              >
                Lanjut <ArrowRight size={15} />
              </button>
              {!isProfileValid && (
                <p style={{ ...body, color: "#D63384" }} className="text-xs">Lengkapi semua pertanyaan bertanda * sebelum lanjut.</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <StepHeader step={2} total={totalSteps} label="Perjalanan Terakhir Anda" />
            <p style={{ color: C.inkMuted }} className="text-sm -mt-3 mb-5">Lengkapi tahap demi tahap; visualisasi berikut akan terbentuk secara otomatis.</p>

            <JourneyTimeline nodes={nodes} />

            <div className="mt-6 space-y-5">
              {/* origin & access */}
              <div style={{ borderColor: C.border }} className="border rounded-2xl p-4 bg-white">
                <p style={{ ...display, color: C.ink }} className="text-sm font-semibold mb-3">Titik Awal</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Berangkat dari (nama lokasi, mis. Rumah, Kos)">
                    <input value={origin} onChange={e => setOrigin(e.target.value)} style={{ borderColor: C.border, color: C.ink }} className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none" />
                  </Field>
                  <Field label="Moda transportasi menuju halte pertama">
                    <ChoiceGroup options={["Jalan kaki", "Motor", "Ojek online", "Diantar", "Sepeda"]} value={accessMode} onChange={setAccessMode} />
                  </Field>
                </div>
                <div className="mt-4">
                  <WilayahPicker label="Wilayah asal" value={originWilayah} onChange={setOriginWilayah} />
                </div>
                <div className="mt-4">
                  <DurationStepper label="Durasi perjalanan" value={accessDuration} onChange={setAccessDuration} />
                </div>
              </div>

              {/* legs */}
              {legs.map((leg, i) => {
                const prevAlightName = i > 0 ? (legs[i - 1].alight || "halte sebelumnya") : null;
                return (
                  <div key={i} style={{ borderColor: C.border }} className="border rounded-2xl p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <p style={{ ...display, color: C.ink }} className="text-sm font-semibold">
                        {i === 0 ? "Bus Pertama" : `Transit ke-${i} — Bus Berikutnya`}
                      </p>
                      {i > 0 && (
                        <button onClick={() => removeLeg(i)} style={{ color: C.inkMuted }} aria-label="Hapus leg ini">
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {i > 0 && (
                      <div className="mb-4">
                        <Field label={`Apakah Anda naik bus berikutnya dari halte ${prevAlightName}, atau berpindah ke halte lain?`}>
                          <ChoiceGroup
                            options={["Halte yang sama", "Pindah ke halte lain"]}
                            value={leg.sameStop === null ? "" : (leg.sameStop ? "Halte yang sama" : "Pindah ke halte lain")}
                            onChange={v => {
                              const sameStop = v === "Halte yang sama";
                              const board = sameStop ? legs[i - 1].alight : "";
                              const rts = sameStop ? availableRoutesForStop(board) : [];
                              updateLeg(i, { sameStop, board, route: rts.length === 1 ? rts[0] : "" });
                            }}
                          />
                        </Field>
                      </div>
                    )}

                    {i > 0 && leg.sameStop === true && (
                      <div className="mb-4">
                        <Pill tone="teal"><Check size={12} /> Naik dari halte {prevAlightName}</Pill>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-4">
                      {(i === 0 || leg.sameStop === false) && (
                        <SearchSelect
                          label="Halte naik"
                          options={HALTE}
                          value={leg.board}
                          onChange={v => {
                            const rts = availableRoutesForStop(v);
                            updateLeg(i, { board: v, route: rts.length === 1 ? rts[0] : "", alight: "" });
                          }}
                          placeholder="Cari halte..."
                          showRouteBadges
                        />
                      )}

                      {(() => {
                        const routeOptions = leg.board ? availableRoutesForStop(leg.board) : RUTE;
                        if (leg.board && routeOptions.length === 1) {
                          return (
                            <div>
                              <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">Rute bus</label>
                              <div style={{ borderColor: C.border }} className="w-full border rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 flex items-center gap-2">
                                <RouteBadge id={routeOptions[0]} />
                                <span style={{ color: C.ink }}>{(TJ_ROUTE_META[routeOptions[0]] && TJ_ROUTE_META[routeOptions[0]].title) || routeOptions[0]}</span>
                              </div>
                              <p style={{ ...body, color: C.inkMuted }} className="text-xs mt-1.5">Otomatis terpilih — hanya 1 rute yang melewati halte ini</p>
                            </div>
                          );
                        }
                        return (
                          <SearchSelect
                            label="Rute bus"
                            options={routeOptions.length ? routeOptions : RUTE}
                            value={leg.route}
                            onChange={v => {
                              const validAlight = leg.alight && stopsForRoute(v).includes(leg.alight) ? leg.alight : "";
                              updateLeg(i, { route: v, alight: validAlight });
                            }}
                            placeholder={leg.board ? "Pilih rute yang lewat halte ini..." : "Pilih halte naik dahulu..."}
                            routeMode
                          />
                        );
                      })()}

                      <SearchSelect
                        label={i === legs.length - 1 ? "Halte turun" : "Halte turun (kalau transit lagi)"}
                        options={leg.route ? stopsForRoute(leg.route) : HALTE}
                        value={leg.alight}
                        onChange={v => updateLeg(i, { alight: v })}
                        placeholder={leg.route ? "Cari halte di rute ini..." : "Pilih rute dahulu..."}
                        showRouteBadges
                      />
                    </div>

                    {i > 0 && leg.sameStop === false && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4" style={{ borderTop: `1px dashed ${C.border}` }}>
                        <Field label="Bagaimana Anda berpindah ke halte berikutnya?">
                          <ChoiceGroup options={["Jalan kaki", "Ojek online", "Motor", "Sepeda"]} value={leg.transferMode} onChange={v => updateLeg(i, { transferMode: v })} />
                        </Field>
                        <DurationStepper label="Durasi perpindahan" value={leg.transferDuration || 5} onChange={v => updateLeg(i, { transferDuration: v })} />
                      </div>
                    )}

                    <div className="mt-4">
                      <DurationStepper label="Durasi perjalanan menggunakan bus ini (dari naik hingga turun)" value={leg.ride} onChange={v => updateLeg(i, { ride: v })} />
                    </div>

                    <div className="mt-4">
                      <DurationStepper label="Durasi menunggu bus ini" value={leg.wait} onChange={v => updateLeg(i, { wait: v })} />
                    </div>
                  </div>
                );
              })}

              {legs.length < 5 && (
                <button onClick={addLeg} style={{ borderColor: C.navy, color: C.navy }} className="w-full border border-dashed rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 bg-white">
                  <Plus size={16} /> Tambah transit
                </button>
              )}

              {/* egress & destination */}
              <div style={{ borderColor: C.border }} className="border rounded-2xl p-4 bg-white">
                <p style={{ ...display, color: C.ink }} className="text-sm font-semibold mb-3">Tujuan Akhir</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Moda transportasi dari halte turun menuju tujuan akhir">
                    <ChoiceGroup options={["Jalan kaki", "Ojek online", "Motor", "Dijemput"]} value={egressMode} onChange={setEgressMode} />
                  </Field>
                  <Field label="Nama lokasi tujuan akhir">
                    <input value={destination} onChange={e => setDestination(e.target.value)} style={{ borderColor: C.border, color: C.ink }} className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none" />
                  </Field>
                </div>
                <div className="mt-4">
                  <WilayahPicker label="Wilayah tujuan" value={destWilayah} onChange={setDestWilayah} />
                </div>
                <div className="mt-4">
                  <DurationStepper label="Durasi perjalanan" value={egressDuration} onChange={setEgressDuration} />
                </div>
              </div>
              <div style={{ borderColor: C.border }} className="border rounded-2xl p-4 bg-white">
                <p style={{ ...display, color: C.ink }} className="text-sm font-semibold mb-1">Verifikasi Total Waktu Perjalanan</p>
                <p style={{ ...body, color: C.inkMuted }} className="text-xs mb-3">
                  Berdasarkan isian Anda, total perjalanan terhitung secara otomatis selama <b style={{ color: C.ink }}>{totalComputed} menit</b>. Menurut Anda, kira-kira berapa lama total perjalanan tersebut secara keseluruhan (dari keberangkatan hingga tiba di tujuan)?
                </p>
                <DurationStepper value={selfReportedTotal} onChange={setSelfReportedTotal} />
              </div>
            </div>

            <div className="flex justify-between items-start mt-8">
              <button onClick={() => setStep(1)} style={{ color: C.inkMuted }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <ChevronLeft size={15} /> Kembali
              </button>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => isJourneyValid && setStep(3)}
                  disabled={!isJourneyValid}
                  style={{ background: isJourneyValid ? C.navy : "#C7CDD1", color: "#fff", cursor: isJourneyValid ? "pointer" : "not-allowed" }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
                >
                  Lanjut <ArrowRight size={15} />
                </button>
                {!isJourneyValid && (
                  <p style={{ ...body, color: "#D63384" }} className="text-xs text-right max-w-[220px]">Lengkapi semua halte, rute, dan wilayah bertanda * sebelum lanjut.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-lg mx-auto">
            <StepHeader step={3} total={totalSteps} label="Penilaian & Masukan" />
            <div className="space-y-6">
              <Field label="Alasan utama Anda memilih Trans Jogja">
                <MultiChoiceGroup
                  options={["Murah", "Nyaman", "Tidak memiliki kendaraan pribadi", "Menghindari kemacetan", "Ramah lingkungan", "Aman", "Biaya parkir mahal", "Lainnya"]}
                  value={reasons}
                  onChange={v => toggleMulti(reasons, setReasons, v)}
                />
              </Field>

              <Field label="Kendala terbesar yang Anda rasakan">
                <MultiChoiceGroup
                  options={["Waktu tunggu terlalu lama", "Lokasi halte jauh", "Harus melakukan transit", "Kondisi bus terlalu penuh", "Informasi kurang jelas", "Tidak tersedia rute langsung", "Jadwal kurang pasti", "Lainnya"]}
                  value={painPoints}
                  onChange={v => toggleMulti(painPoints, setPainPoints, v)}
                />
              </Field>

              <div>
                <p style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1">Tingkat kepuasan Anda</p>
                <p style={{ ...body, color: C.inkMuted }} className="text-xs mb-3">Berikan penilaian pada skala 1 (sangat tidak puas) sampai 5 (sangat puas) untuk setiap aspek berikut.</p>
                <div className="space-y-3">
                  <SatisfactionRow label="Waktu tunggu bus" value={satisfaction.waitTime} onChange={v => setSatisfaction(s => ({ ...s, waitTime: v }))} />
                  <SatisfactionRow label="Kondisi armada (kebersihan dan kelayakan bus)" value={satisfaction.fleetCondition} onChange={v => setSatisfaction(s => ({ ...s, fleetCondition: v }))} />
                  <SatisfactionRow label="Cakupan dan ketersediaan rute" value={satisfaction.routeCoverage} onChange={v => setSatisfaction(s => ({ ...s, routeCoverage: v }))} />
                  <SatisfactionRow label="Kenyamanan halte" value={satisfaction.stopComfort} onChange={v => setSatisfaction(s => ({ ...s, stopComfort: v }))} />
                  <SatisfactionRow label="Ketepatan jadwal keberangkatan" value={satisfaction.punctuality} onChange={v => setSatisfaction(s => ({ ...s, punctuality: v }))} />
                </div>
              </div>

              <Field label="Apabila tersedia rute langsung menuju tujuan Anda, apakah Anda akan lebih sering menggunakan Trans Jogja?">
                <ChoiceGroup options={["Ya", "Mungkin", "Tidak"]} value={wouldUseDirect} onChange={setWouldUseDirect} />
              </Field>

              <Field label="Apabila tersedia layanan feeder menuju halte, apakah Anda akan lebih sering menggunakan Trans Jogja?">
                <ChoiceGroup options={["Ya", "Mungkin", "Tidak"]} value={wouldUseFeeder} onChange={setWouldUseFeeder} />
              </Field>

              <Field label="Prioritas utama yang perlu ditingkatkan">
                <MultiChoiceGroup
                  options={["Menambah armada", "Mempercepat headway", "Menambah halte", "Menambah rute baru", "Layanan feeder", "Memperbaiki informasi perjalanan", "Meningkatkan kenyamanan halte", "Mempermudah proses transit"]}
                  value={priorities}
                  onChange={v => toggleMulti(priorities, setPriorities, v)}
                />
              </Field>

              <Field label="Apabila Anda dapat mengusulkan satu rute baru, apa yang paling Anda inginkan?">
                <textarea
                  value={proposedRoute}
                  onChange={e => setProposedRoute(e.target.value)}
                  placeholder="Contoh: rute langsung dari Jalan Kaliurang menuju Malioboro tanpa transit"
                  rows={3}
                  style={{ ...body, borderColor: C.border, color: C.ink }}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
                />
              </Field>

              <Field label="Saran atau masukan lainnya">
                <textarea
                  value={otherFeedback}
                  onChange={e => setOtherFeedback(e.target.value)}
                  rows={2}
                  style={{ ...body, borderColor: C.border, color: C.ink }}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
                />
              </Field>
            </div>

            <div className="flex justify-between items-start mt-8">
              <button onClick={() => setStep(2)} style={{ color: C.inkMuted }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <ChevronLeft size={15} /> Kembali
              </button>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={!isAssessmentValid || submitting}
                  style={{ background: isAssessmentValid ? C.amber : "#C7CDD1", color: isAssessmentValid ? C.navyDeep : "#fff", cursor: isAssessmentValid && !submitting ? "pointer" : "not-allowed", opacity: submitting ? 0.7 : 1 }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
                >
                  {submitting ? "Mengirim..." : "Kirim Survei"} {!submitting && <ArrowRight size={15} />}
                </button>
                {!isAssessmentValid && (
                  <p style={{ ...body, color: "#D63384" }} className="text-xs text-right max-w-[220px]">Lengkapi semua pertanyaan bertanda * sebelum mengirim.</p>
                )}
                {submitError && (
                  <p style={{ ...body, color: "#D63384" }} className="text-xs text-right max-w-[240px]">{submitError}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-lg mx-auto text-center py-8">
            <div style={{ background: "#E4EFEC" }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Check size={28} color={C.teal} />
            </div>
            <h2 style={{ ...display, color: C.ink }} className="text-2xl font-semibold mb-3">
              {submitted ? "Terima Kasih atas Partisipasi Anda" : "Hampir Selesai"}
            </h2>
            <p style={{ color: C.inkMuted }} className="text-sm leading-relaxed mb-6">
              Jawaban Anda telah tersimpan pada sesi <b style={{ color: C.ink }}>{sessionId.current}</b>.
              {instagram && " Apabila terdapat undian hadiah, kami akan menghubungi Anda melalui nama pengguna Instagram yang telah diberikan."}
            </p>
            <button onClick={() => setStep(3)} style={{ color: C.navy, borderColor: C.border }} className="border px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 bg-white">
              <ChevronLeft size={15} /> Tinjau ulang jawaban
            </button>
          </div>
        )}
      </div>

      {/* footer menu — selalu tampil di semua langkah */}
      <div style={{ borderColor: C.border, ...body }} className="border-t px-5 sm:px-8 py-4 flex flex-col items-center gap-2 text-xs">
        <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap">
          <button onClick={() => setModal("about")} style={{ color: C.inkMuted }} className="inline-flex items-center gap-1.5 hover:underline">
            <Info size={12} /> Tentang
          </button>
          <span style={{ color: C.border }}>·</span>
          <button onClick={() => setModal("privacy")} style={{ color: C.inkMuted }} className="inline-flex items-center gap-1.5 hover:underline">
            <ShieldCheck size={12} /> Kebijakan Privasi
          </button>
          <span style={{ color: C.border }}>·</span>
          <button onClick={() => setModal("contact")} style={{ color: C.inkMuted }} className="inline-flex items-center gap-1.5 hover:underline">
            <Mail size={12} /> Hubungi Kami
          </button>
        </div>
        <p style={{ color: C.inkMuted }} className="text-[11px]">
          Situs ini dikembangkan oleh Fadli Darmawan untuk kepentingan Transport for Yogyakarta. All rights reserved.
        </p>
      </div>

      <InfoModal topic={modal} onClose={() => setModal(null)} />
    </div>
  );
}
