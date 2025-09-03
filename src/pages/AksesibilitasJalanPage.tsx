import React, { useState, useMemo } from 'react';
import { AksesibilitasJalan } from '../types/aksesibilitasJalan';
import { sampleAksesibilitasJalan } from '../data/sampleAksesibilitasJalan';
import AksesibilitasJalanTable from '../components/aksesibilitas/AksesibilitasJalanTable';
import AksesibilitasJalanForm from '../components/aksesibilitas/AksesibilitasJalanForm';

const AksesibilitasJalanPage: React.FC = () => {
  const [data, setData] = useState<AksesibilitasJalan[]>(sampleAksesibilitasJalan);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AksesibilitasJalan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKondisi, setFilterKondisi] = useState<string>('');

  // Statistik
  const stats = useMemo(() => {
    const total = data.length;
    const baik = data.filter(item => item.kondisiJalan === 'baik').length;
    const rusak = data.filter(item => item.kondisiJalan === 'rusak_ringan' || item.kondisiJalan === 'rusak_berat').length;
    const adaPenerangan = data.filter(item => item.adaPenerangan).length;

    return { total, baik, rusak, adaPenerangan };
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.namaJalan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desa.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKondisi = filterKondisi === '' || item.kondisiJalan === filterKondisi;

      return matchesSearch && matchesKondisi;
    });
  }, [data, searchTerm, filterKondisi]);

  const handleAddData = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleViewData = (item: AksesibilitasJalan) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleEditData = (item: AksesibilitasJalan) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteData = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmitForm = (formData: AksesibilitasJalan) => {
    if (editingItem) {
      // Update existing data
      setData(prev => prev.map(item => 
        item.id === formData.id ? formData : item
      ));
    } else {
      // Add new data
      setData(prev => [...prev, formData]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Aksesibilitas Jalan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manajemen master data kondisi dan aksesibilitas jalan
          </p>
        </div>
        <button
          onClick={handleAddData}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Data Jalan
        </button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jalan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kondisi Baik</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.baik}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Perlu Perbaikan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.rusak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ada Penerangan</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.adaPenerangan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cari Jalan
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nama jalan, kecamatan, desa..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter Kondisi
            </label>
            <select
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Kondisi</option>
              <option value="baik">Baik</option>
              <option value="sedang">Sedang</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterKondisi('');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Data Aksesibilitas Jalan ({filteredData.length} dari {data.length})
          </h2>
        </div>
        <AksesibilitasJalanTable
          data={filteredData}
          onView={handleViewData}
          onEdit={handleEditData}
          onDelete={handleDeleteData}
        />
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <AksesibilitasJalanForm
          initialData={editingItem}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          isEdit={!!editingItem}
        />
      )}
    </div>
  );
};

export default AksesibilitasJalanPage;
