import { useState, useEffect } from 'react';
import { KelompokTani, KelompokTaniFilters } from '../../types/kelompokTani';
import KelompokTaniTable from '../../components/kelompok-tani/KelompokTaniTable';
import KelompokTaniForm from '../../components/kelompok-tani/KelompokTaniForm';
import KelompokTaniDetailModal from '../../components/kelompok-tani/KelompokTaniDetailModal';
import kelompokTaniService from '../../services/kelompokTaniService';

const KelompokTaniPage = () => {
  const [kelompokTaniData, setKelompokTaniData] = useState<KelompokTani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedKelompok, setSelectedKelompok] = useState<KelompokTani | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState<KelompokTaniFilters>({});
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    terdaftar: 0,
    belumTerdaftar: 0,
    dalamProses: 0,
    totalAnggota: 0,
    totalLuasLahan: 0
  });

  // Load initial data
  useEffect(() => {
    loadKelompokTaniData();
    loadStatistics();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (!loading) {
      loadKelompokTaniData();
    }
  }, [filters]);

  const loadKelompokTaniData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await kelompokTaniService.getAllKelompokTani({
        page: 1,
        limit: 100,
        search: filters.search,
        statusLegalitas: filters.statusLegalitas,
        statusAktif: filters.statusAktif,
        kecamatan: filters.kecamatan,
        kabupaten: filters.kabupaten,
        komoditasUtama: filters.komoditasUtama
      });
      
      setKelompokTaniData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      console.error('Error loading kelompok tani data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await kelompokTaniService.getStats();
      setStatistics({
        total: stats.total,
        active: stats.aktif,
        inactive: stats.nonaktif,
        terdaftar: stats.terdaftar,
        belumTerdaftar: stats.belumTerdaftar,
        dalamProses: stats.dalamProses,
        totalAnggota: stats.totalAnggota,
        totalLuasLahan: stats.totalLuasLahan
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleAddKelompok = () => {
    setSelectedKelompok(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditKelompok = (kelompok: KelompokTani) => {
    setSelectedKelompok(kelompok);
    setIsEditing(true);
    setShowForm(true);
    setShowDetail(false);
  };

  const handleDeleteKelompok = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kelompok tani ini?')) {
      return;
    }

    try {
      setLoading(true);
      await kelompokTaniService.deleteKelompokTani(id);
      await loadKelompokTaniData();
      await loadStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus data kelompok tani');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (kelompok: KelompokTani) => {
    setSelectedKelompok(kelompok);
    setShowDetail(true);
  };

  const handleSaveKelompok = async (kelompokData: Omit<KelompokTani, 'id' | 'tanggalDaftar'>) => {
    try {
      setLoading(true);
      
      if (isEditing && selectedKelompok) {
        await kelompokTaniService.updateKelompokTani(selectedKelompok.id, kelompokData);
      } else {
        await kelompokTaniService.createKelompokTani(kelompokData);
      }
      
      setShowForm(false);
      setSelectedKelompok(null);
      setIsEditing(false);
      await loadKelompokTaniData();
      await loadStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data kelompok tani');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedKelompok(null);
    setIsEditing(false);
  };

  const handleFiltersChange = (newFilters: KelompokTaniFilters) => {
    setFilters(newFilters);
  };

  if (loading && kelompokTaniData.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data kelompok tani...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  loadKelompokTaniData();
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Kelompok Tani</h1>
          <p className="text-gray-600 mt-1">Kelola data dan informasi kelompok tani tembakau</p>
        </div>
        <button
          onClick={handleAddKelompok}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Kelompok Tani
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Kelompok</p>
              <p className="text-2xl font-semibold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif</p>
              <p className="text-2xl font-semibold text-green-600">{statistics.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tidak Aktif</p>
              <p className="text-2xl font-semibold text-red-600">{statistics.inactive}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terdaftar</p>
              <p className="text-2xl font-semibold text-emerald-600">{statistics.terdaftar}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Dalam Proses</p>
              <p className="text-2xl font-semibold text-yellow-600">{statistics.dalamProses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Belum Terdaftar</p>
              <p className="text-2xl font-semibold text-gray-600">{statistics.belumTerdaftar}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Anggota</p>
              <p className="text-2xl font-semibold text-purple-600">{statistics.totalAnggota}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Luas Lahan</p>
              <p className="text-2xl font-semibold text-indigo-600">{statistics.totalLuasLahan} Ha</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay for actions */}
      {loading && kelompokTaniData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              <span className="text-gray-600">Memproses...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Table */}
      <KelompokTaniTable
        data={kelompokTaniData}
        onEdit={handleEditKelompok}
        onDelete={handleDeleteKelompok}
        onViewDetail={handleViewDetail}
        onFiltersChange={handleFiltersChange}
        filters={filters}
      />

      {/* Modals */}
      {showForm && (
        <KelompokTaniForm
          kelompok={selectedKelompok || undefined}
          isEditing={isEditing}
          onSave={handleSaveKelompok}
          onCancel={handleCancelForm}
        />
      )}

      {showDetail && selectedKelompok && (
        <KelompokTaniDetailModal
          kelompok={selectedKelompok}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default KelompokTaniPage;
