import { PlotLahan } from '../../types/lahan';

interface PlotDetailPanelProps {
  plot: PlotLahan | null;
  onClose: () => void;
}

const PlotDetailPanel: React.FC<PlotDetailPanelProps> = ({ plot, onClose }) => {
  if (!plot) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tanam': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Panen': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Belum Tanam': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Istirahat': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getKualitasColor = (kualitas?: string) => {
    switch (kualitas) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'B': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'C': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-xl z-[1000] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Plot Lahan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Informasi Dasar</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ID Plot:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nama Petani:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.namaPetani}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kelompok Tani:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.kelompokTani}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plot.statusTanam)}`}>
                  {plot.statusTanam}
                </span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Lokasi</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Alamat:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">{plot.alamat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kecamatan:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.kecamatan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kabupaten:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.kabupaten}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Provinsi:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.provinsi}</span>
              </div>
              {plot.elevasi && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Elevasi:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{plot.elevasi} m</span>
                </div>
              )}
            </div>
          </div>

          {/* Farming Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Informasi Budidaya</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Luas Lahan:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.luas} ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Jenis Varietas:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.jenisVarietas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Jenis Irigasi:</span>
                <span className="font-medium text-gray-900 dark:text-white">{plot.jenisIrigasi}</span>
              </div>
              {plot.ph && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">pH Tanah:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{plot.ph}</span>
                </div>
              )}
              {plot.tanggalTanam && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tanggal Tanam:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(plot.tanggalTanam).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}
              {plot.estimasiPanen && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Estimasi Panen:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(plot.estimasiPanen).toLocaleDateString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Production Info */}
          {(plot.produksiTerakhir || plot.kualitasTerakhir) && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Produksi Terakhir</h3>
              <div className="space-y-2">
                {plot.produksiTerakhir && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hasil Produksi:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plot.produksiTerakhir} kg/ha</span>
                  </div>
                )}
                {plot.kualitasTerakhir && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Kualitas:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKualitasColor(plot.kualitasTerakhir)}`}>
                      Grade {plot.kualitasTerakhir}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {plot.catatan && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Catatan</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{plot.catatan}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotDetailPanel;
