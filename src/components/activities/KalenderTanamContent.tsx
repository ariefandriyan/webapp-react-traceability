import React, { useState } from 'react';
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

/* interface Varietas {
  id: string;
  nama: string;
  kategori: 'Virginia' | 'Burley' | 'Oriental';
  masaPertumbuhan: number;
  deskripsi: string;
  status: 'active' | 'inactive';
} */

/* interface FaseTanam {
  id: string;
  nama: string;
  deskripsi: string;
  urutanFase: number;
  estimasiHari: number;
  status: 'active' | 'inactive';
} */

/* interface TanamRecord {
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
} */

/* interface FaseTanamRecord {
  id: string;
  tanamId: string;
  faseTanamId: string;
  tanggalUpdate: string;
  kondisiTanaman: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Buruk';
  catatanOperator: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  reviewStatus: {
    histori: Array<{
      tanggal: string;
      status: 'pending_review' | 'approved' | 'rejected';
      reviewer?: string;
      catatan?: string;
    }>;
  };
  updateBy: string;
  createdAt: string;
} */

/* interface PestisidaRecord {
  id: string;
  tanamId: string;
  pestisidaId: string;
  tanggalAplikasi: string;
  usiaSeratAplikasi: number;
  dosis: number;
  satuanDosis: 'ml/liter' | 'gram/liter' | 'liter/ha';
  jenisHamaId: string;
  metodeAplikasi: 'Semprot' | 'Siram' | 'Tabur' | 'Fumigasi';
  kondisiCuaca: 'Cerah' | 'Berawan' | 'Hujan Ringan';
  catatanAplikasi: string;
  updateBy: string;
  createdAt: string;
} */

interface CalendarActivity {
  id: string;
  tanggal: string;
  jenisAktivitas: 'tanam' | 'fase_tanam' | 'pestisida' | 'panen';
  tanamId?: string;
  faseTanamRecordId?: string;
  pestisidaRecordId?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  petaniId: string;
  lahanId: string;
  deskripsi: string;
}

const KalenderTanamContent: React.FC = () => {
  // State untuk kalender
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // State untuk filter
  const [filterJenisAktivitas, setFilterJenisAktivitas] = useState<'all' | 'tanam' | 'fase_tanam' | 'pestisida' | 'panen'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending_review' | 'approved' | 'rejected'>('all');
  const [filterPetani, setFilterPetani] = useState<string>('all');

  // State untuk toast
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
    }
  ];

/*   const mockVarietas: Varietas[] = [
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
  ]; */

  /* const mockFaseTanam: FaseTanam[] = [
    {
      id: 'FASE001',
      nama: 'Persiapan Lahan',
      deskripsi: 'Tahap persiapan dan pengolahan lahan',
      urutanFase: 1,
      estimasiHari: 7,
      status: 'active'
    },
    {
      id: 'FASE002',
      nama: 'Penanaman',
      deskripsi: 'Tahap penanaman bibit tembakau',
      urutanFase: 2,
      estimasiHari: 3,
      status: 'active'
    },
    {
      id: 'FASE003',
      nama: 'Pertumbuhan Awal',
      deskripsi: 'Tahap pertumbuhan dan perawatan awal',
      urutanFase: 3,
      estimasiHari: 30,
      status: 'active'
    },
    {
      id: 'FASE004',
      nama: 'Pertumbuhan Vegetatif',
      deskripsi: 'Tahap pertumbuhan vegetatif tanaman',
      urutanFase: 4,
      estimasiHari: 35,
      status: 'active'
    },
    {
      id: 'FASE005',
      nama: 'Pematangan',
      deskripsi: 'Tahap pematangan sebelum panen',
      urutanFase: 5,
      estimasiHari: 15,
      status: 'active'
    }
  ]; */

  // Mock calendar activities data
  const mockCalendarActivities: CalendarActivity[] = [
    // Aktivitas Tanam
    {
      id: 'ACT001',
      tanggal: '2025-09-01',
      jenisAktivitas: 'tanam',
      tanamId: 'TNM001',
      status: 'approved',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      deskripsi: 'Penanaman Virginia Gold di Lahan Utara'
    },
    {
      id: 'ACT002',
      tanggal: '2025-09-03',
      jenisAktivitas: 'tanam',
      tanamId: 'TNM002',
      status: 'approved',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      deskripsi: 'Penanaman Burley Premium di Lahan Timur'
    },
    {
      id: 'ACT003',
      tanggal: '2025-09-05',
      jenisAktivitas: 'tanam',
      tanamId: 'TNM003',
      status: 'pending_review',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      deskripsi: 'Penanaman Oriental Classic di Lahan Barat'
    },
    
    // Aktivitas Update Fase Tanam
    {
      id: 'ACT004',
      tanggal: '2025-09-08',
      jenisAktivitas: 'fase_tanam',
      faseTanamRecordId: 'FTR001',
      status: 'approved',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      deskripsi: 'Update ke Fase Pertumbuhan Awal'
    },
    {
      id: 'ACT005',
      tanggal: '2025-09-10',
      jenisAktivitas: 'fase_tanam',
      faseTanamRecordId: 'FTR002',
      status: 'approved',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      deskripsi: 'Update ke Fase Pertumbuhan Awal'
    },
    {
      id: 'ACT006',
      tanggal: '2025-09-12',
      jenisAktivitas: 'fase_tanam',
      faseTanamRecordId: 'FTR003',
      status: 'pending_review',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      deskripsi: 'Update ke Fase Pertumbuhan Vegetatif'
    },
    
    // Aktivitas Penggunaan Pestisida
    {
      id: 'ACT007',
      tanggal: '2025-09-15',
      jenisAktivitas: 'pestisida',
      pestisidaRecordId: 'PEST001',
      status: 'approved',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      deskripsi: 'Aplikasi Cypermethrin untuk Ulat Grayak'
    },
    {
      id: 'ACT008',
      tanggal: '2025-09-17',
      jenisAktivitas: 'pestisida',
      pestisidaRecordId: 'PEST002',
      status: 'approved',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      deskripsi: 'Aplikasi Fungisida untuk Pencegahan Jamur'
    },
    {
      id: 'ACT009',
      tanggal: '2025-09-20',
      jenisAktivitas: 'pestisida',
      pestisidaRecordId: 'PEST003',
      status: 'draft',
      petaniId: 'PET003',
      lahanId: 'LHN004',
      deskripsi: 'Aplikasi Herbisida untuk Gulma'
    },
    
    // Aktivitas Panen (projected)
    {
      id: 'ACT010',
      tanggal: '2025-11-30',
      jenisAktivitas: 'panen',
      tanamId: 'TNM001',
      status: 'draft',
      petaniId: 'PET001',
      lahanId: 'LHN001',
      deskripsi: 'Rencana Panen Virginia Gold'
    },
    {
      id: 'ACT011',
      tanggal: '2025-12-05',
      jenisAktivitas: 'panen',
      tanamId: 'TNM002',
      status: 'draft',
      petaniId: 'PET002',
      lahanId: 'LHN003',
      deskripsi: 'Rencana Panen Burley Premium'
    }
  ];

  // Helper functions
  const getPetaniById = (id: string) => mockPetani.find(p => p.id === id);
  const getLahanById = (id: string) => mockLahan.find(l => l.id === id);
  /* const getVarietasById = (id: string) => mockVarietas.find(v => v.id === id);
  const getFaseTanamById = (id: string) => mockFaseTanam.find(f => f.id === id); */

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00');
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const checkDate = parseDate(dateString);
    return checkDate.toDateString() === today.toDateString();
  };

  const isSelectedDate = (dateString: string) => {
    return selectedDate === dateString;
  };

  // Get activities for a specific date
  const getActivitiesForDate = (dateString: string) => {
    return mockCalendarActivities.filter(activity => {
      const activityDate = activity.tanggal;
      const matchesDate = activityDate === dateString;
      
      // Apply filters
      const matchesJenis = filterJenisAktivitas === 'all' || activity.jenisAktivitas === filterJenisAktivitas;
      const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
      const matchesPetani = filterPetani === 'all' || activity.petaniId === filterPetani;
      
      return matchesDate && matchesJenis && matchesStatus && matchesPetani;
    });
  };

  // Get all filtered activities for the current month
  const getFilteredActivitiesForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return mockCalendarActivities.filter(activity => {
      const activityDate = parseDate(activity.tanggal);
      const matchesMonth = activityDate.getFullYear() === year && activityDate.getMonth() === month;
      
      // Apply filters
      const matchesJenis = filterJenisAktivitas === 'all' || activity.jenisAktivitas === filterJenisAktivitas;
      const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
      const matchesPetani = filterPetani === 'all' || activity.petaniId === filterPetani;
      
      return matchesMonth && matchesJenis && matchesStatus && matchesPetani;
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Modal functions
  const handleDateClick = (dateString: string) => {
    const activities = getActivitiesForDate(dateString);
    if (activities.length > 0) {
      setSelectedDate(dateString);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(new Date(year, month, day));
      days.push(dateString);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const getActivityIcon = (jenisAktivitas: string) => {
    const icons = {
      tanam: '🌱',
      fase_tanam: '🔄',
      pestisida: '🧪',
      panen: '🌾'
    };
    return icons[jenisAktivitas as keyof typeof icons] || '📅';
  };

  const getActivityBadge = (jenisAktivitas: string) => {
    const badges = {
      tanam: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      fase_tanam: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      pestisida: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      panen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    
    const labels = {
      tanam: 'Tanam',
      fase_tanam: 'Fase Tanam',
      pestisida: 'Pestisida',
      panen: 'Panen'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[jenisAktivitas as keyof typeof badges]}`}>
        {labels[jenisAktivitas as keyof typeof labels]}
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

  /* const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  }; */

  const formatDateDisplay = (dateString: string) => {
    return parseDate(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">📅 Kalender Tanam</h1>
        <p className="text-emerald-100">
          Lihat jadwal dan aktivitas tanam petani dalam tampilan kalender
        </p>
      </div>

      {/* Filter dan Kontrol */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              📈 Total Aktivitas
            </label>
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-semibold">
              {getFilteredActivitiesForMonth().length} aktivitas
            </div>
          </div>
        </div>

        {/* Navigasi Kalender */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              ←
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              →
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Kalender */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header hari */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Grid kalender */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dateString, index) => (
            <div
              key={index}
              className={`min-h-24 border-b border-r border-gray-200 dark:border-gray-600 p-2 ${
                dateString ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
              } ${
                dateString && isToday(dateString) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
              } ${
                dateString && isSelectedDate(dateString) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => dateString && handleDateClick(dateString)}
            >
              {dateString && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(dateString) ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {parseDate(dateString).getDate()}
                  </div>
                  <div className="space-y-1">
                    {getActivitiesForDate(dateString).slice(0, 2).map(activity => (
                      <div
                        key={activity.id}
                        className="text-xs p-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 truncate"
                        title={activity.deskripsi}
                      >
                        {getActivityIcon(activity.jenisAktivitas)} {activity.deskripsi.slice(0, 15)}...
                      </div>
                    ))}
                    {getActivitiesForDate(dateString).length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{getActivitiesForDate(dateString).length - 2} lainnya
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Aktivitas */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">📅 Aktivitas Tanam</h2>
                  <p className="text-emerald-100">
                    {formatDateDisplay(selectedDate)}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Daftar Aktivitas */}
              <div className="space-y-4">
                {getActivitiesForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <span className="text-4xl block mb-2">📭</span>
                    <span>Tidak ada aktivitas pada tanggal ini</span>
                  </div>
                ) : (
                  getActivitiesForDate(selectedDate).map(activity => {
                    const petani = getPetaniById(activity.petaniId);
                    const lahan = getLahanById(activity.lahanId);
                    
                    return (
                      <div key={activity.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getActivityIcon(activity.jenisAktivitas)}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {activity.deskripsi}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                ID: {activity.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getActivityBadge(activity.jenisAktivitas)}
                            {getStatusBadge(activity.status)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informasi Petani</h4>
                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                              <div><strong>Nama:</strong> {petani?.nama}</div>
                              <div><strong>Kelompok:</strong> {petani?.kelompokTani}</div>
                              <div><strong>Email:</strong> {petani?.email}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informasi Lahan</h4>
                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                              <div><strong>Nama Lahan:</strong> {lahan?.namaLahan}</div>
                              <div><strong>Kode:</strong> {lahan?.kodeLahan}</div>
                              <div><strong>Lokasi:</strong> {lahan?.lokasi}</div>
                              <div><strong>Luas:</strong> {lahan?.luas.toLocaleString()} m²</div>
                            </div>
                          </div>
                        </div>

                        {/* Detail spesifik berdasarkan jenis aktivitas */}
                        {activity.jenisAktivitas === 'tanam' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detail Penanaman</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div><strong>Tanggal Tanam:</strong> {formatDateDisplay(selectedDate)}</div>
                              <div><strong>Status Approval:</strong> {getStatusBadge(activity.status)}</div>
                            </div>
                          </div>
                        )}

                        {activity.jenisAktivitas === 'fase_tanam' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detail Update Fase</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div><strong>Tanggal Update:</strong> {formatDateDisplay(selectedDate)}</div>
                              <div><strong>Status Approval:</strong> {getStatusBadge(activity.status)}</div>
                            </div>
                          </div>
                        )}

                        {activity.jenisAktivitas === 'pestisida' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detail Aplikasi Pestisida</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div><strong>Tanggal Aplikasi:</strong> {formatDateDisplay(selectedDate)}</div>
                              <div><strong>Status Approval:</strong> {getStatusBadge(activity.status)}</div>
                            </div>
                          </div>
                        )}

                        {activity.jenisAktivitas === 'panen' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detail Rencana Panen</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div><strong>Target Panen:</strong> {formatDateDisplay(selectedDate)}</div>
                              <div><strong>Status:</strong> {getStatusBadge(activity.status)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Tutup
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

export default KalenderTanamContent;
