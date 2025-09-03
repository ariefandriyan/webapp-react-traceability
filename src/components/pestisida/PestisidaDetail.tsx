import React from 'react';
import { Button } from '@heroui/button';
import { PestisidaData } from '../../types/pestisida';

interface PestisidaDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: PestisidaData | null;
}

const PestisidaDetail: React.FC<PestisidaDetailProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getRiskBadgeColor = (kategori: string) => {
    switch (kategori) {
      case 'Rendah': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Sedang': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Tinggi': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusBadgeColor = (status: boolean) => {
    return status
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detail Pestisida
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {data.merek} - {data.namaPestisida}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(data.kategoriRisiko)}`}>
                Risiko {data.kategoriRisiko}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(data.statusAktif)}`}>
                {data.statusAktif ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informasi Dasar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Merek
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{data.merek}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nama Pestisida
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{data.namaPestisida}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Produsen
                </label>
                <p className="text-gray-900 dark:text-white">{data.produsen}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nomor Registrasi
                </label>
                <p className="text-gray-900 dark:text-white font-mono">{data.nomorRegistrasi}</p>
              </div>
            </div>
          </div>

          {/* Chemical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Kimia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Kandungan Aktif
                </label>
                <p className="text-gray-900 font-medium">{data.kandunganAktif}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Konsentrasi
                </label>
                <p className="text-gray-900">{data.konsentrasi}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Bentuk Sediaan
                </label>
                <p className="text-gray-900">{data.bentukSediaan}</p>
              </div>
            </div>
          </div>

          {/* Usage Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Penggunaan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Dosis Rekomendasi
                </label>
                <p className="text-gray-900 font-medium">{data.dosisRekomendasi}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Masa Karensi
                </label>
                <p className="text-gray-900">
                  {data.masaKarensi} hari
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Petunjuk Penggunaan
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {data.petunjukPenggunaan}
                </p>
              </div>
            </div>
          </div>

          {/* Pest Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Jenis Hama yang Dapat Diatasi
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.jenisHama.map((hama, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 font-medium"
                >
                  {hama}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Warnings */}
          {data.peringatanKeamanan.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Peringatan Keamanan
              </h3>
              <div className="space-y-2">
                {data.peringatanKeamanan.map((peringatan, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-red-50 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600 rounded-r-lg"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400 dark:text-red-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800 dark:text-red-300">{peringatan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informasi Produksi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Produksi
                </label>
                <p className="text-gray-900">
                  {formatDate(data.tanggalProduksi || '')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tanggal Kadaluarsa
                </label>
                <p className="text-gray-900">
                  {formatDate(data.tanggalKadaluarsa || '')}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informasi Sistem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">ID</label>
                <p className="font-mono text-gray-900 dark:text-white">{data.id}</p>
              </div>
              
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal Dibuat</label>
                <p className="text-gray-900 dark:text-white">{formatDate(data.createdAt)}</p>
              </div>
              
              <div>
                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Terakhir Diupdate</label>
                <p className="text-gray-900 dark:text-white">{formatDate(data.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end">
            <Button
              onPress={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestisidaDetail;
