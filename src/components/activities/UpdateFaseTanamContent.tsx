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

interface FaseTanam {
  id: string;
  nama: string;
  urutan: number;
  deskripsi: string;
  minUsia: number; // hari
  maxUsia: number; // hari
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

interface FaseTanamRecord {
  id: string;
  tanamId: string;
  faseTanamId: string;
  tanggalUpdate: string;
  catatanFase: string;
  kondisiTanaman: 'baik' | 'cukup' | 'buruk';
  updateBy: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approvalBy?: string;
  approvalDate?: string;
  approvalNote?: string;
}

const UpdateFaseTanamContent: React.FC = () => {
  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedTanam, setSelectedTanam] = useState<TanamRecord | null>(null);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');
  const [filterPetani, setFilterPetani] = useState<string>('all');

  // State untuk form input fase baru
  const [newFaseForm, setNewFaseForm] = useState({
    faseTanamId: '',
    catatanFase: '',
    kondisiTanaman: 'baik' as 'baik' | 'cukup' | 'buruk'
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

  const mockFaseTanam: FaseTanam[] = [
    {
      id: 'FASE001',
      nama: 'Persemaian',
      urutan: 1,
      deskripsi: 'Fase pembibitan dan persemaian benih tembakau',
      minUsia: 0,
      maxUsia: 14,
      status: 'active'
    },
    {
      id: 'FASE002',
      nama: 'Transplanting',
      urutan: 2,
      deskripsi: 'Fase pemindahan bibit ke lahan tanam',
      minUsia: 15,
      maxUsia: 21,
      status: 'active'
    },
    {
      id: 'FASE003',
      nama: 'Vegetatif Awal',
      urutan: 3,
      deskripsi: 'Fase pertumbuhan vegetatif awal setelah transplanting',
      minUsia: 22,
      maxUsia: 35,
      status: 'active'
    },
    {
      id: 'FASE004',
      nama: 'Vegetatif Lanjut',
      urutan: 4,
      deskripsi: 'Fase pertumbuhan vegetatif lanjut dengan pembentukan daun',
      minUsia: 36,
      maxUsia: 50,
      status: 'active'
    },
    {
      id: 'FASE005',
      nama: 'Pembungaan',
      urutan: 5,
      deskripsi: 'Fase munculnya bunga dan topping',
      minUsia: 51,
      maxUsia: 65,
      status: 'active'
    },
    {
      id: 'FASE006',
      nama: 'Pematangan',
      urutan: 6,
      deskripsi: 'Fase pematangan daun untuk persiapan panen',
      minUsia: 66,
      maxUsia: 90,
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

  // Data histori fase tanam
  const [faseTanamRecords, setFaseTanamRecords] = useState<FaseTanamRecord[]>([
    {
      id: 'FTR001',
      tanamId: 'TNM001',
      faseTanamId: 'FASE001',
      tanggalUpdate: '2025-07-15',
      catatanFase: 'Persemaian berhasil, benih berkecambah dengan baik',
      kondisiTanaman: 'baik',
      updateBy: 'operator1',
      status: 'approved',
      approvalBy: 'admin1',
      approvalDate: '2025-07-16',
      approvalNote: 'Kondisi persemaian sangat baik'
    },
    {
      id: 'FTR002',
      tanamId: 'TNM001',
      faseTanamId: 'FASE002',
      tanggalUpdate: '2025-07-30',
      catatanFase: 'Transplanting selesai, bibit beradaptasi dengan baik',
      kondisiTanaman: 'baik',
      updateBy: 'operator1',
      status: 'approved',
      approvalBy: 'admin1',
      approvalDate: '2025-07-31',
      approvalNote: 'Proses transplanting berhasil'
    },
    {
      id: 'FTR003',
      tanamId: 'TNM001',
      faseTanamId: 'FASE003',
      tanggalUpdate: '2025-08-20',
      catatanFase: 'Pertumbuhan vegetatif awal baik, daun mulai terbentuk',
      kondisiTanaman: 'baik',
      updateBy: 'operator1',
      status: 'approved',
      approvalBy: 'admin1',
      approvalDate: '2025-08-21',
      approvalNote: 'Pertumbuhan sesuai target'
    },
    {
      id: 'FTR004',
      tanamId: 'TNM002',
      faseTanamId: 'FASE001',
      tanggalUpdate: '2025-08-01',
      catatanFase: 'Persemaian dimulai, kondisi benih baik',
      kondisiTanaman: 'baik',
      updateBy: 'operator2',
      status: 'approved',
      approvalBy: 'admin1',
      approvalDate: '2025-08-02',
      approvalNote: 'Persemaian dalam kondisi optimal'
    },
    {
      id: 'FTR005',
      tanamId: 'TNM002',
      faseTanamId: 'FASE002',
      tanggalUpdate: '2025-08-16',
      catatanFase: 'Transplanting berhasil dilakukan',
      kondisiTanaman: 'baik',
      updateBy: 'operator2',
      status: 'pending_approval',
      approvalBy: undefined,
      approvalDate: undefined,
      approvalNote: undefined
    }
  ]);

  // Helper functions
  const getPetaniById = (id: string) => mockPetani.find(p => p.id === id);
  const getLahanById = (id: string) => mockLahan.find(l => l.id === id);
  const getVarietasById = (id: string) => mockVarietas.find(v => v.id === id);
  const getFaseTanamById = (id: string) => mockFaseTanam.find(f => f.id === id);

  // Calculate age of plant in days
  const calculatePlantAge = (tanggalTanam: string): number => {
    const plantDate = new Date(tanggalTanam);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - plantDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get latest fase for a tanam record
  const getLatestFase = (tanamId: string): FaseTanamRecord | null => {
    const faseRecords = faseTanamRecords.filter(f => f.tanamId === tanamId && f.status === 'approved');
    if (faseRecords.length === 0) return null;
    
    return faseRecords.reduce((latest, current) => {
      const latestFase = getFaseTanamById(latest.faseTanamId);
      const currentFase = getFaseTanamById(current.faseTanamId);
      
      if (!latestFase || !currentFase) return latest;
      
      return currentFase.urutan > latestFase.urutan ? current : latest;
    });
  };

  // Get next recommended fase
  const getNextRecommendedFase = (tanamId: string, plantAge: number): FaseTanam | null => {
    const latestFase = getLatestFase(tanamId);
    
    if (!latestFase) {
      // Jika belum ada fase, return fase pertama yang sesuai usia
      return mockFaseTanam.find(f => plantAge >= f.minUsia && plantAge <= f.maxUsia) || mockFaseTanam[0];
    }
    
    const currentFase = getFaseTanamById(latestFase.faseTanamId);
    if (!currentFase) return null;
    
    // Find next fase in sequence
    const nextFase = mockFaseTanam.find(f => f.urutan === currentFase.urutan + 1);
    
    // Check if plant age is appropriate for next fase
    if (nextFase && plantAge >= nextFase.minUsia) {
      return nextFase;
    }
    
    return null;
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
    setNewFaseForm({
      faseTanamId: '',
      catatanFase: '',
      kondisiTanaman: 'baik'
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTanam(null);
    setNewFaseForm({
      faseTanamId: '',
      catatanFase: '',
      kondisiTanaman: 'baik'
    });
  };

  // Handle submit new fase
  const handleSubmitFase = async () => {
    if (!selectedTanam || !newFaseForm.faseTanamId || !newFaseForm.catatanFase.trim()) {
      showToast('Mohon lengkapi semua field yang required', 'error');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newFaseRecord: FaseTanamRecord = {
        id: `FTR${Date.now()}`,
        tanamId: selectedTanam.id,
        faseTanamId: newFaseForm.faseTanamId,
        tanggalUpdate: new Date().toISOString().split('T')[0],
        catatanFase: newFaseForm.catatanFase,
        kondisiTanaman: newFaseForm.kondisiTanaman,
        updateBy: 'operator_current',
        status: 'pending_approval'
      };

      setFaseTanamRecords(prev => [newFaseRecord, ...prev]);
      showToast('Update fase tanam berhasil disubmit untuk approval', 'success');
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

  const getStatusBadge = (status: string) => {
    const badges = {
      pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels = {
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      rejected: 'Rejected'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getKondisiBadge = (kondisi: string) => {
    const badges = {
      baik: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cukup: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      buruk: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[kondisi as keyof typeof badges]}`}>
        {kondisi.charAt(0).toUpperCase() + kondisi.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">🔄 Update Fase Tanam</h1>
        <p className="text-emerald-100">
          Kelola dan update fase pertumbuhan tanaman tembakau petani
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
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fase Terakhir</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Fase Berikutnya</th>
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
                  const latestFase = getLatestFase(record.id);
                  const nextFase = getNextRecommendedFase(record.id, plantAge);

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
                        {latestFase ? (
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {getFaseTanamById(latestFase.faseTanamId)?.nama}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {formatDate(latestFase.tanggalUpdate)}
                            </div>
                            <div className="mt-1">
                              {getKondisiBadge(latestFase.kondisiTanaman)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Belum ada update
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {nextFase ? (
                          <div>
                            <div className="font-medium text-emerald-600 dark:text-emerald-400">
                              {nextFase.nama}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              Usia: {nextFase.minUsia}-{nextFase.maxUsia} hari
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Fase terakhir
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenModal(record)}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          📋 Detail Fase
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

      {/* Modal Detail Fase Tanam */}
      {showModal && selectedTanam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">Detail Fase Tanam</h2>
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

              {/* Histori Fase Tanam */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Histori Fase Tanam</h3>
                <div className="space-y-3">
                  {faseTanamRecords
                    .filter(f => f.tanamId === selectedTanam.id)
                    .sort((a, b) => {
                      const faseA = getFaseTanamById(a.faseTanamId);
                      const faseB = getFaseTanamById(b.faseTanamId);
                      return (faseB?.urutan || 0) - (faseA?.urutan || 0);
                    })
                    .map((faseRecord) => {
                      const fase = getFaseTanamById(faseRecord.faseTanamId);
                      return (
                        <div key={faseRecord.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {fase?.nama}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {fase?.deskripsi}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {getKondisiBadge(faseRecord.kondisiTanaman)}
                              {getStatusBadge(faseRecord.status)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Tanggal Update:</strong> {formatDate(faseRecord.tanggalUpdate)}
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white mb-2">
                            <strong>Catatan:</strong> {faseRecord.catatanFase}
                          </div>
                          {faseRecord.approvalNote && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Catatan Approval:</strong> {faseRecord.approvalNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Form Input Fase Baru */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Update Fase Baru</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fase Tanam <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newFaseForm.faseTanamId}
                      onChange={(e) => setNewFaseForm(prev => ({ ...prev, faseTanamId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">-- Pilih Fase Tanam --</option>
                      {mockFaseTanam
                        .filter(f => f.status === 'active')
                        .map(fase => (
                          <option key={fase.id} value={fase.id}>
                            {fase.nama} (Usia: {fase.minUsia}-{fase.maxUsia} hari)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kondisi Tanaman <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newFaseForm.kondisiTanaman}
                      onChange={(e) => setNewFaseForm(prev => ({ ...prev, kondisiTanaman: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="baik">Baik</option>
                      <option value="cukup">Cukup</option>
                      <option value="buruk">Buruk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Catatan Fase <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newFaseForm.catatanFase}
                      onChange={(e) => setNewFaseForm(prev => ({ ...prev, catatanFase: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Jelaskan kondisi tanaman, progress pertumbuhan, dan catatan penting lainnya..."
                    />
                  </div>
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
                  onClick={handleSubmitFase}
                  disabled={loading || !newFaseForm.faseTanamId || !newFaseForm.catatanFase.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Menyimpan...' : '📤 Submit Update'}
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

export default UpdateFaseTanamContent;
