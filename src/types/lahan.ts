export interface PlotLahan {
  id: string;
  petaniId: string;
  namaPetani: string;
  kelompokTani: string;
  luas: number; // dalam hektar
  jenisVarietas: string;
  statusTanam: 'Belum Tanam' | 'Tanam' | 'Panen' | 'Istirahat';
  tanggalTanam?: string;
  estimasiPanen?: string;
  coordinates: [number, number][]; // polygon coordinates [lat, lng]
  center: [number, number]; // center point [lat, lng]
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  elevasi?: number; // dalam meter
  ph?: number;
  jenisIrigasi: 'Tadah Hujan' | 'Irigasi Teknis' | 'Sumur Bor' | 'Sungai';
  produksiTerakhir?: number; // kg per hektar
  kualitasTerakhir?: 'A' | 'B' | 'C';
  catatan?: string;
}

export interface MapFilters {
  kelompokTani: string;
  jenisVarietas: string;
  statusTanam: string;
  kecamatan: string;
  luasMin: number;
  luasMax: number;
}
