import { useState, useEffect, useRef } from "react";
import {
  MapPin, Bus, Footprints, Bike, Car, ArrowRight, Plus, X,
  Clock, ChevronDown, Check, Instagram, RefreshCw, ChevronLeft, ChevronRight,
  Twitter, ShieldCheck, Info, Mail
} from "lucide-react";

// ---- design tokens ----------------------------------------------------
const C = {
  navy: "#16324F",
  navyDeep: "#0D2038",
  line: "#1B3A5C",
  amber: "#F8C530", // kuning resmi TfY
  amberDeep: "#B9761A",
  teal: "#2F6F62",
  bg: "#F3F5F3",
  card: "#FFFFFF",
  ink: "#16232E",
  inkMuted: "#5B6672",
  border: "#DCE1DE",
};

const display = { fontFamily: "'Space Grotesk', sans-serif" };
const body = { fontFamily: "'Inter', sans-serif" };

function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);
}

// ---- data halte & rute asli (diekstrak dari stops.json + index.html) --
// Data halte & rute — diekstrak dari stops.json + index.html (STOP_ORIENTATION/DISPLAY_NAMES/ROUTE_META)
const STOPS = [{"raw":"AA YKPN","display":"AA YKPN","routes":["1A","5A"]},{"raw":"Abu Bakar Ali","display":"Abu Bakar Ali","routes":["1B"]},{"raw":"AM Sangaji - A","display":"AM Sangaji (Barat Jalan)","routes":["2A"]},{"raw":"AM Sangaji - B","display":"AM Sangaji (Timur Jalan)","routes":["2B"]},{"raw":"Ambarukmo - A","display":"Ambarukmo (Selatan Jalan)","routes":["1A","5B"]},{"raw":"Ambarukmo - B","display":"Ambarukmo (Utara Jalan)","routes":["1A","5A"]},{"raw":"Among Rogo - A","display":"Among Rogo (Barat Jalan)","routes":["2A"]},{"raw":"Among Rogo - B","display":"Among Rogo (Timur Jalan)","routes":["2B"]},{"raw":"APMD - A","display":"APMD (Timur Jalan)","routes":["4A"]},{"raw":"APMD - B","display":"APMD (Barat Jalan)","routes":["4B"]},{"raw":"Atakrib Jl. Magelang","display":"Atakrib Jl. Magelang","routes":["5A","9","L1"]},{"raw":"Babarsari - A","display":"Babarsari (Selatan Jalan)","routes":["1B","5A"]},{"raw":"Babarsari - B","display":"Babarsari (Utara Jalan)","routes":["5B"]},{"raw":"Badran","display":"Badran","routes":["2B","3B","8","9","11","L1"]},{"raw":"Bandara Adisutjipto","display":"Adisutjipto","routes":["1A","1B","3A","3B","5B","14","SiBulan 2"]},{"raw":"Banguntapan - A","display":"Banguntapan (Barat Jalan)","routes":["2A","3A"]},{"raw":"Banguntapan - B","display":"Banguntapan (Timur Jalan)","routes":["2B","3B"]},{"raw":"Basen","display":"Basen","routes":["2B"]},{"raw":"Batas Kota Jl. Monjali - A","display":"Batas Kota Jl. Monjali (Timur Jalan)","routes":["2A"]},{"raw":"Batas Kota Jl. Monjali - B","display":"Batas Kota Jl. Monjali (Barat Jalan)","routes":["2B"]},{"raw":"Bayeman - A","display":"Bayeman (Utara Jalan)","routes":["10"]},{"raw":"Bayeman - B","display":"Bayeman (Selatan Jalan)","routes":["10"]},{"raw":"Bhayangkara","display":"Bhayangkara","routes":["3B","8","L1"]},{"raw":"Binamarga","display":"Binamarga","routes":["3B","14","SiBulan 2"]},{"raw":"Biologi UGM","display":"Biologi UGM","routes":["3A","4B","12"]},{"raw":"BKD - A","display":"BKD (Utara Jalan)","routes":["8","13"]},{"raw":"BKD - B","display":"BKD (Selatan Jalan)","routes":["8"]},{"raw":"BKPM","display":"BKPM","routes":["1B","3B"]},{"raw":"Blok O","display":"Blok O","routes":["1B","3A"]},{"raw":"Borobudur Plaza","display":"Borobudur Plaza","routes":["2B","5A"]},{"raw":"Boulevard UII","display":"Boulevard UII","routes":["12","14","SiBulan 2"]},{"raw":"BPD Gamping","display":"BPD Gamping","routes":["6","10"]},{"raw":"BPD Kalasan","display":"BPD Kalasan","routes":["1A"]},{"raw":"BRI Bantul","display":"BRI Bantul","routes":["15"]},{"raw":"Budi Mulia Dua - A","display":"Budi Mulia Dua (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"Budi Mulia Dua - B","display":"Budi Mulia Dua (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Bulog","display":"Bulog","routes":["2B","3A","4A","4B","5A","5B","11","13"]},{"raw":"Cik Di Tiro","display":"Cik Di Tiro","routes":["2B","3A","4A","5A","11"]},{"raw":"Cupuwatu","display":"Cupuwatu","routes":["1A"]},{"raw":"Daytrans Jl. Magelang","display":"Daytrans Jl. Magelang","routes":["5B","9","L1"]},{"raw":"De Britto","display":"De Britto","routes":["1A","4A","5A"]},{"raw":"Demak Ijo - A","display":"Demak Ijo (Timur Jalan)","routes":["8"]},{"raw":"Demak Ijo - B","display":"Demak Ijo (Barat Jalan)","routes":["8"]},{"raw":"Demangan","display":"Demangan","routes":["1A","4A","5A"]},{"raw":"Dentes Godean","display":"Dentes Godean","routes":["8","13"]},{"raw":"Diklat PU","display":"Diklat PU","routes":["2A"]},{"raw":"Diponegoro","display":"Diponegoro","routes":["11"]},{"raw":"Dishub DIY - A","display":"Dishub DIY (Barat Jalan)","routes":["1B","5A"]},{"raw":"Dishub DIY - B","display":"Dishub DIY (Timur Jalan)","routes":["5B"]},{"raw":"Disnakertrans - A","display":"Disnakertrans (Barat Jalan)","routes":["3A","14","SiBulan 2"]},{"raw":"Disnakertrans - B","display":"Disnakertrans (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Dongkelan - A","display":"Dongkelan (Barat Jalan)","routes":["15"]},{"raw":"Dongkelan - B","display":"Dongkelan (Timur Jalan)","routes":["15"]},{"raw":"Dr. Yap","display":"Dr. Yap","routes":["2A","3B","4A","5B","11"]},{"raw":"Druwo - A","display":"Druwo (Barat Jalan)","routes":["9"]},{"raw":"Druwo - B","display":"Druwo (Timur Jalan)","routes":["9"]},{"raw":"Dukuh - A","display":"Dukuh (Barat Jalan)","routes":["15"]},{"raw":"Dukuh - B","display":"Dukuh (Timur Jalan)","routes":["15"]},{"raw":"Dusun Kledokan - A","display":"Dusun Kledokan (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Dusun Kledokan - B","display":"Dusun Kledokan (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Dusun Ngawen","display":"Dusun Ngawen","routes":["8"]},{"raw":"Edotel Kalasan - A","display":"Edotel Kalasan (Selatan Jalan)","routes":["1A"]},{"raw":"Edotel Kalasan - B","display":"Edotel Kalasan (Utara Jalan)","routes":["1A"]},{"raw":"Eks Bioskop Mataram","display":"Eks Bioskop Mataram","routes":["2A"]},{"raw":"Eks Hotel Nataputra","display":"Eks Hotel Nataputra","routes":["10"]},{"raw":"Eks Menara Kopi - A","display":"Eks Menara Kopi (Utara Jalan)","routes":["1A","8","10","2A","L1"]},{"raw":"Eks Menara Kopi - B","display":"Eks Menara Kopi (Selatan Jalan)","routes":["1A","3A","8","13","2A","L1"]},{"raw":"Eks Stasiun Bantul","display":"Eks Stasiun Bantul","routes":["15"]},{"raw":"Fisipol UGM - A","display":"Fisipol UGM (Barat Jalan)","routes":["5A"]},{"raw":"Fisipol UGM - B","display":"Fisipol UGM (Timur Jalan)","routes":["5B"]},{"raw":"FKG UGM - A","display":"FKG UGM (Utara Jalan)","routes":["3A","4B","5B","12"]},{"raw":"FKG UGM - B","display":"FKG UGM (Selatan Jalan)","routes":["3B","4A","5A","12"]},{"raw":"Flyover Lempuyangan","display":"Flyover Lempuyangan","routes":["2B","10"]},{"raw":"Galeria Mall","display":"Galeria Mall","routes":["4B"]},{"raw":"Gambiran - A","display":"Gambiran (Barat Jalan)","routes":["2A"]},{"raw":"Gambiran - B","display":"Gambiran (Timur Jalan)","routes":["2B"]},{"raw":"Gardu PLN - A","display":"Gardu PLN (Barat Jalan)","routes":["12"]},{"raw":"Gardu PLN - B","display":"Gardu PLN (Timur Jalan)","routes":["12"]},{"raw":"Gedung Wanita","display":"Gedung Wanita","routes":["1A","4B","5B"]},{"raw":"Gembira Loka - A","display":"Gembira Loka (Utara Jalan)","routes":["1B","2B"]},{"raw":"Gembira Loka - B","display":"Gembira Loka (Selatan Jalan)","routes":["1B","2A"]},{"raw":"Gereja Pugeran - A","display":"Gereja Pugeran (Barat Jalan)","routes":["15"]},{"raw":"Gereja Pugeran - B","display":"Gereja Pugeran (Timur Jalan)","routes":["15"]},{"raw":"GKJ Wirobrajan","display":"GKJ Wirobrajan","routes":["10"]},{"raw":"Gudang SGM - A","display":"Gudang SGM (Barat Jalan)","routes":["3A","3B","4A","4B"]},{"raw":"Gudang SGM - B","display":"Gudang SGM (Timur Jalan)","routes":["3A","3B","4A","4B"]},{"raw":"Hayam Wuruk - A","display":"Hayam Wuruk (Barat Jalan)","routes":["4A"]},{"raw":"Hayam Wuruk - B","display":"Hayam Wuruk (Timur Jalan)","routes":["4B"]},{"raw":"Hokben Jakal - A","display":"Hokben Jakal (Timur Jalan)","routes":["3A","4B","5A","12"]},{"raw":"Hokben Jakal - B","display":"Hokben Jakal (Barat Jalan)","routes":["3B","4A","5B","12"]},{"raw":"Hotel Abadi","display":"Hotel Abadi","routes":["1B"]},{"raw":"Hotel Andika Putera","display":"Hotel Andika Putera","routes":["10"]},{"raw":"Hotel Noola","display":"Hotel Noola","routes":["9"]},{"raw":"Hotel Pramesthi","display":"Hotel Pramesthi","routes":["11"]},{"raw":"Hotel Utara - A","display":"Hotel Utara (Barat Jalan)","routes":["9","L1"]},{"raw":"Hotel Utara - B","display":"Hotel Utara (Timur Jalan)","routes":["2B","9","L1"]},{"raw":"Hotel Vidi","display":"Hotel Vidi","routes":["3B","4A","5B","12"]},{"raw":"Hyundai","display":"Hyundai","routes":["1A","1B","3B","5B"]},{"raw":"Indogrosir","display":"Indogrosir","routes":["5A","9","L1"]},{"raw":"Indomaret Klajuran - A","display":"Indomaret Klajuran (Utara Jalan)","routes":["13"]},{"raw":"Indomaret Klajuran - B","display":"Indomaret Klajuran (Selatan Jalan)","routes":["13"]},{"raw":"Indomaret Pokoh Sambiroto - A","display":"Indomaret Pokoh Sambiroto (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"Indomaret Pokoh Sambiroto - B","display":"Indomaret Pokoh Sambiroto (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Instiper - A","display":"Instiper (Selatan Jalan)","routes":["3A"]},{"raw":"Instiper - B","display":"Instiper (Utara Jalan)","routes":["3B"]},{"raw":"Janti Selatan","display":"Janti Selatan","routes":["1A","5A","5B"]},{"raw":"Janti Utara","display":"Janti","routes":["1A","1B","3A","5A"]},{"raw":"Jayakarta","display":"Jayakarta","routes":["1A","1B","3B","5B"]},{"raw":"JEC","display":"JEC","routes":["1B","3A"]},{"raw":"Jend. Sudirman - A","display":"Jend. Sudirman (Selatan Jalan)","routes":["1A","11"]},{"raw":"Jend. Sudirman - B","display":"Jend. Sudirman (Utara Jalan)","routes":["3B","13"]},{"raw":"Jl. Mataram","display":"Jl. Mataram","routes":["1A","1B","6","10","15"]},{"raw":"Jl. Raya Kabunan - A","display":"Jl. Raya Kabunan (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Jl. Raya Kabunan - B","display":"Jl. Raya Kabunan (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Jl. Suroto","display":"Jl. Suroto","routes":["5B"]},{"raw":"Jlagran","display":"Jlagran","routes":["1B","3B","8","L1"]},{"raw":"Jogja City Mall - A","display":"Jogja City Mall (Timur Jalan)","routes":["5A","9","L1"]},{"raw":"Jogja City Mall - B","display":"Jogja City Mall (Barat Jalan)","routes":["5B","9","L1"]},{"raw":"Jogjatronik","display":"Jogjatronik","routes":["2A"]},{"raw":"Jogokariyan - A","display":"Jogokariyan (Barat Jalan)","routes":["9","11"]},{"raw":"Jogokariyan - B","display":"Jogokariyan (Timur Jalan)","routes":["9","11"]},{"raw":"Jokteng Kulon","display":"Jokteng Kulon","routes":["3A","9","11"]},{"raw":"Jokteng Wetan","display":"Jokteng Wetan","routes":["3B","9"]},{"raw":"Kantor Kal. Pendowoharjo - A","display":"Kantor Kal. Pendowoharjo (Barat Jalan)","routes":["15"]},{"raw":"Kantor Kal. Pendowoharjo - B","display":"Kantor Kal. Pendowoharjo (Timur Jalan)","routes":["15"]},{"raw":"Kantor Kal. Sidoarum - A","display":"Kantor Kal. Sidoarum (Utara Jalan)","routes":["13"]},{"raw":"Kantor Kal. Sidoarum - B","display":"Kantor Kal. Sidoarum (Selatan Jalan)","routes":["13"]},{"raw":"Kantor Kal. Sukoharjo - A","display":"Kantor Kal. Sukoharjo (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Kantor Kal. Sukoharjo - B","display":"Kantor Kal. Sukoharjo (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Kantor Kal. Wedomartani - A","display":"Kantor Kal. Wedomartani (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"Kantor Kal. Wedomartani - B","display":"Kantor Kal. Wedomartani (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Kantor Kap. Bantul","display":"Kantor Kap. Bantul","routes":["15"]},{"raw":"Kantor Kap. Godean - A","display":"Kantor Kap. Godean (Utara Jalan)","routes":["13"]},{"raw":"Kantor Kap. Godean - B","display":"Kantor Kap. Godean (Selatan Jalan)","routes":["13"]},{"raw":"Kantor Kap. Ngaglik","display":"Kantor Kap. Ngaglik","routes":["12"]},{"raw":"Kantor Kesbangpol - A","display":"Kantor Kesbangpol (Barat Jalan)","routes":["15"]},{"raw":"Kantor Kesbangpol - B","display":"Kantor Kesbangpol (Timur Jalan)","routes":["15"]},{"raw":"Kantor Pos Demak Ijo - A","display":"Kantor Pos Demak Ijo (Utara Jalan)","routes":["8","13"]},{"raw":"Kantor Pos Demak Ijo - B","display":"Kantor Pos Demak Ijo (Selatan Jalan)","routes":["8","13"]},{"raw":"Kanwil DJPb","display":"Kanwil DJPb","routes":["1A","1B","3A","5B"]},{"raw":"Karangjati - A","display":"Karangjati (Timur Jalan)","routes":["2A"]},{"raw":"Karangjati - B","display":"Karangjati (Barat Jalan)","routes":["2B"]},{"raw":"Karangwaru - A","display":"Karangwaru (Timur Jalan)","routes":["5A","9","L1"]},{"raw":"Karangwaru - B","display":"Karangwaru (Barat Jalan)","routes":["5B","9","L1"]},{"raw":"Katamso","display":"Katamso","routes":["2B"]},{"raw":"Kehutanan - A","display":"Kehutanan (Barat Jalan)","routes":["2A","3A"]},{"raw":"Kehutanan - B","display":"Kehutanan (Timur Jalan)","routes":["2B","3B"]},{"raw":"Kentungan","display":"Kentungan","routes":["2B","3B","4A","5B"]},{"raw":"KHA Dahlan - A","display":"KHA Dahlan (Selatan Jalan)","routes":["2B","3A","6","8","10","13","15"]},{"raw":"KHA Dahlan - B","display":"KHA Dahlan (Utara Jalan)","routes":["1B","3B","6","8","10","15"]},{"raw":"KKP Yogyakarta","display":"KKP Yogyakarta","routes":["3A","14","SiBulan 2"]},{"raw":"Kledokan","display":"Kledokan","routes":["1B"]},{"raw":"Kompi Senapan-C","display":"Kompi Senapan-C","routes":["8","13"]},{"raw":"GIK UGM","display":"GIK UGM","routes":["3A","4B","12"]},{"raw":"Koramil Godean - A","display":"Koramil Godean (Utara Jalan)","routes":["13"]},{"raw":"Koramil Godean - B","display":"Koramil Godean (Selatan Jalan)","routes":["13"]},{"raw":"Kosudgama","display":"Kosudgama","routes":["2A","12"]},{"raw":"Kotabaru","display":"Kotabaru","routes":["11"]},{"raw":"KPPN","display":"KPPN","routes":["2A"]},{"raw":"KR - A","display":"KR (Selatan Jalan)","routes":["1A"]},{"raw":"KR - B","display":"KR (Utara Jalan)","routes":["1A"]},{"raw":"Kricak","display":"Kricak","routes":["5B","9","L1"]},{"raw":"Kridosono","display":"Kridosono","routes":["1A","2A","2B","3A","4A","4B","5A","5B","8","10","11","13","L1"]},{"raw":"KS Tubun","display":"KS Tubun","routes":["1B"]},{"raw":"KUA Depok - A","display":"KUA Depok (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"KUA Depok - B","display":"KUA Depok (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Lap. Karang - A","display":"Lap. Karang (Utara Jalan)","routes":["3A"]},{"raw":"Lap. Karang - B","display":"Lap. Karang (Selatan Jalan)","routes":["3B"]},{"raw":"Lap. Kasihan - A","display":"Lap. Kasihan (Barat Jalan)","routes":["6"]},{"raw":"Lap. Kasihan - B","display":"Lap. Kasihan (Timur Jalan)","routes":["6"]},{"raw":"Lap. Klidon - A","display":"Lap. Klidon (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Lap. Klidon - B","display":"Lap. Klidon (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Lapas Wirogunan - A","display":"Lapas Wirogunan (Barat Jalan)","routes":["4A"]},{"raw":"Lapas Wirogunan - B","display":"Lapas Wirogunan (Timur Jalan)","routes":["4B"]},{"raw":"Lempuyangan","display":"Lempuyangan","routes":["2B","4B","10"]},{"raw":"Letjen Suprapto","display":"Letjen Suprapto","routes":["1B"]},{"raw":"Lowanu - A","display":"Lowanu (Timur Jalan)","routes":["3A"]},{"raw":"Lowanu - B","display":"Lowanu (Barat Jalan)","routes":["3B"]},{"raw":"LPP","display":"LPP","routes":["1A","4B","5B"]},{"raw":"Madukismo - A","display":"Madukismo (Timur Jalan)","routes":["6"]},{"raw":"Madukismo - B","display":"Madukismo (Barat Jalan)","routes":["6"]},{"raw":"Maguwo Sambilegi","display":"Maguwo Sambilegi","routes":["1A","1B","3A","3B","5B","14","SiBulan 2"]},{"raw":"Makam Gajah - A","display":"Makam Gajah (Utara Jalan)","routes":["1B","2B"]},{"raw":"Makam Gajah - B","display":"Makam Gajah (Selatan Jalan)","routes":["1B","2A"]},{"raw":"Makam Prajurit","display":"Makam Prajurit","routes":["4A"]},{"raw":"Makam Santren","display":"Makam Santren","routes":["2B","4A","12"]},{"raw":"Makam Sorogenen","display":"Makam Sorogenen","routes":["1A"]},{"raw":"Malioboro 1","display":"Malioboro 1","routes":["1A","2A","3A","6","8","10","13","15","L1"]},{"raw":"Malioboro 2","display":"Malioboro 2","routes":["1A","2A","3A","6","8","10","13","15","L1"]},{"raw":"Malioboro 3","display":"Malioboro","routes":["1A","2A","3A","6","8","10","13","15","L1"]},{"raw":"MAN 1","display":"MAN 1","routes":["4B"]},{"raw":"MAN 2 Sleman - A","display":"MAN 2 Sleman (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"MAN 2 Sleman - B","display":"MAN 2 Sleman (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Mandala Krida - A","display":"Mandala Krida (Selatan Jalan)","routes":["2A"]},{"raw":"Mandala Krida - B","display":"Mandala Krida (Utara Jalan)","routes":["2B"]},{"raw":"Manggung","display":"Manggung","routes":["2A","3A","4B","5A"]},{"raw":"Mangkubumi 1","display":"Mangkubumi 1","routes":["1A","2A","8","L1"]},{"raw":"Mangkubumi 2","display":"Mangkubumi 2","routes":["1A","2A","8","L1"]},{"raw":"McD","display":"McD","routes":["8","13"]},{"raw":"McD Jakal","display":"McD Jakal","routes":["3A","4B","5A","12"]},{"raw":"Metro Nogotirto - A","display":"Metro Nogotirto (Utara Jalan)","routes":["8","13"]},{"raw":"Metro Nogotirto - B","display":"Metro Nogotirto (Selatan Jalan)","routes":["8","13"]},{"raw":"Mirota Babarsari","display":"Mirota Babarsari","routes":["1A","1B","3A","5B"]},{"raw":"Mirota Godean - A","display":"Mirota Godean (Utara Jalan)","routes":["8","13"]},{"raw":"Mirota Godean - B","display":"Mirota Godean (Selatan Jalan)","routes":["8","13"]},{"raw":"MM UGM","display":"MM UGM","routes":["3B","4A","12"]},{"raw":"MMTC Yogyakarta","display":"MMTC Yogyakarta","routes":["5B","9","L1"]},{"raw":"Monjali - A","display":"Monjali (Utara Jalan)","routes":["2A","2B","5B"]},{"raw":"Monjali - B","display":"Monjali (Selatan Jalan)","routes":["2A","2B","5A"]},{"raw":"Mualimin - A","display":"Mualimin (Utara Jalan)","routes":["6","10"]},{"raw":"Mualimin - B","display":"Mualimin (Selatan Jalan)","routes":["6","10"]},{"raw":"Museum Bahari","display":"Museum Bahari","routes":["10"]},{"raw":"Museum Biologi","display":"Museum Biologi","routes":["1B","4A"]},{"raw":"Museum Perjuangan","display":"Museum Perjuangan","routes":["2B","3B"]},{"raw":"Neutron Godean - A","display":"Neutron Godean (Utara Jalan)","routes":["13"]},{"raw":"Neutron Godean - B","display":"Neutron Godean (Selatan Jalan)","routes":["13"]},{"raw":"Ngabean","display":"Ngabean","routes":["1B","2B","3A","3B","6","8","9","10","11","13","15"]},{"raw":"Nitikan","display":"Nitikan","routes":["3B"]},{"raw":"Nogosaren","display":"Nogosaren","routes":["8"]},{"raw":"Nyutran Tamansiswa","display":"Nyutran Tamansiswa","routes":["4A"]},{"raw":"Olive Glagahsari","display":"Olive Glagahsari","routes":["4B"]},{"raw":"Ombudsman","display":"Ombudsman","routes":["2A","4B","12"]},{"raw":"Pakualaman","display":"Pakualaman","routes":["1B","4B"]},{"raw":"Pakuwon Mall - A","display":"Pakuwon Mall (Selatan Jalan)","routes":["3A","5A"]},{"raw":"Pakuwon Mall - B","display":"Pakuwon Mall (Utara Jalan)","routes":["3B","5B"]},{"raw":"Pandeyan","display":"Pandeyan","routes":["4B"]},{"raw":"Park and Ride Gamping","display":"Gamping","routes":["6","10"]},{"raw":"Pasar Angkasa","display":"Pasar Angkasa","routes":["1B","3B"]},{"raw":"Pasar Bantul - A","display":"Pasar Bantul (Barat Jalan)","routes":["15"]},{"raw":"Pasar Bantul - B","display":"Pasar Bantul (Timur Jalan)","routes":["15"]},{"raw":"Pasar Belut Godean - A","display":"Pasar Belut Godean (Utara Jalan)","routes":["13"]},{"raw":"Pasar Belut Godean - B","display":"Pasar Belut Godean (Selatan Jalan)","routes":["13"]},{"raw":"Pasar Demangan","display":"Pasar Demangan","routes":["4A"]},{"raw":"Pasar Gamping - A","display":"Pasar Gamping (Utara Jalan)","routes":["6","10"]},{"raw":"Pasar Gamping - B","display":"Pasar Gamping (Selatan Jalan)","routes":["6","10"]},{"raw":"Pasar Giwangan - A","display":"Pasar Giwangan (Barat Jalan)","routes":["3A","3B","4A","4B"]},{"raw":"Pasar Giwangan - B","display":"Pasar Giwangan (Timur Jalan)","routes":["3A","3B","4A","4B"]},{"raw":"Pasar Induk Godean - A","display":"Pasar Induk Godean (Utara Jalan)","routes":["13"]},{"raw":"Pasar Induk Godean - B","display":"Pasar Induk Godean (Selatan Jalan)","routes":["13"]},{"raw":"Pasar Jangkang - A","display":"Pasar Jangkang (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Pasar Jangkang - B","display":"Pasar Jangkang (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Pasar Kalasan - B","display":"Pasar Kalasan (Utara Jalan)","routes":["1A"]},{"raw":"Pasar Kalasan - A","display":"Pasar Kalasan (Selatan Jalan)","routes":["1A"]},{"raw":"Pasar Kolombo - A","display":"Pasar Kolombo (Barat Jalan)","routes":["12"]},{"raw":"Pasar Kolombo - B","display":"Pasar Kolombo (Timur Jalan)","routes":["12"]},{"raw":"Pasar Kranggan Selatan","display":"Pasar Kranggan Selatan","routes":["3B","8","11","13","L1"]},{"raw":"Pasar Kranggan Timur","display":"Pasar Kranggan Timur","routes":["2A"]},{"raw":"Pasar Legi - A","display":"Pasar Legi (Barat Jalan)","routes":["6"]},{"raw":"Pasar Legi - B","display":"Pasar Legi (Timur Jalan)","routes":["6"]},{"raw":"Pasar Lempuyangan","display":"Pasar Lempuyangan","routes":["4A"]},{"raw":"Pasar Niten - A","display":"Pasar Niten (Barat Jalan)","routes":["15"]},{"raw":"Pasar Niten - B","display":"Pasar Niten (Timur Jalan)","routes":["15"]},{"raw":"Pasar Pathuk","display":"Pasar Pathuk","routes":["3B","8","L1"]},{"raw":"Pasar Pingit - A","display":"Pasar Pingit (Utara Jalan)","routes":["8","13"]},{"raw":"Pasar Pingit - B","display":"Pasar Pingit (Selatan Jalan)","routes":["8"]},{"raw":"Pasar Sentul","display":"Pasar Sentul","routes":["1B","4A"]},{"raw":"Pasar Sepeda","display":"Pasar Sepeda","routes":["2B","4A"]},{"raw":"Pasar Serangan - A","display":"Pasar Serangan (Selatan Jalan)","routes":["2B","9","11","13"]},{"raw":"Pasar Serangan - B","display":"Pasar Serangan (Utara Jalan)","routes":["9","11"]},{"raw":"Pasar Telo - A","display":"Pasar Telo (Barat Jalan)","routes":["11"]},{"raw":"Pasar Telo - B","display":"Pasar Telo (Timur Jalan)","routes":["11"]},{"raw":"Pasar Tlogorejo - A","display":"Pasar Tlogorejo (Utara Jalan)","routes":["8","13"]},{"raw":"Pasar Tlogorejo - B","display":"Pasar Tlogorejo (Selatan Jalan)","routes":["8","13"]},{"raw":"Pasty - A","display":"Pasty (Barat Jalan)","routes":["15"]},{"raw":"Pasty - B","display":"Pasty (Timur Jalan)","routes":["15"]},{"raw":"PDAM Monjali - A","display":"PDAM Monjali (Timur Jalan)","routes":["2A","5B"]},{"raw":"PDAM Monjali - B","display":"PDAM Monjali (Barat Jalan)","routes":["2B","5A"]},{"raw":"PDIN","display":"PDIN","routes":["4B"]},{"raw":"Pegadaian","display":"Pegadaian","routes":["3B"]},{"raw":"Pelem Gurih - A","display":"Pelem Gurih (Utara Jalan)","routes":["10"]},{"raw":"Pelem Gurih - B","display":"Pelem Gurih (Selatan Jalan)","routes":["10"]},{"raw":"Perintis Kemerdekaan - A","display":"Perintis Kemerdekaan (Utara Jalan)","routes":["2A"]},{"raw":"Perintis Kemerdekaan - B","display":"Perintis Kemerdekaan (Selatan Jalan)","routes":["2B"]},{"raw":"Perumahan Nogotirto","display":"Perumahan Nogotirto","routes":["8"]},{"raw":"Pilar","display":"Pilar","routes":["2A","3A"]},{"raw":"PKU Gamping","display":"PKU Gamping","routes":["6","10"]},{"raw":"Plaza UNY","display":"Plaza UNY","routes":["2A","4B","12"]},{"raw":"Plengkung Gading - A","display":"Plengkung Gading (Utara Jalan)","routes":["3A","9"]},{"raw":"Plengkung Gading - B","display":"Plengkung Gading (Selatan Jalan)","routes":["3B","9"]},{"raw":"Polres Bantul","display":"Polres Bantul","routes":["15"]},{"raw":"Polsek Depok Timur - A","display":"Polsek Depok Timur (Selatan Jalan)","routes":["3A"]},{"raw":"Polsek Depok Timur - B","display":"Polsek Depok Timur (Utara Jalan)","routes":["3B"]},{"raw":"Polsek Godean - A","display":"Polsek Godean (Utara Jalan)","routes":["13"]},{"raw":"Polsek Godean - B","display":"Polsek Godean (Selatan Jalan)","routes":["13"]},{"raw":"Polsek Umbulharjo","display":"Polsek Umbulharjo","routes":["4A","4B"]},{"raw":"Poltekkes BSI","display":"Poltekkes BSI","routes":["2B","3B"]},{"raw":"Pramuka","display":"Pramuka","routes":["4A","4B"]},{"raw":"Prayan - A","display":"Prayan (Barat Jalan)","routes":["2A","4B","12"]},{"raw":"Prayan - B","display":"Prayan (Timur Jalan)","routes":["2B","4A","12"]},{"raw":"Progo","display":"Progo","routes":["1A","1B","6","10","15"]},{"raw":"Pujokusuman","display":"Pujokusuman","routes":["2A","3A"]},{"raw":"Purawisata - A","display":"Purawisata (Timur Jalan)","routes":["2A"]},{"raw":"Purawisata - B","display":"Purawisata (Barat Jalan)","routes":["2B"]},{"raw":"Puskesmas Ngaglik - A","display":"Puskesmas Ngaglik (Barat Jalan)","routes":["12"]},{"raw":"Puskesmas Ngaglik - B","display":"Puskesmas Ngaglik (Timur Jalan)","routes":["12"]},{"raw":"Puskesmas Ngemplak - A","display":"Puskesmas Ngemplak (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Puskesmas Ngemplak - B","display":"Puskesmas Ngemplak (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Raminten - A","display":"Raminten (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Raminten - B","display":"Raminten (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"RRI Gejayan","display":"RRI Gejayan","routes":["4B"]},{"raw":"RS Bethesda","display":"RS Bethesda","routes":["1A","2A","4A","5B"]},{"raw":"RS Bhayangkara - A","display":"RS Bhayangkara (Selatan Jalan)","routes":["1A"]},{"raw":"RS Bhayangkara - B","display":"RS Bhayangkara (Utara Jalan)","routes":["1A"]},{"raw":"RS Hardjolukito","display":"RS Hardjolukito","routes":["1B","3B"]},{"raw":"RS Hidayatullah","display":"XT Square","routes":["2A"]},{"raw":"RS JIH","display":"RS JIH","routes":["3B","5B"]},{"raw":"RS Kemasan - A","display":"RS Kemasan (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"RS Kemasan - B","display":"RS Kemasan (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"RS Panti Nugroho","display":"RS Panti Nugroho","routes":["12","14","SiBulan 2"]},{"raw":"RS Panti Rapih","display":"RS Panti Rapih","routes":["2B","4A","12"]},{"raw":"RS Sardjito - A","display":"RS Sardjito (Timur Jalan)","routes":["3A","4B","5B","12"]},{"raw":"RS Sardjito - B","display":"RS Sardjito (Barat Jalan)","routes":["3B","4A","5A","12"]},{"raw":"RSU Gramedika - A","display":"RSU Gramedika (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"RSU Gramedika - B","display":"RSU Gramedika (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Ruba Graha - A","display":"Ruba Graha (Selatan Jalan)","routes":["11"]},{"raw":"Ruba Graha - B","display":"Ruba Graha (Utara Jalan)","routes":["11"]},{"raw":"Sahid J-Walk","display":"Sahid J-Walk","routes":["1B","5A"]},{"raw":"Samirono","display":"Samirono","routes":["2B","12"]},{"raw":"Samsat","display":"Samsat","routes":["9","11"]},{"raw":"Sanata Dharma","display":"Sanata Dharma","routes":["2B","12"]},{"raw":"Santren","display":"Santren","routes":["2A","4B","12"]},{"raw":"Saudagaran","display":"Saudagaran","routes":["9","11"]},{"raw":"SD Unggulan Aisyiyah - A","display":"SD Unggulan Aisyiyah (Barat Jalan)","routes":["15"]},{"raw":"SD Unggulan Aisyiyah - B","display":"SD Unggulan Aisyiyah (Timur Jalan)","routes":["15"]},{"raw":"SDN 1 Demak Ijo - A","display":"SDN 1 Demak Ijo (Utara Jalan)","routes":["8","13"]},{"raw":"SDN 1 Demak Ijo - B","display":"SDN 1 Demak Ijo (Selatan Jalan)","routes":["8","13"]},{"raw":"SDN 1 Depok -  A","display":"SDN 1 Depok -  A","routes":["14","SiBulan 2"]},{"raw":"SDN 1 Depok - B","display":"SDN 1 Depok","routes":["14","SiBulan 2"]},{"raw":"SDN Gedongtengen","display":"SDN Gedongtengen","routes":["1B"]},{"raw":"SDN Kintelan 1","display":"SDN Kintelan 1","routes":["2A"]},{"raw":"SDN Percobaan 3 Pakem","display":"SDN Percobaan 3 Pakem","routes":["12","14","SiBulan 2"]},{"raw":"SDN Selomulyo - A","display":"SDN Selomulyo (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"SDN Selomulyo - B","display":"SDN Selomulyo (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Selokan Mataram Maguwo","display":"Selokan Mataram Maguwo","routes":["14","SiBulan 2"]},{"raw":"Senopati","display":"Senopati","routes":["2B"]},{"raw":"SGM Kusumanegara - A","display":"Kusumanegara (Utara Jalan)","routes":["1B","2B","4B"]},{"raw":"SGM Kusumanegara - B","display":"Kusumanegara (Selatan Jalan)","routes":["1B","2A","4A","10"]},{"raw":"Simpang Babadan - A","display":"Simpang Babadan (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Babadan - B","display":"Simpang Babadan (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Bantulan - A","display":"Simpang Bantulan (Utara Jalan)","routes":["13"]},{"raw":"Simpang Bantulan - B","display":"Simpang Bantulan (Selatan Jalan)","routes":["13"]},{"raw":"Simpang Besi Jakal - A","display":"Simpang Besi Jakal (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Simpang Besi Jakal - B","display":"Simpang Besi Jakal (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Simpang Degolan - A","display":"Simpang Degolan (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Simpang Degolan - B","display":"Simpang Degolan (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Simpang Diklat DIY - A","display":"Simpang Diklat DIY (Selatan Jalan)","routes":["6"]},{"raw":"Simpang Diklat DIY - B","display":"Simpang Diklat DIY (Utara Jalan)","routes":["6"]},{"raw":"Simpang Gesikan - A","display":"Simpang Gesikan (Utara Jalan)","routes":["13"]},{"raw":"Simpang Gesikan - B","display":"Simpang Gesikan (Selatan Jalan)","routes":["13"]},{"raw":"Simpang Gose - A","display":"Simpang Gose (Barat Jalan)","routes":["15"]},{"raw":"Simpang Gose - B","display":"Simpang Gose (Timur Jalan)","routes":["15"]},{"raw":"Simpang Kabunan - A","display":"Simpang Kabunan (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Kabunan - B","display":"Simpang Kabunan (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Kasongan - A","display":"Simpang Kasongan (Barat Jalan)","routes":["15"]},{"raw":"Simpang Kasongan - B","display":"Simpang Kasongan (Timur Jalan)","routes":["15"]},{"raw":"Simpang Kenti - A","display":"Simpang Kenti (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Kenti - B","display":"Simpang Kenti (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Losari - A","display":"Simpang Losari (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Losari - B","display":"Simpang Losari (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Mandungan (Iwak Kalen) - A","display":"Simpang Mandungan (Iwak Kalen) (Utara Jalan)","routes":["13"]},{"raw":"Simpang Mandungan (Iwak Kalen) - B","display":"Simpang Mandungan (Iwak Kalen) (Selatan Jalan)","routes":["13"]},{"raw":"Simpang Munggur - A","display":"Simpang Munggur (Utara Jalan)","routes":["13"]},{"raw":"Simpang Munggur - B","display":"Simpang Munggur (Selatan Jalan)","routes":["13"]},{"raw":"Simpang Palem Raya - A","display":"Simpang Palem Raya (Barat Jalan)","routes":["12"]},{"raw":"Simpang Palem Raya - B","display":"Simpang Palem Raya (Timur Jalan)","routes":["12"]},{"raw":"Simpang Selomartani - A","display":"Simpang Selomartani (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Selomartani - B","display":"Simpang Selomartani (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Simpang Wojo","display":"Simpang Wojo","routes":["9"]},{"raw":"SMA Muh 3","display":"SMA Muh 3","routes":["10"]},{"raw":"SMAN 5","display":"SMAN 5","routes":["3A"]},{"raw":"SMAN 1 - A","display":"SMAN 1 (Barat Jalan)","routes":["2B","9","11","13"]},{"raw":"SMAN 1 - B","display":"SMAN 1 (Timur Jalan)","routes":["9","11"]},{"raw":"SMAN 1 Bantul - A","display":"SMAN 1 Bantul (Barat Jalan)","routes":["15"]},{"raw":"SMAN 1 Bantul - B","display":"SMAN 1 Bantul (Timur Jalan)","routes":["15"]},{"raw":"SMAN 1 Kasihan - A","display":"SMAN 1 Kasihan (Barat Jalan)","routes":["6"]},{"raw":"SMAN 1 Kasihan - B","display":"SMAN 1 Kasihan (Timur Jalan)","routes":["6"]},{"raw":"SMAN 2 Ngaglik - A","display":"SMAN 2 Ngaglik (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"SMAN 2 Ngaglik - B","display":"SMAN 2 Ngaglik (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"SMAN 7","display":"SMAN 7","routes":["3B","9","11"]},{"raw":"SMK Muh 3","display":"SMK Muh 3","routes":["4A","4B"]},{"raw":"SMK Negeri 2 Godean","display":"SMK Negeri 2 Godean","routes":["13"]},{"raw":"SMK Seni - A","display":"SMK Seni (Timur Jalan)","routes":["6"]},{"raw":"SMK Seni - B","display":"SMK Seni (Barat Jalan)","routes":["6"]},{"raw":"SMKN 1 Depok - Jl. Raya Tajem - A","display":"SMKN 1 Depok - Jl. Raya Tajem (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"SMKN 1 Depok - Jl. Raya Tajem - B","display":"SMKN 1 Depok - Jl. Raya Tajem (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"SMKN 1 Depok - Ring Road Utara","display":"SMKN 1 Depok - Ring Road Utara","routes":["3B"]},{"raw":"SMKN 3","display":"SMKN 3","routes":["2B","5A"]},{"raw":"SMKN 5 - A","display":"SMKN 5 (Utara Jalan)","routes":["4A","10"]},{"raw":"SMKN 5 - B","display":"SMKN 5 (Selatan Jalan)","routes":["4B"]},{"raw":"SMP Kanisius Gayam - A","display":"SMP Kanisius Gayam (Barat Jalan)","routes":["2A"]},{"raw":"SMP Kanisius Gayam - B","display":"SMP Kanisius Gayam (Timur Jalan)","routes":["2B","10"]},{"raw":"SMP Muh 3","display":"SMP Muh 3","routes":["10"]},{"raw":"SMPN 1 - A","display":"SMPN 1 (Barat Jalan)","routes":["2A","3B","4A","5B","11"]},{"raw":"SMPN 1 - B","display":"SMPN 1 (Timur Jalan)","routes":["2B","3A","4A","5A","11"]},{"raw":"SMPN 1 Godean","display":"SMPN 1 Godean","routes":["13"]},{"raw":"SMPN 11","display":"SMPN 11","routes":["2B","9","11","13"]},{"raw":"SMPN 14","display":"SMPN 14","routes":["2B","3B","8","9","11","L1"]},{"raw":"SMPN 2 Bantul - A","display":"SMPN 2 Bantul (Barat Jalan)","routes":["15"]},{"raw":"SMPN 2 Bantul - B","display":"SMPN 2 Bantul (Timur Jalan)","routes":["15"]},{"raw":"SMPN 2 Ngaglik - A","display":"SMPN 2 Ngaglik (Barat Jalan)","routes":["12"]},{"raw":"SMPN 2 Ngaglik - B","display":"SMPN 2 Ngaglik (Timur Jalan)","routes":["12"]},{"raw":"SMPN 4 Pakem","display":"SMPN 4 Pakem","routes":["12","14","SiBulan 2"]},{"raw":"SMPN 6","display":"SMPN 6","routes":["5B"]},{"raw":"SMPN 9 - A","display":"SMPN 9 (Utara Jalan)","routes":["2A"]},{"raw":"SMPN 9 - B","display":"SMPN 9 (Selatan Jalan)","routes":["2B"]},{"raw":"Sosrowijayan","display":"Sosrowijayan","routes":["3B","8","L1"]},{"raw":"SPBU Concat - A","display":"SPBU Concat (Barat Jalan)","routes":["2A","4B","12"]},{"raw":"SPBU Concat - B","display":"SPBU Concat (Timur Jalan)","routes":["2B","4A","12"]},{"raw":"SPBU Kaliurang - A","display":"SPBU Kaliurang (Barat Jalan)","routes":["12"]},{"raw":"SPBU Kaliurang - B","display":"SPBU Kaliurang (Timur Jalan)","routes":["12"]},{"raw":"SPBU Mindi - A","display":"SPBU Mindi (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"SPBU Mindi - B","display":"SPBU Mindi (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"SPBU Monjali - A","display":"SPBU Monjali (Timur Jalan)","routes":["2A","5B"]},{"raw":"SPBU Monjali - B","display":"SPBU Monjali (Barat Jalan)","routes":["2B","5A"]},{"raw":"Stadion TGP","display":"Godean","routes":["13"]},{"raw":"Stasiun Lempuyangan","display":"Stasiun Lempuyangan","routes":["2B","4A","10"]},{"raw":"Stasiun Yogyakarta","display":"Stasiun Yogyakarta","routes":["1B","3B","8","L1"]},{"raw":"STIE Kerjasama","display":"STIE Kerjasama","routes":["2A","4B"]},{"raw":"STIE YKPN - A","display":"STIE YKPN (Barat Jalan)","routes":["5A"]},{"raw":"STIE YKPN - B","display":"STIE YKPN (Timur Jalan)","routes":["5B"]},{"raw":"Stikes Guna Bangsa","display":"Stikes Guna Bangsa","routes":["3B","5B"]},{"raw":"STSRD Visi Tamansiswa","display":"STSRD Visi Tamansiswa","routes":["4B"]},{"raw":"Superindo Jakal - A","display":"Superindo Jakal (Barat Jalan)","routes":["12"]},{"raw":"Superindo Jakal - B","display":"Superindo Jakal (Timur Jalan)","routes":["12"]},{"raw":"Superindo Urip Sumoharjo","display":"Superindo Urip Sumoharjo","routes":["1A","4B","5B"]},{"raw":"Suryodiningratan - A","display":"Suryodiningratan (Barat Jalan)","routes":["11"]},{"raw":"Suryodiningratan - B","display":"Suryodiningratan (Timur Jalan)","routes":["11"]},{"raw":"Suryotomo","display":"Suryotomo","routes":["1A","1B","6","10","15"]},{"raw":"Susteran Novisiat","display":"Susteran Novisiat","routes":["2B","4A","12"]},{"raw":"Taman Makam Pahlawan - A","display":"Taman Makam Pahlawan (Utara Jalan)","routes":["1B"]},{"raw":"Taman Makam Pahlawan - B","display":"Taman Makam Pahlawan (Selatan Jalan)","routes":["1B"]},{"raw":"Taman Pintar","display":"Taman Pintar","routes":["1A","1B","2A","6","10","15"]},{"raw":"Tamansari","display":"Tamansari","routes":["3A","9","11","15"]},{"raw":"Tamantirto - A","display":"Tamantirto (Barat Jalan)","routes":["6"]},{"raw":"Tamantirto - B","display":"Tamantirto (Timur Jalan)","routes":["6"]},{"raw":"Tarumartani - A","display":"Tarumartani (Utara Jalan)","routes":["10"]},{"raw":"Tarumartani - B","display":"Tarumartani (Selatan Jalan)","routes":["10"]},{"raw":"Tegal Gendu - A","display":"Tegal Gendu (Utara Jalan)","routes":["3A"]},{"raw":"Tegal Gendu - B","display":"Tegal Gendu (Selatan Jalan)","routes":["3B"]},{"raw":"Tegal Turi - A","display":"Tegal Turi (Utara Jalan)","routes":["3A"]},{"raw":"Tegal Turi - B","display":"Tegal Turi (Selatan Jalan)","routes":["3B"]},{"raw":"Tejokusuman","display":"Tejokusuman","routes":["3B","6","9","10","11","15"]},{"raw":"Teknik UGM - A","display":"Teknik UGM (Selatan Jalan)","routes":["5A"]},{"raw":"Teknik UGM - B","display":"Teknik UGM (Utara Jalan)","routes":["5B"]},{"raw":"Teras 2","display":"Teras 2","routes":["1A","1B","6","10","15"]},{"raw":"Terminal Condongcatur","display":"Condongcatur","routes":["2A","2B","3A","3B","4A","4B","5A","5B","12"]},{"raw":"Terminal Giwangan","display":"Giwangan","routes":["3A","3B","4A","4B","9","11"]},{"raw":"Terminal Jombor","display":"Jombor","routes":["2A","2B","5A","5B","8","9","L1"]},{"raw":"Terminal Pakem","display":"Pakem","routes":["12","14","SiBulan 2"]},{"raw":"Terminal Palbapang","display":"Palbapang","routes":["15"]},{"raw":"Terminal Prambanan","display":"Prambanan","routes":["1A"]},{"raw":"Timoho - A","display":"Timoho (Timur Jalan)","routes":["4A","10"]},{"raw":"Timoho - B","display":"Timoho (Barat Jalan)","routes":["4B","10"]},{"raw":"Timur Jembatan Yapah - A","display":"Timur Jembatan Yapah (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Timur Jembatan Yapah - B","display":"Timur Jembatan Yapah (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"TK BIAS","display":"TK BIAS","routes":["12"]},{"raw":"TNI AL - A","display":"TNI AL (Utara Jalan)","routes":["10"]},{"raw":"TNI AL - B","display":"TNI AL (Selatan Jalan)","routes":["10"]},{"raw":"Toko Saerah - A","display":"Toko Saerah (Utara Jalan)","routes":["13"]},{"raw":"Toko Saerah - B","display":"Toko Saerah (Selatan Jalan)","routes":["13"]},{"raw":"Transmart","display":"Transmart","routes":["1A","1B","3A","5B"]},{"raw":"Tugu Adipura","display":"Tugu Adipura","routes":["15"]},{"raw":"Tugu Batas Desa Yapah - A","display":"Tugu Batas Desa Yapah (Selatan Jalan)","routes":["14","SiBulan 2"]},{"raw":"Tugu Batas Desa Yapah - B","display":"Tugu Batas Desa Yapah (Utara Jalan)","routes":["14","SiBulan 2"]},{"raw":"TVRI - A","display":"TVRI","routes":["5A","9","L1"]},{"raw":"TVRI- B","display":"TVRI- B","routes":["5B","9","L1"]},{"raw":"UAD Jl. Pramuka","display":"UAD Jl. Pramuka","routes":["4A","4B"]},{"raw":"UAD Ring Road Selatan - A","display":"UAD Ring Road Selatan (Selatan Jalan)","routes":["9","11"]},{"raw":"UAD Ring Road Selatan - B","display":"UAD Ring Road Selatan (Utara Jalan)","routes":["9","11"]},{"raw":"UII (Barat Jalan)","display":"UII (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"UII (Timur Jalan)","display":"UII (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"UIN Sunan Kalijaga - A","display":"UIN Sunan Kalijaga (Barat Jalan)","routes":["4A"]},{"raw":"UIN Sunan Kalijaga - B","display":"UIN Sunan Kalijaga (Timur Jalan)","routes":["4B"]},{"raw":"UKDW","display":"UKDW","routes":["2A","4A"]},{"raw":"UMY - A","display":"UMY (Barat Jalan)","routes":["6"]},{"raw":"UMY - B","display":"UMY (Timur Jalan)","routes":["6"]},{"raw":"Universitas Aisyiyah","display":"Universitas Aisyiyah","routes":["8"]},{"raw":"Universitas Alma Ata","display":"Universitas Alma Ata","routes":["6"]},{"raw":"Universitas BSI - A","display":"Universitas BSI (Barat Jalan)","routes":["6"]},{"raw":"Universitas BSI - B","display":"Universitas BSI (Timur Jalan)","routes":["6"]},{"raw":"UNRIYO - A","display":"UNRIYO (Barat Jalan)","routes":["14","SiBulan 2"]},{"raw":"UNRIYO - B","display":"UNRIYO (Timur Jalan)","routes":["14","SiBulan 2"]},{"raw":"UNU","display":"UNU","routes":["3A"]},{"raw":"UNY Colombo","display":"UNY Colombo","routes":["2A","12"]},{"raw":"UPN Veteran","display":"UPN Veteran","routes":["3A","5A"]},{"raw":"UTY Glagahsari - A","display":"UTY Glagahsari (Timur Jalan)","routes":["4A"]},{"raw":"UTY Glagahsari - B","display":"UTY Glagahsari (Barat Jalan)","routes":["4B"]},{"raw":"UTY Ring Road Utara - A","display":"UTY Ring Road Utara (Selatan Jalan)","routes":["8"]},{"raw":"UTY Ring Road Utara - B","display":"UTY Ring Road Utara (Utara Jalan)","routes":["8"]},{"raw":"Veteran","display":"Veteran","routes":["2B"]},{"raw":"Vokasi UGM","display":"Vokasi UGM","routes":["3B","4A","12"]},{"raw":"Wedangan Kampoeng - A","display":"Wedangan Kampoeng (Barat Jalan)","routes":["12"]},{"raw":"Wedangan Kampoeng - B","display":"Wedangan Kampoeng (Timur Jalan)","routes":["12"]},{"raw":"Westlake - A","display":"Westlake (Timur Jalan)","routes":["8"]},{"raw":"Westlake - B","display":"Westlake (Barat Jalan)","routes":["8"]},{"raw":"Widya Wiwaha - A","display":"Widya Wiwaha (Timur Jalan)","routes":["3A"]},{"raw":"Widya Wiwaha - B","display":"Widya Wiwaha (Barat Jalan)","routes":["3B"]},{"raw":"Wirosaban","display":"Wirosaban","routes":["3A"]},{"raw":"Wojo (Randubelang) - A","display":"Wojo (Randubelang) (Barat Jalan)","routes":["11"]},{"raw":"Wojo (Randubelang) - B","display":"Wojo (Randubelang) (Timur Jalan)","routes":["11"]},{"raw":"Wonocatur","display":"Wonocatur","routes":["1B","3B"]},{"raw":"XT Square","display":"XT Square","routes":["2B","4A"]},{"raw":"YAKKUM - A","display":"YAKKUM (Barat Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"YAKKUM - B","display":"YAKKUM (Timur Jalan)","routes":["12","14","SiBulan 2"]},{"raw":"Pasar Godean","display":"Pasar Godean","routes":["SiBulan 1"]},{"raw":"Kantor Dishub Sleman","display":"Kantor Dishub Sleman","routes":["SiBulan 1"]},{"raw":"GSP","display":"GSP","routes":["Transgama 1","Transgama 2","Transgama 3"]},{"raw":"Perpustakaan","display":"Perpustakaan","routes":["Transgama 1"]},{"raw":"Fakultas Kehutanan","display":"Fakultas Kehutanan","routes":["Transgama 1"]},{"raw":"Fakultas Pertanian","display":"Fakultas Pertanian","routes":["Transgama 1"]},{"raw":"Fakultas Peternakan","display":"Fakultas Peternakan","routes":["Transgama 1"]},{"raw":"Wisdom Park","display":"Wisdom Park","routes":["Transgama 1"]},{"raw":"Fakultas Ilmu Budaya","display":"Fakultas Ilmu Budaya","routes":["Transgama 1"]},{"raw":"University Club","display":"University Club","routes":["Transgama 1"]},{"raw":"Jalan Medika","display":"Jalan Medika","routes":["Transgama 2","Transgama 3"]},{"raw":"Fakultas Teknik","display":"Fakultas Teknik","routes":["Transgama 2"]},{"raw":"Fakultas Biologi","display":"Fakultas Biologi","routes":["Transgama 2"]},{"raw":"Fakultas MIPA","display":"Fakultas MIPA","routes":["Transgama 2"]},{"raw":"Fasilitas Kerohanian","display":"Fasilitas Kerohanian","routes":["Transgama 3"]},{"raw":"TILC","display":"TILC","routes":["Transgama 3"]},{"raw":"Jalan Kemuning","display":"Jalan Kemuning","routes":["Transgama 3"]}];

// Hanya rute agency Trans Jogja (SiBulan & Transgama disembunyikan dari pencarian rute)
const TJ_ROUTES = ["1A","1B","2A","2B","3A","3B","4A","4B","5A","5B","6","8","9","10","11","12","13","14","15","L1"];

const TJ_ROUTE_META = {"6":{"title":"Gamping - Malioboro","color":"#5A413A"},"8":{"title":"Jombor - Ngabean","color":"#005CA5"},"9":{"title":"Giwangan - Jombor","color":"#42B6B5"},"10":{"title":"Gamping - Kusumanegara","color":"#F7C331"},"11":{"title":"Giwangan - Cik Di Tiro","color":"#c1d01b"},"12":{"title":"Condongcatur - Pakem","color":"#A54E01"},"13":{"title":"Stadion TGP - Malioboro","color":"#D63384"},"14":{"title":"Adisutjipto - Pakem","color":"#467800"},"15":{"title":"Palbapang - Malioboro","color":"#6F42C1"},"1A":{"title":"Prambanan - Malioboro","color":"#E73D4A"},"1B":{"title":"Adisutjipto - Ngabean","color":"#F7A2A5"},"2A":{"title":"Condongcatur - XT Square","color":"#1a94da"},"2B":{"title":"Condongcatur - XT Square","color":"#9CCEEF"},"3A":{"title":"Giwangan - Condongcatur","color":"#e46c00"},"3B":{"title":"Giwangan - Condongcatur","color":"#FFAE64"},"4A":{"title":"Giwangan - Condongcatur","color":"#63A90A"},"4B":{"title":"Giwangan - Condongcatur","color":"#BDD8A5"},"5A":{"title":"Jombor - Janti","color":"#733B9C"},"5B":{"title":"Jombor - Adisutjipto","color":"#17A398"},"L1":{"title":"Jombor - Malioboro","color":"#495057"}};

const MODE_ICON = { "Jalan kaki": Footprints, "Ojek online": Bike, "Motor": Car, "Diantar": Car, "Sepeda": Bike };

function routeBadgesFor(stopDisplay) {
  const s = STOPS.find(x => x.display === stopDisplay);
  return s ? s.routes : [];
}

function availableRoutesForStop(stopDisplay) {
  // hanya rute agency Trans Jogja yang dilewati halte ini
  return routeBadgesFor(stopDisplay).filter(r => RUTE.includes(r));
}

function stopsForRoute(routeId) {
  return STOPS.filter(s => s.routes.includes(routeId)).map(s => s.display);
}

const HALTE = [...new Set(STOPS.map(s => s.display))].sort();
const RUTE = TJ_ROUTES;

// ---- data wilayah administratif DIY (kelurahan → kecamatan → kabupaten/kota) --
// Sumber: Kepmendagri No 300.2.2-2430 Tahun 2025, via cahyadsn/wilayah
const WILAYAH = [{"display":"Ambarketawang (Gamping)","kelurahan":"Ambarketawang","kecamatan":"Gamping","kabupaten":"Kabupaten Sleman"},{"display":"Argodadi (Sedayu)","kelurahan":"Argodadi","kecamatan":"Sedayu","kabupaten":"Kabupaten Bantul"},{"display":"Argomulyo (Cangkringan)","kelurahan":"Argomulyo","kecamatan":"Cangkringan","kabupaten":"Kabupaten Sleman"},{"display":"Argomulyo (Sedayu)","kelurahan":"Argomulyo","kecamatan":"Sedayu","kabupaten":"Kabupaten Bantul"},{"display":"Argorejo (Sedayu)","kelurahan":"Argorejo","kecamatan":"Sedayu","kabupaten":"Kabupaten Bantul"},{"display":"Argosari (Sedayu)","kelurahan":"Argosari","kecamatan":"Sedayu","kabupaten":"Kabupaten Bantul"},{"display":"Baciro (Gondokusuman)","kelurahan":"Baciro","kecamatan":"Gondokusuman","kabupaten":"Kota Yogyakarta"},{"display":"Balecatur (Gamping)","kelurahan":"Balecatur","kecamatan":"Gamping","kabupaten":"Kabupaten Sleman"},{"display":"Baleharjo (Wonosari)","kelurahan":"Baleharjo","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Balong (Girisubo)","kelurahan":"Balong","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Banaran (Galur)","kelurahan":"Banaran","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banaran (Playen)","kelurahan":"Banaran","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bandung (Playen)","kelurahan":"Bandung","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Banguncipto (Sentolo)","kelurahan":"Banguncipto","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bangunharjo (Sewon)","kelurahan":"Bangunharjo","kecamatan":"Sewon","kabupaten":"Kabupaten Bantul"},{"display":"Bangunjiwo (Kasihan)","kelurahan":"Bangunjiwo","kecamatan":"Kasihan","kabupaten":"Kabupaten Bantul"},{"display":"Bangunkerto (Turi)","kelurahan":"Bangunkerto","kecamatan":"Turi","kabupaten":"Kabupaten Sleman"},{"display":"Banguntapan (Banguntapan)","kelurahan":"Banguntapan","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Banjararum (Kalibawang)","kelurahan":"Banjararum","kecamatan":"Kalibawang","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banjarasri (Kalibawang)","kelurahan":"Banjarasri","kecamatan":"Kalibawang","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banjarejo (Tanjungsari)","kelurahan":"Banjarejo","kecamatan":"Tanjungsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Banjarharjo (Kalibawang)","kelurahan":"Banjarharjo","kecamatan":"Kalibawang","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banjaroyo (Kalibawang)","kelurahan":"Banjaroyo","kecamatan":"Kalibawang","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banjarsari (Samigaluh)","kelurahan":"Banjarsari","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bantul (Bantul)","kelurahan":"Bantul","kecamatan":"Bantul","kabupaten":"Kabupaten Bantul"},{"display":"Banyuraden (Gamping)","kelurahan":"Banyuraden","kecamatan":"Gamping","kabupaten":"Kabupaten Sleman"},{"display":"Banyurejo (Tempel)","kelurahan":"Banyurejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Banyuroto (Nanggulan)","kelurahan":"Banyuroto","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Banyusoco (Playen)","kelurahan":"Banyusoco","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Baturetno (Banguntapan)","kelurahan":"Baturetno","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Bausasran (Danurejan)","kelurahan":"Bausasran","kecamatan":"Danurejan","kabupaten":"Kota Yogyakarta"},{"display":"Bawuran (Pleret)","kelurahan":"Bawuran","kecamatan":"Pleret","kabupaten":"Kabupaten Bantul"},{"display":"Bedoyo (Ponjong)","kelurahan":"Bedoyo","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Beji (Ngawen)","kelurahan":"Beji","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Beji (Patuk)","kelurahan":"Beji","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bejiharjo (Karangmojo)","kelurahan":"Bejiharjo","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bendung (Semin)","kelurahan":"Bendung","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bendungan (Karangmojo)","kelurahan":"Bendungan","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bendungan (Wates)","kelurahan":"Bendungan","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bener (Tegalrejo)","kelurahan":"Bener","kecamatan":"Tegalrejo","kabupaten":"Kota Yogyakarta"},{"display":"Bimomartani (Ngemplak)","kelurahan":"Bimomartani","kecamatan":"Ngemplak","kabupaten":"Kabupaten Sleman"},{"display":"Bleberan (Playen)","kelurahan":"Bleberan","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bohol (Rongkop)","kelurahan":"Bohol","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bojong (Panjatan)","kelurahan":"Bojong","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bokoharjo (Prambanan)","kelurahan":"Bokoharjo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Botodayaan (Rongkop)","kelurahan":"Botodayaan","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Brontokusuman (Mergangsan)","kelurahan":"Brontokusuman","kecamatan":"Mergangsan","kabupaten":"Kota Yogyakarta"},{"display":"Brosot (Galur)","kelurahan":"Brosot","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bugel (Panjatan)","kelurahan":"Bugel","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bulurejo (Semin)","kelurahan":"Bulurejo","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Bumijo (Jetis)","kelurahan":"Bumijo","kecamatan":"Jetis","kabupaten":"Kota Yogyakarta"},{"display":"Bumirejo (Lendah)","kelurahan":"Bumirejo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Bunder (Patuk)","kelurahan":"Bunder","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Canden (Jetis)","kelurahan":"Canden","kecamatan":"Jetis","kabupaten":"Kabupaten Bantul"},{"display":"Candibinangun (Pakem)","kelurahan":"Candibinangun","kecamatan":"Pakem","kabupaten":"Kabupaten Sleman"},{"display":"Candirejo (Semanu)","kelurahan":"Candirejo","kecamatan":"Semanu","kabupaten":"Kabupaten Gunungkidul"},{"display":"Candirejo (Semin)","kelurahan":"Candirejo","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Caturharjo (Pandak)","kelurahan":"Caturharjo","kecamatan":"Pandak","kabupaten":"Kabupaten Bantul"},{"display":"Caturharjo (Sleman)","kelurahan":"Caturharjo","kecamatan":"Sleman","kabupaten":"Kabupaten Sleman"},{"display":"Caturtunggal (Depok)","kelurahan":"Caturtunggal","kecamatan":"Depok","kabupaten":"Kabupaten Sleman"},{"display":"Cerme (Panjatan)","kelurahan":"Cerme","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Cokrodiningratan (Jetis)","kelurahan":"Cokrodiningratan","kecamatan":"Jetis","kabupaten":"Kota Yogyakarta"},{"display":"Condongcatur (Depok)","kelurahan":"Condongcatur","kecamatan":"Depok","kabupaten":"Kabupaten Sleman"},{"display":"Dadapayu (Semanu)","kelurahan":"Dadapayu","kecamatan":"Semanu","kabupaten":"Kabupaten Gunungkidul"},{"display":"Demangan (Gondokusuman)","kelurahan":"Demangan","kecamatan":"Gondokusuman","kabupaten":"Kota Yogyakarta"},{"display":"Demangrejo (Sentolo)","kelurahan":"Demangrejo","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Demen (Temon)","kelurahan":"Demen","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Dengok (Playen)","kelurahan":"Dengok","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Depok (Panjatan)","kelurahan":"Depok","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Dlingo (Dlingo)","kelurahan":"Dlingo","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Donoharjo (Ngaglik)","kelurahan":"Donoharjo","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Donokerto (Turi)","kelurahan":"Donokerto","kecamatan":"Turi","kabupaten":"Kabupaten Sleman"},{"display":"Donomulyo (Nanggulan)","kelurahan":"Donomulyo","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Donotirto (Kretek)","kelurahan":"Donotirto","kecamatan":"Kretek","kabupaten":"Kabupaten Bantul"},{"display":"Duwet (Wonosari)","kelurahan":"Duwet","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gading (Playen)","kelurahan":"Gading","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gadingharjo (Sanden)","kelurahan":"Gadingharjo","kecamatan":"Sanden","kabupaten":"Kabupaten Bantul"},{"display":"Gadingsari (Sanden)","kelurahan":"Gadingsari","kecamatan":"Sanden","kabupaten":"Kabupaten Bantul"},{"display":"Gari (Wonosari)","kelurahan":"Gari","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Garongan (Panjatan)","kelurahan":"Garongan","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Gayamharjo (Prambanan)","kelurahan":"Gayamharjo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Gedangrejo (Karangmojo)","kelurahan":"Gedangrejo","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gedongkiwo (Mantrijeron)","kelurahan":"Gedongkiwo","kecamatan":"Mantrijeron","kabupaten":"Kota Yogyakarta"},{"display":"Genjahan (Ponjong)","kelurahan":"Genjahan","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gerbosari (Samigaluh)","kelurahan":"Gerbosari","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Getas (Playen)","kelurahan":"Getas","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gilangharjo (Pandak)","kelurahan":"Gilangharjo","kecamatan":"Pandak","kabupaten":"Kabupaten Bantul"},{"display":"Giriasih (Purwosari)","kelurahan":"Giriasih","kecamatan":"Purwosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giricahyo (Purwosari)","kelurahan":"Giricahyo","kecamatan":"Purwosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giriharjo (Panggang)","kelurahan":"Giriharjo","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Girijati (Purwosari)","kelurahan":"Girijati","kecamatan":"Purwosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Girikarto (Panggang)","kelurahan":"Girikarto","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Girikerto (Turi)","kelurahan":"Girikerto","kecamatan":"Turi","kabupaten":"Kabupaten Sleman"},{"display":"Girimulyo (Panggang)","kelurahan":"Girimulyo","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giring (Paliyan)","kelurahan":"Giring","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giripanggung (Tepus)","kelurahan":"Giripanggung","kecamatan":"Tepus","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giripeni (Wates)","kelurahan":"Giripeni","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Giripurwo (Girimulyo)","kelurahan":"Giripurwo","kecamatan":"Girimulyo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Giripurwo (Purwosari)","kelurahan":"Giripurwo","kecamatan":"Purwosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Girirejo (Imogiri)","kelurahan":"Girirejo","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Girisekar (Panggang)","kelurahan":"Girisekar","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Girisuko (Panggang)","kelurahan":"Girisuko","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giritirto (Purwosari)","kelurahan":"Giritirto","kecamatan":"Purwosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giriwungu (Panggang)","kelurahan":"Giriwungu","kecamatan":"Panggang","kabupaten":"Kabupaten Gunungkidul"},{"display":"Giwangan (Umbulharjo)","kelurahan":"Giwangan","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Glagah (Temon)","kelurahan":"Glagah","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Glagaharjo (Cangkringan)","kelurahan":"Glagaharjo","kecamatan":"Cangkringan","kabupaten":"Kabupaten Sleman"},{"display":"Gombang (Ponjong)","kelurahan":"Gombang","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gotakan (Panjatan)","kelurahan":"Gotakan","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Gowongan (Jetis)","kelurahan":"Gowongan","kecamatan":"Jetis","kabupaten":"Kota Yogyakarta"},{"display":"Grogol (Paliyan)","kelurahan":"Grogol","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Gulurejo (Lendah)","kelurahan":"Gulurejo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Gunungketur (Pakualaman)","kelurahan":"Gunungketur","kecamatan":"Pakualaman","kabupaten":"Kota Yogyakarta"},{"display":"Guwosari (Pajangan)","kelurahan":"Guwosari","kecamatan":"Pajangan","kabupaten":"Kabupaten Bantul"},{"display":"Hargobinangun (Pakem)","kelurahan":"Hargobinangun","kecamatan":"Pakem","kabupaten":"Kabupaten Sleman"},{"display":"Hargomulyo (Gedangsari)","kelurahan":"Hargomulyo","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Hargomulyo (Kokap)","kelurahan":"Hargomulyo","kecamatan":"Kokap","kabupaten":"Kabupaten Kulon Progo"},{"display":"Hargorejo (Kokap)","kelurahan":"Hargorejo","kecamatan":"Kokap","kabupaten":"Kabupaten Kulon Progo"},{"display":"Hargosari (Tanjungsari)","kelurahan":"Hargosari","kecamatan":"Tanjungsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Hargotirto (Kokap)","kelurahan":"Hargotirto","kecamatan":"Kokap","kabupaten":"Kabupaten Kulon Progo"},{"display":"Hargowilis (Kokap)","kelurahan":"Hargowilis","kecamatan":"Kokap","kabupaten":"Kabupaten Kulon Progo"},{"display":"Harjobinangun (Pakem)","kelurahan":"Harjobinangun","kecamatan":"Pakem","kabupaten":"Kabupaten Sleman"},{"display":"Imogiri (Imogiri)","kelurahan":"Imogiri","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Jagalan (Banguntapan)","kelurahan":"Jagalan","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Jambidan (Banguntapan)","kelurahan":"Jambidan","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Jangkaran (Temon)","kelurahan":"Jangkaran","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Janten (Temon)","kelurahan":"Janten","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Jatiayu (Karangmojo)","kelurahan":"Jatiayu","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Jatimulyo (Dlingo)","kelurahan":"Jatimulyo","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Jatimulyo (Girimulyo)","kelurahan":"Jatimulyo","kecamatan":"Girimulyo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Jatirejo (Lendah)","kelurahan":"Jatirejo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Jatisarono (Nanggulan)","kelurahan":"Jatisarono","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Jepitu (Girisubo)","kelurahan":"Jepitu","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Jerukwudel (Girisubo)","kelurahan":"Jerukwudel","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Jetis (Saptosari)","kelurahan":"Jetis","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Jogotirto (Berbah)","kelurahan":"Jogotirto","kecamatan":"Berbah","kabupaten":"Kabupaten Sleman"},{"display":"Jurangjero (Ngawen)","kelurahan":"Jurangjero","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kadipaten (Kraton)","kelurahan":"Kadipaten","kecamatan":"Kraton","kabupaten":"Kota Yogyakarta"},{"display":"Kaliagung (Sentolo)","kelurahan":"Kaliagung","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kalidengen (Temon)","kelurahan":"Kalidengen","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kaligintung (Temon)","kelurahan":"Kaligintung","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kalirejo (Kokap)","kelurahan":"Kalirejo","kecamatan":"Kokap","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kalitekuk (Semin)","kelurahan":"Kalitekuk","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kalitirto (Berbah)","kelurahan":"Kalitirto","kecamatan":"Berbah","kabupaten":"Kabupaten Sleman"},{"display":"Kampung (Ngawen)","kelurahan":"Kampung","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kanigoro (Saptosari)","kelurahan":"Kanigoro","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kanoman (Panjatan)","kelurahan":"Kanoman","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Karangasem (Paliyan)","kelurahan":"Karangasem","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangasem (Ponjong)","kelurahan":"Karangasem","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangawen (Girisubo)","kelurahan":"Karangawen","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangduwet (Paliyan)","kelurahan":"Karangduwet","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangmojo (Karangmojo)","kelurahan":"Karangmojo","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangrejek (Wonosari)","kelurahan":"Karangrejek","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangsari (Pengasih)","kelurahan":"Karangsari","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Karangsari (Semin)","kelurahan":"Karangsari","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangsewu (Galur)","kelurahan":"Karangsewu","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Karangtalun (Imogiri)","kelurahan":"Karangtalun","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Karangtengah (Imogiri)","kelurahan":"Karangtengah","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Karangtengah (Wonosari)","kelurahan":"Karangtengah","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangwaru (Tegalrejo)","kelurahan":"Karangwaru","kecamatan":"Tegalrejo","kabupaten":"Kota Yogyakarta"},{"display":"Karangwuluh (Temon)","kelurahan":"Karangwuluh","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Karangwuni (Rongkop)","kelurahan":"Karangwuni","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Karangwuni (Wates)","kelurahan":"Karangwuni","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Katongan (Nglipar)","kelurahan":"Katongan","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kebonagung (Imogiri)","kelurahan":"Kebonagung","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Kebonharjo (Samigaluh)","kelurahan":"Kebonharjo","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kebonrejo (Temon)","kelurahan":"Kebonrejo","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kedundang (Temon)","kelurahan":"Kedundang","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kedungkeris (Nglipar)","kelurahan":"Kedungkeris","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kedungpoh (Nglipar)","kelurahan":"Kedungpoh","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kedungsari (Pengasih)","kelurahan":"Kedungsari","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kelor (Karangmojo)","kelurahan":"Kelor","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kemadang (Tanjungsari)","kelurahan":"Kemadang","kecamatan":"Tanjungsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kembang (Nanggulan)","kelurahan":"Kembang","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kemejing (Semin)","kelurahan":"Kemejing","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kemiri (Tanjungsari)","kelurahan":"Kemiri","kecamatan":"Tanjungsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kenteng (Ponjong)","kelurahan":"Kenteng","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Keparakan (Mergangsan)","kelurahan":"Keparakan","kecamatan":"Mergangsan","kabupaten":"Kota Yogyakarta"},{"display":"Kepek (Saptosari)","kelurahan":"Kepek","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kepek (Wonosari)","kelurahan":"Kepek","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kepuharjo (Cangkringan)","kelurahan":"Kepuharjo","kecamatan":"Cangkringan","kabupaten":"Kabupaten Sleman"},{"display":"Klitren (Gondokusuman)","kelurahan":"Klitren","kecamatan":"Gondokusuman","kabupaten":"Kota Yogyakarta"},{"display":"Kotabaru (Gondokusuman)","kelurahan":"Kotabaru","kecamatan":"Gondokusuman","kabupaten":"Kota Yogyakarta"},{"display":"Krambilsawit (Saptosari)","kelurahan":"Krambilsawit","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Kranggan (Galur)","kelurahan":"Kranggan","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Krembangan (Panjatan)","kelurahan":"Krembangan","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kricak (Tegalrejo)","kelurahan":"Kricak","kecamatan":"Tegalrejo","kabupaten":"Kota Yogyakarta"},{"display":"Kulur (Temon)","kelurahan":"Kulur","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Kulwaru (Wates)","kelurahan":"Kulwaru","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Logandeng (Playen)","kelurahan":"Logandeng","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Lumbungrejo (Tempel)","kelurahan":"Lumbungrejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Madurejo (Prambanan)","kelurahan":"Madurejo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Maguwoharjo (Depok)","kelurahan":"Maguwoharjo","kecamatan":"Depok","kabupaten":"Kabupaten Sleman"},{"display":"Mangunan (Dlingo)","kelurahan":"Mangunan","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Mantrijeron (Mantrijeron)","kelurahan":"Mantrijeron","kecamatan":"Mantrijeron","kabupaten":"Kota Yogyakarta"},{"display":"Margoagung (Seyegan)","kelurahan":"Margoagung","kecamatan":"Seyegan","kabupaten":"Kabupaten Sleman"},{"display":"Margodadi (Seyegan)","kelurahan":"Margodadi","kecamatan":"Seyegan","kabupaten":"Kabupaten Sleman"},{"display":"Margokaton (Seyegan)","kelurahan":"Margokaton","kecamatan":"Seyegan","kabupaten":"Kabupaten Sleman"},{"display":"Margoluwih (Seyegan)","kelurahan":"Margoluwih","kecamatan":"Seyegan","kabupaten":"Kabupaten Sleman"},{"display":"Margomulyo (Seyegan)","kelurahan":"Margomulyo","kecamatan":"Seyegan","kabupaten":"Kabupaten Sleman"},{"display":"Margorejo (Tempel)","kelurahan":"Margorejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Margosari (Pengasih)","kelurahan":"Margosari","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Melikan (Rongkop)","kelurahan":"Melikan","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Merdikorejo (Tempel)","kelurahan":"Merdikorejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Mertelu (Gedangsari)","kelurahan":"Mertelu","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Minomartani (Ngaglik)","kelurahan":"Minomartani","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Monggol (Saptosari)","kelurahan":"Monggol","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Mororejo (Tempel)","kelurahan":"Mororejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Muja Muju (Umbulharjo)","kelurahan":"Muja Muju","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Mulo (Wonosari)","kelurahan":"Mulo","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Mulusan (Paliyan)","kelurahan":"Mulusan","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Mulyodadi (Bambanglipuro)","kelurahan":"Mulyodadi","kecamatan":"Bambanglipuro","kabupaten":"Kabupaten Bantul"},{"display":"Muntuk (Dlingo)","kelurahan":"Muntuk","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Murtigading (Sanden)","kelurahan":"Murtigading","kecamatan":"Sanden","kabupaten":"Kabupaten Bantul"},{"display":"Natah (Nglipar)","kelurahan":"Natah","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngalang (Gedangsari)","kelurahan":"Ngalang","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngampilan (Ngampilan)","kelurahan":"Ngampilan","kecamatan":"Ngampilan","kabupaten":"Kota Yogyakarta"},{"display":"Ngargosari (Samigaluh)","kelurahan":"Ngargosari","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Ngawis (Karangmojo)","kelurahan":"Ngawis","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngawu (Playen)","kelurahan":"Ngawu","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngentakrejo (Lendah)","kelurahan":"Ngentakrejo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Ngeposari (Semanu)","kelurahan":"Ngeposari","kecamatan":"Semanu","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngestiharjo (Kasihan)","kelurahan":"Ngestiharjo","kecamatan":"Kasihan","kabupaten":"Kabupaten Bantul"},{"display":"Ngestiharjo (Wates)","kelurahan":"Ngestiharjo","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Ngestirejo (Tanjungsari)","kelurahan":"Ngestirejo","kecamatan":"Tanjungsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngipak (Karangmojo)","kelurahan":"Ngipak","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Nglanggeran (Patuk)","kelurahan":"Nglanggeran","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Nglegi (Patuk)","kelurahan":"Nglegi","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngleri (Playen)","kelurahan":"Ngleri","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Nglindur (Girisubo)","kelurahan":"Nglindur","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Nglipar (Nglipar)","kelurahan":"Nglipar","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngloro (Saptosari)","kelurahan":"Ngloro","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngoro-oro (Patuk)","kelurahan":"Ngoro-oro","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngunut (Playen)","kelurahan":"Ngunut","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Ngupasan (Gondomanan)","kelurahan":"Ngupasan","kecamatan":"Gondomanan","kabupaten":"Kota Yogyakarta"},{"display":"Nogotirto (Gamping)","kelurahan":"Nogotirto","kecamatan":"Gamping","kabupaten":"Kabupaten Sleman"},{"display":"Nomporejo (Galur)","kelurahan":"Nomporejo","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Notoprajan (Ngampilan)","kelurahan":"Notoprajan","kecamatan":"Ngampilan","kabupaten":"Kota Yogyakarta"},{"display":"Pacarejo (Semanu)","kelurahan":"Pacarejo","kecamatan":"Semanu","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pagerharjo (Samigaluh)","kelurahan":"Pagerharjo","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pakembinangun (Pakem)","kelurahan":"Pakembinangun","kecamatan":"Pakem","kabupaten":"Kabupaten Sleman"},{"display":"Pakuncen (Wirobrajan)","kelurahan":"Pakuncen","kecamatan":"Wirobrajan","kabupaten":"Kota Yogyakarta"},{"display":"Palbapang (Bantul)","kelurahan":"Palbapang","kecamatan":"Bantul","kabupaten":"Kabupaten Bantul"},{"display":"Palihan (Temon)","kelurahan":"Palihan","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pampang (Paliyan)","kelurahan":"Pampang","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pandeyan (Umbulharjo)","kelurahan":"Pandeyan","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Pandowan (Galur)","kelurahan":"Pandowan","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pandowoharjo (Sleman)","kelurahan":"Pandowoharjo","kecamatan":"Sleman","kabupaten":"Kabupaten Sleman"},{"display":"Panembahan (Kraton)","kelurahan":"Panembahan","kecamatan":"Kraton","kabupaten":"Kota Yogyakarta"},{"display":"Panggungharjo (Sewon)","kelurahan":"Panggungharjo","kecamatan":"Sewon","kabupaten":"Kabupaten Bantul"},{"display":"Panjangrejo (Pundong)","kelurahan":"Panjangrejo","kecamatan":"Pundong","kabupaten":"Kabupaten Bantul"},{"display":"Panjatan (Panjatan)","kelurahan":"Panjatan","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Parangtritis (Kretek)","kelurahan":"Parangtritis","kecamatan":"Kretek","kabupaten":"Kabupaten Bantul"},{"display":"Patalan (Jetis)","kelurahan":"Patalan","kecamatan":"Jetis","kabupaten":"Kabupaten Bantul"},{"display":"Patangpuluhan (Wirobrajan)","kelurahan":"Patangpuluhan","kecamatan":"Wirobrajan","kabupaten":"Kota Yogyakarta"},{"display":"Patehan (Kraton)","kelurahan":"Patehan","kecamatan":"Kraton","kabupaten":"Kota Yogyakarta"},{"display":"Patuk (Patuk)","kelurahan":"Patuk","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pendowoharjo (Sewon)","kelurahan":"Pendowoharjo","kecamatan":"Sewon","kabupaten":"Kabupaten Bantul"},{"display":"Pendoworejo (Girimulyo)","kelurahan":"Pendoworejo","kecamatan":"Girimulyo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pengasih (Pengasih)","kelurahan":"Pengasih","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pengkok (Patuk)","kelurahan":"Pengkok","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pengkol (Nglipar)","kelurahan":"Pengkol","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Petir (Rongkop)","kelurahan":"Petir","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pilangrejo (Nglipar)","kelurahan":"Pilangrejo","kecamatan":"Nglipar","kabupaten":"Kabupaten Gunungkidul"},{"display":"Piyaman (Wonosari)","kelurahan":"Piyaman","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Planjan (Saptosari)","kelurahan":"Planjan","kecamatan":"Saptosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Playen (Playen)","kelurahan":"Playen","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Plembutan (Playen)","kelurahan":"Plembutan","kecamatan":"Playen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pleret (Panjatan)","kelurahan":"Pleret","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Pleret (Pleret)","kelurahan":"Pleret","kecamatan":"Pleret","kabupaten":"Kabupaten Bantul"},{"display":"Plumbon (Temon)","kelurahan":"Plumbon","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Poncosari (Srandakan)","kelurahan":"Poncosari","kecamatan":"Srandakan","kabupaten":"Kabupaten Bantul"},{"display":"Pondokrejo (Tempel)","kelurahan":"Pondokrejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Ponjong (Ponjong)","kelurahan":"Ponjong","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Potorono (Banguntapan)","kelurahan":"Potorono","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Prawirodirjan (Gondomanan)","kelurahan":"Prawirodirjan","kecamatan":"Gondomanan","kabupaten":"Kota Yogyakarta"},{"display":"Prenggan (Kotagede)","kelurahan":"Prenggan","kecamatan":"Kotagede","kabupaten":"Kota Yogyakarta"},{"display":"Pringgokusuman (Gedongtengen)","kelurahan":"Pringgokusuman","kecamatan":"Gedongtengen","kabupaten":"Kota Yogyakarta"},{"display":"Pringombo (Rongkop)","kelurahan":"Pringombo","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pucanganom (Rongkop)","kelurahan":"Pucanganom","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pucung (Girisubo)","kelurahan":"Pucung","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pulutan (Wonosari)","kelurahan":"Pulutan","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Pundungsari (Semin)","kelurahan":"Pundungsari","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Purbayan (Kotagede)","kelurahan":"Purbayan","kecamatan":"Kotagede","kabupaten":"Kota Yogyakarta"},{"display":"Purwobinangun (Pakem)","kelurahan":"Purwobinangun","kecamatan":"Pakem","kabupaten":"Kabupaten Sleman"},{"display":"Purwodadi (Tepus)","kelurahan":"Purwodadi","kecamatan":"Tepus","kabupaten":"Kabupaten Gunungkidul"},{"display":"Purwoharjo (Samigaluh)","kelurahan":"Purwoharjo","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Purwokinanti (Pakualaman)","kelurahan":"Purwokinanti","kecamatan":"Pakualaman","kabupaten":"Kota Yogyakarta"},{"display":"Purwomartani (Kalasan)","kelurahan":"Purwomartani","kecamatan":"Kalasan","kabupaten":"Kabupaten Sleman"},{"display":"Purwosari (Girimulyo)","kelurahan":"Purwosari","kecamatan":"Girimulyo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Putat (Patuk)","kelurahan":"Putat","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Rejosari (Semin)","kelurahan":"Rejosari","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Rejowinangun (Kotagede)","kelurahan":"Rejowinangun","kecamatan":"Kotagede","kabupaten":"Kota Yogyakarta"},{"display":"Ringinharjo (Bantul)","kelurahan":"Ringinharjo","kecamatan":"Bantul","kabupaten":"Kabupaten Bantul"},{"display":"Sabdodadi (Bantul)","kelurahan":"Sabdodadi","kecamatan":"Bantul","kabupaten":"Kabupaten Bantul"},{"display":"Salam (Patuk)","kelurahan":"Salam","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Salamrejo (Sentolo)","kelurahan":"Salamrejo","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sambirejo (Ngawen)","kelurahan":"Sambirejo","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sambirejo (Prambanan)","kelurahan":"Sambirejo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Sampang (Gedangsari)","kelurahan":"Sampang","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sardonoharjo (Ngaglik)","kelurahan":"Sardonoharjo","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Sariharjo (Ngaglik)","kelurahan":"Sariharjo","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Sawahan (Ponjong)","kelurahan":"Sawahan","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Segoroyoso (Pleret)","kelurahan":"Segoroyoso","kecamatan":"Pleret","kabupaten":"Kabupaten Bantul"},{"display":"Selang (Wonosari)","kelurahan":"Selang","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Seloharjo (Pundong)","kelurahan":"Seloharjo","kecamatan":"Pundong","kabupaten":"Kabupaten Bantul"},{"display":"Selomartani (Kalasan)","kelurahan":"Selomartani","kecamatan":"Kalasan","kabupaten":"Kabupaten Sleman"},{"display":"Selopamioro (Imogiri)","kelurahan":"Selopamioro","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Semaki (Umbulharjo)","kelurahan":"Semaki","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Semanu (Semanu)","kelurahan":"Semanu","kecamatan":"Semanu","kabupaten":"Kabupaten Gunungkidul"},{"display":"Semin (Semin)","kelurahan":"Semin","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Semoyo (Patuk)","kelurahan":"Semoyo","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Semugih (Rongkop)","kelurahan":"Semugih","kecamatan":"Rongkop","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sendangadi (Mlati)","kelurahan":"Sendangadi","kecamatan":"Mlati","kabupaten":"Kabupaten Sleman"},{"display":"Sendangagung (Minggir)","kelurahan":"Sendangagung","kecamatan":"Minggir","kabupaten":"Kabupaten Sleman"},{"display":"Sendangarum (Minggir)","kelurahan":"Sendangarum","kecamatan":"Minggir","kabupaten":"Kabupaten Sleman"},{"display":"Sendangmulyo (Minggir)","kelurahan":"Sendangmulyo","kecamatan":"Minggir","kabupaten":"Kabupaten Sleman"},{"display":"Sendangrejo (Minggir)","kelurahan":"Sendangrejo","kecamatan":"Minggir","kabupaten":"Kabupaten Sleman"},{"display":"Sendangsari (Minggir)","kelurahan":"Sendangsari","kecamatan":"Minggir","kabupaten":"Kabupaten Sleman"},{"display":"Sendangsari (Pajangan)","kelurahan":"Sendangsari","kecamatan":"Pajangan","kabupaten":"Kabupaten Bantul"},{"display":"Sendangsari (Pengasih)","kelurahan":"Sendangsari","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sendangtirto (Berbah)","kelurahan":"Sendangtirto","kecamatan":"Berbah","kabupaten":"Kabupaten Sleman"},{"display":"Sentolo (Sentolo)","kelurahan":"Sentolo","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Serut (Gedangsari)","kelurahan":"Serut","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sidoagung (Godean)","kelurahan":"Sidoagung","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidoarum (Godean)","kelurahan":"Sidoarum","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidoharjo (Samigaluh)","kelurahan":"Sidoharjo","kecamatan":"Samigaluh","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sidoharjo (Tepus)","kelurahan":"Sidoharjo","kecamatan":"Tepus","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sidokarto (Godean)","kelurahan":"Sidokarto","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidoluhur (Godean)","kelurahan":"Sidoluhur","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidomoyo (Godean)","kelurahan":"Sidomoyo","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidomulyo (Bambanglipuro)","kelurahan":"Sidomulyo","kecamatan":"Bambanglipuro","kabupaten":"Kabupaten Bantul"},{"display":"Sidomulyo (Godean)","kelurahan":"Sidomulyo","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidomulyo (Pengasih)","kelurahan":"Sidomulyo","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sidorejo (Godean)","kelurahan":"Sidorejo","kecamatan":"Godean","kabupaten":"Kabupaten Sleman"},{"display":"Sidorejo (Lendah)","kelurahan":"Sidorejo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sidorejo (Ponjong)","kelurahan":"Sidorejo","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sinduadi (Mlati)","kelurahan":"Sinduadi","kecamatan":"Mlati","kabupaten":"Kabupaten Sleman"},{"display":"Sinduharjo (Ngaglik)","kelurahan":"Sinduharjo","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Sindumartani (Ngemplak)","kelurahan":"Sindumartani","kecamatan":"Ngemplak","kabupaten":"Kabupaten Sleman"},{"display":"Sindutan (Temon)","kelurahan":"Sindutan","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Singosaren (Banguntapan)","kelurahan":"Singosaren","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Siraman (Wonosari)","kelurahan":"Siraman","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sitimulyo (Piyungan)","kelurahan":"Sitimulyo","kecamatan":"Piyungan","kabupaten":"Kabupaten Bantul"},{"display":"Sodo (Paliyan)","kelurahan":"Sodo","kecamatan":"Paliyan","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sogan (Wates)","kelurahan":"Sogan","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Songbanyu (Girisubo)","kelurahan":"Songbanyu","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sorosutan (Umbulharjo)","kelurahan":"Sorosutan","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Sosromenduran (Gedongtengen)","kelurahan":"Sosromenduran","kecamatan":"Gedongtengen","kabupaten":"Kota Yogyakarta"},{"display":"Srigading (Sanden)","kelurahan":"Srigading","kecamatan":"Sanden","kabupaten":"Kabupaten Bantul"},{"display":"Srihardono (Pundong)","kelurahan":"Srihardono","kecamatan":"Pundong","kabupaten":"Kabupaten Bantul"},{"display":"Sriharjo (Imogiri)","kelurahan":"Sriharjo","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Srikayangan (Sentolo)","kelurahan":"Srikayangan","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Srimartani (Piyungan)","kelurahan":"Srimartani","kecamatan":"Piyungan","kabupaten":"Kabupaten Bantul"},{"display":"Srimulyo (Piyungan)","kelurahan":"Srimulyo","kecamatan":"Piyungan","kabupaten":"Kabupaten Bantul"},{"display":"Sukoharjo (Ngaglik)","kelurahan":"Sukoharjo","kecamatan":"Ngaglik","kabupaten":"Kabupaten Sleman"},{"display":"Sukoreno (Sentolo)","kelurahan":"Sukoreno","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Sumberadi (Mlati)","kelurahan":"Sumberadi","kecamatan":"Mlati","kabupaten":"Kabupaten Sleman"},{"display":"Sumberagung (Jetis)","kelurahan":"Sumberagung","kecamatan":"Jetis","kabupaten":"Kabupaten Bantul"},{"display":"Sumberagung (Moyudan)","kelurahan":"Sumberagung","kecamatan":"Moyudan","kabupaten":"Kabupaten Sleman"},{"display":"Sumberarum (Moyudan)","kelurahan":"Sumberarum","kecamatan":"Moyudan","kabupaten":"Kabupaten Sleman"},{"display":"Sumberejo (Semin)","kelurahan":"Sumberejo","kecamatan":"Semin","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sumbergiri (Ponjong)","kelurahan":"Sumbergiri","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Sumberharjo (Prambanan)","kelurahan":"Sumberharjo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Sumbermulyo (Bambanglipuro)","kelurahan":"Sumbermulyo","kecamatan":"Bambanglipuro","kabupaten":"Kabupaten Bantul"},{"display":"Sumberrahayu (Moyudan)","kelurahan":"Sumberrahayu","kecamatan":"Moyudan","kabupaten":"Kabupaten Sleman"},{"display":"Sumberrejo (Tempel)","kelurahan":"Sumberrejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Sumbersari (Moyudan)","kelurahan":"Sumbersari","kecamatan":"Moyudan","kabupaten":"Kabupaten Sleman"},{"display":"Sumberwungu (Tepus)","kelurahan":"Sumberwungu","kecamatan":"Tepus","kabupaten":"Kabupaten Gunungkidul"},{"display":"Suryatmajan (Danurejan)","kelurahan":"Suryatmajan","kecamatan":"Danurejan","kabupaten":"Kota Yogyakarta"},{"display":"Suryodiningratan (Mantrijeron)","kelurahan":"Suryodiningratan","kecamatan":"Mantrijeron","kabupaten":"Kota Yogyakarta"},{"display":"Tahunan (Umbulharjo)","kelurahan":"Tahunan","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Tamanan (Banguntapan)","kelurahan":"Tamanan","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Tamanmartani (Kalasan)","kelurahan":"Tamanmartani","kecamatan":"Kalasan","kabupaten":"Kabupaten Sleman"},{"display":"Tamantirto (Kasihan)","kelurahan":"Tamantirto","kecamatan":"Kasihan","kabupaten":"Kabupaten Bantul"},{"display":"Tambakrejo (Tempel)","kelurahan":"Tambakrejo","kecamatan":"Tempel","kabupaten":"Kabupaten Sleman"},{"display":"Tambakromo (Ponjong)","kelurahan":"Tambakromo","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Tancep (Ngawen)","kelurahan":"Tancep","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Tanjungharjo (Nanggulan)","kelurahan":"Tanjungharjo","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Tawangsari (Pengasih)","kelurahan":"Tawangsari","kecamatan":"Pengasih","kabupaten":"Kabupaten Kulon Progo"},{"display":"Tayuban (Panjatan)","kelurahan":"Tayuban","kecamatan":"Panjatan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Tegalpanggung (Danurejan)","kelurahan":"Tegalpanggung","kecamatan":"Danurejan","kabupaten":"Kota Yogyakarta"},{"display":"Tegalrejo (Gedangsari)","kelurahan":"Tegalrejo","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Tegalrejo (Tegalrejo)","kelurahan":"Tegalrejo","kecamatan":"Tegalrejo","kabupaten":"Kota Yogyakarta"},{"display":"Tegaltirto (Berbah)","kelurahan":"Tegaltirto","kecamatan":"Berbah","kabupaten":"Kabupaten Sleman"},{"display":"Temon Kulon (Temon)","kelurahan":"Temon Kulon","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Temon Wetan (Temon)","kelurahan":"Temon Wetan","kecamatan":"Temon","kabupaten":"Kabupaten Kulon Progo"},{"display":"Temuwuh (Dlingo)","kelurahan":"Temuwuh","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Tepus (Tepus)","kelurahan":"Tepus","kecamatan":"Tepus","kabupaten":"Kabupaten Gunungkidul"},{"display":"Terbah (Patuk)","kelurahan":"Terbah","kecamatan":"Patuk","kabupaten":"Kabupaten Gunungkidul"},{"display":"Terban (Gondokusuman)","kelurahan":"Terban","kecamatan":"Gondokusuman","kabupaten":"Kota Yogyakarta"},{"display":"Terong (Dlingo)","kelurahan":"Terong","kecamatan":"Dlingo","kabupaten":"Kabupaten Bantul"},{"display":"Tileng (Girisubo)","kelurahan":"Tileng","kecamatan":"Girisubo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Timbulharjo (Sewon)","kelurahan":"Timbulharjo","kecamatan":"Sewon","kabupaten":"Kabupaten Bantul"},{"display":"Tirtoadi (Mlati)","kelurahan":"Tirtoadi","kecamatan":"Mlati","kabupaten":"Kabupaten Sleman"},{"display":"Tirtohargo (Kretek)","kelurahan":"Tirtohargo","kecamatan":"Kretek","kabupaten":"Kabupaten Bantul"},{"display":"Tirtomartani (Kalasan)","kelurahan":"Tirtomartani","kecamatan":"Kalasan","kabupaten":"Kabupaten Sleman"},{"display":"Tirtomulyo (Kretek)","kelurahan":"Tirtomulyo","kecamatan":"Kretek","kabupaten":"Kabupaten Bantul"},{"display":"Tirtonirmolo (Kasihan)","kelurahan":"Tirtonirmolo","kecamatan":"Kasihan","kabupaten":"Kabupaten Bantul"},{"display":"Tirtorahayu (Galur)","kelurahan":"Tirtorahayu","kecamatan":"Galur","kabupaten":"Kabupaten Kulon Progo"},{"display":"Tirtosari (Kretek)","kelurahan":"Tirtosari","kecamatan":"Kretek","kabupaten":"Kabupaten Bantul"},{"display":"Tlogoadi (Mlati)","kelurahan":"Tlogoadi","kecamatan":"Mlati","kabupaten":"Kabupaten Sleman"},{"display":"Tridadi (Sleman)","kelurahan":"Tridadi","kecamatan":"Sleman","kabupaten":"Kabupaten Sleman"},{"display":"Trihanggo (Gamping)","kelurahan":"Trihanggo","kecamatan":"Gamping","kabupaten":"Kabupaten Sleman"},{"display":"Triharjo (Pandak)","kelurahan":"Triharjo","kecamatan":"Pandak","kabupaten":"Kabupaten Bantul"},{"display":"Triharjo (Sleman)","kelurahan":"Triharjo","kecamatan":"Sleman","kabupaten":"Kabupaten Sleman"},{"display":"Triharjo (Wates)","kelurahan":"Triharjo","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Trimulyo (Jetis)","kelurahan":"Trimulyo","kecamatan":"Jetis","kabupaten":"Kabupaten Bantul"},{"display":"Trimulyo (Sleman)","kelurahan":"Trimulyo","kecamatan":"Sleman","kabupaten":"Kabupaten Sleman"},{"display":"Trimurti (Srandakan)","kelurahan":"Trimurti","kecamatan":"Srandakan","kabupaten":"Kabupaten Bantul"},{"display":"Trirenggo (Bantul)","kelurahan":"Trirenggo","kecamatan":"Bantul","kabupaten":"Kabupaten Bantul"},{"display":"Triwidadi (Pajangan)","kelurahan":"Triwidadi","kecamatan":"Pajangan","kabupaten":"Kabupaten Bantul"},{"display":"Tuksono (Sentolo)","kelurahan":"Tuksono","kecamatan":"Sentolo","kabupaten":"Kabupaten Kulon Progo"},{"display":"Umbulharjo (Cangkringan)","kelurahan":"Umbulharjo","kecamatan":"Cangkringan","kabupaten":"Kabupaten Sleman"},{"display":"Umbulmartani (Ngemplak)","kelurahan":"Umbulmartani","kecamatan":"Ngemplak","kabupaten":"Kabupaten Sleman"},{"display":"Umbulrejo (Ponjong)","kelurahan":"Umbulrejo","kecamatan":"Ponjong","kabupaten":"Kabupaten Gunungkidul"},{"display":"Wahyuharjo (Lendah)","kelurahan":"Wahyuharjo","kecamatan":"Lendah","kabupaten":"Kabupaten Kulon Progo"},{"display":"Wareng (Wonosari)","kelurahan":"Wareng","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Warungboto (Umbulharjo)","kelurahan":"Warungboto","kecamatan":"Umbulharjo","kabupaten":"Kota Yogyakarta"},{"display":"Wates (Wates)","kelurahan":"Wates","kecamatan":"Wates","kabupaten":"Kabupaten Kulon Progo"},{"display":"Watugajah (Gedangsari)","kelurahan":"Watugajah","kecamatan":"Gedangsari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Watusigar (Ngawen)","kelurahan":"Watusigar","kecamatan":"Ngawen","kabupaten":"Kabupaten Gunungkidul"},{"display":"Wedomartani (Ngemplak)","kelurahan":"Wedomartani","kecamatan":"Ngemplak","kabupaten":"Kabupaten Sleman"},{"display":"Widodomartani (Ngemplak)","kelurahan":"Widodomartani","kecamatan":"Ngemplak","kabupaten":"Kabupaten Sleman"},{"display":"Wijimulyo (Nanggulan)","kelurahan":"Wijimulyo","kecamatan":"Nanggulan","kabupaten":"Kabupaten Kulon Progo"},{"display":"Wijirejo (Pandak)","kelurahan":"Wijirejo","kecamatan":"Pandak","kabupaten":"Kabupaten Bantul"},{"display":"Wiladeg (Karangmojo)","kelurahan":"Wiladeg","kecamatan":"Karangmojo","kabupaten":"Kabupaten Gunungkidul"},{"display":"Wirobrajan (Wirobrajan)","kelurahan":"Wirobrajan","kecamatan":"Wirobrajan","kabupaten":"Kota Yogyakarta"},{"display":"Wirogunan (Mergangsan)","kelurahan":"Wirogunan","kecamatan":"Mergangsan","kabupaten":"Kota Yogyakarta"},{"display":"Wirokerten (Banguntapan)","kelurahan":"Wirokerten","kecamatan":"Banguntapan","kabupaten":"Kabupaten Bantul"},{"display":"Wonokerto (Turi)","kelurahan":"Wonokerto","kecamatan":"Turi","kabupaten":"Kabupaten Sleman"},{"display":"Wonokromo (Pleret)","kelurahan":"Wonokromo","kecamatan":"Pleret","kabupaten":"Kabupaten Bantul"},{"display":"Wonolelo (Pleret)","kelurahan":"Wonolelo","kecamatan":"Pleret","kabupaten":"Kabupaten Bantul"},{"display":"Wonosari (Wonosari)","kelurahan":"Wonosari","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"},{"display":"Wukirharjo (Prambanan)","kelurahan":"Wukirharjo","kecamatan":"Prambanan","kabupaten":"Kabupaten Sleman"},{"display":"Wukirsari (Cangkringan)","kelurahan":"Wukirsari","kecamatan":"Cangkringan","kabupaten":"Kabupaten Sleman"},{"display":"Wukirsari (Imogiri)","kelurahan":"Wukirsari","kecamatan":"Imogiri","kabupaten":"Kabupaten Bantul"},{"display":"Wunung (Wonosari)","kelurahan":"Wunung","kecamatan":"Wonosari","kabupaten":"Kabupaten Gunungkidul"}];

// ---- small primitives ---------------------------------------------------
function Pill({ children, tone = "navy" }) {
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

function RouteBadge({ id }) {
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

function SearchSelect({ label, options, value, onChange, allowOther = false, placeholder = "Cari...", showRouteBadges = false, routeMode = false }) {
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
        {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label}</label>}
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
      {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label}</label>}
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

const WILAYAH_DISPLAY = WILAYAH.map(w => w.display);
const KECAMATAN = [...new Set(WILAYAH.map(w => w.kecamatan))].sort();

function WilayahPicker({ label, value, onChange }) {
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

function DurationStepper({ value, onChange, label }) {
  return (
    <div>
      {label && <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label}</label>}
      <div style={{ borderColor: C.border }} className="flex items-center border rounded-xl overflow-hidden w-fit bg-white">
        <button onClick={() => onChange(Math.max(0, value - 5))} style={{ color: C.navy }} className="px-3 py-2 hover:bg-gray-50" aria-label="Kurangi 5 menit">−</button>
        <div style={{ ...display, color: C.ink, borderColor: C.border }} className="px-4 py-2 text-sm font-semibold border-x min-w-[76px] text-center">
          {value} mnt
        </div>
        <button onClick={() => onChange(value + 5)} style={{ color: C.navy }} className="px-3 py-2 hover:bg-gray-50" aria-label="Tambah 5 menit">+</button>
      </div>
    </div>
  );
}

// ---- journey timeline (signature element) ------------------------------
function JourneyTimeline({ nodes }) {
  const totalTime = nodes.reduce((s, n) => s + (n.legDuration || 0), 0);
  return (
    <div style={{ background: C.navyDeep }} className="rounded-2xl p-5 sm:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <p style={{ ...body, color: "#AEC3D6" }} className="text-xs font-medium uppercase tracking-wide">Ringkasan perjalanan</p>
        <Pill tone="amber"><Clock size={12} /> {totalTime} menit total</Pill>
      </div>
      <div className="flex items-stretch min-w-max pb-1">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center" style={{ width: 108 }}>
              <div
                style={{
                  background: n.kind === "stop" ? "#fff" : "transparent",
                  border: n.kind === "stop" ? `2px solid ${C.amber}` : "none",
                  color: n.kind === "stop" ? C.navy : "#fff",
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              >
                {n.icon ? <n.icon size={16} /> : <MapPin size={16} />}
              </div>
              <p style={{ ...display, color: "#fff" }} className="text-[13px] font-semibold text-center mt-2 leading-tight flex items-center justify-center gap-1">
                {n.routeId ? <RouteBadge id={n.routeId} /> : n.title}
              </p>
              {n.subtitle && <p style={{ ...body, color: "#8FA6BA" }} className="text-[11px] text-center mt-0.5 leading-tight">{n.subtitle}</p>}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center -mt-5" style={{ width: 56 }}>
                <div style={{ background: "#3C5A78" }} className="h-0.5 w-full" />
                {nodes[i + 1].legDuration != null && (
                  <p style={{ ...body, color: "#AEC3D6" }} className="text-[10px] mt-1 whitespace-nowrap">{nodes[i + 1].legDuration} mnt</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- step shell ----------------------------------------------------------
function StepHeader({ step, total, label }) {
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

function Field({ label, children }) {
  return (
    <div>
      <label style={{ ...body, color: C.inkMuted }} className="text-sm font-medium mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function MultiChoiceGroup({ options, value, onChange, max = 3 }) {
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

function ChoiceGroup({ options, value, onChange }) {
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

function SatisfactionRow({ label, value, onChange }) {
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

// ---- main app --------------------------------------------------------
function TfYLogo({ color = "#fff", className = "" }) {
  // Path resmi logo Transport for Yogyakarta (wordmark), viewBox asli 0 0 320 83.
  // Warna: putih (default, untuk background gelap), hitam/navy (background terang), atau #F8C530 (kuning TfY) sebagai aksen.
  return (
    <svg viewBox="0 0 320 83" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: "block" }}>
      <path d="M157.775,81.701c-0.219,-0.527 -1.114,-3.924 -1.043,-3.956c2.366,-1.095 3.269,-1.675 4.258,-2.732c1.175,-1.256 1.804,-2.309 1.804,-3.017c0,-0.246 -1.704,-4.708 -3.787,-9.914c-2.083,-5.206 -3.827,-9.566 -3.874,-9.69c-0.067,-0.173 0.559,-0.224 2.774,-0.224l2.861,0l2.255,6.769c1.241,3.723 2.311,7.071 2.378,7.441c0.068,0.37 0.183,0.672 0.257,0.672c0.073,0 0.353,-0.827 0.621,-1.837c0.268,-1.011 0.847,-3.049 1.286,-4.528c0.439,-1.479 1.045,-3.537 1.346,-4.572c0.302,-1.035 0.689,-2.326 0.861,-2.869l0.314,-0.986l2.719,-0.05c1.496,-0.027 2.72,0.015 2.72,0.094c-0,0.078 -0.491,1.472 -1.091,3.097c-0.6,1.626 -1.442,3.923 -1.87,5.107c-4.659,12.863 -6.139,15.898 -9.104,18.667c-1.386,1.294 -2.913,2.18 -4.573,2.653c-0.93,0.266 -0.951,0.263 -1.112,-0.125Zm-19.484,-0.392c-1.36,-0.247 -2.893,-0.705 -3.665,-1.095l-0.467,-0.236l0.544,-1.936c0.298,-1.065 0.561,-1.963 0.583,-1.994c0.022,-0.032 0.365,0.108 0.762,0.311c1.763,0.899 4.771,1.401 6.514,1.087c3.137,-0.565 4.633,-2.593 4.633,-6.28l0,-1.59l-0.802,0.857c-1.935,2.069 -5.16,2.69 -8.214,1.582c-1.907,-0.693 -3.455,-2.095 -4.513,-4.088c-1.684,-3.174 -1.634,-7.997 0.117,-11.332c2.627,-5.004 9.34,-6.556 12.91,-2.985c0.563,0.563 1.068,0.98 1.122,0.927c0.054,-0.054 0.097,-0.609 0.097,-1.233l0,-1.136l2.286,0l2.287,0l-0.046,5.603c-0.118,14.542 -0.139,15.188 -0.541,16.658c-1.109,4.052 -3.629,6.255 -7.955,6.957c-1.514,0.246 -4.064,0.211 -5.652,-0.077Zm6.377,-13.084c0.952,-0.483 1.661,-1.226 2.125,-2.227c0.245,-0.53 0.302,-1.236 0.307,-3.789c0.005,-2.823 -0.032,-3.22 -0.374,-3.957c-1.33,-2.876 -4.944,-3.527 -7.179,-1.293c-2.226,2.227 -2.509,7.369 -0.547,9.942c1.289,1.689 3.793,2.274 5.668,1.324Zm-108.687,10.29c-3.904,-0.346 -8.797,-1.634 -12.427,-3.269c-12.257,-5.524 -20.692,-16.659 -22.789,-30.088c-0.421,-2.698 -0.424,-8.566 -0.005,-11.312c2.192,-14.371 11.991,-26.375 25.496,-31.232c7.246,-2.606 15.507,-2.999 22.976,-1.093c9.19,2.346 17.293,8.021 22.634,15.851c7.352,10.778 8.883,24.393 4.105,36.5c-6.355,16.102 -22.707,26.178 -39.99,24.643Zm7.398,-9.516c6.084,-0.676 12.005,-3.511 16.676,-7.988c4.847,-4.644 7.896,-10.431 8.888,-16.864c0.354,-2.297 0.4,-6.657 0.093,-8.833c-0.973,-6.904 -4.579,-13.602 -9.761,-18.128c-4.07,-3.556 -8.567,-5.794 -13.905,-6.923c-2.016,-0.426 -2.647,-0.477 -5.846,-0.477c-3.199,-0 -3.83,0.051 -5.845,0.477c-7.919,1.674 -14.362,5.991 -18.883,12.651c-4.512,6.648 -6.093,15.143 -4.303,23.124c2.853,12.72 13.762,22.154 26.762,23.144c2.054,0.157 3.442,0.115 6.124,-0.183Zm-8.248,-10.555l0,-15.188l-0.962,-1.775c-0.529,-0.976 -3.042,-5.687 -5.583,-10.47c-2.541,-4.783 -4.69,-8.773 -4.775,-8.867c-0.085,-0.093 -0.155,-0.276 -0.155,-0.406c-0,-0.191 0.908,-0.227 4.699,-0.188l4.699,0.047l2.028,4.752c1.116,2.613 2.607,6.185 3.312,7.938c0.706,1.752 1.335,3.124 1.398,3.048c0.062,-0.076 0.422,-0.945 0.799,-1.931c0.378,-0.987 1.815,-4.517 3.193,-7.845l2.506,-6.051l4.641,-0c2.552,-0 4.641,0.038 4.641,0.085c-0,0.086 -1.591,2.928 -6.628,11.838c-1.505,2.663 -3.333,5.897 -4.061,7.187l-1.324,2.345l-0,15.481l-8.428,-0Zm81.478,14.437c-3.517,-0.766 -6.395,-3.539 -7.351,-7.086c-0.424,-1.57 -0.432,-4.869 -0.015,-6.434c0.982,-3.698 3.553,-6.336 7.112,-7.298c1.436,-0.388 4.526,-0.438 5.917,-0.095c4.544,1.119 7.516,5.147 7.528,10.204c0.01,4.324 -1.99,7.949 -5.35,9.694c-2.285,1.187 -5.273,1.574 -7.841,1.015Zm4.498,-3.841c2.505,-1.164 3.831,-4.87 3.121,-8.725c-0.72,-3.906 -3.923,-5.939 -6.934,-4.403c-2.937,1.498 -4.018,7.003 -2.114,10.761c0.509,1.004 1.794,2.209 2.648,2.483c0.959,0.307 2.484,0.253 3.279,-0.116Zm59.593,3.764c-4.359,-1.394 -5.658,-6.955 -2.424,-10.374c1.215,-1.284 3.194,-2.246 5.615,-2.727c1.001,-0.2 2.212,-0.363 2.689,-0.365c0.478,-0.001 1.176,-0.052 1.552,-0.115l0.684,-0.113l-0.122,-0.736c-0.227,-1.366 -0.868,-2.182 -2.144,-2.73c-1.427,-0.612 -4.667,-0.274 -6.605,0.689c-0.379,0.189 -0.788,0.305 -0.908,0.259c-0.196,-0.075 -1.002,-2.476 -1.002,-2.985c0,-0.31 2.055,-1.176 3.676,-1.548c1.851,-0.425 5.298,-0.441 6.769,-0.032c3.171,0.882 4.939,3.169 5.334,6.9c0.085,0.808 0.172,4.237 0.193,7.62l0.039,6.151l-4.432,0l-0.152,-0.717c-0.083,-0.394 -0.19,-0.906 -0.238,-1.136c-0.085,-0.409 -0.106,-0.402 -0.869,0.301c-1.941,1.789 -5.103,2.474 -7.655,1.658Zm4.866,-3.436c1.122,-0.255 2.077,-0.933 2.699,-1.913c0.505,-0.797 0.528,-0.923 0.528,-2.876l0,-2.042l-1.389,0.119c-3.84,0.327 -5.596,1.438 -5.736,3.63c-0.104,1.62 0.674,2.752 2.127,3.095c0.828,0.195 0.857,0.195 1.771,-0.013l-0,0Zm37.999,3.534c-1.767,-0.477 -3.254,-1.715 -4.002,-3.332c-0.305,-0.658 -0.378,-1.164 -0.378,-2.609c-0,-1.59 0.057,-1.915 0.503,-2.869c1.21,-2.586 4.488,-4.345 8.685,-4.662c2.88,-0.217 2.915,-0.227 2.915,-0.824c-0,-0.627 -0.425,-1.712 -0.858,-2.191c-1.194,-1.319 -4.022,-1.47 -7.109,-0.379c-0.697,0.247 -1.393,0.491 -1.547,0.544c-0.219,0.074 -0.385,-0.244 -0.762,-1.459c-0.265,-0.854 -0.44,-1.621 -0.389,-1.703c0.144,-0.234 2.745,-1.186 3.941,-1.444c1.659,-0.357 5.334,-0.314 6.62,0.078c1.274,0.388 2.706,1.272 3.411,2.107c0.784,0.927 1.501,2.62 1.7,4.016c0.099,0.69 0.202,4.261 0.231,7.934l0.051,6.679l-2.085,0c-1.451,0 -2.139,-0.068 -2.266,-0.224c-0.099,-0.123 -0.238,-0.648 -0.307,-1.166c-0.133,-0.988 -0.318,-1.167 -0.62,-0.603c-0.313,0.585 -2.205,1.706 -3.418,2.025c-1.366,0.359 -3.161,0.393 -4.316,0.082Zm5.482,-3.868c0.913,-0.398 1.982,-1.58 2.228,-2.464c0.238,-0.859 0.252,-3.765 0.018,-3.909c-0.095,-0.059 -1.003,-0.023 -2.017,0.079c-2.147,0.218 -3.802,0.9 -4.475,1.845c-0.545,0.765 -0.668,2.517 -0.241,3.418c0.684,1.442 2.554,1.871 4.487,1.031Zm33.137,3.869c-1.92,-0.491 -3.148,-1.69 -3.88,-3.786c-0.11,-0.317 -0.231,-3.149 -0.289,-6.818l-0.101,-6.276l-1.434,-0.089l-1.435,-0.09l0,-3.586l1.435,-0.09l1.434,-0.089l0.09,-2.317l0.09,-2.316l2.33,-0.588c1.282,-0.323 2.39,-0.592 2.461,-0.597c0.072,-0.005 0.153,1.302 0.18,2.904l0.049,2.914l2.465,0.05l2.466,0.049l-0,3.746l-2.466,0.049l-2.465,0.05l-0.048,4.841c-0.056,5.625 0.058,6.501 0.961,7.404c0.601,0.602 0.603,0.602 2.139,0.544c1.816,-0.069 1.743,-0.168 1.663,2.26l-0.053,1.602l-0.538,0.151c-1,0.282 -4.072,0.33 -5.054,0.078Zm12.316,-0.012c-1.802,-0.5 -3.132,-1.622 -3.916,-3.304c-0.4,-0.859 -0.471,-1.257 -0.47,-2.626c0.002,-1.392 0.072,-1.768 0.513,-2.73c0.662,-1.446 2.023,-2.739 3.744,-3.556c1.384,-0.658 4.33,-1.333 5.828,-1.337c0.465,-0.001 1.134,-0.049 1.488,-0.108l0.642,-0.106l-0.136,-0.866c-0.219,-1.384 -0.744,-2.055 -2.048,-2.614c-1.416,-0.607 -4.749,-0.266 -6.593,0.675c-0.386,0.196 -0.8,0.319 -0.921,0.272c-0.205,-0.078 -1.002,-2.431 -1.001,-2.955c0,-0.325 1.977,-1.185 3.521,-1.533c2.869,-0.646 5.691,-0.554 7.861,0.258c2.02,0.756 3.754,2.929 4.201,5.264c0.095,0.5 0.22,3.854 0.278,7.453c0.057,3.6 0.123,6.787 0.146,7.083l0.041,0.537l-2.265,0.05l-2.265,0.05l-0.117,-0.677c-0.064,-0.373 -0.161,-0.903 -0.216,-1.179l-0.099,-0.501l-0.773,0.713c-0.426,0.391 -1.102,0.88 -1.503,1.084c-1.688,0.861 -4.196,1.137 -5.94,0.653Zm5.821,-4.018c0.524,-0.282 1.114,-0.797 1.434,-1.255c0.521,-0.743 0.547,-0.869 0.604,-2.913c0.069,-2.46 0.315,-2.239 -2.164,-1.955c-3.364,0.386 -4.978,1.611 -4.978,3.78c-0,2.578 2.514,3.732 5.104,2.343Zm-183.206,3.8c-0.068,-0.068 -0.124,-2.758 -0.124,-5.977l-0,-5.853l-4.479,-8.237l-4.479,-8.237l2.896,-0.05c1.593,-0.027 2.955,0.013 3.026,0.09c0.183,0.198 4.697,9.936 5.279,11.39c0.266,0.666 0.545,1.21 0.62,1.21c0.075,0 0.282,-0.383 0.46,-0.851c0.289,-0.762 2.376,-5.328 4.63,-10.131l0.821,-1.748l2.874,0c1.581,0 2.875,0.061 2.874,0.135c-0,0.073 -0.148,0.376 -0.328,0.672c-0.18,0.296 -1.766,3.039 -3.523,6.096c-1.758,3.057 -3.687,6.406 -4.289,7.441l-1.093,1.883l-0.09,6.096l-0.089,6.096l-2.431,0.05c-1.337,0.027 -2.487,-0.006 -2.555,-0.075Zm102.023,0c-0.069,-0.068 -0.125,-6.848 -0.125,-15.066l0,-14.942l5.2,0l0,18.539l0.852,-1.258c0.468,-0.693 1.972,-2.726 3.341,-4.518l2.489,-3.26l3.039,0c1.741,0 3.014,0.07 2.98,0.163c-0.033,0.089 -1.593,1.844 -3.467,3.9c-1.873,2.056 -3.514,3.875 -3.646,4.043c-0.21,0.269 0.261,1.001 3.99,6.199c2.326,3.242 4.228,5.989 4.228,6.105c0,0.307 -5.742,0.294 -6.129,-0.014c-0.155,-0.123 -1.553,-2.186 -3.107,-4.584c-1.554,-2.398 -2.884,-4.294 -2.955,-4.213c-0.071,0.08 -0.444,0.5 -0.827,0.934l-0.698,0.788l-0.09,3.605l-0.089,3.604l-2.431,0.05c-1.337,0.027 -2.487,-0.006 -2.555,-0.075l-0,0Zm42.46,-0.104c-0.045,-0.126 -0.103,-4.77 -0.13,-10.32l-0.05,-10.091l2.242,0.05l2.241,0.05l0.048,1.614c0.066,2.215 0.14,2.326 0.777,1.161c0.703,-1.286 1.653,-2.242 2.761,-2.777c0.984,-0.474 2.5,-0.735 3.223,-0.553l0.463,0.116l-0.05,2.371l-0.05,2.371l-0.931,-0.06c-2.395,-0.156 -4.347,1.16 -5.127,3.456c-0.105,0.31 -0.232,3.204 -0.292,6.645l-0.105,6.096l-2.469,0.05c-1.878,0.038 -2.489,-0.005 -2.551,-0.179Zm-55.496,-45.906c0,-7.421 -0.052,-13.916 -0.114,-14.434l-0.114,-0.942l4.666,0l0.125,1.435c0.069,0.789 0.143,1.434 0.165,1.434c0.023,0 0.544,-0.49 1.16,-1.088c3.248,-3.159 8.417,-3.119 11.6,0.089c2.028,2.045 2.954,4.578 2.954,8.082c0,3.603 -0.977,6.293 -3.034,8.353c-3.192,3.197 -8.234,3.579 -11.22,0.85l-0.987,-0.902l0,10.615l-5.199,0l-0.002,-13.492l0,-0Zm11.919,1.224c1.51,-0.631 2.598,-2.178 3.058,-4.351c0.328,-1.545 0.327,-2.516 -0.003,-4.073c-0.463,-2.187 -1.321,-3.43 -2.869,-4.162c-2.408,-1.138 -5.245,-0.015 -6.393,2.531c-0.561,1.245 -0.707,5.413 -0.246,7.015c0.389,1.347 1.765,2.773 3.084,3.193c0.971,0.31 2.419,0.244 3.369,-0.153l-0,0Zm-70.595,4.196c-3.245,-0.823 -5.195,-3.831 -4.62,-7.13c0.704,-4.042 4.026,-6.118 10.55,-6.592l1.671,-0.121l-0.12,-0.742c-0.278,-1.707 -1.132,-2.598 -2.863,-2.988c-1.58,-0.356 -4.024,0.075 -6.574,1.16c-0.247,0.105 -0.385,-0.141 -0.805,-1.428l-0.506,-1.555l0.385,-0.312c0.534,-0.432 2.978,-1.215 4.565,-1.463c0.735,-0.115 2.157,-0.166 3.204,-0.114c3.986,0.195 6.423,1.937 7.39,5.282c0.288,0.997 0.365,1.935 0.427,5.248c0.041,2.219 0.102,5.467 0.134,7.217l0.059,3.183l-4.57,-0l-0.127,-0.941c-0.069,-0.518 -0.163,-1.004 -0.208,-1.079c-0.045,-0.076 -0.496,0.225 -1.003,0.668c-1.286,1.125 -2.862,1.721 -4.784,1.808c-0.842,0.038 -1.834,-0.007 -2.205,-0.101Zm5.449,-4.082c0.665,-0.345 1.142,-0.768 1.545,-1.365c0.573,-0.851 0.583,-0.901 0.583,-2.907l-0,-2.042l-0.904,-0c-1.181,-0 -3.481,0.48 -4.287,0.895c-1.822,0.937 -2.462,2.754 -1.578,4.478c0.776,1.513 2.764,1.916 4.641,0.941Zm38.808,4.078c-1.219,-0.191 -3.381,-0.844 -3.776,-1.138c-0.233,-0.174 -0.211,-0.401 0.179,-1.813c0.244,-0.888 0.482,-1.712 0.527,-1.832c0.059,-0.156 0.369,-0.091 1.097,0.232c1.983,0.876 4.36,1.2 5.825,0.793c0.351,-0.097 0.875,-0.425 1.166,-0.728c0.441,-0.461 0.527,-0.698 0.527,-1.456c0,-0.835 -0.057,-0.956 -0.742,-1.564c-0.488,-0.433 -1.432,-0.928 -2.757,-1.445c-4.048,-1.58 -5.801,-3.67 -5.503,-6.562c0.384,-3.714 3.752,-6.007 8.464,-5.761c1.767,0.092 4.064,0.642 4.519,1.081c0.168,0.162 0.115,0.567 -0.238,1.817c-0.25,0.886 -0.49,1.667 -0.533,1.737c-0.043,0.07 -0.503,-0.067 -1.022,-0.304c-1.816,-0.831 -4.269,-0.907 -5.399,-0.167c-0.792,0.519 -1.04,1.653 -0.564,2.576c0.283,0.547 2.053,1.557 3.618,2.065c1.063,0.344 2.799,1.348 3.535,2.044c2.267,2.143 2.184,6.289 -0.17,8.459c-1.444,1.331 -3.199,1.943 -5.897,2.058c-0.986,0.041 -2.272,0 -2.856,-0.092Zm45.799,0.018c-5.095,-0.952 -8.234,-4.928 -8.245,-10.443c-0.014,-6.803 4.517,-11.19 11.203,-10.848c5.085,0.259 8.346,3.1 9.501,8.276c0.065,0.293 0.115,1.382 0.11,2.42c-0.023,5.045 -2.499,8.674 -6.921,10.146c-1.566,0.521 -4.158,0.727 -5.648,0.449Zm4.084,-4.024c0.928,-0.48 1.84,-1.522 2.438,-2.784c0.548,-1.156 0.56,-1.237 0.555,-3.781c-0.006,-3.208 -0.32,-4.204 -1.788,-5.672c-1.406,-1.406 -3.245,-1.733 -5.02,-0.894c-1.165,0.551 -1.728,1.172 -2.455,2.711c-0.587,1.241 -0.594,1.284 -0.594,3.855c0,2.332 0.043,2.692 0.412,3.496c0.827,1.799 1.889,2.903 3.198,3.322c0.738,0.237 2.584,0.093 3.254,-0.253Zm33.121,3.953c-2.186,-0.57 -3.316,-1.693 -4.001,-3.974c-0.208,-0.694 -0.286,-2.263 -0.345,-6.948l-0.076,-6.051l-2.84,-0l0,-3.75l1.39,-0.053l1.389,-0.052l0.09,-2.331l0.09,-2.331l2.241,-0.567c1.233,-0.312 2.38,-0.575 2.55,-0.583c0.279,-0.014 0.315,0.271 0.359,2.898l0.049,2.914l2.376,0.05l2.376,0.05l-0,3.755l-4.841,-0l0.004,5.424c0.003,4.94 0.034,5.49 0.344,6.174c0.493,1.085 1.155,1.374 2.911,1.273l1.402,-0.081l0,3.868l-0.672,0.191c-1.108,0.314 -3.8,0.384 -4.796,0.124l-0,0Zm36.488,-0.039c-2.904,-0.623 -5.368,-2.537 -6.607,-5.133c-0.892,-1.867 -1.104,-2.891 -1.101,-5.31c0.005,-3.407 0.861,-5.723 2.867,-7.761c2.112,-2.146 4.922,-3.15 8.337,-2.979c3.836,0.192 6.853,2.061 8.409,5.21c0.939,1.9 1.24,3.51 1.129,6.032c-0.145,3.293 -1.079,5.453 -3.238,7.493c-2.356,2.225 -6.273,3.204 -9.796,2.448Zm3.979,-3.697c0.871,-0.261 2.158,-1.372 2.74,-2.365c1.327,-2.266 1.304,-6.467 -0.05,-8.964c-1.514,-2.793 -4.906,-3.317 -7.135,-1.102c-1.912,1.901 -2.523,5.454 -1.503,8.755c0.902,2.921 3.372,4.447 5.948,3.676Zm-199.239,3.438l-0,-24.027l-8.069,0l0,-4.482l21.516,-0l0,4.476l-4.079,0.048l-4.079,0.048l-0.046,11.968l-0.046,11.969l-5.197,-0Zm13.983,-9.817c-0.002,-5.399 -0.051,-9.998 -0.111,-10.22c-0.108,-0.403 -0.103,-0.404 2.135,-0.404c1.88,0 2.261,0.046 2.352,0.284c0.06,0.156 0.109,1.003 0.109,1.883c-0,0.879 0.065,1.599 0.145,1.599c0.079,-0 0.295,-0.341 0.479,-0.758c0.458,-1.038 1.784,-2.411 2.869,-2.968c0.721,-0.371 1.167,-0.466 2.245,-0.475l1.344,-0.013l0.05,2.376l0.05,2.376l-1.305,0.008c-2.306,0.013 -3.548,0.748 -4.486,2.652l-0.584,1.186l-0.058,6.145l-0.057,6.146l-5.175,-0l-0.002,-9.817Zm35.325,1.776c-0,-4.422 -0.053,-9.021 -0.117,-10.22l-0.118,-2.18l2.248,0c2.562,0 2.462,-0.069 2.467,1.719c0.001,0.501 0.05,0.959 0.109,1.018c0.059,0.059 0.563,-0.36 1.121,-0.93c1.689,-1.726 3.674,-2.464 6.168,-2.294c2.493,0.17 4.564,1.486 5.625,3.574c0.997,1.964 1.02,2.174 1.097,10.047l0.072,7.307l-5.205,-0l-0.065,-6.769c-0.072,-7.57 -0.09,-7.691 -1.297,-8.941c-1.863,-1.931 -5.15,-1.187 -6.463,1.461c-0.329,0.664 -0.356,1.169 -0.404,7.48l-0.051,6.769l-5.187,-0l-0,-8.041Zm88.754,0.107c-0,-4.364 -0.054,-8.963 -0.118,-10.22l-0.116,-2.287l4.538,0l0.021,1.39c0.012,0.764 0.072,1.612 0.134,1.885c0.11,0.479 0.131,0.462 0.632,-0.499c1.043,-2.001 3.148,-3.313 5.316,-3.313l1.069,-0l-0,4.841l-1.3,0.001c-1.623,0.003 -2.833,0.519 -3.766,1.609c-1.165,1.361 -1.21,1.676 -1.21,8.463l0,6.064l-5.2,-0l0,-7.934l-0,-0Zm38.73,-0.396l-0,-8.33l-1.39,-0.052l-1.39,-0.053l-0.051,-1.83l-0.051,-1.83l1.396,-0.053l1.396,-0.052l0.115,-1.636c0.204,-2.893 0.984,-4.832 2.521,-6.27c1.7,-1.59 4.182,-2.288 6.786,-1.908c0.793,0.115 1.527,0.263 1.631,0.327c0.202,0.124 0.039,3.649 -0.178,3.865c-0.064,0.064 -0.603,0.035 -1.196,-0.063c-1.849,-0.306 -3.132,0.258 -3.893,1.712c-0.313,0.599 -0.391,1.062 -0.398,2.359l-0.009,1.614l2.196,0.05l2.197,0.05l-0,3.755l-4.483,-0l0,16.675l-5.199,-0l-0,-8.33l-0,-0Zm35.322,-1.896l0,-10.226l2.197,0.051l2.196,0.05l0.048,1.614c0.066,2.215 0.14,2.327 0.777,1.161c0.685,-1.254 1.569,-2.158 2.735,-2.793c0.773,-0.422 1.141,-0.505 2.267,-0.512l1.345,-0.008l0.05,2.376l0.05,2.376l-1.233,-0c-2.279,-0 -3.636,0.788 -4.549,2.641l-0.593,1.205l-0.058,6.145l-0.057,6.146l-5.175,-0l0,-10.226l0,0Z" style={{ fill: color, fillRule: "nonzero" }} />
    </svg>
  );
}

function InfoModal({ topic, onClose }) {
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


export default function SurveiTransJogja() {
  useFonts();
  const [modal, setModal] = useState(null); // 'about' | 'privacy' | 'contact'
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const sessionId = useRef("TJ-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  // profil
  const [ageGroup, setAgeGroup] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [occupation, setOccupation] = useState("");
  const [instagram, setInstagram] = useState("");

  // perjalanan
  const [origin, setOrigin] = useState("Rumah");
  const [originWilayah, setOriginWilayah] = useState(null);
  const [accessMode, setAccessMode] = useState("Jalan kaki");
  const [accessDuration, setAccessDuration] = useState(10);
  const [legs, setLegs] = useState([
    { route: "4A", board: "UIN Sunan Kalijaga (Barat Jalan)", alight: "Cik Di Tiro", wait: 8, ride: 18 },
  ]);
  const [egressMode, setEgressMode] = useState("Jalan kaki");
  const [egressDuration, setEgressDuration] = useState(5);
  const [destination, setDestination] = useState("Kantor");
  const [destWilayah, setDestWilayah] = useState(null);
  const [selfReportedTotal, setSelfReportedTotal] = useState(45);

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

  function toggleMulti(list, setList, item, max = 3) {
    if (list.includes(item)) { setList(list.filter(x => x !== item)); return; }
    if (list.length >= max) return;
    setList([...list, item]);
  }

  function addLeg() {
    if (legs.length >= 5) return;
    setLegs([...legs, { route: "", board: "", alight: "", wait: 5, ride: 15, sameStop: null, transferMode: "Jalan kaki", transferDuration: 5 }]);
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

  const stepLabels = ["Selamat datang", "Profil singkat", "Perjalanan Anda", "Masukan & selesai"];

  return (
    <div style={{ background: C.bg, minHeight: 600, ...body }} className="w-full rounded-2xl overflow-hidden">
      {/* top bar */}
      <div style={{ background: C.navy }} className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TfYLogo color="#fff" className="h-5 w-auto shrink-0" />
          <div style={{ background: "rgba(255,255,255,0.2)" }} className="w-px h-6 shrink-0" />
          <div className="flex items-center gap-2.5">
            <div style={{ background: C.amber }} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <Bus size={17} color={C.navyDeep} />
            </div>
            <div>
              <p style={{ ...display, color: "#fff" }} className="text-sm font-semibold leading-none">Survei Rute Trans Jogja</p>
              <p style={{ color: "#9FB4C6" }} className="text-[11px] mt-1">oleh Transport for Yogyakarta</p>
            </div>
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
              <Field label="Nama pengguna Instagram (opsional, untuk keperluan undian hadiah)">
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
            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} style={{ background: C.navy, color: "#fff" }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                Lanjut <ArrowRight size={15} />
              </button>
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

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} style={{ color: C.inkMuted }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <ChevronLeft size={15} /> Kembali
              </button>
              <button onClick={() => setStep(3)} style={{ background: C.navy, color: "#fff" }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                Lanjut <ArrowRight size={15} />
              </button>
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

              <Field label="Saran atau masukan lainnya (opsional)">
                <textarea
                  value={otherFeedback}
                  onChange={e => setOtherFeedback(e.target.value)}
                  rows={2}
                  style={{ ...body, borderColor: C.border, color: C.ink }}
                  className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none"
                />
              </Field>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(2)} style={{ color: C.inkMuted }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                <ChevronLeft size={15} /> Kembali
              </button>
              <button onClick={() => { setSubmitted(true); setStep(4); }} style={{ background: C.amber, color: C.navyDeep }} className="px-5 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
                Kirim Survei <ArrowRight size={15} />
              </button>
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
      <div style={{ borderColor: C.border, ...body }} className="border-t px-5 sm:px-8 py-4 flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-xs">
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

      <InfoModal topic={modal} onClose={() => setModal(null)} />
    </div>
  );
}
