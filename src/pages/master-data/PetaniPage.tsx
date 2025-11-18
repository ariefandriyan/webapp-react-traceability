import { useState, useEffect } from 'react';
import { Petani, PetaniFilters } from '../../types/petani';
import { PetaniTable, PetaniForm, PetaniDetailModal } from '../../components/petani';
import petaniService from '../../services/petaniService';

const PetaniPage = () => {
  const [petaniData, setPetaniData] = useState<Petani[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // 'create', 'update', 'delete', 'filter'
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  // Smooth progress bar animation
  const animateProgress = (duration: number) => {
    setLoadingProgress(0);
    const startTime = Date.now();
    let animationFrameId: number;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 95); // Max 95% until complete
      setLoadingProgress(progress);
      
      if (progress < 95) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateProgress);
    
    // Return cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  };

  const completeProgress = () => {
    setLoadingProgress(100);
    setTimeout(() => {
      setLoadingProgress(0);
    }, 500);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Cleanup progress bar on unmount
  useEffect(() => {
    return () => {
      setLoadingProgress(0);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    loadPetaniData();
    loadStatistics();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (!loading) {
      setActionLoading('filter');
      const cleanup = animateProgress(800);
      loadPetaniData();
      return cleanup;
    }
  }, [filters]);

  const loadPetaniData = async () => {
    try {
      if (petaniData.length === 0) {
        setLoading(true);
        animateProgress(1000);
      }
      setError(null);
      
      const response = await petaniService.getAllPetani({
        page: 1,
        limit: 100,
        search: filters.nama || filters.nik,
        statusAktif: filters.statusAktif
      });
      
      setPetaniData(response.data);
      completeProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      console.error('Error loading petani data:', err);
      // Ensure progress completes even on error
      setLoadingProgress(0);
    } finally {
      setLoading(false);
      setActionLoading(null);
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
      setActionLoading('delete');
      animateProgress(800);
      await petaniService.deletePetani(id);
      await loadPetaniData();
      await loadStatistics();
      completeProgress();
      showSuccess('Data petani berhasil dihapus');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus data petani');
      // Reset progress immediately on error
      setLoadingProgress(0);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetail = (petani: Petani) => {
    setSelectedPetani(petani);
    setShowDetail(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const actionType = editingPetani ? 'update' : 'create';
      setActionLoading(actionType);
      animateProgress(1200);
      
      if (editingPetani) {
        await petaniService.updatePetani(editingPetani.id, formData);
        showSuccess('Data petani berhasil diupdate');
      } else {
        await petaniService.createPetani(formData);
        showSuccess('Data petani berhasil ditambahkan');
      }
      
      setShowForm(false);
      setEditingPetani(null);
      await loadPetaniData();
      await loadStatistics();
      completeProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data petani');
      // Reset progress immediately on error
      setLoadingProgress(0);
    } finally {
      setActionLoading(null);
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Memuat data petani...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
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
      {/* Smooth Progress Bar */}
      {loadingProgress > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-emerald-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 transition-all duration-300 ease-out relative"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              {loadingProgress < 100 && (
                <div 
                  className="absolute top-0 right-0 w-16 h-full bg-gradient-to-r from-transparent to-white opacity-50"
                  style={{
                    animation: 'progress-shine 1.5s infinite'
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Data Petani</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Kelola data dan informasi petani tembakau</p>
        </div>
        <button
          onClick={handleAddPetani}
          disabled={actionLoading === 'create'}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading === 'create' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Petani
            </>
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <svg className="w-5 h-5 dark:5 9-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Petani</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Petani Aktif</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{statistics.active}</p>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tidak Aktif</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{statistics.inactive}</p>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-opacity duration-300 ${actionLoading ? 'opacity-70' : 'opacity-100'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Success Notification */}
      {successMessage && (
        <div 
          className="fixed top-20 right-6 z-40"
          style={{
            animation: 'slide-in-right 0.3s ease-out'
          }}
        >
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[280px]">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">{successMessage}</p>
              <p className="text-xs text-green-600 dark:text-green-400">Operasi berhasil</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-500 hover:text-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Action Status Notification */}
      {actionLoading && (
        <div 
          className="fixed top-20 right-6 z-40"
          style={{
            animation: 'slide-in-right 0.3s ease-out'
          }}
        >
          <div className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[280px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-200 dark:border-emerald-700"></div>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-emerald-600 dark:border-emerald-400 absolute inset-0"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {actionLoading === 'create' && 'Menambah data petani...'}
                {actionLoading === 'update' && 'Mengupdate data petani...'}
                {actionLoading === 'delete' && 'Menghapus data petani...'}
                {actionLoading === 'filter' && 'Memfilter data...'}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Sedang diproses</p>
            </div>
            <div className="ml-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center justify-between animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Table */}
      <div className={`transition-opacity duration-300 ${actionLoading ? 'opacity-80' : 'opacity-100'}`}>
        <PetaniTable
          data={petaniData}
          onEdit={handleEditPetani}
          onDelete={handleDeletePetani}
          onViewDetail={handleViewDetail}
          onFiltersChange={handleFilterChange}
          filters={filters}
        />
      </div>

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
