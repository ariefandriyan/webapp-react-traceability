import { AksesibilitasJalan } from '../types/aksesibilitasJalan';

export const sampleAksesibilitasJalan: AksesibilitasJalan[] = [
  {
    id: '1',
    namaJalan: 'Jl. Desa Wonokerto',
    kecamatan: 'Poncokusumo',
    desa: 'Wonokerto',
    jenisJalan: 'aspal',
    kondisiJalan: 'baik',
    lebarJalan: 4.5,
    panjangJalan: 2500,
    aksesKendaraan: 'mobil',
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    adaPenerangan: true,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    adaDrainase: true,
    kondisiDrainase: 'baik',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    catatan: 'Jalan akses utama ke area pertanian tembakau dengan kondisi sangat baik'
  },
  {
    id: '2',
    namaJalan: 'Jl. Sawah Tengah',
    kecamatan: 'Poncokusumo',
    desa: 'Gubugklakah',
    jenisJalan: 'kerikil',
    kondisiJalan: 'sedang',
    lebarJalan: 3.0,
    panjangJalan: 1800,
    aksesKendaraan: 'motor',
    aksesMusimHujan: 'sedang',
    aksesMusimKemarau: 'mudah',
    adaPenerangan: false,
    adaJembatan: true,
    kondisiJembatan: 'baik',
    adaDrainase: false,
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-02-01T09:15:00Z',
    catatan: 'Jalan menuju lahan tembakau di area tengah, perlu perbaikan drainase'
  },
  {
    id: '3',
    namaJalan: 'Jl. Petani Sejahtera',
    kecamatan: 'Kasembon',
    desa: 'Bayem',
    jenisJalan: 'tanah',
    kondisiJalan: 'rusak_ringan',
    lebarJalan: 2.5,
    panjangJalan: 1200,
    aksesKendaraan: 'motor',
    aksesMusimHujan: 'sulit',
    aksesMusimKemarau: 'sedang',
    adaPenerangan: false,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    adaDrainase: false,
    createdAt: '2025-02-05T08:20:00Z',
    updatedAt: '2025-02-05T08:20:00Z',
    catatan: 'Jalan tanah yang rusak saat musim hujan, sangat mempengaruhi akses petani'
  },
  {
    id: '4',
    namaJalan: 'Jl. Kebun Raya',
    kecamatan: 'Wajak',
    desa: 'Kidangbang',
    jenisJalan: 'paving',
    kondisiJalan: 'baik',
    lebarJalan: 3.5,
    panjangJalan: 3200,
    aksesKendaraan: 'mobil',
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    adaPenerangan: true,
    adaJembatan: true,
    kondisiJembatan: 'baik',
    adaDrainase: true,
    kondisiDrainase: 'baik',
    createdAt: '2025-01-10T16:45:00Z',
    updatedAt: '2025-01-25T11:30:00Z',
    catatan: 'Infrastruktur jalan lengkap dengan fasilitas pendukung yang memadai'
  },
  {
    id: '5',
    namaJalan: 'Jl. Tembakau Utara',
    kecamatan: 'Tumpang',
    desa: 'Jatiarjo',
    jenisJalan: 'beton',
    kondisiJalan: 'rusak_berat',
    lebarJalan: 4.0,
    panjangJalan: 2100,
    aksesKendaraan: 'jalan_kaki',
    aksesMusimHujan: 'tidak_bisa',
    aksesMusimKemarau: 'sulit',
    adaPenerangan: false,
    adaJembatan: true,
    kondisiJembatan: 'rusak',
    adaDrainase: true,
    kondisiDrainase: 'buruk',
    createdAt: '2025-01-08T13:15:00Z',
    updatedAt: '2025-02-03T15:20:00Z',
    catatan: 'Jalan beton rusak parah, jembatan perlu perbaikan mendesak, drainase tersumbat'
  },
  {
    id: '6',
    namaJalan: 'Jl. Ladang Produktif',
    kecamatan: 'Ngantang',
    desa: 'Tulungrejo',
    jenisJalan: 'kerikil',
    kondisiJalan: 'baik',
    lebarJalan: 3.8,
    panjangJalan: 1950,
    aksesKendaraan: 'mobil',
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    adaPenerangan: false,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    adaDrainase: true,
    kondisiDrainase: 'sedang',
    createdAt: '2025-01-12T09:30:00Z',
    updatedAt: '2025-01-30T14:10:00Z',
    catatan: 'Jalan kerikil dalam kondisi baik, drainase perlu perawatan rutin'
  }
];

export const jenisJalanOptions = [
  { value: 'aspal', label: 'Aspal' },
  { value: 'beton', label: 'Beton' },
  { value: 'tanah', label: 'Tanah' },
  { value: 'kerikil', label: 'Kerikil' },
  { value: 'paving', label: 'Paving' }
];

export const kondisiJalanOptions = [
  { value: 'baik', label: 'Baik' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'rusak_ringan', label: 'Rusak Ringan' },
  { value: 'rusak_berat', label: 'Rusak Berat' }
];

export const aksesKendaraanOptions = [
  { value: 'mobil', label: 'Mobil' },
  { value: 'motor', label: 'Motor' },
  { value: 'sepeda', label: 'Sepeda' },
  { value: 'jalan_kaki', label: 'Jalan Kaki' }
];

export const prioritasOptions = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'sangat_tinggi', label: 'Sangat Tinggi' }
];

export const kecamatanOptions = [
  { value: 'Poncokusumo', label: 'Poncokusumo' },
  { value: 'Kasembon', label: 'Kasembon' },
  { value: 'Wajak', label: 'Wajak' },
  { value: 'Tumpang', label: 'Tumpang' },
  { value: 'Ngantang', label: 'Ngantang' }
];
