import React, { useState } from 'react';
import AktivitasTanamTable from './AktivitasTanamTable';
import Toast from '../ui/Toast';

interface ActivityRecord {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  aktivitas: string;
  fase: string;
  tanggalRencana: string;
  tanggalRealisasi: string;
  namaOperator: string;
  emailOperator: string;
  metadata: {
    cuaca: string;
    suhuUdara: number;
    kelembaban: number;
    kondisiTanah: string;
    pupukDigunakan?: string;
    pestisidaDigunakan?: string;
    catatanKhusus?: string;
    fotoAktivitas?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  catatan?: string;
}

// Mock data
const mockActivities: ActivityRecord[] = [
  {
    id: 'ACT001',
    kodeLahan: 'LHN001',
    namaLahan: 'Lahan Tembakau Utara',
    aktivitas: 'Penyemaian',
    fase: 'Persiapan Bibit',
    tanggalRencana: '2024-12-01',
    tanggalRealisasi: '2024-12-01',
    namaOperator: 'Budi Santoso',
    emailOperator: 'budi@example.com',
    metadata: {
      cuaca: 'Cerah',
      suhuUdara: 28,
      kelembaban: 65,
      kondisiTanah: 'Gembur dan lembab',
      catatanKhusus: 'Benih berkualitas baik, perkecambahan merata'
    },
    status: 'pending',
    createdAt: '2024-12-01T08:30:00Z'
  },
  {
    id: 'ACT002',
    kodeLahan: 'LHN002',
    namaLahan: 'Lahan Tembakau Selatan',
    aktivitas: 'Pengolahan Tanah',
    fase: 'Persiapan Lahan',
    tanggalRencana: '2024-11-28',
    tanggalRealisasi: '2024-11-29',
    namaOperator: 'Siti Aminah',
    emailOperator: 'siti@example.com',
    metadata: {
      cuaca: 'Berawan',
      suhuUdara: 26,
      kelembaban: 70,
      kondisiTanah: 'Keras, perlu dicangkul dalam',
      catatanKhusus: 'Tanah terlalu kering, perlu disiram sebelum dicangkul'
    },
    status: 'approved',
    createdAt: '2024-11-29T14:15:00Z',
    approvedAt: '2024-11-30T09:20:00Z',
    approvedBy: 'Admin Surabaya',
    catatan: 'Aktivitas sesuai SOP, dokumentasi lengkap'
  },
  {
    id: 'ACT003',
    kodeLahan: 'LHN003',
    namaLahan: 'Lahan Tembakau Timur',
    aktivitas: 'Pemupukan Dasar',
    fase: 'Persiapan Lahan',
    tanggalRencana: '2024-11-25',
    tanggalRealisasi: '2024-11-26',
    namaOperator: 'Ahmad Fauzi',
    emailOperator: 'ahmad@example.com',
    metadata: {
      cuaca: 'Hujan Ringan',
      suhuUdara: 24,
      kelembaban: 85,
      kondisiTanah: 'Basah, berlumpur',
      pupukDigunakan: 'NPK 15-15-15, 200kg/ha',
      catatanKhusus: 'Pemupukan ditunda karena hujan'
    },
    status: 'rejected',
    createdAt: '2024-11-26T16:45:00Z',
    rejectedAt: '2024-11-27T11:10:00Z',
    rejectedBy: 'Admin Malang',
    catatan: 'Pemupukan tidak sesuai jadwal, kondisi tanah terlalu basah. Harap ulangi saat kondisi optimal.'
  }
];

const AktivitasTanamApprovalContent: React.FC = () => {
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>(mockActivities);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'info' });

  // Statistics
  const stats = {
    total: mockActivities.length,
    pending: mockActivities.filter((a: ActivityRecord) => a.status === 'pending').length,
    approved: mockActivities.filter((a: ActivityRecord) => a.status === 'approved').length,
    rejected: mockActivities.filter((a: ActivityRecord) => a.status === 'rejected').length
  };

  // Filter and search activities
  React.useEffect(() => {
    let filtered = mockActivities;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.kodeLahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.namaLahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.aktivitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.namaOperator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.fase.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [filterStatus, searchTerm]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const handleApprovalSubmit = async (id: string, action: 'approved' | 'rejected', catatan: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock data
      const activityIndex = mockActivities.findIndex(activity => activity.id === id);
      if (activityIndex !== -1) {
        mockActivities[activityIndex] = {
          ...mockActivities[activityIndex],
          status: action,
          [`${action}At`]: new Date().toISOString(),
          [`${action}By`]: 'Admin User',
          catatan: catatan || undefined
        };
      }
      
      const actionText = action === 'approved' ? 'disetujui' : 'ditolak';
      showToast(`Aktivitas berhasil ${actionText}`, 'success');
      
    } catch (error) {
      showToast('Terjadi kesalahan saat memproses approval', 'error');
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    color: string;
    bgColor: string;
    textColor: string;
  }> = ({ title, value, color, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Approval Aktivitas Tanam
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review dan approve aktivitas tanam tembakau yang dilaporkan operator
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Aktivitas"
          value={stats.total}
          color="bg-blue-500"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          textColor="text-blue-700 dark:text-blue-300"
        />
        <StatCard
          title="Menunggu Review"
          value={stats.pending}
          color="bg-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-900/20"
          textColor="text-amber-700 dark:text-amber-300"
        />
        <StatCard
          title="Disetujui"
          value={stats.approved}
          color="bg-green-500"
          bgColor="bg-green-50 dark:bg-green-900/20"
          textColor="text-green-700 dark:text-green-300"
        />
        <StatCard
          title="Ditolak"
          value={stats.rejected}
          color="bg-red-500"
          bgColor="bg-red-50 dark:bg-red-900/20"
          textColor="text-red-700 dark:text-red-300"
        />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari berdasarkan kode lahan, nama lahan, aktivitas, atau operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                     placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu Review</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {/* Table */}
      <AktivitasTanamTable
        data={filteredActivities}
        onApproval={handleApprovalSubmit}
      />
      {/* Toast */}
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default AktivitasTanamApprovalContent;
