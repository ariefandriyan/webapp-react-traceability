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
