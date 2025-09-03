import React, { useState } from 'react';
import { AksesibilitasLahan } from '../../types/aksesibilitas';

interface AksesibilitasTableProps {
  data: AksesibilitasLahan[];
  onEdit: (item: AksesibilitasLahan) => void;
  onDelete: (id: string) => void;
  onView: (item: AksesibilitasLahan) => void;
}

const AksesibilitasTable: React.FC<AksesibilitasTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView
}) => {
  const [sortBy, setSortBy] = useState<keyof AksesibilitasLahan>('namaPetani');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedData = [...data].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const comparison = valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    return 0;
  });

  const handleSort = (field: keyof AksesibilitasLahan) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const getSortIcon = (field: keyof AksesibilitasLahan) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l4-4 4 4" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
      </svg>
    );
  };

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi) {
      case 'baik': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sedang': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rusak_ringan': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'rusak_berat': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPrioritasColor = (prioritas: string) => {
    switch (prioritas) {
      case 'rendah': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sedang': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'tinggi': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'sangat_tinggi': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak Ada Data</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada data aksesibilitas lahan atau data tidak sesuai dengan filter yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('namaPetani')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Petani</span>
                  {getSortIcon('namaPetani')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('kecamatan')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Lokasi</span>
                  {getSortIcon('kecamatan')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('jenisJalan')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Jenis Jalan</span>
                  {getSortIcon('jenisJalan')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('kondisiJalan')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Kondisi</span>
                  {getSortIcon('kondisiJalan')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('aksesKendaraan')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Akses</span>
                  {getSortIcon('aksesKendaraan')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('prioritasUrgency')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Prioritas</span>
                  {getSortIcon('prioritasUrgency')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('statusVerifikasi')}
                  className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  <span>Status</span>
                  {getSortIcon('statusVerifikasi')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 text-sm">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{item.namaPetani}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.kelompokTani}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{item.kecamatan}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.desa}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatLabel(item.jenisJalan)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getKondisiColor(item.kondisiJalan)}`}>
                    {formatLabel(item.kondisiJalan)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatLabel(item.aksesKendaraan)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPrioritasColor(item.prioritasUrgency)}`}>
                    {formatLabel(item.prioritasUrgency)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.statusVerifikasi)}`}>
                    {formatLabel(item.statusVerifikasi)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(item)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Lihat detail"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                      title="Edit data"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`p-1 rounded ${
                        deleteConfirm === item.id
                          ? 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900'
                          : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                      }`}
                      title={deleteConfirm === item.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus data'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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

export default AksesibilitasTable;
