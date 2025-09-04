import React, { useState } from 'react';
import { Button } from "@heroui/button";
import PendaftaranPetaniTable from './PendaftaranPetaniTable';
import ApprovalModal from './ApprovalModal';
import Toast from '../ui/Toast';

// Mock data interface
interface FarmerRegistration {
  id: string;
  nama: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pendidikan: string;
  pengalaman: string;
  luasLahan: number;
  statusLahan: 'Milik Sendiri' | 'Sewa' | 'Bagi Hasil';
  alamatLahan: string;
  tanggalDaftar: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  catatan?: string;
  dokumen: {
    ktp: string;
    sertifikatLahan?: string;
    suratKeteranganDesa: string;
  };
}

// Mock data
const mockData: FarmerRegistration[] = [
  {
    id: 'REG001',
    nama: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    nomorTelepon: '081234567890',
    alamat: 'Jl. Raya No. 123, Desa Sejahtera',
    nik: '3507012345678901',
    tanggalLahir: '1985-05-15',
    jenisKelamin: 'Laki-laki',
    pendidikan: 'SMA',
    pengalaman: '10 tahun',
    luasLahan: 2.5,
    statusLahan: 'Milik Sendiri',
    alamatLahan: 'Jl. Pertanian No. 45, Desa Sejahtera',
    tanggalDaftar: '2024-01-15',
    status: 'pending',
    dokumen: {
      ktp: 'ktp_budi.pdf',
      sertifikatLahan: 'sertifikat_budi.pdf',
      suratKeteranganDesa: 'surat_desa_budi.pdf'
    }
  },
  {
    id: 'REG002',
    nama: 'Siti Rahayu',
    email: 'siti.rahayu@email.com',
    nomorTelepon: '081234567891',
    alamat: 'Jl. Mawar No. 67, Desa Makmur',
    nik: '3507012345678902',
    tanggalLahir: '1990-08-22',
    jenisKelamin: 'Perempuan',
    pendidikan: 'D3',
    pengalaman: '5 tahun',
    luasLahan: 1.5,
    statusLahan: 'Sewa',
    alamatLahan: 'Jl. Sawah No. 12, Desa Makmur',
    tanggalDaftar: '2024-01-18',
    status: 'pending',
    dokumen: {
      ktp: 'ktp_siti.pdf',
      suratKeteranganDesa: 'surat_desa_siti.pdf'
    }
  },
  {
    id: 'REG003',
    nama: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@email.com',
    nomorTelepon: '081234567892',
    alamat: 'Jl. Melati No. 89, Desa Subur',
    nik: '3507012345678903',
    tanggalLahir: '1982-12-10',
    jenisKelamin: 'Laki-laki',
    pendidikan: 'S1',
    pengalaman: '15 tahun',
    luasLahan: 3.0,
    statusLahan: 'Milik Sendiri',
    alamatLahan: 'Jl. Kebun No. 23, Desa Subur',
    tanggalDaftar: '2024-01-20',
    status: 'approved',
    catatan: 'Dokumen lengkap dan memenuhi syarat',
    dokumen: {
      ktp: 'ktp_ahmad.pdf',
      sertifikatLahan: 'sertifikat_ahmad.pdf',
      suratKeteranganDesa: 'surat_desa_ahmad.pdf'
    }
  },
  {
    id: 'REG004',
    nama: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    nomorTelepon: '081234567893',
    alamat: 'Jl. Anggrek No. 34, Desa Maju',
    nik: '3507012345678904',
    tanggalLahir: '1988-03-28',
    jenisKelamin: 'Perempuan',
    pendidikan: 'SMP',
    pengalaman: '8 tahun',
    luasLahan: 1.0,
    statusLahan: 'Bagi Hasil',
    alamatLahan: 'Jl. Ladang No. 56, Desa Maju',
    tanggalDaftar: '2024-01-22',
    status: 'rejected',
    catatan: 'Dokumen tidak lengkap - sertifikat lahan tidak tersedia',
    dokumen: {
      ktp: 'ktp_dewi.pdf',
      suratKeteranganDesa: 'surat_desa_dewi.pdf'
    }
  }
];

const PendaftaranPetaniContent: React.FC = () => {
  const [data, setData] = useState<FarmerRegistration[]>(mockData);
  const [filteredData, setFilteredData] = useState<FarmerRegistration[]>(mockData);
  const [selectedRegistration, setSelectedRegistration] = useState<FarmerRegistration | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'approved' | 'rejected' | 'suspended' | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Toast states
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // Statistics
  const stats = {
    total: data.length,
    pending: data.filter(item => item.status === 'pending').length,
    approved: data.filter(item => item.status === 'approved').length,
    rejected: data.filter(item => item.status === 'rejected').length,
    suspended: data.filter(item => item.status === 'suspended').length,
  };

  // Filter data based on search and status
  React.useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter]);

  const handleApproval = (registration: FarmerRegistration) => {
    setSelectedRegistration(registration);
    setSelectedAction(undefined); // Let user choose
    setIsApprovalModalOpen(true);
  };

  // Handle quick actions
  const handleQuickApprove = (registration: FarmerRegistration) => {
    const defaultNote = `Pendaftaran disetujui pada ${new Date().toLocaleDateString('id-ID')}`;
    handleApprovalSubmit(registration.id, 'approved', defaultNote);
  };

  const handleQuickReject = (registration: FarmerRegistration) => {
    // For quick reject, we still want to open modal to get proper reason
    setSelectedRegistration(registration);
    setSelectedAction('rejected');
    setIsApprovalModalOpen(true);
  };

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleApprovalSubmit = (id: string, action: 'approved' | 'rejected' | 'suspended', catatan: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, status: action, catatan }
          : item
      )
    );

    // Show success toast
    const farmerName = data.find(item => item.id === id)?.nama || 'Petani';
    const actionText = action === 'approved' ? 'disetujui' : action === 'rejected' ? 'ditolak' : 'disuspend';
    showToast(`Pendaftaran ${farmerName} berhasil ${actionText}!`, 'success');

    setIsApprovalModalOpen(false);
    setSelectedRegistration(null);
    setSelectedAction(undefined);
  };

  // StatCard component with improved dark mode support
  const StatCard: React.FC<{ 
    title: string; 
    value: number; 
    bgColor: string; 
    textColor: string;
    iconBgColor: string;
    icon: React.ReactNode 
  }> = ({
    title,
    value,
    bgColor,
    textColor,
    iconBgColor,
    icon
  }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} mb-1`}>{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Approval Pendaftaran Petani
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Verifikasi dan kelola pendaftaran petani baru
          </p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
          onPress={() => {
            // Refresh data functionality
            setData([...mockData]);
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Pendaftaran"
          value={stats.total}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-gray-600 dark:text-gray-300"
          iconBgColor="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="Menunggu Review"
          value={stats.pending}
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
          textColor="text-yellow-700 dark:text-yellow-300"
          iconBgColor="bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Disetujui"
          value={stats.approved}
          bgColor="bg-green-50 dark:bg-green-900/20"
          textColor="text-green-700 dark:text-green-300"
          iconBgColor="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Ditolak"
          value={stats.rejected}
          bgColor="bg-red-50 dark:bg-red-900/20"
          textColor="text-red-700 dark:text-red-300"
          iconBgColor="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Disuspend"
          value={stats.suspended}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          textColor="text-purple-700 dark:text-purple-300"
          iconBgColor="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cari Pendaftaran
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama, email, NIK, atau ID..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Review</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
              <option value="suspended">Disuspend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <PendaftaranPetaniTable
        data={filteredData}
        onApproval={handleApproval}
        onQuickApprove={handleQuickApprove}
        onQuickReject={handleQuickReject}
      />

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRegistration(null);
          setSelectedAction(undefined);
        }}
        registration={selectedRegistration}
        onSubmit={handleApprovalSubmit}
        preSelectedAction={selectedAction}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default PendaftaranPetaniContent;
