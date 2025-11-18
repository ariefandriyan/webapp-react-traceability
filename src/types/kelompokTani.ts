export interface KelompokTani {
  id: string;
  kodeKelompok: string;
  namaKelompok: string;
  ketuaKelompok: string;
  waktuBentuk: string; // Tanggal pembentukan
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos?: string;
  noTelepon: string;
  email?: string;
  jumlahAnggota: number;
  luasTotalLahan: number; // dalam hektar
  komoditasUtama: string;
  statusLegalitas: 'Terdaftar' | 'Belum Terdaftar' | 'Dalam Proses';
  skKelompok?: string; // Nomor SK pembentukan kelompok
  tanggalSK?: string;
  pembina?: string; // Petugas pembina
  bankMitra?: string;
  noRekeningKelompok?: string;
  statusAktif: boolean;
  tanggalDaftar: string;
  catatan?: string;
}

export interface KelompokTaniFilters {
  search?: string;
  statusLegalitas?: string;
  statusAktif?: boolean;
  kecamatan?: string;
  kabupaten?: string;
  komoditasUtama?: string;
}

// Backend interface
export interface KelompokTaniBackend {
  id: number;
  kode_kelompok: string;
  nama_kelompok: string;
  ketua_kelompok: string;
  waktu_bentuk: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota_kabupaten: string;
  provinsi: string;
  kode_pos?: string;
  no_telepon: string;
  email?: string;
  jumlah_anggota?: number;
  luas_total_lahan?: number;
  komoditas_utama: string;
  status_legalitas: 'Terdaftar' | 'Belum Terdaftar' | 'Dalam Proses';
  sk_kelompok?: string;
  tanggal_sk?: string;
  pembina?: string;
  bank_mitra?: string;
  no_rekening_kelompok?: string;
  status: 'aktif' | 'nonaktif';
  tanggal_daftar: string;
  catatan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KelompokTaniStatsResponse {
  total: number;
  aktif: number;
  nonaktif: number;
  terdaftar: number;
  belumTerdaftar: number;
  dalamProses: number;
  totalAnggota: number;
  totalLuasLahan: number;
}

// Mapper functions
export function mapBackendToFrontend(backend: KelompokTaniBackend): KelompokTani {
  return {
    id: backend.id.toString(),
    kodeKelompok: backend.kode_kelompok,
    namaKelompok: backend.nama_kelompok,
    ketuaKelompok: backend.ketua_kelompok,
    waktuBentuk: backend.waktu_bentuk,
    alamat: backend.alamat,
    desa: backend.kelurahan,
    kecamatan: backend.kecamatan,
    kabupaten: backend.kota_kabupaten,
    provinsi: backend.provinsi,
    kodePos: backend.kode_pos,
    noTelepon: backend.no_telepon,
    email: backend.email,
    jumlahAnggota: backend.jumlah_anggota || 0,
    luasTotalLahan: backend.luas_total_lahan || 0,
    komoditasUtama: backend.komoditas_utama,
    statusLegalitas: backend.status_legalitas,
    skKelompok: backend.sk_kelompok,
    tanggalSK: backend.tanggal_sk,
    pembina: backend.pembina,
    bankMitra: backend.bank_mitra,
    noRekeningKelompok: backend.no_rekening_kelompok,
    statusAktif: backend.status === 'aktif',
    tanggalDaftar: backend.tanggal_daftar,
    catatan: backend.catatan
  };
}

export function mapFrontendToBackend(frontend: Partial<KelompokTani>): Partial<KelompokTaniBackend> {
  const backend: Partial<KelompokTaniBackend> = {};
  
  if (frontend.kodeKelompok !== undefined) backend.kode_kelompok = frontend.kodeKelompok;
  if (frontend.namaKelompok !== undefined) backend.nama_kelompok = frontend.namaKelompok;
  if (frontend.ketuaKelompok !== undefined) backend.ketua_kelompok = frontend.ketuaKelompok;
  if (frontend.waktuBentuk !== undefined) backend.waktu_bentuk = frontend.waktuBentuk;
  if (frontend.alamat !== undefined) backend.alamat = frontend.alamat;
  if (frontend.desa !== undefined) backend.kelurahan = frontend.desa;
  if (frontend.kecamatan !== undefined) backend.kecamatan = frontend.kecamatan;
  if (frontend.kabupaten !== undefined) backend.kota_kabupaten = frontend.kabupaten;
  if (frontend.provinsi !== undefined) backend.provinsi = frontend.provinsi;
  if (frontend.kodePos !== undefined) backend.kode_pos = frontend.kodePos;
  if (frontend.noTelepon !== undefined) backend.no_telepon = frontend.noTelepon;
  if (frontend.email !== undefined) backend.email = frontend.email;
  if (frontend.komoditasUtama !== undefined) backend.komoditas_utama = frontend.komoditasUtama;
  if (frontend.statusLegalitas !== undefined) backend.status_legalitas = frontend.statusLegalitas;
  if (frontend.skKelompok !== undefined) backend.sk_kelompok = frontend.skKelompok;
  if (frontend.tanggalSK !== undefined) backend.tanggal_sk = frontend.tanggalSK;
  if (frontend.pembina !== undefined) backend.pembina = frontend.pembina;
  if (frontend.bankMitra !== undefined) backend.bank_mitra = frontend.bankMitra;
  if (frontend.noRekeningKelompok !== undefined) backend.no_rekening_kelompok = frontend.noRekeningKelompok;
  if (frontend.statusAktif !== undefined) backend.status = frontend.statusAktif ? 'aktif' : 'nonaktif';
  if (frontend.tanggalDaftar !== undefined) backend.tanggal_daftar = frontend.tanggalDaftar;
  if (frontend.catatan !== undefined) backend.catatan = frontend.catatan;
  
  return backend;
}

