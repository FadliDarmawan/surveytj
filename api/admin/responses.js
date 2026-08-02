// api/admin/responses.js
// GET /api/admin/responses?page=1&pageSize=50
// Mengembalikan daftar mentah hasil survei untuk dashboard admin.
// Dilindungi HTTP Basic Auth (lihat api/_lib/auth.js).

import { neon } from "@neondatabase/serverless";
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

    const page = Math.max(parseInt(req.query.page || "1", 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || "50", 10) || 50, 1), 200);
    const offset = (page - 1) * pageSize;

    const rows = await sql`
      SELECT
        id, session_id, created_at,
        age_group, kecamatan, occupation, instagram,
        origin, origin_wilayah, access_mode, access_duration, legs,
        egress_mode, egress_duration, destination, dest_wilayah, self_reported_total,
        reasons, pain_points, priorities, satisfaction,
        would_use_direct, would_use_feeder, proposed_route, other_feedback
      FROM survey_responses
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const totalRows = await sql`SELECT COUNT(*)::int AS total FROM survey_responses`;

    res.status(200).json({
      rows,
      total: totalRows[0].total,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("Gagal mengambil data admin:", err);
    res.status(500).json({ error: "Gagal mengambil data survei." });
  }
}
