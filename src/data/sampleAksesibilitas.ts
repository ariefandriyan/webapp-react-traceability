import { AksesibilitasLahan } from '../types/aksesibilitas';

export const sampleAksesibilitasLahan: AksesibilitasLahan[] = [
  {
    id: 'AKS001',
    petaniId: 'P001',
    namaPetani: 'Budi Santoso',
    kelompokTani: 'Kelompok Tani Sejahtera',
    lokasiLahan: 'Blok A1',
    koordinat: {
      latitude: -7.8951,
      longitude: 112.6669
    },
    alamatLahan: 'Jl. Raya Singosari Km 12',
    kecamatan: 'Singosari',
    desa: 'Ardimulyo',
    
    jenisJalan: 'aspal',
    kondisiJalan: 'baik',
    lebarJalan: 4.5,
    jarakDariJalanUtama: 50,
    aksesKendaraan: 'mobil',
    
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    
    adaPembatasJalan: true,
    adaPenerangan: true,
    adaPapanNama: true,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    
    waktuTempuhDariKota: 25,
    biayaTransportasi: 15000,
    frekuensiTransportUmum: 'sering',
    
    kendalaUtama: ['Tidak ada kendala berarti'],
    solusiYangDiperlukan: ['Pemeliharaan rutin jalan'],
    prioritasUrgency: 'rendah',
    
    tanggalSurvey: '2024-01-15',
    surveyor: 'Ahmad Surveyor',
    statusVerifikasi: 'verified',
    catatan: 'Aksesibilitas sangat baik, infrastruktur mendukung',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'AKS002',
    petaniId: 'P002',
    namaPetani: 'Siti Rahayu',
    kelompokTani: 'Kelompok Tani Makmur',
    lokasiLahan: 'Blok B2',
    koordinat: {
      latitude: -7.9123,
      longitude: 112.6502
    },
    alamatLahan: 'Dusun Krajan RT 02/RW 01',
    kecamatan: 'Lawang',
    desa: 'Ketindan',
    
    jenisJalan: 'tanah',
    kondisiJalan: 'rusak_ringan',
    lebarJalan: 2.5,
    jarakDariJalanUtama: 500,
    aksesKendaraan: 'motor',
    
    aksesMusimHujan: 'sulit',
    aksesMusimKemarau: 'sedang',
    
    adaPembatasJalan: false,
    adaPenerangan: false,
    adaPapanNama: false,
    adaJembatan: true,
    kondisiJembatan: 'rusak',
    
    waktuTempuhDariKota: 45,
    biayaTransportasi: 25000,
    frekuensiTransportUmum: 'jarang',
    
    kendalaUtama: [
      'Jalan tanah licin saat hujan',
      'Jembatan kayu rusak',
      'Tidak ada penerangan jalan'
    ],
    solusiYangDiperlukan: [
      'Perbaikan jalan dengan hotmix',
      'Renovasi jembatan',
      'Pemasangan lampu jalan'
    ],
    prioritasUrgency: 'tinggi',
    
    tanggalSurvey: '2024-01-18',
    surveyor: 'Dewi Surveyor',
    statusVerifikasi: 'verified',
    catatan: 'Perlu perbaikan infrastruktur segera',
    createdAt: '2024-01-18T09:30:00Z',
    updatedAt: '2024-01-18T09:30:00Z'
  },
  {
    id: 'AKS003',
    petaniId: 'P003',
    namaPetani: 'Agus Wijaya',
    kelompokTani: 'Kelompok Tani Jaya',
    lokasiLahan: 'Blok C3',
    koordinat: {
      latitude: -7.8745,
      longitude: 112.6890
    },
    alamatLahan: 'Jl. Desa Pagerwojo No. 45',
    kecamatan: 'Dau',
    desa: 'Pagerwojo',
    
    jenisJalan: 'kerikil',
    kondisiJalan: 'sedang',
    lebarJalan: 3.0,
    jarakDariJalanUtama: 200,
    aksesKendaraan: 'mobil',
    
    aksesMusimHujan: 'sedang',
    aksesMusimKemarau: 'mudah',
    
    adaPembatasJalan: true,
    adaPenerangan: false,
    adaPapanNama: true,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    
    waktuTempuhDariKota: 35,
    biayaTransportasi: 20000,
    frekuensiTransportUmum: 'jarang',
    
    kendalaUtama: [
      'Jalan berbatu saat kemarau berdebu',
      'Genangan air saat musim hujan'
    ],
    solusiYangDiperlukan: [
      'Penyiraman jalan rutin',
      'Perbaikan sistem drainase'
    ],
    prioritasUrgency: 'sedang',
    
    tanggalSurvey: '2024-01-20',
    surveyor: 'Rudi Surveyor',
    statusVerifikasi: 'pending',
    catatan: 'Kondisi cukup baik, perlu perawatan minor',
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  },
  {
    id: 'AKS004',
    petaniId: 'P004',
    namaPetani: 'Rina Kartika',
    kelompokTani: 'Kelompok Tani Berkah',
    lokasiLahan: 'Blok D4',
    koordinat: {
      latitude: -7.9234,
      longitude: 112.6345
    },
    alamatLahan: 'Dusun Sumber RT 01/RW 02',
    kecamatan: 'Karangploso',
    desa: 'Sumber',
    
    jenisJalan: 'beton',
    kondisiJalan: 'baik',
    lebarJalan: 5.0,
    jarakDariJalanUtama: 100,
    aksesKendaraan: 'mobil',
    
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    
    adaPembatasJalan: true,
    adaPenerangan: true,
    adaPapanNama: true,
    adaJembatan: true,
    kondisiJembatan: 'baik',
    
    waktuTempuhDariKota: 30,
    biayaTransportasi: 18000,
    frekuensiTransportUmum: 'sering',
    
    kendalaUtama: ['Tidak ada kendala'],
    solusiYangDiperlukan: ['Pemeliharaan preventif'],
    prioritasUrgency: 'rendah',
    
    tanggalSurvey: '2024-01-22',
    surveyor: 'Lisa Surveyor',
    statusVerifikasi: 'verified',
    catatan: 'Infrastruktur excellent, akses sangat mudah',
    createdAt: '2024-01-22T08:45:00Z',
    updatedAt: '2024-01-22T08:45:00Z'
  },
  {
    id: 'AKS005',
    petaniId: 'P005',
    namaPetani: 'Joko Susilo',
    kelompokTani: 'Kelompok Tani Maju',
    lokasiLahan: 'Blok E5',
    koordinat: {
      latitude: -7.8567,
      longitude: 112.7123
    },
    alamatLahan: 'Jl. Perkebunan Km 8',
    kecamatan: 'Pujon',
    desa: 'Tawangargo',
    
    jenisJalan: 'tanah',
    kondisiJalan: 'rusak_berat',
    lebarJalan: 2.0,
    jarakDariJalanUtama: 1000,
    aksesKendaraan: 'sepeda',
    
    aksesMusimHujan: 'tidak_bisa',
    aksesMusimKemarau: 'sulit',
    
    adaPembatasJalan: false,
    adaPenerangan: false,
    adaPapanNama: false,
    adaJembatan: true,
    kondisiJembatan: 'rusak',
    
    waktuTempuhDariKota: 60,
    biayaTransportasi: 35000,
    frekuensiTransportUmum: 'tidak_ada',
    
    kendalaUtama: [
      'Jalan tanah rusak berat',
      'Tidak bisa dilewati kendaraan bermotor',
      'Jembatan bambu hampir roboh',
      'Tidak ada transportasi umum'
    ],
    solusiYangDiperlukan: [
      'Pembangunan jalan cor beton',
      'Pembangunan jembatan permanen',
      'Pemasangan rambu dan penerangan',
      'Penyediaan transportasi umum'
    ],
    prioritasUrgency: 'sangat_tinggi',
    
    tanggalSurvey: '2024-01-25',
    surveyor: 'Bambang Surveyor',
    statusVerifikasi: 'verified',
    catatan: 'Kondisi sangat buruk, butuh prioritas pembangunan',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-25T14:20:00Z'
  }
];

// Options untuk dropdown dan filter
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

export const aksesMusimOptions = [
  { value: 'mudah', label: 'Mudah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'sulit', label: 'Sulit' },
  { value: 'tidak_bisa', label: 'Tidak Bisa' }
];

export const prioritasOptions = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'sangat_tinggi', label: 'Sangat Tinggi' }
];

export const statusVerifikasiOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' }
];

export const frekuensiTransportOptions = [
  { value: 'sering', label: 'Sering' },
  { value: 'jarang', label: 'Jarang' },
  { value: 'tidak_ada', label: 'Tidak Ada' }
];

export const kondisiJembatanOptions = [
  { value: 'baik', label: 'Baik' },
  { value: 'rusak', label: 'Rusak' },
  { value: 'tidak_ada', label: 'Tidak Ada' }
];

export const kecamatanOptions = [
  'Singosari',
  'Lawang', 
  'Dau',
  'Karangploso',
  'Pujon',
  'Ngantang'
];
