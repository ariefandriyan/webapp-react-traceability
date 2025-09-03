import { MapFilters } from '../../types/lahan';
import { kelompokTaniOptions, kecamatanOptions } from '../../data/sampleLahan';

interface MapFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  plotCount: number;
}

const MapFiltersComponent: React.FC<MapFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  plotCount 
}) => {
  const handleFilterChange = (key: keyof MapFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      kelompokTani: '',
      jenisVarietas: '',
      statusTanam: '',
      kecamatan: '',
      luasMin: 0,
      luasMax: 0
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Peta</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {plotCount} plot ditemukan
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
        {/* Kelompok Tani Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kelompok Tani
          </label>
          <select
            value={filters.kelompokTani}
            onChange={(e) => handleFilterChange('kelompokTani', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Kelompok</option>
            {kelompokTaniOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Jenis Varietas Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jenis Varietas
          </label>
          <select
            value={filters.jenisVarietas}
            onChange={(e) => handleFilterChange('jenisVarietas', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Varietas</option>
            <option value="Virginia">Virginia</option>
            <option value="Burley">Burley</option>
            <option value="Oriental">Oriental</option>
            <option value="Rajangan">Rajangan</option>
          </select>
        </div>

        {/* Status Tanam Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status Tanam
          </label>
          <select
            value={filters.statusTanam}
            onChange={(e) => handleFilterChange('statusTanam', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="Tanam">Sedang Tanam</option>
            <option value="Panen">Masa Panen</option>
            <option value="Belum Tanam">Belum Tanam</option>
            <option value="Istirahat">Istirahat</option>
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Luas Minimum Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Luas Min (ha)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={filters.luasMin}
            onChange={(e) => handleFilterChange('luasMin', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0"
          />
        </div>

        {/* Luas Maximum Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Luas Max (ha)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={filters.luasMax}
            onChange={(e) => handleFilterChange('luasMax', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Tidak dibatasi"
          />
        </div>
      </div>
    </div>
  );
};

export default MapFiltersComponent;
