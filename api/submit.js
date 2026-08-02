// api/submit.js
// Vercel serverless function — menerima POST dari form survei dan menyimpan
// hasilnya ke Neon Postgres lewat @neondatabase/serverless.
//
// Env var yang wajib di-set di Vercel (Project Settings -> Environment Variables):
//   DATABASE_URL = connection string Neon (pakai yang "pooled connection")

import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL belum di-set di environment variables.");
    res.status(500).json({ error: "Konfigurasi server belum lengkap." });
    return;
  }

  const b = req.body || {};

  // Validasi minimal di server (jangan percaya penuh ke client)
  const requiredFields = [
    "sessionId", "ageGroup", "kecamatan", "occupation",
    "origin", "accessMode", "egressMode", "destination",
  ];
  for (const f of requiredFields) {
    if (!b[f] || (typeof b[f] === "string" && b[f].trim() === "")) {
      res.status(400).json({ error: `Field wajib "${f}" belum diisi.` });
      return;
    }
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`
      INSERT INTO survey_responses (
        session_id, age_group, kecamatan, occupation, instagram,
        origin, origin_wilayah, access_mode, access_duration, legs,
        egress_mode, egress_duration, destination, dest_wilayah, self_reported_total,
        reasons, pain_points, priorities, satisfaction,
        would_use_direct, would_use_feeder, proposed_route, other_feedback,
        user_agent
      ) VALUES (
        ${b.sessionId}, ${b.ageGroup}, ${b.kecamatan}, ${b.occupation}, ${b.instagram || null},
        ${b.origin}, ${b.originWilayah ? JSON.stringify(b.originWilayah) : null},
        ${b.accessMode}, ${b.accessDuration ?? 0}, ${JSON.stringify(b.legs || [])},
        ${b.egressMode}, ${b.egressDuration ?? 0}, ${b.destination},
        ${b.destWilayah ? JSON.stringify(b.destWilayah) : null}, ${b.selfReportedTotal ?? 0},
        ${b.reasons || []}, ${b.painPoints || []}, ${b.priorities || []},
        ${JSON.stringify(b.satisfaction || {})},
        ${b.wouldUseDirect || null}, ${b.wouldUseFeeder || null},
        ${b.proposedRoute || null}, ${b.otherFeedback || null},
        ${req.headers["user-agent"] || null}
      )
      RETURNING id, created_at
    `;

    res.status(200).json({ ok: true, id: rows[0].id, createdAt: rows[0].created_at });
  } catch (err) {
    console.error("Gagal menyimpan survei:", err);
    res.status(500).json({ error: "Gagal menyimpan data survei. Silakan coba lagi." });
  }
}
