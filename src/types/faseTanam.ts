export interface FaseTanam {
  id: string;
  nama: string;
  deskripsi: string;
  urutan: number;
  hariMulai: number; // hari setelah tanam
  hariSelesai: number; // hari setelah tanam
  durasi: number; // dalam hari
  warna: string; // untuk visualisasi kalender
  jenisVarietas: string[]; // varietas yang berlaku
  kegiatan: KegiatanFase[];
  indikatorVisual: string[];
  perawatanKhusus: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KegiatanFase {
  id: string;
  nama: string;
  deskripsi: string;
  hariOptimal: number; // hari dalam fase ini
  kategori: 'pemupukan' | 'penyiangan' | 'pengairan' | 'pengendalian_hama' | 'pemeliharaan' | 'panen';
  isMandatory: boolean;
  estimasiWaktu: number; // dalam jam
  peralatan: string[];
  bahan: string[];
}

export interface KalenderTanam {
  id: string;
  namaKalender: string;
  jenisVarietas: string;
  tanggalMulai: string;
  estimasiPanen: string;
  totalDurasi: number; // dalam hari
  faseTanamList: FaseTanameKalender[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdBy: string;
  createdAt: string;
}

export interface FaseTanameKalender {
  faseId: string;
  nama: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'upcoming' | 'active' | 'completed' | 'delayed';
  progress: number; // 0-100
  catatan?: string;
}

export interface VarietasTembakau {
  id: string;
  nama: string;
  deskripsi: string;
  totalDurasiTanam: number; // dalam hari
  kategori: 'Virginia' | 'Burley' | 'Oriental' | 'Rajangan';
  karakteristik: string[];
  syaratTumbuh: {
    iklim: string;
    tanah: string;
    ketinggian: string;
    curahHujan: string;
  };
}

export interface FaseTanamFilters {
  jenisVarietas: string;
  kategoriKegiatan: string;
  status: string;
  urutanFase: string;
}

// Template default untuk fase tanam tembakau
export interface TemplateFaseTanam {
  nama: string;
  deskripsi: string;
  hariMulai: number;
  hariSelesai: number;
  warna: string;
  indikatorVisual: string[];
  kegiatanDefault: Omit<KegiatanFase, 'id'>[];
}
