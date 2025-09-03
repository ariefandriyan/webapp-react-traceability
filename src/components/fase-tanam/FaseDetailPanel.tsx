import React from 'react';
import { FaseTanam } from '../../types/faseTanam';

interface FaseDetailPanelProps {
  fase: FaseTanam | null;
  onClose: () => void;
}

const FaseDetailPanel: React.FC<FaseDetailPanelProps> = ({ fase, onClose }) => {
  if (!fase) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pemupukan':
        return '🌱';
      case 'penyiangan':
        return '🌿';
      case 'pengairan':
        return '💧';
      case 'pengendalian_hama':
        return '🐛';
      case 'pemeliharaan':
        return '🔧';
      case 'panen':
        return '🌾';
      default:
        return '📋';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'pemupukan': 'Pemupukan',
      'penyiangan': 'Penyiangan', 
      'pengairan': 'Pengairan',
      'pengendalian_hama': 'Pengendalian Hama',
      'pemeliharaan': 'Pemeliharaan',
      'panen': 'Panen'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: fase.warna }}
          ></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {fase.nama}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Urutan Fase</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Fase ke-{fase.urutan}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Durasi</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {fase.durasi} hari
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Hari Mulai</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Hari {fase.hariMulai}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Hari Selesai</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Hari {fase.hariSelesai}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Deskripsi</h3>
          <p className="text-gray-700 dark:text-gray-300">{fase.deskripsi}</p>
        </div>

        {/* Indikator Visual */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Indikator Visual</h3>
          <ul className="space-y-2">
            {fase.indikatorVisual.map((indikator, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700 dark:text-gray-300">{indikator}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Kegiatan */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Kegiatan ({fase.kegiatan.length})
          </h3>
          <div className="space-y-3">
            {fase.kegiatan.map((kegiatan) => (
              <div 
                key={kegiatan.id} 
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryIcon(kegiatan.kategori)}</span>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {kegiatan.nama}
                    </h4>
                    {kegiatan.isMandatory && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Wajib
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Hari +{kegiatan.hariOptimal}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-3">{kegiatan.deskripsi}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Kategori:</span>
                    <div className="mt-1">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        {getCategoryLabel(kegiatan.kategori)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Estimasi Waktu:</span>
                    <div className="text-gray-900 dark:text-white mt-1">{kegiatan.estimasiWaktu} jam</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Peralatan:</span>
                    <div className="text-gray-900 dark:text-white mt-1">
                      {kegiatan.peralatan.length > 0 ? kegiatan.peralatan.join(', ') : 'Tidak ada'}
                    </div>
                  </div>
                </div>
                
                {kegiatan.bahan.length > 0 && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Bahan:</span>
                    <div className="text-gray-900 dark:text-white mt-1">{kegiatan.bahan.join(', ')}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Perawatan Khusus */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Perawatan Khusus</h3>
          <ul className="space-y-2">
            {fase.perawatanKhusus.map((perawatan, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">{perawatan}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Varietas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Varietas yang Berlaku</h3>
          <div className="flex flex-wrap gap-2">
            {fase.jenisVarietas.map((varietas, index) => (
              <span 
                key={index}
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full text-sm"
              >
                {varietas}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaseDetailPanel;
