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
