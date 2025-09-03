import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import PestisidaTable from '../pestisida/PestisidaTable';
import PestisidaForm from '../pestisida/PestisidaForm';
import PestisidaDetail from '../pestisida/PestisidaDetail';
import { PestisidaData, PestisidaFormData, PestisidaStats } from '../../types/pestisida';
import { samplePestisidaData } from '../../data/samplePestisida';

const PestisidaContent: React.FC = () => {
  const [pestisidaData, setPestisidaData] = useState<PestisidaData[]>(samplePestisidaData);
  const [filteredData, setFilteredData] = useState<PestisidaData[]>(samplePestisidaData);
  const [stats, setStats] = useState<PestisidaStats>({
    totalPestisida: 0,
    totalAktif: 0,
    risikoTinggi: 0,
    risikoSedang: 0,
    risikoRendah: 0
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editData, setEditData] = useState<PestisidaData | null>(null);
  const [selectedData, setSelectedData] = useState<PestisidaData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Calculate statistics
  useEffect(() => {
    const newStats: PestisidaStats = {
      totalPestisida: pestisidaData.length,
      totalAktif: pestisidaData.filter(p => p.statusAktif).length,
      risikoTinggi: pestisidaData.filter(p => p.kategoriRisiko === 'Tinggi').length,
      risikoSedang: pestisidaData.filter(p => p.kategoriRisiko === 'Sedang').length,
      risikoRendah: pestisidaData.filter(p => p.kategoriRisiko === 'Rendah').length
    };
    setStats(newStats);
  }, [pestisidaData]);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = pestisidaData;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.merek.toLowerCase().includes(query) ||
        item.namaPestisida.toLowerCase().includes(query) ||
        item.kandunganAktif.toLowerCase().includes(query) ||
        item.produsen.toLowerCase().includes(query) ||
        item.jenisHama.some(hama => hama.toLowerCase().includes(query))
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(item => item.kategoriRisiko === riskFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(item => item.statusAktif);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(item => !item.statusAktif);
    }

    setFilteredData(filtered);
  }, [pestisidaData, searchQuery, riskFilter, statusFilter]);

  // CRUD Operations
  const handleAdd = () => {
    setEditData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (data: PestisidaData) => {
    setEditData(data);
    setIsFormOpen(true);
  };

  const handleView = (data: PestisidaData) => {
    setSelectedData(data);
    setIsDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setPestisidaData(prev => prev.filter(item => item.id !== deleteId));
      setDeleteId(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleFormSubmit = (formData: PestisidaFormData) => {
    if (editData) {
      // Update existing data
      setPestisidaData(prev =>
        prev.map(item =>
          item.id === editData.id
            ? {
                ...item,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : item
        )
      );
    } else {
      // Add new data
      const newPestisida: PestisidaData = {
        id: `PEST${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPestisidaData(prev => [...prev, newPestisida]);
    }
    setIsFormOpen(false);
    setEditData(null);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    color: string;
    icon: React.ReactNode;
  }> = ({ title, value, color, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')} dark:${color.replace('text-', 'bg-').replace('-600', '-900')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manajemen Pestisida
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data master merek pestisida untuk traceability tembakau
          </p>
        </div>
        <Button
          onPress={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Pestisida
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          title="Total Pestisida"
          value={stats.totalPestisida}
          color="text-blue-600"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        
        <StatCard
          title="Status Aktif"
          value={stats.totalAktif}
          color="text-green-600"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Risiko Tinggi"
          value={stats.risikoTinggi}
          color="text-red-600"
          icon={
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />
        
        <StatCard
          title="Risiko Sedang"
          value={stats.risikoSedang}
          color="text-yellow-600"
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Risiko Rendah"
          value={stats.risikoRendah}
          color="text-emerald-600"
          icon={
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pencarian
            </label>
            <Input
              placeholder="Cari merek, nama, atau kandungan aktif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori Risiko
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Semua Risiko</option>
              <option value="Rendah">Risiko Rendah</option>
              <option value="Sedang">Risiko Sedang</option>
              <option value="Tinggi">Risiko Tinggi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onPress={() => {
                setSearchQuery('');
                setRiskFilter('all');
                setStatusFilter('all');
              }}
              variant="light"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <PestisidaTable
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      <PestisidaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        editData={editData}
        title={editData ? 'Edit Pestisida' : 'Tambah Pestisida Baru'}
      />

      <PestisidaDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedData(null);
        }}
        data={selectedData}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apakah Anda yakin ingin menghapus data pestisida ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="light"
                onPress={() => {
                  setIsDeleteConfirmOpen(false);
                  setDeleteId(null);
                }}
                className="rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Batal
              </Button>
              <Button
                onPress={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestisidaContent;
