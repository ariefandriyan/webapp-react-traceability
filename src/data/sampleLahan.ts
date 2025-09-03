import { PlotLahan } from '../types/lahan';

// Sample data plot lahan petani di sekitar Malang, Jawa Timur
// Options untuk filter
export const kelompokTaniOptions = [
  'Kelompok Tani Sejahtera',
  'Kelompok Tani Makmur',
  'Kelompok Tani Jaya',
  'Kelompok Tani Berkah',
  'Kelompok Tani Maju',
  'Kelompok Tani Harapan'
];

export const kecamatanOptions = [
  'Singosari',
  'Lawang',
  'Dau',
  'Karangploso',
  'Pujon',
  'Ngantang'
];

export const samplePlotLahan: PlotLahan[] = [
  {
    id: 'PL001',
    petaniId: 'P001',
    namaPetani: 'Budi Santoso',
    kelompokTani: 'Kelompok Tani Sejahtera',
    luas: 2.5,
    jenisVarietas: 'Virginia',
    statusTanam: 'Tanam',
    tanggalTanam: '2024-01-15',
    estimasiPanen: '2024-05-15',
    coordinates: [
      [-7.8951, 112.6669],
      [-7.8951, 112.6679],
      [-7.8961, 112.6679],
      [-7.8961, 112.6669],
      [-7.8951, 112.6669]
    ],
    center: [-7.8956, 112.6674],
    alamat: 'Desa Ardimulyo',
    kecamatan: 'Singosari',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 450,
    ph: 6.5,
    jenisIrigasi: 'Irigasi Teknis',
    produksiTerakhir: 3200,
    kualitasTerakhir: 'A',
    catatan: 'Lahan dengan irigasi yang baik'
  },
  {
    id: 'PL002',
    petaniId: 'P002',
    namaPetani: 'Siti Aminah',
    kelompokTani: 'Sejahtera Bersama',
    luas: 1.8,
    jenisVarietas: 'Burley',
    statusTanam: 'Panen',
    tanggalTanam: '2024-06-01',
    estimasiPanen: '2024-10-01',
    coordinates: [
      [-7.9686, 112.6366],
      [-7.9686, 112.6386],
      [-7.9666, 112.6386],
      [-7.9666, 112.6366],
      [-7.9686, 112.6366]
    ],
    center: [-7.9676, 112.6376],
    alamat: 'Desa Bantur, Kec. Bantur',
    kecamatan: 'Bantur',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 520,
    ph: 6.0,
    jenisIrigasi: 'Irigasi Teknis',
    produksiTerakhir: 3200,
    kualitasTerakhir: 'A',
    catatan: 'Hasil panen sangat memuaskan'
  },
  {
    id: 'PL003',
    petaniId: 'P003',
    namaPetani: 'Ahmad Wijaya',
    kelompokTani: 'Tani Makmur',
    luas: 3.2,
    jenisVarietas: 'Virginia',
    statusTanam: 'Belum Tanam',
    coordinates: [
      [-7.9706, 112.6306],
      [-7.9706, 112.6336],
      [-7.9676, 112.6336],
      [-7.9676, 112.6306],
      [-7.9706, 112.6306]
    ],
    center: [-7.9691, 112.6321],
    alamat: 'Desa Gedangan, Kec. Gedangan',
    kecamatan: 'Gedangan',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 480,
    ph: 6.5,
    jenisIrigasi: 'Sumur Bor',
    produksiTerakhir: 2600,
    kualitasTerakhir: 'B',
    catatan: 'Sedang persiapan lahan untuk musim tanam berikutnya'
  },
  {
    id: 'PL004',
    petaniId: 'P004',
    namaPetani: 'Rini Handayani',
    kelompokTani: 'Maju Bersama',
    luas: 2.1,
    jenisVarietas: 'Oriental',
    statusTanam: 'Tanam',
    tanggalTanam: '2024-09-01',
    estimasiPanen: '2025-01-01',
    coordinates: [
      [-7.9726, 112.6356],
      [-7.9726, 112.6376],
      [-7.9706, 112.6376],
      [-7.9706, 112.6356],
      [-7.9726, 112.6356]
    ],
    center: [-7.9716, 112.6366],
    alamat: 'Desa Sumbermanjing, Kec. Sumbermanjing',
    kecamatan: 'Sumbermanjing',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 380,
    ph: 6.8,
    jenisIrigasi: 'Sungai',
    produksiTerakhir: 2900,
    kualitasTerakhir: 'A',
    catatan: 'Varietas oriental dengan kualitas premium'
  },
  {
    id: 'PL005',
    petaniId: 'P005',
    namaPetani: 'Joko Susilo',
    kelompokTani: 'Sejahtera Bersama',
    luas: 4.0,
    jenisVarietas: 'Burley',
    statusTanam: 'Istirahat',
    coordinates: [
      [-7.9746, 112.6306],
      [-7.9746, 112.6346],
      [-7.9716, 112.6346],
      [-7.9716, 112.6306],
      [-7.9746, 112.6306]
    ],
    center: [-7.9731, 112.6326],
    alamat: 'Desa Pagak, Kec. Pagak',
    kecamatan: 'Pagak',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 550,
    ph: 5.8,
    jenisIrigasi: 'Tadah Hujan',
    produksiTerakhir: 3100,
    kualitasTerakhir: 'B',
    catatan: 'Lahan sedang istirahat, pemupukan organik'
  },
  {
    id: 'PL006',
    petaniId: 'P006',
    namaPetani: 'Dewi Sartika',
    kelompokTani: 'Maju Bersama',
    luas: 1.5,
    jenisVarietas: 'Virginia',
    statusTanam: 'Tanam',
    tanggalTanam: '2024-08-20',
    estimasiPanen: '2024-12-20',
    coordinates: [
      [-7.9606, 112.6346],
      [-7.9606, 112.6366],
      [-7.9586, 112.6366],
      [-7.9586, 112.6346],
      [-7.9606, 112.6346]
    ],
    center: [-7.9596, 112.6356],
    alamat: 'Desa Ampelgading, Kec. Ampelgading',
    kecamatan: 'Ampelgading',
    kabupaten: 'Malang',
    provinsi: 'Jawa Timur',
    elevasi: 420,
    ph: 6.3,
    jenisIrigasi: 'Irigasi Teknis',
    produksiTerakhir: 2700,
    kualitasTerakhir: 'A',
    catatan: 'Lahan dengan akses jalan yang baik'
  }
];
