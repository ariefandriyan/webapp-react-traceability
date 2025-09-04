import React from 'react';

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

interface PendaftaranPetaniTableProps {
  data: FarmerRegistration[];
  onApproval: (registration: FarmerRegistration) => void;
  onQuickApprove: (registration: FarmerRegistration) => void;
  onQuickReject: (registration: FarmerRegistration) => void;
}

const PendaftaranPetaniTable: React.FC<PendaftaranPetaniTableProps> = ({
  data,
  onApproval,
  onQuickApprove,
  onQuickReject
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: FarmerRegistration['status']) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-300',
        label: 'Menunggu Review'
      },
      approved: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-300',
        label: 'Disetujui'
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-300',
        label: 'Ditolak'
      },
      suspended: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-300',
        label: 'Disuspend'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusLahanBadge = (statusLahan: FarmerRegistration['statusLahan']) => {
    const statusConfig = {
      'Milik Sendiri': {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-300'
      },
      'Sewa': {
        bg: 'bg-orange-100 dark:bg-orange-900', 
        text: 'text-orange-800 dark:text-orange-300'
      },
      'Bagi Hasil': {
        bg: 'bg-teal-100 dark:bg-teal-900',
        text: 'text-teal-800 dark:text-teal-300'
      }
    };

    const config = statusConfig[statusLahan];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {statusLahan}
      </span>
    );
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-8">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Tidak ada data pendaftaran</h3>
          <p className="text-gray-500 dark:text-gray-400">Belum ada petani yang mendaftar saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Petani
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Lahan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tanggal Daftar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {data.map((registration) => (
              <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          {registration.nama.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {registration.nama}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {registration.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        NIK: {registration.nik}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {registration.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {registration.nomorTelepon}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {registration.luasLahan} ha
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {registration.pengalaman} pengalaman
                  </div>
                  {getStatusLahanBadge(registration.statusLahan)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(registration.tanggalDaftar)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(registration.status)}
                  {registration.catatan && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
                      {registration.catatan}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onApproval(registration)}
                      className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                      title="Review Detail"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Review
                    </button>
                    
                    {registration.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onQuickApprove(registration)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                          title="Setujui Langsung"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Setujui
                        </button>
                        <button
                          onClick={() => onQuickReject(registration)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                          title="Tolak dengan Alasan"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Tolak
                        </button>
                      </>
                    )}

                    {registration.status === 'approved' && (
                      <button
                        onClick={() => onApproval(registration)}
                        className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        title="Suspend Petani"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Suspend
                      </button>
                    )}

                    {(registration.status === 'rejected' || registration.status === 'suspended') && (
                      <button
                        onClick={() => onApproval(registration)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                        title="Review Ulang"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Review Ulang
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendaftaranPetaniTable;
