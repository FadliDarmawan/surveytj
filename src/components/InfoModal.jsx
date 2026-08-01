import { X, Instagram, Twitter } from "lucide-react";
import { C, display, body } from "../theme";

export default function InfoModal({ topic, onClose }) {
  if (!topic) return null;

  const titles = { about: "Tentang Survei Ini", privacy: "Kebijakan Privasi", contact: "Hubungi Kami" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(13,32,56,0.6)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ ...body }}
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...display, color: C.ink }} className="text-lg font-semibold">{titles[topic]}</h3>
          <button onClick={onClose} style={{ color: C.inkMuted }} aria-label="Tutup"><X size={20} /></button>
        </div>

        {topic === "about" && (
          <div style={{ color: C.ink }} className="text-sm leading-relaxed space-y-3">
            <p>
              <em style={{ color: C.inkMuted }}>[Placeholder — ganti dengan deskripsi resmi]</em> Survei ini
              diselenggarakan oleh <b>Transport for Yogyakarta (TfY)</b>, sebuah [placeholder: komunitas/inisiatif
              warga] yang mendorong perbaikan transportasi publik di Daerah Istimewa Yogyakarta.
            </p>
            <p>
              Tujuan survei ini adalah memahami pola perjalanan pengguna Trans Jogja — halte yang dipakai, rute
              yang ditempuh, kendala yang dirasakan, dan preferensi pengembangan jaringan — untuk mendukung usulan
              redesain rute dan halte yang lebih sesuai kebutuhan warga.
            </p>
            <p style={{ color: C.inkMuted }} className="text-xs">
              [Placeholder: tambahkan tautan ke laporan/publikasi hasil survei bila sudah tersedia]
            </p>
          </div>
        )}

        {topic === "privacy" && (
          <div style={{ color: C.ink }} className="text-sm leading-relaxed space-y-3">
            <p style={{ color: C.inkMuted }} className="text-xs italic">[Placeholder — tinjau kembali sebelum publikasi]</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Survei ini tidak meminta nama asli responden. Identitas Anda tetap anonim.</li>
              <li>Nama pengguna Instagram bersifat opsional, hanya digunakan untuk keperluan undian hadiah, dan disimpan terpisah dari data perjalanan.</li>
              <li>Data lokasi (asal/tujuan) disimpan pada tingkat kelurahan/kecamatan, bukan alamat persis.</li>
              <li>Seluruh data hanya digunakan untuk keperluan penelitian dan disajikan dalam bentuk agregat, tidak akan mengungkap identitas responden secara individual.</li>
              <li>Data tidak dibagikan ke pihak ketiga di luar keperluan penelitian ini.</li>
              <li>Anda dapat menghubungi kami melalui menu "Hubungi Kami" apabila ingin meminta penghapusan data yang sudah dikirim.</li>
            </ul>
          </div>
        )}

        {topic === "contact" && (
          <div className="space-y-3">
            <p style={{ color: C.inkMuted }} className="text-sm mb-2">
              Ada pertanyaan seputar survei ini? Hubungi kami melalui:
            </p>
            <a
              href="https://instagram.com/transportforyogya"
              target="_blank" rel="noopener noreferrer"
              style={{ borderColor: C.border, color: C.ink }}
              className="flex items-center gap-3 border rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50"
            >
              <Instagram size={18} style={{ color: C.navy }} /> @transportforyogya
            </a>
            <a
              href="https://twitter.com/TfYogyakarta"
              target="_blank" rel="noopener noreferrer"
              style={{ borderColor: C.border, color: C.ink }}
              className="flex items-center gap-3 border rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50"
            >
              <Twitter size={18} style={{ color: C.navy }} /> @TfYogyakarta
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

