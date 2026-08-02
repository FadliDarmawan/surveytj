-- schema.sql
-- Jalankan sekali di Neon SQL Editor (console.neon.tech -> project -> SQL Editor)
-- sebelum deploy, untuk membuat tabel penyimpanan hasil survei.

CREATE TABLE IF NOT EXISTS survey_responses (
  id                  BIGSERIAL PRIMARY KEY,
  session_id          TEXT NOT NULL,

  -- profil responden
  age_group           TEXT NOT NULL,
  kecamatan           TEXT NOT NULL,
  occupation          TEXT NOT NULL,
  instagram           TEXT,

  -- perjalanan
  origin              TEXT NOT NULL,
  origin_wilayah      JSONB,
  access_mode         TEXT NOT NULL,
  access_duration     INTEGER DEFAULT 0,
  legs                JSONB NOT NULL DEFAULT '[]',
  egress_mode         TEXT NOT NULL,
  egress_duration     INTEGER DEFAULT 0,
  destination         TEXT NOT NULL,
  dest_wilayah        JSONB,
  self_reported_total INTEGER DEFAULT 0,

  -- penilaian & preferensi
  reasons             TEXT[] DEFAULT '{}',
  pain_points         TEXT[] DEFAULT '{}',
  priorities          TEXT[] DEFAULT '{}',
  satisfaction        JSONB NOT NULL DEFAULT '{}',
  would_use_direct    TEXT,
  would_use_feeder    TEXT,
  proposed_route      TEXT,
  other_feedback      TEXT,

  -- metadata
  user_agent          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk dashboard admin nanti (filter per tanggal / kecamatan)
CREATE INDEX IF NOT EXISTS idx_survey_created_at ON survey_responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_kecamatan ON survey_responses (kecamatan);
