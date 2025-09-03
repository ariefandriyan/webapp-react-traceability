import React, { useState, useMemo } from 'react';
import { AksesibilitasLahan, AksesibilitasFilters } from '../types/aksesibilitas';
import { sampleAksesibilitasLahan } from '../data/sampleAksesibilitas';
import AksesibilitasTable from '../components/aksesibilitas/AksesibilitasTable';
import AksesibilitasForm from '../components/aksesibilitas/AksesibilitasForm';
import AksesibilitasFiltersComponent from '../components/aksesibilitas/AksesibilitasFilters';

interface AksesibilitasStats {
  total: number;
  baik: number;
  sedang: number;
  rusak: number;
  prioritasTinggi: number;
  verified: number;
  pending: number;
}

const AksesibilitasPage: React.FC = () => {
  const [data, setData] = useState<AksesibilitasLahan[]>(sampleAksesibilitasLahan);
  const [filteredData, setFilteredData] = useState<AksesibilitasLahan[]>(sampleAksesibilitasLahan);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AksesibilitasLahan | null>(null);
  const [viewingItem, setViewingItem] = useState<AksesibilitasLahan | null>(null);
  const [filters, setFilters] = useState<AksesibilitasFilters>({
    jenisJalan: '',
    kondisiJalan: '',
    aksesKendaraan: '',
    kecamatan: '',
    prioritasUrgency: '',
    statusVerifikasi: ''
  });

  // Statistik
  const stats: AksesibilitasStats = useMemo(() => {
    return {
      total: filteredData.length,
      baik: filteredData.filter(item => item.kondisiJalan === 'baik').length,
      sedang: filteredData.filter(item => item.kondisiJalan === 'sedang').length,
      rusak: filteredData.filter(item => ['rusak_ringan', 'rusak_berat'].includes(item.kondisiJalan)).length,
      prioritasTinggi: filteredData.filter(item => ['tinggi', 'sangat_tinggi'].includes(item.prioritasUrgency)).length,
      verified: filteredData.filter(item => item.statusVerifikasi === 'verified').length,
      pending: filteredData.filter(item => item.statusVerifikasi === 'pending').length
    };
  }, [filteredData]);

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: AksesibilitasLahan) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleView = (item: AksesibilitasLahan) => {
    setViewingItem(item);
  };

  const handleCloseView = () => {
    setViewingItem(null);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    setFilteredData(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (formData: AksesibilitasLahan) => {
    if (editingItem) {
      // Update existing
      setData(prev => prev.map(item => 
        item.id === formData.id ? formData : item
      ));
      setFilteredData(prev => prev.map(item => 
        item.id === formData.id ? formData : item
      ));
    } else {
      // Add new
      setData(prev => [...prev, formData]);
      setFilteredData(prev => [...prev, formData]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Apply filters
  React.useEffect(() => {
    let filtered = data;
    
    if (filters.jenisJalan) {
      filtered = filtered.filter(item => item.jenisJalan === filters.jenisJalan);
    }
    
    if (filters.kondisiJalan) {
      filtered = filtered.filter(item => item.kondisiJalan === filters.kondisiJalan);
    }
    
    if (filters.aksesKendaraan) {
      filtered = filtered.filter(item => item.aksesKendaraan === filters.aksesKendaraan);
    }
    
    if (filters.kecamatan) {
      filtered = filtered.filter(item => item.kecamatan === filters.kecamatan);
    }
    
    if (filters.prioritasUrgency) {
      filtered = filtered.filter(item => item.prioritasUrgency === filters.prioritasUrgency);
    }
    
    if (filters.statusVerifikasi) {
      filtered = filtered.filter(item => item.statusVerifikasi === filters.statusVerifikasi);
    }
    
    setFilteredData(filtered);
  }, [data, filters]);

  const handleFiltersChange = (newFilters: AksesibilitasFilters) => {
    setFilters(newFilters);
  };

  const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Aksesibilitas Lahan
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manajemen data aksesibilitas jalan menuju lahan petani
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Data</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Kondisi Baik</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.baik}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Kondisi Sedang</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.sedang}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rusak</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.rusak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Prioritas Tinggi</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.prioritasTinggi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.verified}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AksesibilitasFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalRecords={data.length}
        filteredRecords={filteredData.length}
      />

      {/* Table */}
      <AksesibilitasTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Form Modal */}
      {showForm && (
        <AksesibilitasForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={!!editingItem}
        />
      )}

      {/* Detail View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detail Aksesibilitas Lahan
              </h2>
              <button
                onClick={handleCloseView}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informasi Petani */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Petani</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nama Petani</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.namaPetani}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Kelompok Tani</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.kelompokTani}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.desa}, {viewingItem.kecamatan}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Alamat Lahan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.alamatLahan}</p>
                  </div>
                </div>
              </div>

              {/* Kondisi Jalan */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kondisi Jalan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Jenis Jalan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.jenisJalan)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Kondisi</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.kondisiJalan)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Lebar Jalan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.lebarJalan} meter</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Akses Kendaraan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.aksesKendaraan)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Jarak dari Jalan Utama</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.jarakDariJalanUtama} meter</p>
                  </div>
                </div>
              </div>

              {/* Aksesibilitas Musiman */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Aksesibilitas Musiman</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Akses Musim Hujan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.aksesMusimHujan)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Akses Musim Kemarau</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.aksesMusimKemarau)}</p>
                  </div>
                </div>
              </div>

              {/* Estimasi */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estimasi Biaya & Waktu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Waktu Tempuh</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.waktuTempuhDariKota} menit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Biaya Transportasi</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">Rp {viewingItem.biayaTransportasi.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Transport Umum</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.frekuensiTransportUmum)}</p>
                  </div>
                </div>
              </div>

              {/* Kendala dan Solusi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kendala Utama</h3>
                  {viewingItem.kendalaUtama.length > 0 ? (
                    <ul className="space-y-2">
                      {viewingItem.kendalaUtama.map((kendala, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          <span className="text-sm text-gray-900 dark:text-white">{kendala}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada kendala</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Solusi yang Diperlukan</h3>
                  {viewingItem.solusiYangDiperlukan.length > 0 ? (
                    <ul className="space-y-2">
                      {viewingItem.solusiYangDiperlukan.map((solusi, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                          <span className="text-sm text-gray-900 dark:text-white">{solusi}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada solusi yang diperlukan</p>
                  )}
                </div>
              </div>

              {/* Info Survey */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Survey</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Survey</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(viewingItem.tanggalSurvey).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Surveyor</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.surveyor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Prioritas</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatLabel(viewingItem.prioritasUrgency)}</p>
                  </div>
                </div>
                
                {viewingItem.catatan && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Catatan</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{viewingItem.catatan}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  handleEdit(viewingItem);
                  setViewingItem(null);
                }}
                className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Edit Data
              </button>
              <button
                onClick={handleCloseView}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AksesibilitasPage;
