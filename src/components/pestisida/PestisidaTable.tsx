import React from 'react';
import { Button } from '@heroui/button';
import { PestisidaData } from '../../types/pestisida';

interface PestisidaTableProps {
  data: PestisidaData[];
  onEdit: (pestisida: PestisidaData) => void;
  onDelete: (id: string) => void;
  onView: (pestisida: PestisidaData) => void;
  loading?: boolean;
}

const PestisidaTable: React.FC<PestisidaTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView,
  loading = false
}) => {
  const getRisikoColor = (kategori: string) => {
    switch (kategori) {
      case 'Rendah':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Sedang':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Tinggi':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: boolean) => {
    return status 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getBentukColor = (bentuk: string) => {
    switch (bentuk) {
      case 'Cair':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Granul':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Tablet':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Bubuk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Emulsi':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-50 dark:bg-emerald-900">
            <tr>
              <th scope="col" className="px-6 py-3">Merek</th>
              <th scope="col" className="px-6 py-3">Nama Pestisida</th>
              <th scope="col" className="px-6 py-3">Kandungan Aktif</th>
              <th scope="col" className="px-6 py-3">Jenis Hama</th>
              <th scope="col" className="px-6 py-3">Bentuk</th>
              <th scope="col" className="px-6 py-3">Risiko</th>
              <th scope="col" className="px-6 py-3">Masa Karensi</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada data pestisida yang tersedia
                </td>
              </tr>
            ) : (
              data.map((pestisida) => (
                <tr key={pestisida.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900 dark:text-white">{pestisida.merek}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pestisida.produsen}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900 dark:text-white">{pestisida.namaPestisida}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pestisida.nomorRegistrasi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900 dark:text-white">{pestisida.kandunganAktif}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pestisida.konsentrasi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {pestisida.jenisHama.slice(0, 2).map((hama, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {hama}
                        </span>
                      ))}
                      {pestisida.jenisHama.length > 2 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          +{pestisida.jenisHama.length - 2} lagi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBentukColor(pestisida.bentukSediaan)}`}>
                      {pestisida.bentukSediaan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRisikoColor(pestisida.kategoriRisiko)}`}>
                      {pestisida.kategoriRisiko}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900">{pestisida.masaKarensi} hari</p>
                      <p className="text-sm text-gray-500">{pestisida.dosisRekomendasi}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pestisida.statusAktif)}`}>
                      {pestisida.statusAktif ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => onView(pestisida)}
                        className="rounded-lg px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(pestisida)}
                        className="rounded-lg px-3 py-1 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => onDelete(pestisida.id)}
                        className="rounded-lg px-3 py-1 text-red-600 hover:text-red-900 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PestisidaTable;
