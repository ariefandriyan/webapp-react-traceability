import React, { useState, useEffect } from 'react';
import { Varietas, VarietasFilters } from '../../types/varietas';
import VarietasTable from '../../components/varietas/VarietasTable';
import VarietasForm from '../../components/varietas/VarietasForm';
import VarietasDetailModal from '../../components/varietas/VarietasDetailModal';

// Sample data varietas tembakau
const sampleVarietasData: Varietas[] = [
  {
    id: '1',
    kodeVarietas: 'VT001',
    namaVarietas: 'Virginia Bright 14',
    jenisVarietas: 'Virginia',
    deskripsi: 'Varietas tembakau Virginia dengan kualitas daun yang sangat baik untuk rokok kretek premium',
    asalVarietas: 'Amerika Serikat',
    karakteristikDaun: {
      bentukDaun: 'Elips panjang',
      ukuranDaun: 'Besar (45-55 cm)',
      warnaDaun: 'Hijau terang',
      teksturDaun: 'Halus',
      ketebalanDaun: 'Sedang'
    },
    sifatTanaman: {
      tinggiTanaman: '180-200 cm',
      jumlahDaun: 22,
      umurPanen: 90,
      dayayaHasil: 'Tinggi (2.5-3 ton/ha)',
      ketahananHama: 'Tahan terhadap aphids',
      ketahananPenyakit: 'Tahan TMV, rentan terhadap busuk akar'
    },
    syaratTumbuh: {
      iklim: 'Subtropis hingga tropis',
      suhu: '20-28°C',
      curahHujan: '1000-1200 mm/tahun',
      kelembaban: '60-70%',
      jenisLahan: 'Lahan kering, drainase baik',
      pHTanah: '5.5-6.5',
      ketinggian: '200-800 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '2.5-3.5%',
      kandunganGula: '15-20%',
      kandunganProtein: '8-12%',
      aromaTembakau: 'Manis, ringan',
      warnaRajangan: 'Kuning keemasan',
      teksturRajangan: 'Halus'
    },
    penggunaan: ['Rokok kretek premium', 'Rokok putih', 'Cerutu wrapper'],
    statusVarietas: 'Aktif',
    sumberBenih: 'PT Tembakau Nusantara',
    instansiPengembang: 'Balai Penelitian Tanaman Pemanis dan Serat',
    tahunRilis: 2018,
    sertifikasi: ['Sertifikat Varietas Unggul', 'ISO 9001:2015'],
    catatanKhusus: 'Cocok untuk daerah dengan curah hujan sedang',
    tanggalDaftar: '2018-03-15',
    terakhirDiperbarui: '2024-12-15'
  },
  {
    id: '2',
    kodeVarietas: 'BL002',
    namaVarietas: 'Burley TN-1',
    jenisVarietas: 'Burley',
    deskripsi: 'Varietas Burley lokal hasil pengembangan dengan adaptasi baik di iklim Indonesia',
    asalVarietas: 'Indonesia (hasil silangan)',
    karakteristikDaun: {
      bentukDaun: 'Oval lebar',
      ukuranDaun: 'Sangat besar (50-60 cm)',
      warnaDaun: 'Hijau kekuningan',
      teksturDaun: 'Agak kasar',
      ketebalanDaun: 'Tebal'
    },
    sifatTanaman: {
      tinggiTanaman: '200-220 cm',
      jumlahDaun: 20,
      umurPanen: 85,
      dayayaHasil: 'Sangat tinggi (3-3.5 ton/ha)',
      ketahananHama: 'Tahan ulat grayak',
      ketahananPenyakit: 'Tahan layu bakteri'
    },
    syaratTumbuh: {
      iklim: 'Tropis basah',
      suhu: '22-30°C',
      curahHujan: '1200-1500 mm/tahun',
      kelembaban: '70-80%',
      jenisLahan: 'Lahan sawah, tadah hujan',
      pHTanah: '6.0-7.0',
      ketinggian: '100-600 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '1.5-2.5%',
      kandunganGula: '8-12%',
      kandunganProtein: '12-16%',
      aromaTembakau: 'Nutty, earthy',
      warnaRajangan: 'Coklat muda',
      teksturRajangan: 'Agak kasar'
    },
    penggunaan: ['Rokok kretek', 'Tembakau kunyah', 'Campuran blend'],
    statusVarietas: 'Aktif',
    sumberBenih: 'Balai Benih Tembakau Jember',
    instansiPengembang: 'Universitas Brawijaya',
    tahunRilis: 2020,
    sertifikasi: ['Sertifikat Varietas Lokal Unggul'],
    catatanKhusus: 'Hasil pengembangan khusus untuk iklim tropis Indonesia',
    tanggalDaftar: '2020-07-20',
    terakhirDiperbarui: '2024-11-30'
  },
  {
    id: '3',
    kodeVarietas: 'OR003',
    namaVarietas: 'Oriental Izmir',
    jenisVarietas: 'Oriental',
    deskripsi: 'Varietas Oriental premium dengan aroma khas untuk produk tembakau berkualitas tinggi',
    asalVarietas: 'Turki',
    karakteristikDaun: {
      bentukDaun: 'Bulat kecil',
      ukuranDaun: 'Kecil (15-25 cm)',
      warnaDaun: 'Hijau tua',
      teksturDaun: 'Sangat halus',
      ketebalanDaun: 'Tipis'
    },
    sifatTanaman: {
      tinggiTanaman: '120-150 cm',
      jumlahDaun: 35,
      umurPanen: 110,
      dayayaHasil: 'Sedang (1.5-2 ton/ha)',
      ketahananHama: 'Rentan kutu daun',
      ketahananPenyakit: 'Tahan penyakit virus'
    },
    syaratTumbuh: {
      iklim: 'Mediterania kering',
      suhu: '18-25°C',
      curahHujan: '400-600 mm/tahun',
      kelembaban: '50-60%',
      jenisLahan: 'Lahan kering, berbatu',
      pHTanah: '7.0-8.0',
      ketinggian: '300-1000 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '3.5-4.5%',
      kandunganGula: '12-18%',
      kandunganProtein: '6-10%',
      aromaTembakau: 'Spicy, complex',
      warnaRajangan: 'Kuning emas',
      teksturRajangan: 'Sangat halus'
    },
    penggunaan: ['Rokok premium', 'Cerutu filler', 'Blend aroma'],
    statusVarietas: 'Uji Coba',
    sumberBenih: 'Import dari Turki',
    instansiPengembang: 'Balai Penelitian Tanaman Tembakau Jember',
    tahunRilis: 2022,
    sertifikasi: ['Sertifikat Import Benih'],
    catatanKhusus: 'Sedang dalam tahap adaptasi iklim Indonesia',
    tanggalDaftar: '2022-01-10',
    terakhirDiperbarui: '2024-08-15'
  },
  {
    id: '4',
    kodeVarietas: 'RJ004',
    namaVarietas: 'Rajangan Besuki',
    jenisVarietas: 'Rajangan',
    deskripsi: 'Varietas tradisional Besuki dengan kualitas rajangan terbaik untuk cerutu premium',
    asalVarietas: 'Jember, Jawa Timur',
    karakteristikDaun: {
      bentukDaun: 'Elips besar',
      ukuranDaun: 'Sangat besar (60-70 cm)',
      warnaDaun: 'Hijau gelap',
      teksturDaun: 'Halus elastis',
      ketebalanDaun: 'Sedang hingga tebal'
    },
    sifatTanaman: {
      tinggiTanaman: '220-250 cm',
      jumlahDaun: 18,
      umurPanen: 95,
      dayayaHasil: 'Tinggi (2.8-3.2 ton/ha)',
      ketahananHama: 'Tahan thrips',
      ketahananPenyakit: 'Tahan busuk hitam'
    },
    syaratTumbuh: {
      iklim: 'Tropis lembab',
      suhu: '24-28°C',
      curahHujan: '1400-1800 mm/tahun',
      kelembaban: '75-85%',
      jenisLahan: 'Lahan sawah, alluvial',
      pHTanah: '6.5-7.5',
      ketinggian: '50-200 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '2.0-3.0%',
      kandunganGula: '10-15%',
      kandunganProtein: '10-14%',
      aromaTembakau: 'Earthy, rich',
      warnaRajangan: 'Coklat kemerahan',
      teksturRajangan: 'Elastis'
    },
    penggunaan: ['Cerutu wrapper', 'Cerutu binder', 'Rokok kretek premium'],
    statusVarietas: 'Aktif',
    sumberBenih: 'Koperasi Tani Besuki',
    instansiPengembang: 'Dinas Pertanian Jember',
    tahunRilis: 1995,
    sertifikasi: ['Sertifikat Varietas Lokal', 'Indikasi Geografis Besuki'],
    catatanKhusus: 'Varietas warisan budaya Besuki dengan kualitas dunia',
    tanggalDaftar: '1995-12-01',
    terakhirDiperbarui: '2024-10-20'
  },
  {
    id: '5',
    kodeVarietas: 'DC005',
    namaVarietas: 'Dark Air Cured Prima',
    jenisVarietas: 'Dark Air Cured',
    deskripsi: 'Varietas tembakau gelap dengan proses curing udara untuk produk tembakau khusus',
    asalVarietas: 'Kentucky, Amerika Serikat',
    karakteristikDaun: {
      bentukDaun: 'Oval memanjang',
      ukuranDaun: 'Besar (40-50 cm)',
      warnaDaun: 'Hijau gelap keunguan',
      teksturDaun: 'Agak kasar',
      ketebalanDaun: 'Tebal'
    },
    sifatTanaman: {
      tinggiTanaman: '160-180 cm',
      jumlahDaun: 24,
      umurPanen: 100,
      dayayaHasil: 'Sedang (2-2.5 ton/ha)',
      ketahananHama: 'Tahan hornworm',
      ketahananPenyakit: 'Rentan black shank'
    },
    syaratTumbuh: {
      iklim: 'Kontinental sedang',
      suhu: '16-24°C',
      curahHujan: '800-1000 mm/tahun',
      kelembaban: '65-75%',
      jenisLahan: 'Lahan kering, subur',
      pHTanah: '6.0-6.8',
      ketinggian: '400-800 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '3.0-4.0%',
      kandunganGula: '5-8%',
      kandunganProtein: '14-18%',
      aromaTembakau: 'Strong, robust',
      warnaRajangan: 'Coklat tua',
      teksturRajangan: 'Kasar'
    },
    penggunaan: ['Tembakau kunyah', 'Tembakau pipa', 'Campuran rokok kuat'],
    statusVarietas: 'Tidak Aktif',
    sumberBenih: 'Import Amerika Serikat',
    instansiPengembang: 'Balai Penelitian Tanaman Tembakau',
    tahunRilis: 2010,
    sertifikasi: ['Sertifikat Import'],
    catatanKhusus: 'Dihentikan karena tidak cocok dengan iklim tropis Indonesia',
    tanggalDaftar: '2010-05-15',
    terakhirDiperbarui: '2023-03-10'
  },
  {
    id: '6',
    kodeVarietas: 'FC006',
    namaVarietas: 'Flue Cured Gold',
    jenisVarietas: 'Flue Cured',
    deskripsi: 'Varietas modern dengan teknologi curing cerobong untuk kualitas premium',
    asalVarietas: 'Brasil',
    karakteristikDaun: {
      bentukDaun: 'Elips sedang',
      ukuranDaun: 'Sedang (35-45 cm)',
      warnaDaun: 'Hijau cerah',
      teksturDaun: 'Halus',
      ketebalanDaun: 'Sedang'
    },
    sifatTanaman: {
      tinggiTanaman: '170-190 cm',
      jumlahDaun: 26,
      umurPanen: 88,
      dayayaHasil: 'Tinggi (2.8-3.3 ton/ha)',
      ketahananHama: 'Tahan wireworm',
      ketahananPenyakit: 'Tahan TSWV'
    },
    syaratTumbuh: {
      iklim: 'Subtropis hingga tropis',
      suhu: '21-27°C',
      curahHujan: '1100-1300 mm/tahun',
      kelembaban: '65-75%',
      jenisLahan: 'Lahan kering, sandy loam',
      pHTanah: '5.8-6.5',
      ketinggian: '300-700 mdpl'
    },
    kualitasHasil: {
      kandunganNikotin: '2.8-3.8%',
      kandunganGula: '18-22%',
      kandunganProtein: '7-11%',
      aromaTembakau: 'Sweet, mild',
      warnaRajangan: 'Kuning bright',
      teksturRajangan: 'Halus elastis'
    },
    penggunaan: ['Rokok putih premium', 'Export blend', 'Cerutu mild'],
    statusVarietas: 'Uji Coba',
    sumberBenih: 'Kerjasama dengan Brasil',
    instansiPengembang: 'Institut Teknologi Tembakau',
    tahunRilis: 2023,
    sertifikasi: ['Sertifikat Uji Coba Lapang'],
    catatanKhusus: 'Dalam tahap evaluasi untuk pelepasan varietas',
    tanggalDaftar: '2023-09-01',
    terakhirDiperbarui: '2024-12-01'
  }
];

const VarietasPage: React.FC = () => {
  const [varietasData, setVarietasData] = useState<Varietas[]>(sampleVarietasData);
  const [filteredData, setFilteredData] = useState<Varietas[]>(sampleVarietasData);
  const [filters, setFilters] = useState<VarietasFilters>({
    search: '',
    jenisVarietas: '',
    statusVarietas: ''
  });
  
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedVarietas, setSelectedVarietas] = useState<Varietas | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter data when filters change
  useEffect(() => {
    let filtered = varietasData;

    if (filters.search) {
      filtered = filtered.filter(varietas =>
        varietas.namaVarietas.toLowerCase().includes(filters.search.toLowerCase()) ||
        varietas.kodeVarietas.toLowerCase().includes(filters.search.toLowerCase()) ||
        varietas.asalVarietas.toLowerCase().includes(filters.search.toLowerCase()) ||
        varietas.instansiPengembang.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.jenisVarietas) {
      filtered = filtered.filter(varietas => varietas.jenisVarietas === filters.jenisVarietas);
    }

    if (filters.statusVarietas) {
      filtered = filtered.filter(varietas => varietas.statusVarietas === filters.statusVarietas);
    }

    setFilteredData(filtered);
  }, [filters, varietasData]);

  // Calculate statistics
  const stats = {
    totalVarietas: varietasData.length,
    varietasAktif: varietasData.filter(v => v.statusVarietas === 'Aktif').length,
    varietasUjiCoba: varietasData.filter(v => v.statusVarietas === 'Uji Coba').length,
    jenisVarietasTerbanyak: 'Virginia' // Could be calculated dynamically
  };

  const handleAddVarietas = () => {
    setSelectedVarietas(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditVarietas = (varietas: Varietas) => {
    setSelectedVarietas(varietas);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteVarietas = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data varietas ini?')) {
      setVarietasData(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleViewDetail = (varietas: Varietas) => {
    setSelectedVarietas(varietas);
    setShowDetail(true);
  };

  const handleSaveVarietas = (varietasData: Omit<Varietas, 'id' | 'tanggalDaftar' | 'terakhirDiperbarui'>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (isEditing && selectedVarietas) {
      // Update existing varietas
      const updatedVarietas: Varietas = {
        ...varietasData,
        id: selectedVarietas.id,
        tanggalDaftar: selectedVarietas.tanggalDaftar,
        terakhirDiperbarui: currentDate
      };
      
      setVarietasData(prev => prev.map(v => 
        v.id === selectedVarietas.id ? updatedVarietas : v
      ));
    } else {
      // Add new varietas
      const newVarietas: Varietas = {
        ...varietasData,
        id: Date.now().toString(),
        tanggalDaftar: currentDate,
        terakhirDiperbarui: currentDate
      };
      
      setVarietasData(prev => [...prev, newVarietas]);
    }
    
    setShowForm(false);
    setSelectedVarietas(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Data Varietas Tembakau</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Kelola data varietas tembakau dan karakteristiknya
          </p>
        </div>
        <button
          onClick={handleAddVarietas}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Varietas
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Varietas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalVarietas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Varietas Aktif</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.varietasAktif}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uji Coba</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.varietasUjiCoba}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Jenis Terbanyak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.jenisVarietasTerbanyak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Varietas Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <VarietasTable
          data={filteredData}
          filters={filters}
          onFiltersChange={setFilters}
          onEdit={handleEditVarietas}
          onDelete={handleDeleteVarietas}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <VarietasForm
          varietas={selectedVarietas}
          isEditing={isEditing}
          onSave={handleSaveVarietas}
          onCancel={() => {
            setShowForm(false);
            setSelectedVarietas(null);
            setIsEditing(false);
          }}
        />
      )}

      {/* Detail Modal */}
      {showDetail && selectedVarietas && (
        <VarietasDetailModal
          varietas={selectedVarietas}
          onClose={() => {
            setShowDetail(false);
            setSelectedVarietas(null);
          }}
        />
      )}
    </div>
  );
};

export default VarietasPage;
