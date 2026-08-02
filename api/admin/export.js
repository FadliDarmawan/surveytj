// api/admin/export.js
// GET /api/admin/export -> mengunduh seluruh hasil survei sebagai file .xlsx
// Dilindungi HTTP Basic Auth (lihat api/_lib/auth.js).

import { neon } from "@neondatabase/serverless";
import * as XLSX from "xlsx";
import { requireAdminAuth } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdminAuth(req, res)) return;

  if (!process.env.DATABASE_URL) {
    res.status(500).json({ error: "DATABASE_URL belum di-set." });
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT * FROM survey_responses ORDER BY created_at DESC`;

    const flat = rows.map((r) => ({
      ID: r.id,
      Waktu: new Date(r.created_at).toLocaleString("id-ID"),
      Sesi: r.session_id,
      "Kelompok Usia": r.age_group,
      Kecamatan: r.kecamatan,
      Pekerjaan: r.occupation,
      Instagram: r.instagram || "",
      Asal: r.origin,
      "Wilayah Asal": r.origin_wilayah ? JSON.stringify(r.origin_wilayah) : "",
      "Moda Akses": r.access_mode,
      "Durasi Akses (menit)": r.access_duration,
      "Detail Rute/Transit": JSON.stringify(r.legs || []),
      "Moda Egress": r.egress_mode,
      "Durasi Egress (menit)": r.egress_duration,
      Tujuan: r.destination,
      "Wilayah Tujuan": r.dest_wilayah ? JSON.stringify(r.dest_wilayah) : "",
      "Total Estimasi Waktu (menit)": r.self_reported_total,
      "Alasan Memilih TfY": (r.reasons || []).join("; "),
      Kendala: (r.pain_points || []).join("; "),
      "Prioritas Perbaikan": (r.priorities || []).join("; "),
      "Puas - Waktu Tunggu": r.satisfaction?.waitTime ?? "",
      "Puas - Kondisi Armada": r.satisfaction?.fleetCondition ?? "",
      "Puas - Cakupan Rute": r.satisfaction?.routeCoverage ?? "",
      "Puas - Kenyamanan Halte": r.satisfaction?.stopComfort ?? "",
      "Puas - Ketepatan Jadwal": r.satisfaction?.punctuality ?? "",
      "Mau Pakai Bila Ada Rute Langsung": r.would_use_direct || "",
      "Mau Pakai Bila Ada Feeder": r.would_use_feeder || "",
      "Usulan Rute Baru": r.proposed_route || "",
      "Masukan Lain": r.other_feedback || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(flat);
    // lebar kolom biar enak dibaca
    worksheet["!cols"] = Object.keys(flat[0] || {}).map((key) => ({
      wch: Math.min(Math.max(key.length, 14), 40),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Survei");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `hasil-survei-transjogja-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(buffer);
  } catch (err) {
    console.error("Gagal membuat file export:", err);
    res.status(500).json({ error: "Gagal membuat file export." });
  }
}
