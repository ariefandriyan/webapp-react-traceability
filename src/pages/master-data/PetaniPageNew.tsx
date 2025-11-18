import { useState, useEffect } from 'react';
import { Petani, PetaniFilters } from '../../types/petani';
import { PetaniTable, PetaniForm, PetaniDetailModal } from '../../components/petani';
import petaniService from '../../services/petaniService';

const PetaniPage = () => {
  const [petaniData, setPetaniData] = useState<Petani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPetani, setSelectedPetani] = useState<Petani | null>(null);
  const [editingPetani, setEditingPetani] = useState<Petani | null>(null);
  const [filters, setFilters] = useState<PetaniFilters>({});
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalLahan: 0,
    avgLahan: 0,
    kelompokTaniCount: 0
  });

  // Load initial data
  useEffect(() => {
    loadPetaniData();
    loadStatistics();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (!loading) {
      loadPetaniData();
    }
  }, [filters]);

  const loadPetaniData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await petaniService.getAllPetani({
        page: 1,
        limit: 100,
        search: filters.nama || filters.nik,
        statusAktif: filters.statusAktif
      });
      
      setPetaniData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      console.error('Error loading petani data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await petaniService.getStats();
      setStatistics({
        total: stats.total,
        active: stats.aktif,
        inactive: stats.nonaktif,
        totalLahan: stats.totalLahan,
        avgLahan: stats.avgLahan,
        kelompokTaniCount: stats.kelompokTaniCount
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleAddPetani = () => {
    setEditingPetani(null);
    setShowForm(true);
  };

  const handleEditPetani = (petani: Petani) => {
    setEditingPetani(petani);
    setShowForm(true);
  };

  const handleDeletePetani = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data petani ini?')) {
      return;
    }

    try {
      setLoading(true);
      await petaniService.deletePetani(id);
      await loadPetaniData();
      await loadStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus data petani');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (petani: Petani) => {
    setSelectedPetani(petani);
    setShowDetail(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      if (editingPetani) {
        await petaniService.updatePetani(editingPetani.id, formData);
      } else {
        await petaniService.createPetani(formData);
      }
      
      setShowForm(false);
      setEditingPetani(null);
      await loadPetaniData();
      await loadStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data petani');
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPetani(null);
  };

  const handleFilterChange = (newFilters: PetaniFilters) => {
    setFilters(newFilters);
  };

  if (loading && petaniData.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data petani...</p>
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
                  loadPetaniData();
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
          <h1 className="text-2xl font-bold text-gray-900">Master Data Petani</h1>
          <p className="text-gray-600 mt-1">Kelola data dan informasi petani tembakau</p>
        </div>
        <button
          onClick={handleAddPetani}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Petani
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
              <p className="text-sm font-medium text-gray-500">Total Petani</p>
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
              <p className="text-sm font-medium text-gray-500">Petani Aktif</p>
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
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Lahan</p>
              <p className="text-2xl font-semibold text-yellow-600">{statistics.totalLahan} Ha</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Lahan</p>
              <p className="text-2xl font-semibold text-purple-600">{statistics.avgLahan} Ha</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Kelompok Tani</p>
              <p className="text-2xl font-semibold text-indigo-600">{statistics.kelompokTaniCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay for actions */}
      {loading && petaniData.length > 0 && (
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
      <PetaniTable
        data={petaniData}
        onEdit={handleEditPetani}
        onDelete={handleDeletePetani}
        onViewDetail={handleViewDetail}
        onFiltersChange={handleFilterChange}
        filters={filters}
      />

      {/* Modals */}
      {showForm && (
        <PetaniForm
          petani={editingPetani}
          isEditing={!!editingPetani}
          onSave={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {showDetail && selectedPetani && (
        <PetaniDetailModal
          petani={selectedPetani}
          onClose={() => setShowDetail(false)}
          onEdit={() => {
            setShowDetail(false);
            handleEditPetani(selectedPetani);
          }}
        />
      )}
    </div>
  );
};

export default PetaniPage;
