export interface Varietas {
  id: string;
  kodeVarietas: string;
  namaVarietas: string;
  jenisVarietas: 'Virginia' | 'Burley' | 'Oriental' | 'Rajangan' | 'Dark Air Cured' | 'Flue Cured';
  deskripsi: string;
  asalVarietas: string;
  karakteristikDaun: {
    bentukDaun: string;
    ukuranDaun: string;
    warnaDaun: string;
    teksturDaun: string;
    ketebalanDaun: string;
  };
  sifatTanaman: {
    tinggiTanaman: string;
    jumlahDaun: number;
    umurPanen: number; // dalam hari
    dayayaHasil: string;
    ketahananHama: string;
    ketahananPenyakit: string;
  };
  syaratTumbuh: {
    iklim: string;
    suhu: string;
    curahHujan: string;
    kelembaban: string;
    jenisLahan: string;
    pHTanah: string;
    ketinggian: string;
  };
  kualitasHasil: {
    kandunganNikotin: string;
    kandunganGula: string;
    kandunganProtein: string;
    aromaTembakau: string;
    warnaRajangan: string;
    teksturRajangan: string;
  };
  penggunaan: string[];
  statusVarietas: 'Aktif' | 'Tidak Aktif' | 'Uji Coba';
  sumberBenih: string;
  instansiPengembang: string;
  tahunRilis: number;
  sertifikasi: string[];
  catatanKhusus?: string;
  tanggalDaftar: string;
  terakhirDiperbarui: string;
}

export interface VarietasFilters {
  search: string;
  jenisVarietas: string;
  statusVarietas: string;
}

export interface VarietasStats {
  totalVarietas: number;
  varietasAktif: number;
  varietasUjiCoba: number;
  jenisVarietasTerbanyak: string;
}
