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
              Survei ini diselenggarakan oleh <b>Komunitas Transport for Yogyakarta</b>, sebuah komunitas
              pemerhati dan pegiat transportasi umum yang mendorong perbaikan transportasi publik di Daerah
              Istimewa Yogyakarta.
            </p>
            <p>
              Tujuan dari survei ini adalah memahami pola perjalanan pengguna Trans Jogja, meliputi halte yang
              dipakai, rute yang digunakan, kendala yang dirasakan, serta preferensi pengembangan jaringan untuk
              mendukung usulan rerouting dan redesign rute dan halte yang sesuai pola dan kebutuhan masyarakat.
            </p>
            <p>
              Terima kasih telah ikut berpartisipasi dalam mengisi survei. Kami akan dengan senang hati
              membagikan hasil usulan kami berdasarkan data survei yang kami himpun.
            </p>
            <button
              disabled
              style={{ borderColor: C.border, color: C.inkMuted }}
              className="w-full border rounded-xl px-4 py-3 text-sm font-medium text-left flex items-center justify-between cursor-not-allowed"
            >
              Unduh usulan rute TfY
              <span style={{ background: C.bg, color: C.inkMuted }} className="text-xs px-2 py-1 rounded-lg">Coming soon</span>
            </button>
          </div>
        )}

        {topic === "privacy" && (
          <div style={{ color: C.ink }} className="text-sm leading-relaxed space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>Survei ini tidak membutuhkan nama asli responden. Identitas Anda tetap anonim.</li>
              <li>Nama pengguna Instagram bersifat opsional, hanya digunakan untuk keperluan undian hadiah dan disimpan terpisah dari data survei.</li>
              <li>Data lokasi asal dan tujuan disimpan pada tingkat Kal/Kelurahan, bukan merupakan alamat persis.</li>
              <li>Seluruh data hanya digunakan untuk keperluan penelitian dan disajikan dalam bentuk agregat. Kami tidak akan mengungkap identitas responden secara individual.</li>
              <li>Data tidak dibagikan ke pihak ketiga di luar keperluan penelitian.</li>
            </ul>
            <p style={{ background: "#FFF6E5", borderColor: "#F2B705", color: C.ink }} className="border rounded-xl px-3.5 py-3 text-xs leading-relaxed">
              <b>PENTING:</b> Kami akan membagikan data kepada instansi terkait selaku regulator dan operator
              Trans Jogja untuk evaluasi.
            </p>
            <p className="text-sm">
              Anda dapat menghubungi kami melalui menu &ldquo;Hubungi Kami&rdquo; apabila ingin meminta
              penghapusan data yang sudah dikirim.
            </p>
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

