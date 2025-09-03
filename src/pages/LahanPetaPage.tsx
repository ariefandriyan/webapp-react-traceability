import React, { useState, useMemo } from 'react';
import MapComponent from '../components/map/MapComponent';
import MapFiltersComponent from '../components/map/MapFiltersComponent';
import PlotDetailPanel from '../components/map/PlotDetailPanel';
import { samplePlotLahan } from '../data/sampleLahan';
import { PlotLahan, MapFilters } from '../types/lahan';

const LahanPetaPage: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState<PlotLahan | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    kelompokTani: '',
    jenisVarietas: '',
    statusTanam: '',
    kecamatan: '',
    luasMin: 0,
    luasMax: 0
  });

  // Filter plot berdasarkan criteria
  const filteredPlots = useMemo(() => {
    return samplePlotLahan.filter(plot => {
      // Filter berdasarkan kelompok tani
      if (filters.kelompokTani && plot.kelompokTani !== filters.kelompokTani) {
        return false;
      }

      // Filter berdasarkan jenis varietas
      if (filters.jenisVarietas && plot.jenisVarietas !== filters.jenisVarietas) {
        return false;
      }

      // Filter berdasarkan status tanam
      if (filters.statusTanam && plot.statusTanam !== filters.statusTanam) {
        return false;
      }

      // Filter berdasarkan kecamatan
      if (filters.kecamatan && plot.kecamatan !== filters.kecamatan) {
        return false;
      }

      // Filter berdasarkan luas minimum
      if (filters.luasMin > 0 && plot.luas < filters.luasMin) {
        return false;
      }

      // Filter berdasarkan luas maksimum
      if (filters.luasMax > 0 && plot.luas > filters.luasMax) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handlePlotSelect = (plot: PlotLahan) => {
    setSelectedPlot(plot);
  };

  const handlePlotDeselect = () => {
    setSelectedPlot(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Peta Lahan Petani Tembakau
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualisasi dan monitoring lahan petani tembakau di wilayah Malang
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6 py-4">
        <MapFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          plotCount={filteredPlots.length}
        />
      </div>

      {/* Map and Detail Section */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="h-[600px]">
                <MapComponent
                  plots={filteredPlots}
                  selectedPlot={selectedPlot}
                  onPlotSelect={handlePlotSelect}
                  filters={filters}
                />
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedPlot ? (
              <PlotDetailPanel
                plot={selectedPlot}
                onClose={handlePlotDeselect}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pilih Plot Lahan</h3>
                  <p className="text-sm">
                    Klik pada salah satu plot di peta untuk melihat detail informasi lahan petani
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="px-6 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Statistik Lahan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {filteredPlots.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Plot</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredPlots.reduce((sum, plot) => sum + plot.luas, 0).toFixed(1)} ha
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Luas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filteredPlots.filter(plot => plot.statusTanam === 'Tanam').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sedang Tanam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {filteredPlots.filter(plot => plot.statusTanam === 'Panen').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Siap Panen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LahanPetaPage;
