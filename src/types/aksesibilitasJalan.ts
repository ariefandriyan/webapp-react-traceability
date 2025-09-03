export interface AksesibilitasJalan {
  id: string;
  namaJalan: string;
  kecamatan: string;
  desa: string;
  
  // Kondisi Jalan
  jenisJalan: 'aspal' | 'beton' | 'tanah' | 'kerikil' | 'paving';
  kondisiJalan: 'baik' | 'sedang' | 'rusak_ringan' | 'rusak_berat';
  lebarJalan: number; // dalam meter
  panjangJalan: number; // dalam meter
  
  // Akses
  aksesKendaraan: 'mobil' | 'motor' | 'sepeda' | 'jalan_kaki';
  
  // Kondisi Cuaca
  aksesMusimHujan: 'mudah' | 'sedang' | 'sulit' | 'tidak_bisa';
  aksesMusimKemarau: 'mudah' | 'sedang' | 'sulit' | 'tidak_bisa';
  
  // Fasilitas
  adaPenerangan: boolean;
  adaJembatan: boolean;
  kondisiJembatan?: 'baik' | 'rusak' | 'tidak_ada';
  adaDrainase: boolean;
  kondisiDrainase?: 'baik' | 'sedang' | 'buruk';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  catatan?: string;
}

export interface AksesibilitasJalanFilters {
  jenisJalan: string;
  kondisiJalan: string;
  aksesKendaraan: string;
  kecamatan: string;
}
