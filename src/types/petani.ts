// Backend API response types
export interface PetaniBackend {
  id: number;
  nik: string;
  nama_lengkap: string;
  tempat_lahir: string | null;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  status_perkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati' | null;
  pendidikan: 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2' | 'S3' | null;
  pekerjaan: string | null;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kabupaten: string;
  provinsi: string;
  kode_pos: string | null;
  no_telepon: string;
  email: string | null;
  kelompok_tani_id: number | null;
  status_kepemilikan_lahan: 'Milik Sendiri' | 'Sewa' | 'Bagi Hasil' | 'Lainnya' | null;
  luas_lahan: number | null;
  status: 'aktif' | 'nonaktif';
  catatan: string | null;
  created_at: string;
  updated_at: string;
}

// Frontend interface (sesuai dengan yang sudah ada)
export interface Petani {
  id: string;
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  noTelepon: string;
  email?: string;
  statusPerkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  pendidikan: 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2' | 'S3';
  pekerjaan: string;
  statusKepemilikanLahan: 'Milik Sendiri' | 'Sewa' | 'Bagi Hasil' | 'Lainnya';
  luasLahan: number; // dalam hektar
  kelompokTani?: string;
  statusAktif: boolean;
  tanggalDaftar: string;
  catatan?: string;
}

export interface PetaniFormData extends Omit<Petani, 'id' | 'tanggalDaftar'> {}

export interface PetaniFilters {
  nama?: string;
  nik?: string;
  kelompokTani?: string;
  statusAktif?: boolean;
  kabupaten?: string;
}

// API Request/Response types
export interface PetaniApiResponse {
  success: boolean;
  message: string;
  data?: PetaniBackend | PetaniBackend[];
  total?: number;
  page?: number;
  limit?: number;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PetaniStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    aktif: number;
    nonaktif: number;
    totalLahan: number;
    avgLahan: number;
    kelompokTaniCount: number;
  };
}

// Helper functions untuk konversi backend <-> frontend
export const mapBackendToFrontend = (backend: PetaniBackend): Petani => {
  return {
    id: backend.id.toString(),
    nama: backend.nama_lengkap,
    nik: backend.nik,
    tempatLahir: backend.tempat_lahir || '',
    tanggalLahir: backend.tanggal_lahir,
    jenisKelamin: backend.jenis_kelamin,
    alamat: backend.alamat,
    desa: backend.kelurahan,
    kecamatan: backend.kecamatan,
    kabupaten: backend.kota_kabupaten,
    provinsi: backend.provinsi,
    kodePos: backend.kode_pos || '',
    noTelepon: backend.no_telepon,
    email: backend.email || '',
    statusPerkawinan: backend.status_perkawinan || 'Belum Kawin',
    pendidikan: backend.pendidikan || 'SMA',
    pekerjaan: backend.pekerjaan || 'Petani',
    statusKepemilikanLahan: backend.status_kepemilikan_lahan || 'Milik Sendiri',
    luasLahan: backend.luas_lahan || 0,
    kelompokTani: backend.kelompok_tani_id?.toString() || '',
    statusAktif: backend.status === 'aktif',
    tanggalDaftar: backend.created_at,
    catatan: backend.catatan || ''
  };
};

export const mapFrontendToBackend = (frontend: Partial<Petani>): Partial<PetaniBackend> => {
  const payload: any = {};
  
  if (frontend.nik) payload.nik = frontend.nik;
  if (frontend.nama) payload.nama_lengkap = frontend.nama;
  if (frontend.tempatLahir) payload.tempat_lahir = frontend.tempatLahir;
  if (frontend.tanggalLahir) payload.tanggal_lahir = frontend.tanggalLahir;
  if (frontend.jenisKelamin) payload.jenis_kelamin = frontend.jenisKelamin;
  if (frontend.statusPerkawinan) payload.status_perkawinan = frontend.statusPerkawinan;
  if (frontend.pendidikan) payload.pendidikan = frontend.pendidikan;
  if (frontend.pekerjaan) payload.pekerjaan = frontend.pekerjaan;
  if (frontend.alamat) payload.alamat = frontend.alamat;
  if (frontend.desa) payload.kelurahan = frontend.desa;
  if (frontend.kecamatan) payload.kecamatan = frontend.kecamatan;
  if (frontend.kabupaten) payload.kota_kabupaten = frontend.kabupaten;
  if (frontend.provinsi) payload.provinsi = frontend.provinsi;
  if (frontend.kodePos) payload.kode_pos = frontend.kodePos;
  if (frontend.noTelepon) payload.no_telepon = frontend.noTelepon;
  if (frontend.email) payload.email = frontend.email;
  if (frontend.kelompokTani) payload.kelompok_tani_id = parseInt(frontend.kelompokTani) || null;
  if (frontend.statusKepemilikanLahan) payload.status_kepemilikan_lahan = frontend.statusKepemilikanLahan;
  if (frontend.luasLahan !== undefined) payload.luas_lahan = frontend.luasLahan;
  if (frontend.statusAktif !== undefined) payload.status = frontend.statusAktif ? 'aktif' : 'nonaktif';
  if (frontend.catatan) payload.catatan = frontend.catatan;
  
  return payload;
}
