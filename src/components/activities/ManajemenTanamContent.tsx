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

interface FormData {
  petaniId?: string;
  lahanId?: string;
  varietasId?: string;
  tanggalTanam?: string;
  targetPanen?: string;
  luas?: number;
  estimasiProduksi?: number;
  catatanKhusus?: string;
}

const ManajemenTanamContent: React.FC = () => {
  // State untuk tab navigation
  const [activeTab, setActiveTab] = useState<'daftar' | 'tambah'>('daftar');

  // Mock data (sama seperti sebelumnya)
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
      status: 'available'
    },
    {
      id: 'LHN002',
      kodeLahan: 'TMB-001-B',
      namaLahan: 'Lahan Tembakau Selatan',
      petaniId: 'PET001',
      luas: 1800,
      lokasi: 'Blok B, Desa Sumberejo',
      jenisTanah: 'Lempung Liat',
      koordinat: { latitude: -7.9676, longitude: 112.6336 },
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
      status: 'available'
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

  // State untuk Tambah Tanam (dari TambahTanamBaruContent)
  const [formData, setFormData] = useState<FormData>({});
  const [selectedPetani, setSelectedPetani] = useState<Petani | null>(null);
  const [availableLahan, setAvailableLahan] = useState<Lahan[]>([]);
  const [selectedLahan, setSelectedLahan] = useState<Lahan | null>(null);
  const [selectedVarietas, setSelectedVarietas] = useState<Varietas | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info'}>({
    show: false, message: '', type: 'success'
  });

  // State untuk Daftar Tanam
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [filterPetani, setFilterPetani] = useState<string>('all');

  // Mock data tanam records (yang akan bertambah ketika ada data baru)
  const [tanamRecords, setTanamRecords] = useState<TanamRecord[]>([
    {
      id: 'TNM001',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      varietasId: 'VAR001',
      tanggalTanam: '2025-09-15',
      targetPanen: '2025-12-14',
      luas: 2000,
      estimasiProduksi: 7000,
      catatanKhusus: 'Perlu perhatian khusus pada irigasi',
      status: 'approved',
      reviewStatus: {
        histori: [
          {
            tanggal: '2025-09-02',
            status: 'pending_review',
            reviewer: 'Admin',
            catatan: 'Data lengkap dan sesuai'
          },
          {
            tanggal: '2025-09-03',
            status: 'approved',
            reviewer: 'Supervisor',
            catatan: 'Disetujui untuk pelaksanaan'
          }
        ]
      },
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2025-09-03T14:30:00Z'
    },
    {
      id: 'TNM002',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      varietasId: 'VAR002',
      tanggalTanam: '2025-09-20',
      targetPanen: '2025-12-04',
      luas: 1500,
      estimasiProduksi: 4500,
      status: 'pending_review',
      reviewStatus: {
        histori: [
          {
            tanggal: '2025-09-04',
            status: 'pending_review'
          }
        ]
      },
      createdAt: '2025-09-04T08:15:00Z',
      updatedAt: '2025-09-04T08:15:00Z'
    },
    {
      id: 'TNM003',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      varietasId: 'VAR003',
      tanggalTanam: '2025-10-01',
      targetPanen: '2025-12-25',
      luas: 1200,
      estimasiProduksi: 3000,
      catatanKhusus: 'Lahan baru, monitoring intensif diperlukan',
      status: 'draft',
      reviewStatus: {
        histori: []
      },
      createdAt: '2025-09-04T16:45:00Z',
      updatedAt: '2025-09-04T16:45:00Z'
    }
  ]);

  // Helper functions untuk Tambah Tanam
  const calculateTargetPanen = (tanggalTanam: string, masaPertumbuhan: number): string => {
    const tanamDate = new Date(tanggalTanam);
    tanamDate.setDate(tanamDate.getDate() + masaPertumbuhan);
    return tanamDate.toISOString().split('T')[0];
  };

  const calculateEstimasiProduksi = (luas: number, varietas: Varietas): number => {
    const produksiPerM2 = varietas.kategori === 'Virginia' ? 3.5 : 
                         varietas.kategori === 'Burley' ? 3.0 :
                         varietas.kategori === 'Oriental' ? 2.5 : 2.0;
    return Math.round(luas * produksiPerM2);
  };

  // Event Handlers untuk Tambah Tanam
  const handlePetaniChange = (petaniId: string) => {
    const petani = mockPetani.find(p => p.id === petaniId) || null;
    setSelectedPetani(petani);
    setFormData(prev => ({ ...prev, petaniId, lahanId: '' }));
    setSelectedLahan(null);
    
    const lahanPetani = mockLahan.filter(l => l.petaniId === petaniId && l.status === 'available');
    setAvailableLahan(lahanPetani);
  };

  const handleLahanChange = (lahanId: string) => {
    const lahan = availableLahan.find(l => l.id === lahanId) || null;
    setSelectedLahan(lahan);
    setFormData(prev => ({ 
      ...prev, 
      lahanId,
      luas: lahan ? lahan.luas : 0 
    }));
  };

  const handleVarietasChange = (varietasId: string) => {
    const varietas = mockVarietas.find(v => v.id === varietasId) || null;
    setSelectedVarietas(varietas);
    setFormData(prev => {
      const newData = { ...prev, varietasId };
      
      if (prev.tanggalTanam && varietas) {
        newData.targetPanen = calculateTargetPanen(prev.tanggalTanam, varietas.masaPertumbuhan);
      }
      
      if (prev.luas && varietas) {
        newData.estimasiProduksi = calculateEstimasiProduksi(prev.luas, varietas);
      }
      
      return newData;
    });
  };

  const handleDateChange = (tanggalTanam: string) => {
    setFormData(prev => {
      const newData = { ...prev, tanggalTanam };
      
      if (selectedVarietas) {
        newData.targetPanen = calculateTargetPanen(tanggalTanam, selectedVarietas.masaPertumbuhan);
      }
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.petaniId) newErrors.petaniId = 'Petani harus dipilih';
    if (!formData.lahanId) newErrors.lahanId = 'Lahan harus dipilih';
    if (!formData.varietasId) newErrors.varietasId = 'Varietas harus dipilih';
    if (!formData.tanggalTanam) newErrors.tanggalTanam = 'Tanggal tanam harus diisi';
    if (!formData.luas || formData.luas <= 0) newErrors.luas = 'Luas tanam harus lebih dari 0';
    
    if (formData.tanggalTanam) {
      const today = new Date();
      const tanamDate = new Date(formData.tanggalTanam);
      if (tanamDate < today) {
        newErrors.tanggalTanam = 'Tanggal tanam tidak boleh di masa lalu';
      }
    }
    
    if (selectedLahan && formData.luas && formData.luas > selectedLahan.luas) {
      newErrors.luas = `Luas tanam tidak boleh melebihi luas lahan (${selectedLahan.luas} m²)`;
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const validateAndSetErrors = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.petaniId) newErrors.petaniId = 'Petani harus dipilih';
    if (!formData.lahanId) newErrors.lahanId = 'Lahan harus dipilih';
    if (!formData.varietasId) newErrors.varietasId = 'Varietas harus dipilih';
    if (!formData.tanggalTanam) newErrors.tanggalTanam = 'Tanggal tanam harus diisi';
    if (!formData.luas || formData.luas <= 0) newErrors.luas = 'Luas tanam harus lebih dari 0';
    
    if (formData.tanggalTanam) {
      const today = new Date();
      const tanamDate = new Date(formData.tanggalTanam);
      if (tanamDate < today) {
        newErrors.tanggalTanam = 'Tanggal tanam tidak boleh di masa lalu';
      }
    }
    
    if (selectedLahan && formData.luas && formData.luas > selectedLahan.luas) {
      newErrors.luas = `Luas tanam tidak boleh melebihi luas lahan (${selectedLahan.luas} m²)`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return validateForm();
  }, [formData, selectedLahan]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const resetForm = () => {
    setFormData({});
    setSelectedPetani(null);
    setAvailableLahan([]);
    setSelectedLahan(null);
    setSelectedVarietas(null);
    setErrors({});
  };

  const handleSave = async (status: 'draft' | 'pending_review') => {
    if (!validateAndSetErrors()) {
      showToast('Mohon perbaiki kesalahan pada form', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRecord: TanamRecord = {
        id: `TNM${Date.now()}`,
        petaniId: formData.petaniId!,
        lahanId: formData.lahanId!,
        varietasId: formData.varietasId!,
        tanggalTanam: formData.tanggalTanam!,
        targetPanen: formData.targetPanen!,
        luas: formData.luas!,
        estimasiProduksi: formData.estimasiProduksi!,
        catatanKhusus: formData.catatanKhusus,
        status,
        reviewStatus: {
          histori: status === 'pending_review' ? [{
            tanggal: new Date().toISOString(),
            status: 'pending_review'
          }] : []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Tambahkan ke state tanamRecords
      setTanamRecords(prev => [newRecord, ...prev]);
      
      const statusText = status === 'draft' ? 'draft' : 'review';
      showToast(`Data tanam berhasil disimpan sebagai ${statusText}!`, 'success');
      
      if (status === 'pending_review') {
        resetForm();
        // Switch ke tab daftar untuk melihat hasil
        setActiveTab('daftar');
      }
      
    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions untuk Daftar Tanam
  const getPetaniById = (id: string) => mockPetani.find(p => p.id === id);
  const getLahanById = (id: string) => mockLahan.find(l => l.id === id);
  const getVarietasById = (id: string) => mockVarietas.find(v => v.id === id);

  const filteredRecords = useMemo(() => {
    return tanamRecords.filter(record => {
      const petani = getPetaniById(record.petaniId);
      const lahan = getLahanById(record.lahanId);
      const varietas = getVarietasById(record.varietasId);

      const matchesSearch = searchTerm === '' || 
        petani?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lahan?.namaLahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        varietas?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      const matchesPetani = filterPetani === 'all' || record.petaniId === filterPetani;

      return matchesSearch && matchesStatus && matchesPetani;
    });
  }, [searchTerm, filterStatus, filterPetani, tanamRecords]);

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels = {
      draft: 'Draft',
      pending_review: 'Menunggu Review',
      approved: 'Disetujui',
      rejected: 'Ditolak'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="mx-auto">
      {/* Header dengan Tab Navigation */}
      <div className="text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🌾 Manajemen Data Tanam</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('daftar')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'daftar' 
                ? 'bg-white text-emerald-600 font-medium' 
                : 'bg-emerald-500/50 hover:bg-emerald-500/70 text-white'
            }`}
          >
            📋 Daftar Tanam
          </button>
          <button
            onClick={() => setActiveTab('tambah')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === 'tambah' 
                ? 'bg-white text-emerald-600 font-medium' 
                : 'bg-emerald-500/50 hover:bg-emerald-500/70 text-white'
            }`}
          >
            ➕ Tambah Tanam Baru
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'daftar' && (
        <div className="space-y-6">
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
                  📊 Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Menunggu Review</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
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
                  {filteredRecords.length} dari {tanamRecords.length} record
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <span className="text-xl">📝</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tanamRecords.filter(r => r.status === 'draft').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Draft</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                  <span className="text-xl">⏳</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tanamRecords.filter(r => r.status === 'pending_review').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Menunggu Review</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tanamRecords.filter(r => r.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Disetujui</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                  <span className="text-xl">🌾</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tanamRecords.reduce((sum, r) => sum + r.luas, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Luas (m²)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">ID Tanam</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Petani</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Lahan</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Varietas</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Tanggal Tanam</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Target Panen</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Luas (m²)</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Estimasi (kg)</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Dibuat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center space-y-2">
                          <span className="text-4xl">📭</span>
                          <span>Tidak ada data yang ditemukan</span>
                          <button
                            onClick={() => setActiveTab('tambah')}
                            className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                          >
                            ➕ Tambah Data Tanam Pertama
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => {
                      const petani = getPetaniById(record.petaniId);
                      const lahan = getLahanById(record.lahanId);
                      const varietas = getVarietasById(record.varietasId);

                      return (
                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {record.id}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {petani?.nama}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                {petani?.kelompokTani}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {lahan?.namaLahan}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">
                                {lahan?.kodeLahan}
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
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {formatDate(record.targetPanen)}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {record.luas.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">
                            {record.estimasiProduksi.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                            {formatDate(record.createdAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tambah' && (
        <div className="space-y-6">
          {/* Form Content - menggunakan grid layout yang sama seperti TambahTanamBaruContent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Petani Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  👨‍🌾 Pilih Petani
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Petani <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.petaniId || ''}
                      onChange={(e) => handlePetaniChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.petaniId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">-- Pilih Petani --</option>
                      {mockPetani.filter(p => p.status === 'active').map(petani => (
                        <option key={petani.id} value={petani.id}>
                          {petani.nama} - {petani.kelompokTani}
                        </option>
                      ))}
                    </select>
                    {errors.petaniId && <p className="text-sm text-red-500 mt-1">{errors.petaniId}</p>}
                  </div>

                  {selectedPetani && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><strong>NIK:</strong> {selectedPetani.nik}</div>
                        <div><strong>Email:</strong> {selectedPetani.email}</div>
                        <div><strong>Alamat:</strong> {selectedPetani.alamat}</div>
                        <div><strong>Kelompok Tani:</strong> {selectedPetani.kelompokTani}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lahan Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  🗺️ Pilih Lahan
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Lahan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.lahanId || ''}
                      onChange={(e) => handleLahanChange(e.target.value)}
                      disabled={!selectedPetani}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.lahanId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">-- Pilih Lahan --</option>
                      {availableLahan.map(lahan => (
                        <option key={lahan.id} value={lahan.id}>
                          {lahan.namaLahan} ({lahan.kodeLahan}) - {lahan.luas.toLocaleString()} m²
                        </option>
                      ))}
                    </select>
                    {errors.lahanId && <p className="text-sm text-red-500 mt-1">{errors.lahanId}</p>}
                  </div>

                  {selectedLahan && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><strong>Kode:</strong> {selectedLahan.kodeLahan}</div>
                        <div><strong>Lokasi:</strong> {selectedLahan.lokasi}</div>
                        <div><strong>Jenis Tanah:</strong> {selectedLahan.jenisTanah}</div>
                        <div><strong>Luas:</strong> {selectedLahan.luas.toLocaleString()} m²</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Varietas Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  🌱 Pilih Varietas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Varietas Tembakau <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.varietasId || ''}
                      onChange={(e) => handleVarietasChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.varietasId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">-- Pilih Varietas --</option>
                      {mockVarietas.filter(v => v.status === 'active').map(varietas => (
                        <option key={varietas.id} value={varietas.id}>
                          {varietas.nama} ({varietas.kategori}) - {varietas.masaPertumbuhan} hari
                        </option>
                      ))}
                    </select>
                    {errors.varietasId && <p className="text-sm text-red-500 mt-1">{errors.varietasId}</p>}
                  </div>

                  {selectedVarietas && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><strong>Kategori:</strong> {selectedVarietas.kategori}</div>
                        <div><strong>Masa Pertumbuhan:</strong> {selectedVarietas.masaPertumbuhan} hari</div>
                        <div><strong>Deskripsi:</strong> {selectedVarietas.deskripsi}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Date, Area, and Summary */}
            <div className="space-y-6">
              {/* Tanggal Tanam */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  📅 Jadwal Tanam
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Tanggal Tanam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalTanam || ''}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.tanggalTanam ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.tanggalTanam && <p className="text-sm text-red-500 mt-1">{errors.tanggalTanam}</p>}
                  </div>

                  {formData.targetPanen && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-sm">
                        <strong>Target Panen:</strong> {formatDate(formData.targetPanen)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Luas Tanam */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  📐 Luas Area Tanam
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Luas Tanam (m²) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.luas || ''}
                      onChange={(e) => {
                        const luas = parseFloat(e.target.value) || 0;
                        setFormData(prev => {
                          const newData = { ...prev, luas };
                          if (selectedVarietas) {
                            newData.estimasiProduksi = calculateEstimasiProduksi(luas, selectedVarietas);
                          }
                          return newData;
                        });
                      }}
                      min="1"
                      max={selectedLahan?.luas || undefined}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.luas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Masukkan luas area tanam"
                    />
                    {selectedLahan && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Maksimal: {selectedLahan.luas.toLocaleString()} m² (luas total lahan)
                      </p>
                    )}
                    {errors.luas && <p className="text-sm text-red-500 mt-1">{errors.luas}</p>}
                  </div>
                </div>
              </div>

              {/* Catatan Khusus */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  📝 Catatan Khusus
                </h3>
                
                <div>
                  <textarea
                    value={formData.catatanKhusus || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, catatanKhusus: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tambahkan catatan khusus untuk penanaman ini (opsional)"
                  />
                </div>
              </div>

              {/* Summary Card */}
              {(formData.luas || formData.estimasiProduksi) && (
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    📊 Ringkasan
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Luas Tanam:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formData.luas?.toLocaleString()} m²
                      </span>
                    </div>
                    {formData.estimasiProduksi && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estimasi Produksi:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formData.estimasiProduksi.toLocaleString()} kg
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => handleSave('draft')}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
              >
                {loading ? '⏳ Menyimpan...' : '💾 Simpan Draft'}
              </button>
              <button
                onClick={() => handleSave('pending_review')}
                disabled={loading || !isFormValid}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
              >
                {loading ? '⏳ Mengirim...' : '📤 Submit untuk Review'}
              </button>
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

export default ManajemenTanamContent;
