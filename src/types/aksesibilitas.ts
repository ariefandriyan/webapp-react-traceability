export interface AksesibilitasLahan {
  id: string;
  petaniId: string;
  namaPetani: string;
  kelompokTani: string;
  lokasiLahan: string;
  koordinat: {
    latitude: number;
    longitude: number;
  };
  alamatLahan: string;
  kecamatan: string;
  desa: string;
  
  // Data Aksesibilitas Jalan
  jenisJalan: 'aspal' | 'beton' | 'tanah' | 'kerikil' | 'paving';
  kondisiJalan: 'baik' | 'sedang' | 'rusak_ringan' | 'rusak_berat';
  lebarJalan: number; // dalam meter
  jarakDariJalanUtama: number; // dalam meter
  aksesKendaraan: 'mobil' | 'motor' | 'sepeda' | 'jalan_kaki';
  
  // Kondisi Cuaca
  aksesMusimHujan: 'mudah' | 'sedang' | 'sulit' | 'tidak_bisa';
  aksesMusimKemarau: 'mudah' | 'sedang' | 'sulit' | 'tidak_bisa';
  
  // Fasilitas Pendukung
  adaPembatasJalan: boolean;
  adaPenerangan: boolean;
  adaPapanNama: boolean;
  adaJembatan: boolean;
  kondisiJembatan?: 'baik' | 'rusak' | 'tidak_ada';
  
  // Estimasi Waktu dan Biaya
  waktuTempuhDariKota: number; // dalam menit
  biayaTransportasi: number; // rupiah per trip
  frekuensiTransportUmum: 'sering' | 'jarang' | 'tidak_ada';
  
  // Kendala dan Catatan
  kendalaUtama: string[];
  solusiYangDiperlukan: string[];
  prioritasUrgency: 'rendah' | 'sedang' | 'tinggi' | 'sangat_tinggi';
  
  // Metadata
  tanggalSurvey: string;
  surveyor: string;
  statusVerifikasi: 'pending' | 'verified' | 'rejected';
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface AksesibilitasFilters {
  jenisJalan: string;
  kondisiJalan: string;
  aksesKendaraan: string;
  kecamatan: string;
  prioritasUrgency: string;
  statusVerifikasi: string;
}

export interface AksesibilitasStatistics {
  total: number;
  aksesibilitasBaik: number;
  aksesibilitasSedang: number;
  aksesibilitasBuruk: number;
  prioritasTinggi: number;
  belumVerifikasi: number;
  rataRataWaktuTempuh: number;
}
