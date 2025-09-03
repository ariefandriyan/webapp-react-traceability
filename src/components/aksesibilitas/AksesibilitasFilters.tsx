import React from 'react';
import { AksesibilitasFilters } from '../../types/aksesibilitas';
import { 
  jenisJalanOptions, 
  kondisiJalanOptions, 
  aksesKendaraanOptions, 
  prioritasOptions, 
  statusVerifikasiOptions,
  kecamatanOptions 
} from '../../data/sampleAksesibilitas';

interface AksesibilitasFiltersProps {
  filters: AksesibilitasFilters;
  onFiltersChange: (filters: AksesibilitasFilters) => void;
  totalRecords: number;
  filteredRecords: number;
}

const AksesibilitasFiltersComponent: React.FC<AksesibilitasFiltersProps> = ({
  filters,
  onFiltersChange,
  totalRecords,
  filteredRecords
}) => {
  const handleFilterChange = (key: keyof AksesibilitasFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      jenisJalan: '',
      kondisiJalan: '',
      aksesKendaraan: '',
      kecamatan: '',
      prioritasUrgency: '',
      statusVerifikasi: ''
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Data Aksesibilitas</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredRecords} dari {totalRecords} data
          </span>
          <button
            onClick={resetFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Jenis Jalan Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jenis Jalan
          </label>
          <select
            value={filters.jenisJalan}
            onChange={(e) => handleFilterChange('jenisJalan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Jenis</option>
            {jenisJalanOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Kondisi Jalan Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kondisi Jalan
          </label>
          <select
            value={filters.kondisiJalan}
            onChange={(e) => handleFilterChange('kondisiJalan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Kondisi</option>
            {kondisiJalanOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Akses Kendaraan Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Akses Kendaraan
          </label>
          <select
            value={filters.aksesKendaraan}
            onChange={(e) => handleFilterChange('aksesKendaraan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Akses</option>
            {aksesKendaraanOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Kecamatan Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kecamatan
          </label>
          <select
            value={filters.kecamatan}
            onChange={(e) => handleFilterChange('kecamatan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Prioritas Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Prioritas
          </label>
          <select
            value={filters.prioritasUrgency}
            onChange={(e) => handleFilterChange('prioritasUrgency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Prioritas</option>
            {prioritasOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Status Verifikasi Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status Verifikasi
          </label>
          <select
            value={filters.statusVerifikasi}
            onChange={(e) => handleFilterChange('statusVerifikasi', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Semua Status</option>
            {statusVerifikasiOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AksesibilitasFiltersComponent;
