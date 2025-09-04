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

/* interface FaseTanam {
  id: string;
  nama: string;
  deskripsi: string;
  urutanFase: number;
  estimasiHari: number;
  status: 'active' | 'inactive';
} */

interface ActivityReport {
  id: string;
  petaniId: string;
  lahanId: string;
  varietasId?: string;
  jenisAktivitas: 'tanam' | 'fase_tanam' | 'pestisida' | 'panen';
  tanggalAktivitas: string;
  deskripsiAktivitas: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  createdBy: string;
  reviewBy?: string;
  reviewDate?: string;
  catatan?: string;
  metadata?: {
    faseTanamId?: string;
    pestisidaId?: string;
    dosis?: number;
    targetProduksi?: number;
    luasTanam?: number;
  };
  createdAt: string;
  updatedAt: string;
}

type SortField = 'tanggalAktivitas' | 'petani' | 'jenisAktivitas' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const LaporanContent: React.FC = () => {
  // State untuk tabel dan filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenisAktivitas, setFilterJenisAktivitas] = useState<'all' | 'tanam' | 'fase_tanam' | 'pestisida' | 'panen'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [filterPetani, setFilterPetani] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // State untuk sorting
  const [sortField, setSortField] = useState<SortField>('tanggalAktivitas');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
    },
    {
      id: 'PET004',
      nama: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      nik: '3201234567890126',
      alamat: 'Jl. Mawar No. 89, Desa Pujon',
      kelompokTani: 'Kelompok Tani Maju',
      status: 'active'
    },
    {
      id: 'PET005',
      nama: 'Raden Wijadi',
      email: 'raden.wijadi@email.com',
      nik: '3201234567890127',
      alamat: 'Jl. Cempaka No. 12, Desa Batu',
      kelompokTani: 'Kelompok Tani Sukses',
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
    },
    {
      id: 'LHN005',
      kodeLahan: 'TMB-004-A',
      namaLahan: 'Lahan Tembakau Tengah',
      petaniId: 'PET004',
      luas: 2800,
      lokasi: 'Blok E, Desa Pujon',
      jenisTanah: 'Lempung Berpasir',
      koordinat: { latitude: -7.9706, longitude: 112.6366 },
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

  // Mock activity reports data
  const mockActivityReports: ActivityReport[] = [
    // Aktivitas Tanam
    {
      id: 'RPT001',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      varietasId: 'VAR001',
      jenisAktivitas: 'tanam',
      tanggalAktivitas: '2025-08-15',
      deskripsiAktivitas: 'Penanaman Virginia Gold seluas 2000 m² di Lahan Utara',
      status: 'approved',
      createdBy: 'operator1',
      reviewBy: 'admin1',
      reviewDate: '2025-08-16',
      catatan: 'Penanaman berjalan lancar sesuai jadwal',
      metadata: {
        targetProduksi: 7000,
        luasTanam: 2000
      },
      createdAt: '2025-08-15T08:00:00Z',
      updatedAt: '2025-08-16T10:30:00Z'
    },
    {
      id: 'RPT002',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      varietasId: 'VAR002',
      jenisAktivitas: 'tanam',
      tanggalAktivitas: '2025-08-20',
      deskripsiAktivitas: 'Penanaman Burley Premium seluas 1500 m² di Lahan Timur',
      status: 'approved',
      createdBy: 'operator2',
      reviewBy: 'admin1',
      reviewDate: '2025-08-21',
      catatan: 'Kondisi lahan bagus, siap tanam',
      metadata: {
        targetProduksi: 4500,
        luasTanam: 1500
      },
      createdAt: '2025-08-20T09:15:00Z',
      updatedAt: '2025-08-21T14:20:00Z'
    },
    {
      id: 'RPT003',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      varietasId: 'VAR003',
      jenisAktivitas: 'tanam',
      tanggalAktivitas: '2025-08-25',
      deskripsiAktivitas: 'Penanaman Oriental Classic seluas 1200 m² di Lahan Barat',
      status: 'pending_review',
      createdBy: 'operator3',
      catatan: 'Menunggu approval admin',
      metadata: {
        targetProduksi: 3000,
        luasTanam: 1200
      },
      createdAt: '2025-08-25T16:45:00Z',
      updatedAt: '2025-08-25T16:45:00Z'
    },
    
    // Aktivitas Update Fase Tanam
    {
      id: 'RPT004',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      jenisAktivitas: 'fase_tanam',
      tanggalAktivitas: '2025-09-01',
      deskripsiAktivitas: 'Update fase tanam ke Pertumbuhan Awal (17 hari)',
      status: 'approved',
      createdBy: 'operator1',
      reviewBy: 'admin2',
      reviewDate: '2025-09-02',
      catatan: 'Kondisi tanaman sangat baik',
      metadata: {
        faseTanamId: 'FASE003'
      },
      createdAt: '2025-09-01T08:30:00Z',
      updatedAt: '2025-09-02T11:15:00Z'
    },
    {
      id: 'RPT005',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      jenisAktivitas: 'fase_tanam',
      tanggalAktivitas: '2025-09-05',
      deskripsiAktivitas: 'Update fase tanam ke Pertumbuhan Awal (16 hari)',
      status: 'approved',
      createdBy: 'operator2',
      reviewBy: 'admin1',
      reviewDate: '2025-09-06',
      catatan: 'Pertumbuhan sesuai ekspektasi',
      metadata: {
        faseTanamId: 'FASE003'
      },
      createdAt: '2025-09-05T09:00:00Z',
      updatedAt: '2025-09-06T13:45:00Z'
    },
    {
      id: 'RPT006',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      jenisAktivitas: 'fase_tanam',
      tanggalAktivitas: '2025-09-10',
      deskripsiAktivitas: 'Update fase tanam ke Pertumbuhan Vegetatif (26 hari)',
      status: 'draft',
      createdBy: 'operator1',
      catatan: 'Sedang dalam proses input',
      metadata: {
        faseTanamId: 'FASE004'
      },
      createdAt: '2025-09-10T10:20:00Z',
      updatedAt: '2025-09-10T10:20:00Z'
    },
    
    // Aktivitas Pestisida
    {
      id: 'RPT007',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      jenisAktivitas: 'pestisida',
      tanggalAktivitas: '2025-08-30',
      deskripsiAktivitas: 'Aplikasi Cypermethrin 25 EC untuk pengendalian Ulat Grayak',
      status: 'approved',
      createdBy: 'operator1',
      reviewBy: 'admin2',
      reviewDate: '2025-08-31',
      catatan: 'Aplikasi berhasil, hama terkendali',
      metadata: {
        pestisidaId: 'PEST001',
        dosis: 2.5
      },
      createdAt: '2025-08-30T15:00:00Z',
      updatedAt: '2025-08-31T09:30:00Z'
    },
    {
      id: 'RPT008',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      jenisAktivitas: 'pestisida',
      tanggalAktivitas: '2025-09-03',
      deskripsiAktivitas: 'Aplikasi Mancozeb 80 WP untuk pencegahan penyakit jamur',
      status: 'approved',
      createdBy: 'operator2',
      reviewBy: 'admin1',
      reviewDate: '2025-09-04',
      catatan: 'Aplikasi preventif berjalan baik',
      metadata: {
        pestisidaId: 'PEST002',
        dosis: 3.0
      },
      createdAt: '2025-09-03T07:45:00Z',
      updatedAt: '2025-09-04T12:00:00Z'
    },
    {
      id: 'RPT009',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      jenisAktivitas: 'pestisida',
      tanggalAktivitas: '2025-09-08',
      deskripsiAktivitas: 'Aplikasi Glyphosate 480 SL untuk pengendalian gulma',
      status: 'rejected',
      createdBy: 'operator3',
      reviewBy: 'admin2',
      reviewDate: '2025-09-09',
      catatan: 'Dosis terlalu tinggi, perlu revisi',
      metadata: {
        pestisidaId: 'PEST003',
        dosis: 5.0
      },
      createdAt: '2025-09-08T14:30:00Z',
      updatedAt: '2025-09-09T11:45:00Z'
    },
    
    // Aktivitas Panen (Rencana)
    {
      id: 'RPT010',
      petaniId: 'PET004',
      lahanId: 'LHN005',
      varietasId: 'VAR001',
      jenisAktivitas: 'panen',
      tanggalAktivitas: '2025-11-15',
      deskripsiAktivitas: 'Rencana panen Virginia Gold dengan estimasi 8000 kg',
      status: 'draft',
      createdBy: 'operator4',
      catatan: 'Rencana panen masih dalam tahap perencanaan',
      metadata: {
        targetProduksi: 8000,
        luasTanam: 2800
      },
      createdAt: '2025-09-01T16:00:00Z',
      updatedAt: '2025-09-01T16:00:00Z'
    },
    
    // Data tambahan untuk variasi
    {
      id: 'RPT011',
      petaniId: 'PET004',
      lahanId: 'LHN005',
      varietasId: 'VAR001',
      jenisAktivitas: 'tanam',
      tanggalAktivitas: '2025-08-10',
      deskripsiAktivitas: 'Penanaman Virginia Gold seluas 2800 m² di Lahan Tengah',
      status: 'approved',
      createdBy: 'operator4',
      reviewBy: 'admin1',
      reviewDate: '2025-08-11',
      catatan: 'Lahan siap, kondisi optimal',
      metadata: {
        targetProduksi: 8000,
        luasTanam: 2800
      },
      createdAt: '2025-08-10T07:30:00Z',
      updatedAt: '2025-08-11T15:45:00Z'
    },
    {
      id: 'RPT012',
      petaniId: 'PET005',
      lahanId: 'LHN006',
      varietasId: 'VAR002',
      jenisAktivitas: 'tanam',
      tanggalAktivitas: '2025-08-28',
      deskripsiAktivitas: 'Penanaman Burley Premium seluas 1600 m²',
      status: 'pending_review',
      createdBy: 'operator5',
      catatan: 'Menunggu verifikasi dokumen',
      metadata: {
        targetProduksi: 4800,
        luasTanam: 1600
      },
      createdAt: '2025-08-28T11:20:00Z',
      updatedAt: '2025-08-28T11:20:00Z'
    }
  ];

  // Helper functions
  const getPetaniById = (id: string) => mockPetani.find(p => p.id === id);
  const getLahanById = (id: string) => mockLahan.find(l => l.id === id);
  const getVarietasById = (id: string) => mockVarietas.find(v => v.id === id);

  // Filter dan sorting data
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockActivityReports.filter(report => {
      const petani = getPetaniById(report.petaniId);
      const lahan = getLahanById(report.lahanId);
      const varietas = report.varietasId ? getVarietasById(report.varietasId) : null;
      
      // Filter berdasarkan pencarian
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        petani?.nama.toLowerCase().includes(searchLower) ||
        lahan?.namaLahan.toLowerCase().includes(searchLower) ||
        lahan?.kodeLahan.toLowerCase().includes(searchLower) ||
        varietas?.nama.toLowerCase().includes(searchLower) ||
        report.deskripsiAktivitas.toLowerCase().includes(searchLower) ||
        report.id.toLowerCase().includes(searchLower);

      // Filter berdasarkan jenis aktivitas
      const matchesJenis = filterJenisAktivitas === 'all' || report.jenisAktivitas === filterJenisAktivitas;
      
      // Filter berdasarkan status
      const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
      
      // Filter berdasarkan petani
      const matchesPetani = filterPetani === 'all' || report.petaniId === filterPetani;
      
      // Filter berdasarkan tanggal
      const reportDate = new Date(report.tanggalAktivitas);
      const startDate = filterDateRange.startDate ? new Date(filterDateRange.startDate) : null;
      const endDate = filterDateRange.endDate ? new Date(filterDateRange.endDate) : null;
      
      const matchesDateRange = (!startDate || reportDate >= startDate) && 
                              (!endDate || reportDate <= endDate);

      return matchesSearch && matchesJenis && matchesStatus && matchesPetani && matchesDateRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'tanggalAktivitas':
          aValue = new Date(a.tanggalAktivitas);
          bValue = new Date(b.tanggalAktivitas);
          break;
        case 'petani':
          aValue = getPetaniById(a.petaniId)?.nama || '';
          bValue = getPetaniById(b.petaniId)?.nama || '';
          break;
        case 'jenisAktivitas':
          aValue = a.jenisAktivitas;
          bValue = b.jenisAktivitas;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.tanggalAktivitas;
          bValue = b.tanggalAktivitas;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, filterJenisAktivitas, filterStatus, filterPetani, filterDateRange, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export functions
  const exportToCSV = () => {
    setLoading(true);
    
    try {
      const headers = [
        'ID Laporan',
        'Nama Petani',
        'Kelompok Tani',
        'Lahan',
        'Kode Lahan',
        'Jenis Aktivitas',
        'Tanggal Aktivitas',
        'Deskripsi',
        'Status',
        'Dibuat Oleh',
        'Direview Oleh',
        'Tanggal Review',
        'Catatan',
        'Dibuat Pada',
        'Diupdate Pada'
      ];

      const csvData = filteredAndSortedData.map(report => {
        const petani = getPetaniById(report.petaniId);
        const lahan = getLahanById(report.lahanId);
        
        return [
          report.id,
          petani?.nama || '',
          petani?.kelompokTani || '',
          lahan?.namaLahan || '',
          lahan?.kodeLahan || '',
          report.jenisAktivitas,
          report.tanggalAktivitas,
          report.deskripsiAktivitas,
          report.status,
          report.createdBy,
          report.reviewBy || '',
          report.reviewDate || '',
          report.catatan || '',
          report.createdAt,
          report.updatedAt
        ];
      });

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan-aktivitas-tanam-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Laporan CSV berhasil diunduh', 'success');
    } catch (error) {
      showToast('Gagal mengunduh laporan CSV', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    setLoading(true);
    
    // Simulasi export PDF (dalam implementasi real, gunakan library seperti jsPDF)
    setTimeout(() => {
      showToast('Fitur export PDF sedang dalam pengembangan', 'info');
      setLoading(false);
    }, 1500);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterJenisAktivitas('all');
    setFilterStatus('all');
    setFilterPetani('all');
    setFilterDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  // Badge components
  const getJenisAktivitasBadge = (jenis: string) => {
    const badges = {
      tanam: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      fase_tanam: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      pestisida: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      panen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };

    const labels = {
      tanam: '🌱 Tanam',
      fase_tanam: '🔄 Fase Tanam',
      pestisida: '🧪 Pestisida',
      panen: '🌾 Panen'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[jenis as keyof typeof badges]}`}>
        {labels[jenis as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      pending_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels = {
      draft: 'Draft',
      pending_review: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">📊 Laporan Aktivitas Tanam</h1>
        <p className="text-emerald-100">
          Laporan komprehensif semua aktivitas tanam petani dengan fitur pencarian dan ekspor
        </p>
      </div>

      {/* Filter dan Kontrol */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Pencarian
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari petani, lahan, aktivitas..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Jenis Aktivitas
            </label>
            <select
              value={filterJenisAktivitas}
              onChange={(e) => setFilterJenisAktivitas(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Aktivitas</option>
              <option value="tanam">🌱 Tanam</option>
              <option value="fase_tanam">🔄 Update Fase</option>
              <option value="pestisida">🧪 Pestisida</option>
              <option value="panen">🌾 Panen</option>
            </select>
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
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
              📅 Rentang Tanggal
            </label>
            <div className="flex space-x-1">
              <input
                type="date"
                value={filterDateRange.startDate}
                onChange={(e) => setFilterDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="flex-1 px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="date"
                value={filterDateRange.endDate}
                onChange={(e) => setFilterDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Statistik dan Kontrol */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-semibold">
              📈 {filteredAndSortedData.length} dari {mockActivityReports.length} laporan
            </div>
            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              🔄 Reset Filter
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              disabled={loading || filteredAndSortedData.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳' : '📄'} Export CSV
            </button>
            <button
              onClick={exportToPDF}
              disabled={loading || filteredAndSortedData.length === 0}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳' : '📋'} Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Laporan */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('tanggalAktivitas')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tanggal Aktivitas</span>
                    {sortField === 'tanggalAktivitas' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('petani')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Petani & Lahan</span>
                    {sortField === 'petani' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('jenisAktivitas')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Jenis Aktivitas</span>
                    {sortField === 'jenisAktivitas' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Deskripsi Aktivitas
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === 'status' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Review Info
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Dibuat</span>
                    {sortField === 'createdAt' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">📭</span>
                      <span>Tidak ada data laporan yang ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((report) => {
                  const petani = getPetaniById(report.petaniId);
                  const lahan = getLahanById(report.lahanId);
                  const varietas = report.varietasId ? getVarietasById(report.varietasId) : null;

                  return (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(report.tanggalAktivitas)}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            ID: {report.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {petani?.nama}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {lahan?.namaLahan} ({lahan?.kodeLahan})
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            {petani?.kelompokTani}
                          </div>
                          {varietas && (
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {varietas.nama}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getJenisAktivitasBadge(report.jenisAktivitas)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <div className="text-gray-900 dark:text-white">
                            {report.deskripsiAktivitas}
                          </div>
                          {report.catatan && (
                            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                              💬 {report.catatan}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs">
                          <div className="text-gray-900 dark:text-white">
                            👤 {report.createdBy}
                          </div>
                          {report.reviewBy && (
                            <div className="text-gray-500 dark:text-gray-400">
                              ✅ {report.reviewBy}
                            </div>
                          )}
                          {report.reviewDate && (
                            <div className="text-gray-500 dark:text-gray-400">
                              📅 {formatDate(report.reviewDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>📅 {formatDateTime(report.createdAt)}</div>
                          {report.updatedAt !== report.createdAt && (
                            <div>🔄 {formatDateTime(report.updatedAt)}</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tampilkan
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  per halaman
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ⟪
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ⟫
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

export default LaporanContent;
