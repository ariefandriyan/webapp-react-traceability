export interface PestisidaData {
  id: string;
  merek: string;
  namaPestisida: string;
  jenisHama: string[];
  bentukSediaan: 'Cair' | 'Granul' | 'Tablet' | 'Bubuk' | 'Emulsi';
  kandunganAktif: string;
  konsentrasi: string;
  dosisRekomendasi: string;
  masaKarensi: number; // dalam hari
  kategoriRisiko: 'Rendah' | 'Sedang' | 'Tinggi';
  nomorRegistrasi: string;
  produsen: string;
  tanggalProduksi?: string;
  tanggalKadaluarsa?: string;
  petunjukPenggunaan: string;
  peringatanKeamanan: string[];
  statusAktif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PestisidaFormData {
  merek: string;
  namaPestisida: string;
  jenisHama: string[];
  bentukSediaan: 'Cair' | 'Granul' | 'Tablet' | 'Bubuk' | 'Emulsi';
  kandunganAktif: string;
  konsentrasi: string;
  dosisRekomendasi: string;
  masaKarensi: number;
  kategoriRisiko: 'Rendah' | 'Sedang' | 'Tinggi';
  nomorRegistrasi: string;
  produsen: string;
  tanggalProduksi?: string;
  tanggalKadaluarsa?: string;
  petunjukPenggunaan: string;
  peringatanKeamanan: string[];
  statusAktif: boolean;
}

export interface PestisidaStats {
  totalPestisida: number;
  totalAktif: number;
  risikoRendah: number;
  risikoSedang: number;
  risikoTinggi: number;
}
