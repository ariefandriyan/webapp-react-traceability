import React, { useState, useMemo } from 'react';
import Toast from '../ui/Toast';

// Data Types
interface Petani {
  id: string;
  nama: string;
  email: string;
  nik: string;
  alamat: string;
  kelompokTani: string;
  status: 'active' | 'inactive';
}

interface Lahan {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  petaniId: string;
  luas: number;
  lokasi: string;
  jenisTanah: string;
  koordinat: { latitude: number; longitude: number };
  status: 'available' | 'in_use' | 'maintenance';
}

interface Varietas {
  id: string;
  nama: string;
  kategori: 'Virginia' | 'Burley' | 'Oriental';
  masaPertumbuhan: number;
  deskripsi: string;
  status: 'active' | 'inactive';
}

interface TanamRecord {
  id: string;
  petaniId: string;
  lahanId: string;
  varietasId: string;
  tanggalTanam: string;
  targetPanen: string;
  luas: number;
  estimasiProduksi: number;
  catatanKhusus?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  reviewStatus: {
    histori: Array<{
      tanggal: string;
      status: 'pending_review' | 'approved' | 'rejected';
      reviewer?: string;
      catatan?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pestisida {
  id: string;
  nama: string;
  merek: string;
  jenis: 'Insektisida' | 'Fungisida' | 'Herbisida' | 'Bakterisida';
  bahanAktif: string;
  deskripsi: string;
  status: 'active' | 'inactive';
}

interface JenisHama {
  id: string;
  nama: string;
  kategori: 'Serangga' | 'Jamur' | 'Bakteri' | 'Gulma' | 'Virus';
  deskripsi: string;
  status: 'active' | 'inactive';
}

interface PestisidaRecord {
  id: string;
  tanamId: string;
  pestisidaId: string;
  tanggalAplikasi: string;
  usiaSeratAplikasi: number; // usia tanaman dalam hari
  dosis: number;
  satuanDosis: 'ml/liter' | 'gram/liter' | 'liter/ha';
  jenisHamaId: string;
  metodeAplikasi: 'Semprot' | 'Siram' | 'Tabur' | 'Fumigasi';
  kondisiCuaca: 'Cerah' | 'Berawan' | 'Hujan Ringan';
  catatanAplikasi: string;
  updateBy: string;
  createdAt: string;
}

const UpdatePestisidaContent: React.FC = () => {
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTanam, setSelectedTanam] = useState<TanamRecord | null>(null);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');
  const [filterPetani, setFilterPetani] = useState<string>('all');

  // State untuk form input pestisida baru
  const [newPestisidaForm, setNewPestisidaForm] = useState({
    pestisidaId: '',
    tanggalAplikasi: new Date().toISOString().split('T')[0],
    dosis: '',
    satuanDosis: 'ml/liter' as 'ml/liter' | 'gram/liter' | 'liter/ha',
    jenisHamaId: '',
    metodeAplikasi: 'Semprot' as 'Semprot' | 'Siram' | 'Tabur' | 'Fumigasi',
    kondisiCuaca: 'Cerah' as 'Cerah' | 'Berawan' | 'Hujan Ringan',
    catatanAplikasi: ''
  });

  // State untuk loading dan toast
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info'}>({
    show: false, message: '', type: 'success'
  });

  // Mock data
  const mockPetani: Petani[] = [
    {
      id: 'PET001',
      nama: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      nik: '3201234567890123',
      alamat: 'Jl. Raya No. 123, Desa Sumberejo',
      kelompokTani: 'Kelompok Tani Makmur',
      status: 'active'
    },
    {
      id: 'PET002',
      nama: 'Siti Aminah',
      email: 'siti.aminah@email.com',
      nik: '3201234567890124',
      alamat: 'Jl. Melati No. 45, Desa Tumpang',
      kelompokTani: 'Kelompok Tani Sejahtera',
      status: 'active'
    },
    {
      id: 'PET003',
      nama: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@email.com',
      nik: '3201234567890125',
      alamat: 'Jl. Kenanga No. 67, Desa Dampit',
      kelompokTani: 'Kelompok Tani Berkah',
      status: 'active'
    }
  ];

  const mockLahan: Lahan[] = [
    {
      id: 'LHN001',
      kodeLahan: 'TMB-001-A',
      namaLahan: 'Lahan Tembakau Utara',
      petaniId: 'PET001',
      luas: 2500,
      lokasi: 'Blok A, Desa Sumberejo',
      jenisTanah: 'Lempung Berpasir',
      koordinat: { latitude: -7.9666, longitude: 112.6326 },
      status: 'in_use'
    },
    {
      id: 'LHN003',
      kodeLahan: 'TMB-002-A',
      namaLahan: 'Lahan Tembakau Timur',
      petaniId: 'PET002',
      luas: 3200,
      lokasi: 'Blok C, Desa Tumpang',
      jenisTanah: 'Lempung Liat',
      koordinat: { latitude: -7.9686, longitude: 112.6346 },
      status: 'in_use'
    },
    {
      id: 'LHN004',
      kodeLahan: 'TMB-003-A',
      namaLahan: 'Lahan Tembakau Barat',
      petaniId: 'PET003',
      luas: 2100,
      lokasi: 'Blok D, Desa Dampit',
      jenisTanah: 'Lempung Berpasir',
      koordinat: { latitude: -7.9696, longitude: 112.6356 },
      status: 'in_use'
    }
  ];

  const mockVarietas: Varietas[] = [
    {
      id: 'VAR001',
      nama: 'Virginia Gold',
      kategori: 'Virginia',
      masaPertumbuhan: 90,
      deskripsi: 'Tembakau Virginia kualitas premium dengan rasa mild',
      status: 'active'
    },
    {
      id: 'VAR002',
      nama: 'Burley Premium',
      kategori: 'Burley',
      masaPertumbuhan: 75,
      deskripsi: 'Tembakau Burley dengan kandungan nikotin sedang',
      status: 'active'
    },
    {
      id: 'VAR003',
      nama: 'Oriental Classic',
      kategori: 'Oriental',
      masaPertumbuhan: 85,
      deskripsi: 'Tembakau Oriental dengan aroma khas dan rasa kuat',
      status: 'active'
    }
  ];

  const mockPestisida: Pestisida[] = [
    {
      id: 'PEST001',
      nama: 'Cypermethrin 25 EC',
      merek: 'Cyperguard',
      jenis: 'Insektisida',
      bahanAktif: 'Cypermethrin 25%',
      deskripsi: 'Insektisida sistemik untuk mengendalikan hama penggerek',
      status: 'active'
    },
    {
      id: 'PEST002',
      nama: 'Mancozeb 80 WP',
      merek: 'Fungitox',
      jenis: 'Fungisida',
      bahanAktif: 'Mancozeb 80%',
      deskripsi: 'Fungisida kontak untuk mencegah penyakit jamur',
      status: 'active'
    },
    {
      id: 'PEST003',
      nama: 'Glyphosate 480 SL',
      merek: 'Roundup',
      jenis: 'Herbisida',
      bahanAktif: 'Glyphosate 480 g/l',
      deskripsi: 'Herbisida sistemik untuk mengendalikan gulma',
      status: 'active'
    },
    {
      id: 'PEST004',
      nama: 'Imidacloprid 200 SL',
      merek: 'Confidor',
      jenis: 'Insektisida',
      bahanAktif: 'Imidacloprid 200 g/l',
      deskripsi: 'Insektisida sistemik untuk kutu daun dan thrips',
      status: 'active'
    },
    {
      id: 'PEST005',
      nama: 'Carbendazim 50 WP',
      merek: 'Benlate',
      jenis: 'Fungisida',
      bahanAktif: 'Carbendazim 50%',
      deskripsi: 'Fungisida sistemik untuk penyakit layu dan busuk',
      status: 'active'
    }
  ];

  const mockJenisHama: JenisHama[] = [
    {
      id: 'HAMA001',
      nama: 'Ulat Grayak',
      kategori: 'Serangga',
      deskripsi: 'Hama yang menyerang daun tembakau muda',
      status: 'active'
    },
    {
      id: 'HAMA002',
      nama: 'Kutu Daun',
      kategori: 'Serangga',
      deskripsi: 'Serangga kecil yang menghisap cairan daun',
      status: 'active'
    },
    {
      id: 'HAMA003',
      nama: 'Thrips',
      kategori: 'Serangga',
      deskripsi: 'Serangga kecil yang merusak permukaan daun',
      status: 'active'
    },
    {
      id: 'HAMA004',
      nama: 'Penyakit Layu Fusarium',
      kategori: 'Jamur',
      deskripsi: 'Penyakit jamur yang menyebabkan layu pada tanaman',
      status: 'active'
    },
    {
      id: 'HAMA005',
      nama: 'Bercak Daun',
      kategori: 'Jamur',
      deskripsi: 'Penyakit yang menyebabkan bercak pada daun',
      status: 'active'
    },
    {
      id: 'HAMA006',
      nama: 'Gulma Lebar',
      kategori: 'Gulma',
      deskripsi: 'Gulma berdaun lebar yang mengganggu pertumbuhan',
      status: 'active'
    }
  ];

  // Data tanam yang sudah approved dan sedang berjalan
  const mockTanamRecords: TanamRecord[] = [
    {
      id: 'TNM001',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      varietasId: 'VAR001',
      tanggalTanam: '2025-07-15',
      targetPanen: '2025-10-13',
      luas: 2000,
      estimasiProduksi: 7000,
      catatanKhusus: 'Perlu perhatian khusus pada irigasi',
      status: 'approved',
      reviewStatus: {
        histori: []
      },
      createdAt: '2025-07-01T10:00:00Z',
      updatedAt: '2025-07-03T14:30:00Z'
    },
    {
      id: 'TNM002',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      varietasId: 'VAR002',
      tanggalTanam: '2025-08-01',
      targetPanen: '2025-10-15',
      luas: 1500,
      estimasiProduksi: 4500,
      status: 'approved',
      reviewStatus: {
        histori: []
      },
      createdAt: '2025-07-25T08:15:00Z',
      updatedAt: '2025-07-25T08:15:00Z'
    },
    {
      id: 'TNM003',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      varietasId: 'VAR003',
      tanggalTanam: '2025-08-15',
      targetPanen: '2025-11-08',
      luas: 1200,
      estimasiProduksi: 3000,
      catatanKhusus: 'Lahan baru, monitoring intensif diperlukan',
      status: 'approved',
      reviewStatus: {
        histori: []
      },
      createdAt: '2025-08-10T16:45:00Z',
      updatedAt: '2025-08-10T16:45:00Z'
    }
  ];

  // Data riwayat penggunaan pestisida
  const [pestisidaRecords, setPestisidaRecords] = useState<PestisidaRecord[]>([
    {
      id: 'PESTAPP001',
      tanamId: 'TNM001',
      pestisidaId: 'PEST001',
      tanggalAplikasi: '2025-08-05',
      usiaSeratAplikasi: 21,
      dosis: 2.5,
      satuanDosis: 'ml/liter',
      jenisHamaId: 'HAMA001',
      metodeAplikasi: 'Semprot',
      kondisiCuaca: 'Cerah',
      catatanAplikasi: 'Aplikasi pagi hari, kondisi tanaman sehat',
      updateBy: 'operator1',
      createdAt: '2025-08-05T08:00:00Z'
    },
    {
      id: 'PESTAPP002',
      tanamId: 'TNM001',
      pestisidaId: 'PEST002',
      tanggalAplikasi: '2025-08-20',
      usiaSeratAplikasi: 36,
      dosis: 3.0,
      satuanDosis: 'gram/liter',
      jenisHamaId: 'HAMA005',
      metodeAplikasi: 'Semprot',
      kondisiCuaca: 'Berawan',
      catatanAplikasi: 'Pencegahan penyakit jamur, aplikasi sore hari',
      updateBy: 'operator1',
      createdAt: '2025-08-20T16:00:00Z'
    },
    {
      id: 'PESTAPP003',
      tanamId: 'TNM002',
      pestisidaId: 'PEST004',
      tanggalAplikasi: '2025-08-25',
      usiaSeratAplikasi: 24,
      dosis: 1.5,
      satuanDosis: 'ml/liter',
      jenisHamaId: 'HAMA002',
      metodeAplikasi: 'Semprot',
      kondisiCuaca: 'Cerah',
      catatanAplikasi: 'Pengendalian kutu daun yang mulai muncul',
      updateBy: 'operator2',
      createdAt: '2025-08-25T09:00:00Z'
    }
  ]);

  // Helper functions
  const getPetaniById = (id: string) => mockPetani.find(p => p.id === id);
  const getLahanById = (id: string) => mockLahan.find(l => l.id === id);
  const getVarietasById = (id: string) => mockVarietas.find(v => v.id === id);
  const getPestisidaById = (id: string) => mockPestisida.find(p => p.id === id);
  const getJenisHamaById = (id: string) => mockJenisHama.find(h => h.id === id);

  // Calculate age of plant in days
  const calculatePlantAge = (tanggalTanam: string): number => {
    const plantDate = new Date(tanggalTanam);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - plantDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate plant age at application date
  const calculatePlantAgeAtApplication = (tanggalTanam: string, tanggalAplikasi: string): number => {
    const plantDate = new Date(tanggalTanam);
    const appDate = new Date(tanggalAplikasi);
    const diffTime = Math.abs(appDate.getTime() - plantDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get latest pesticide application
  const getLatestPestisidaApplication = (tanamId: string): PestisidaRecord | null => {
    const applications = pestisidaRecords.filter(p => p.tanamId === tanamId);
    if (applications.length === 0) return null;
    
    return applications.reduce((latest, current) => {
      return new Date(current.tanggalAplikasi) > new Date(latest.tanggalAplikasi) ? current : latest;
    });
  };

  // Filter data
  const filteredTanamRecords = useMemo(() => {
    return mockTanamRecords.filter(record => {
      const petani = getPetaniById(record.petaniId);
      const lahan = getLahanById(record.lahanId);
      const varietas = getVarietasById(record.varietasId);
      const plantAge = calculatePlantAge(record.tanggalTanam);
      
      // Filter berdasarkan pencarian
      const matchesSearch = searchTerm === '' || 
        petani?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lahan?.namaLahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        varietas?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter berdasarkan status
      let matchesStatus = true;
      if (filterStatus === 'active') {
        matchesStatus = plantAge < (getVarietasById(record.varietasId)?.masaPertumbuhan || 90);
      } else if (filterStatus === 'completed') {
        matchesStatus = plantAge >= (getVarietasById(record.varietasId)?.masaPertumbuhan || 90);
      }

      // Filter berdasarkan petani
      const matchesPetani = filterPetani === 'all' || record.petaniId === filterPetani;

      return matchesSearch && matchesStatus && matchesPetani;
    });
  }, [searchTerm, filterStatus, filterPetani]);

  // Handle modal actions
  const handleOpenModal = (tanam: TanamRecord) => {
    setSelectedTanam(tanam);
    setShowModal(true);
    setNewPestisidaForm({
      pestisidaId: '',
      tanggalAplikasi: new Date().toISOString().split('T')[0],
      dosis: '',
      satuanDosis: 'ml/liter',
      jenisHamaId: '',
      metodeAplikasi: 'Semprot',
      kondisiCuaca: 'Cerah',
      catatanAplikasi: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTanam(null);
    setNewPestisidaForm({
      pestisidaId: '',
      tanggalAplikasi: new Date().toISOString().split('T')[0],
      dosis: '',
      satuanDosis: 'ml/liter',
      jenisHamaId: '',
      metodeAplikasi: 'Semprot',
      kondisiCuaca: 'Cerah',
      catatanAplikasi: ''
    });
  };

  // Handle submit new pestisida application
  const handleSubmitPestisida = async () => {
    if (!selectedTanam || !newPestisidaForm.pestisidaId || !newPestisidaForm.dosis || !newPestisidaForm.jenisHamaId || !newPestisidaForm.catatanAplikasi.trim()) {
      showToast('Mohon lengkapi semua field yang required', 'error');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const usiaAplikasi = calculatePlantAgeAtApplication(selectedTanam.tanggalTanam, newPestisidaForm.tanggalAplikasi);

      const newPestisidaRecord: PestisidaRecord = {
        id: `PESTAPP${Date.now()}`,
        tanamId: selectedTanam.id,
        pestisidaId: newPestisidaForm.pestisidaId,
        tanggalAplikasi: newPestisidaForm.tanggalAplikasi,
        usiaSeratAplikasi: usiaAplikasi,
        dosis: parseFloat(newPestisidaForm.dosis),
        satuanDosis: newPestisidaForm.satuanDosis,
        jenisHamaId: newPestisidaForm.jenisHamaId,
        metodeAplikasi: newPestisidaForm.metodeAplikasi,
        kondisiCuaca: newPestisidaForm.kondisiCuaca,
        catatanAplikasi: newPestisidaForm.catatanAplikasi,
        updateBy: 'operator_current',
        createdAt: new Date().toISOString()
      };

      setPestisidaRecords(prev => [newPestisidaRecord, ...prev]);
      showToast('Data penggunaan pestisida berhasil ditambahkan', 'success');
      handleCloseModal();

    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getJenisBadge = (jenis: string) => {
    const badges = {
      Insektisida: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Fungisida: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Herbisida: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Bakterisida: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[jenis as keyof typeof badges]}`}>
        {jenis}
      </span>
    );
  };

  const getKategoriBadge = (kategori: string) => {
    const badges = {
      Serangga: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      Jamur: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Bakteri: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      Gulma: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Virus: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[kategori as keyof typeof badges]}`}>
        {kategori}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">🧪 Update Penggunaan Pestisida</h1>
        <p className="text-emerald-100">
          Kelola dan catat penggunaan pestisida pada lahan tanam tembakau
        </p>
      </div>

      {/* Filter dan Pencarian */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Pencarian
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari petani, lahan, varietas..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Status Tanam
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Sedang Tanam</option>
              <option value="completed">Sudah Panen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              👨‍🌾 Petani
            </label>
            <select
              value={filterPetani}
              onChange={(e) => setFilterPetani(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Petani</option>
              {mockPetani.map(petani => (
                <option key={petani.id} value={petani.id}>
                  {petani.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📈 Total Data
            </label>
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-semibold">
              {filteredTanamRecords.length} tanaman aktif
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Petani & Lahan</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Varietas</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Tanggal Tanam</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Usia Tanaman</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Aplikasi Terakhir</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Total Aplikasi</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTanamRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">📭</span>
                      <span>Tidak ada data tanaman yang ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTanamRecords.map((record) => {
                  const petani = getPetaniById(record.petaniId);
                  const lahan = getLahanById(record.lahanId);
                  const varietas = getVarietasById(record.varietasId);
                  const plantAge = calculatePlantAge(record.tanggalTanam);
                  const latestApplication = getLatestPestisidaApplication(record.id);
                  const totalApplications = pestisidaRecords.filter(p => p.tanamId === record.id).length;

                  return (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {petani?.nama}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {lahan?.namaLahan} ({lahan?.kodeLahan})
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {record.luas.toLocaleString()} m²
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {varietas?.nama}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {varietas?.kategori}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {formatDate(record.tanggalTanam)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {plantAge} hari
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          Target: {varietas?.masaPertumbuhan} hari
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {latestApplication ? (
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-xs">
                              {getPestisidaById(latestApplication.pestisidaId)?.nama}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {formatDate(latestApplication.tanggalAplikasi)}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              Usia: {latestApplication.usiaSeratAplikasi} hari
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic text-xs">
                            Belum ada aplikasi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-emerald-600 dark:text-emerald-400">
                          {totalApplications} kali
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenModal(record)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          🧪 Detail Pestisida
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Penggunaan Pestisida */}
      {showModal && selectedTanam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Detail Penggunaan Pestisida</h2>
                  <div className="text-emerald-100 text-sm space-y-1">
                    <div>Petani: {getPetaniById(selectedTanam.petaniId)?.nama}</div>
                    <div>Lahan: {getLahanById(selectedTanam.lahanId)?.namaLahan}</div>
                    <div>Varietas: {getVarietasById(selectedTanam.varietasId)?.nama}</div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Lahan */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Informasi Lahan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Tanggal Tanam:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedTanam.tanggalTanam)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Usia Tanaman:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {calculatePlantAge(selectedTanam.tanggalTanam)} hari
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Luas Tanam:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedTanam.luas.toLocaleString()} m²
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Target Panen:</span>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedTanam.targetPanen)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Riwayat Penggunaan Pestisida */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Riwayat Penggunaan Pestisida</h3>
                <div className="space-y-3">
                  {pestisidaRecords
                    .filter(p => p.tanamId === selectedTanam.id)
                    .sort((a, b) => new Date(b.tanggalAplikasi).getTime() - new Date(a.tanggalAplikasi).getTime())
                    .map((pestRecord) => {
                      const pestisida = getPestisidaById(pestRecord.pestisidaId);
                      const hama = getJenisHamaById(pestRecord.jenisHamaId);
                      return (
                        <div key={pestRecord.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {pestisida?.nama}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {pestisida?.merek} - {pestisida?.bahanAktif}
                              </p>
                              <div className="mb-2">
                                {pestisida && getJenisBadge(pestisida.jenis)}
                              </div>
                            </div>
                            <div>
                              <div className="space-y-1 text-sm">
                                <div><strong>Tanggal Aplikasi:</strong> {formatDate(pestRecord.tanggalAplikasi)}</div>
                                <div><strong>Usia Tanaman:</strong> {pestRecord.usiaSeratAplikasi} hari</div>
                                <div><strong>Dosis:</strong> {pestRecord.dosis} {pestRecord.satuanDosis}</div>
                                <div><strong>Metode:</strong> {pestRecord.metodeAplikasi}</div>
                                <div><strong>Cuaca:</strong> {pestRecord.kondisiCuaca}</div>
                              </div>
                            </div>
                            <div>
                              <div className="mb-2">
                                <strong className="text-sm">Target Hama:</strong>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {hama?.nama}
                                </div>
                                <div className="mt-1">
                                  {hama && getKategoriBadge(hama.kategori)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-sm">
                              <strong>Catatan:</strong> {pestRecord.catatanAplikasi}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {pestisidaRecords.filter(p => p.tanamId === selectedTanam.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <span className="text-4xl block mb-2">🧪</span>
                      <span>Belum ada riwayat penggunaan pestisida</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Tambah Pestisida Baru */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tambah Penggunaan Pestisida Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pestisida <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPestisidaForm.pestisidaId}
                      onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, pestisidaId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">-- Pilih Pestisida --</option>
                      {mockPestisida
                        .filter(p => p.status === 'active')
                        .map(pestisida => (
                          <option key={pestisida.id} value={pestisida.id}>
                            {pestisida.nama} ({pestisida.merek}) - {pestisida.jenis}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Aplikasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newPestisidaForm.tanggalAplikasi}
                      onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, tanggalAplikasi: e.target.value }))}
                      min={selectedTanam.tanggalTanam}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dosis <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        value={newPestisidaForm.dosis}
                        onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, dosis: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.0"
                      />
                      <select
                        value={newPestisidaForm.satuanDosis}
                        onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, satuanDosis: e.target.value as any }))}
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="ml/liter">ml/liter</option>
                        <option value="gram/liter">gram/liter</option>
                        <option value="liter/ha">liter/ha</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Hama <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPestisidaForm.jenisHamaId}
                      onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, jenisHamaId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">-- Pilih Target Hama --</option>
                      {mockJenisHama
                        .filter(h => h.status === 'active')
                        .map(hama => (
                          <option key={hama.id} value={hama.id}>
                            {hama.nama} ({hama.kategori})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Metode Aplikasi
                    </label>
                    <select
                      value={newPestisidaForm.metodeAplikasi}
                      onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, metodeAplikasi: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Semprot">Semprot</option>
                      <option value="Siram">Siram</option>
                      <option value="Tabur">Tabur</option>
                      <option value="Fumigasi">Fumigasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kondisi Cuaca
                    </label>
                    <select
                      value={newPestisidaForm.kondisiCuaca}
                      onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, kondisiCuaca: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Cerah">Cerah</option>
                      <option value="Berawan">Berawan</option>
                      <option value="Hujan Ringan">Hujan Ringan</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catatan Aplikasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newPestisidaForm.catatanAplikasi}
                    onChange={(e) => setNewPestisidaForm(prev => ({ ...prev, catatanAplikasi: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Jelaskan kondisi aplikasi, efektivitas, dan catatan penting lainnya..."
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitPestisida}
                  disabled={loading || !newPestisidaForm.pestisidaId || !newPestisidaForm.dosis || !newPestisidaForm.jenisHamaId || !newPestisidaForm.catatanAplikasi.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Menyimpan...' : '🧪 Tambah Aplikasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default UpdatePestisidaContent;
