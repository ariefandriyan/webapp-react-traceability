import { FaseTanam, VarietasTembakau, TemplateFaseTanam } from '../types/faseTanam';

// Template fase tanam standar untuk tembakau
export const templateFaseTanam: TemplateFaseTanam[] = [
  {
    nama: 'Persiapan Lahan',
    deskripsi: 'Fase persiapan dan pengolahan lahan sebelum tanam',
    hariMulai: -14,
    hariSelesai: 0,
    warna: '#8B4513',
    indikatorVisual: [
      'Lahan dibersihkan dari gulma',
      'Tanah diolah dan digemburkan',
      'Bedengan siap tanam'
    ],
    kegiatanDefault: [
      {
        nama: 'Pembersihan Lahan',
        deskripsi: 'Membersihkan lahan dari gulma dan sisa tanaman',
        hariOptimal: -14,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 8,
        peralatan: ['cangkul', 'sabit', 'handsprayer'],
        bahan: ['herbisida (opsional)']
      },
      {
        nama: 'Pengolahan Tanah',
        deskripsi: 'Mengolah tanah dan membuat bedengan',
        hariOptimal: -7,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 12,
        peralatan: ['cangkul', 'garu', 'meteran'],
        bahan: ['pupuk kandang', 'kapur (jika pH rendah)']
      }
    ]
  },
  {
    nama: 'Persemaian',
    deskripsi: 'Fase penyemaian benih hingga bibit siap tanam',
    hariMulai: 0,
    hariSelesai: 35,
    warna: '#90EE90',
    indikatorVisual: [
      'Benih berkecambah dalam 5-7 hari',
      'Daun pertama muncul',
      'Bibit memiliki 4-6 daun',
      'Tinggi bibit 10-15 cm'
    ],
    kegiatanDefault: [
      {
        nama: 'Penyemaian',
        deskripsi: 'Menanam benih di bedengan persemaian',
        hariOptimal: 0,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 4,
        peralatan: ['sprayer', 'ember', 'cetok'],
        bahan: ['benih tembakau', 'media semai', 'fungisida']
      },
      {
        nama: 'Penyiraman Semai',
        deskripsi: 'Penyiraman rutin bibit semai',
        hariOptimal: 7,
        kategori: 'pengairan',
        isMandatory: true,
        estimasiWaktu: 1,
        peralatan: ['sprayer', 'gembor'],
        bahan: ['air']
      },
      {
        nama: 'Pemupukan Semai',
        deskripsi: 'Pemberian pupuk dasar untuk bibit',
        hariOptimal: 14,
        kategori: 'pemupukan',
        isMandatory: true,
        estimasiWaktu: 2,
        peralatan: ['sprayer'],
        bahan: ['pupuk NPK', 'air']
      }
    ]
  },
  {
    nama: 'Fase Vegetatif Awal',
    deskripsi: 'Fase awal pertumbuhan setelah transplanting',
    hariMulai: 35,
    hariSelesai: 60,
    warna: '#32CD32',
    indikatorVisual: [
      'Bibit berhasil beradaptasi setelah tanam',
      'Pertumbuhan daun aktif',
      'Sistem perakaran berkembang',
      'Tinggi tanaman 25-40 cm'
    ],
    kegiatanDefault: [
      {
        nama: 'Transplanting',
        deskripsi: 'Memindahkan bibit ke lahan produksi',
        hariOptimal: 35,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 8,
        peralatan: ['cetok', 'ember', 'meteran'],
        bahan: ['bibit semai', 'air', 'pupuk kandang']
      },
      {
        nama: 'Penyulaman',
        deskripsi: 'Mengganti bibit yang mati atau tidak tumbuh baik',
        hariOptimal: 42,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 3,
        peralatan: ['cetok'],
        bahan: ['bibit cadangan']
      },
      {
        nama: 'Pemupukan I',
        deskripsi: 'Pemupukan susulan pertama',
        hariOptimal: 45,
        kategori: 'pemupukan',
        isMandatory: true,
        estimasiWaktu: 4,
        peralatan: ['cangkul kecil'],
        bahan: ['pupuk NPK', 'pupuk kandang']
      }
    ]
  },
  {
    nama: 'Fase Vegetatif Lanjut',
    deskripsi: 'Fase pertumbuhan vegetatif intensif',
    hariMulai: 60,
    hariSelesai: 90,
    warna: '#228B22',
    indikatorVisual: [
      'Pertumbuhan daun maksimal',
      'Tinggi tanaman 60-80 cm',
      'Daun berwarna hijau pekat',
      'Batang kokoh dan tegak'
    ],
    kegiatanDefault: [
      {
        nama: 'Penyiangan I',
        deskripsi: 'Pembersihan gulma dan penggemburan tanah',
        hariOptimal: 65,
        kategori: 'penyiangan',
        isMandatory: true,
        estimasiWaktu: 6,
        peralatan: ['cangkul', 'kored'],
        bahan: []
      },
      {
        nama: 'Pemupukan II',
        deskripsi: 'Pemupukan susulan kedua',
        hariOptimal: 70,
        kategori: 'pemupukan',
        isMandatory: true,
        estimasiWaktu: 4,
        peralatan: ['cangkul kecil'],
        bahan: ['pupuk NPK', 'pupuk KCl']
      },
      {
        nama: 'Pengendalian Hama I',
        deskripsi: 'Monitoring dan pengendalian hama/penyakit',
        hariOptimal: 75,
        kategori: 'pengendalian_hama',
        isMandatory: false,
        estimasiWaktu: 3,
        peralatan: ['sprayer'],
        bahan: ['insektisida', 'fungisida']
      }
    ]
  },
  {
    nama: 'Fase Generatif',
    deskripsi: 'Fase pembentukan bunga dan biji',
    hariMulai: 90,
    hariSelesai: 120,
    warna: '#FFD700',
    indikatorVisual: [
      'Mulai muncul kuncup bunga',
      'Pembungaan penuh',
      'Tinggi tanaman maksimal 100-120 cm',
      'Daun mencapai ukuran optimal'
    ],
    kegiatanDefault: [
      {
        nama: 'Pemangkasan Tunas',
        deskripsi: 'Memangkas tunas samping untuk fokus pertumbuhan',
        hariOptimal: 95,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 5,
        peralatan: ['gunting pangkas'],
        bahan: []
      },
      {
        nama: 'Penyiangan II',
        deskripsi: 'Penyiangan dan pembumbunan terakhir',
        hariOptimal: 100,
        kategori: 'penyiangan',
        isMandatory: true,
        estimasiWaktu: 6,
        peralatan: ['cangkul', 'kored'],
        bahan: []
      },
      {
        nama: 'Topping',
        deskripsi: 'Memotong pucuk bunga untuk mengoptimalkan daun',
        hariOptimal: 105,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 4,
        peralatan: ['gunting pangkas'],
        bahan: []
      }
    ]
  },
  {
    nama: 'Fase Pematangan',
    deskripsi: 'Fase pematangan daun menuju panen',
    hariMulai: 120,
    hariSelesai: 150,
    warna: '#FF8C00',
    indikatorVisual: [
      'Daun mulai menguning dari bawah',
      'Tekstur daun mengeras',
      'Urat daun jelas terlihat',
      'Daun siap dipetik bertahap'
    ],
    kegiatanDefault: [
      {
        nama: 'Suckering',
        deskripsi: 'Membuang tunas air yang tumbuh setelah topping',
        hariOptimal: 125,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 3,
        peralatan: ['tangan'],
        bahan: []
      },
      {
        nama: 'Monitoring Kematangan',
        deskripsi: 'Memantau tingkat kematangan daun',
        hariOptimal: 135,
        kategori: 'pemeliharaan',
        isMandatory: true,
        estimasiWaktu: 2,
        peralatan: [],
        bahan: []
      }
    ]
  },
  {
    nama: 'Fase Panen',
    deskripsi: 'Fase pemanenan daun tembakau',
    hariMulai: 150,
    hariSelesai: 180,
    warna: '#DC143C',
    indikatorVisual: [
      'Daun bawah matang optimal',
      'Warna kuning kecoklatan',
      'Daun mudah dilepas dari batang',
      'Tidak ada kerusakan fisik'
    ],
    kegiatanDefault: [
      {
        nama: 'Panen Daun Bawah',
        deskripsi: 'Memanen daun tingkat bawah yang sudah matang',
        hariOptimal: 155,
        kategori: 'panen',
        isMandatory: true,
        estimasiWaktu: 8,
        peralatan: ['pisau panen', 'keranjang'],
        bahan: []
      },
      {
        nama: 'Panen Daun Tengah',
        deskripsi: 'Memanen daun tingkat tengah',
        hariOptimal: 165,
        kategori: 'panen',
        isMandatory: true,
        estimasiWaktu: 8,
        peralatan: ['pisau panen', 'keranjang'],
        bahan: []
      },
      {
        nama: 'Panen Daun Atas',
        deskripsi: 'Memanen daun tingkat atas (kualitas terbaik)',
        hariOptimal: 175,
        kategori: 'panen',
        isMandatory: true,
        estimasiWaktu: 8,
        peralatan: ['pisau panen', 'keranjang'],
        bahan: []
      }
    ]
  }
];

// Data varietas tembakau
export const varietasTembakau: VarietasTembakau[] = [
  {
    id: 'VAR001',
    nama: 'Virginia',
    deskripsi: 'Varietas tembakau untuk rokok putih dengan kualitas tinggi',
    totalDurasiTanam: 180,
    kategori: 'Virginia',
    karakteristik: [
      'Daun besar dan tebal',
      'Warna kuning cerah saat matang',
      'Kadar nikotin sedang',
      'Cocok untuk flue-cured'
    ],
    syaratTumbuh: {
      iklim: 'Subtropis hingga tropis, suhu 20-28°C',
      tanah: 'Tanah lempung berpasir, pH 5.5-6.5',
      ketinggian: '200-800 mdpl',
      curahHujan: '1000-1500 mm/tahun'
    }
  },
  {
    id: 'VAR002',
    nama: 'Burley',
    deskripsi: 'Varietas tembakau air-cured dengan daun tebal',
    totalDurasiTanam: 170,
    kategori: 'Burley',
    karakteristik: [
      'Daun tebal dan lebar',
      'Warna coklat muda saat kering',
      'Kadar nikotin tinggi',
      'Cocok untuk air-cured'
    ],
    syaratTumbuh: {
      iklim: 'Subtropis, suhu 18-25°C',
      tanah: 'Tanah subur dengan drainase baik, pH 6.0-7.0',
      ketinggian: '300-1000 mdpl',
      curahHujan: '800-1200 mm/tahun'
    }
  },
  {
    id: 'VAR003',
    nama: 'Oriental',
    deskripsi: 'Varietas tembakau aromatik untuk campuran rokok',
    totalDurasiTanam: 160,
    kategori: 'Oriental',
    karakteristik: [
      'Daun kecil dan aromatik',
      'Warna kuning keemasan',
      'Aroma khas dan kuat',
      'Cocok untuk sun-cured'
    ],
    syaratTumbuh: {
      iklim: 'Mediterania, suhu 15-22°C',
      tanah: 'Tanah berbatu, pH 6.5-7.5',
      ketinggian: '400-800 mdpl',
      curahHujan: '600-900 mm/tahun'
    }
  },
  {
    id: 'VAR004',
    nama: 'Rajangan',
    deskripsi: 'Varietas tembakau lokal untuk rokok kretek',
    totalDurasiTanam: 165,
    kategori: 'Rajangan',
    karakteristik: [
      'Daun sedang dengan aroma khas',
      'Warna coklat kehitaman',
      'Rasa gurih dan manis',
      'Khusus untuk kretek Indonesia'
    ],
    syaratTumbuh: {
      iklim: 'Tropis lembab, suhu 22-30°C',
      tanah: 'Tanah aluvial, pH 6.0-6.8',
      ketinggian: '50-500 mdpl',
      curahHujan: '1200-2000 mm/tahun'
    }
  }
];

// Generate sample fase tanam data
export const sampleFaseTanam: FaseTanam[] = templateFaseTanam.map((template, index) => ({
  id: `FASE${String(index + 1).padStart(3, '0')}`,
  nama: template.nama,
  deskripsi: template.deskripsi,
  urutan: index + 1,
  hariMulai: template.hariMulai,
  hariSelesai: template.hariSelesai,
  durasi: template.hariSelesai - template.hariMulai,
  warna: template.warna,
  jenisVarietas: varietasTembakau.map(v => v.nama),
  kegiatan: template.kegiatanDefault.map((kegiatan, kegiatanIndex) => ({
    id: `KEG${String(index + 1).padStart(3, '0')}${String(kegiatanIndex + 1).padStart(2, '0')}`,
    ...kegiatan
  })),
  indikatorVisual: template.indikatorVisual,
  perawatanKhusus: [
    'Monitoring cuaca dan kelembaban',
    'Pencegahan serangan hama',
    'Kontrol kualitas air irigasi'
  ],
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}));

// Options untuk filter
export const kategoriKegiatanOptions = [
  'pemupukan',
  'penyiangan', 
  'pengairan',
  'pengendalian_hama',
  'pemeliharaan',
  'panen'
];

export const jenisVarietasOptions = varietasTembakau.map(v => v.nama);

export const statusOptions = [
  'upcoming',
  'active', 
  'completed',
  'delayed'
];
