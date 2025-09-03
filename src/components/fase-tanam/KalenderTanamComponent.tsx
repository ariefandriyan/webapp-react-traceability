import React, { useState } from 'react';
import { KalenderTanam, FaseTanameKalender, FaseTanam } from '../../types/faseTanam';
import { varietasTembakau } from '../../data/sampleFaseTanam';

interface KalenderTanamProps {
  faseList: FaseTanam[];
  onCreateKalender: (kalender: Omit<KalenderTanam, 'id' | 'createdAt'>) => void;
}

const KalenderTanamComponent: React.FC<KalenderTanamProps> = ({ faseList, onCreateKalender }) => {
  const [selectedVarietas, setSelectedVarietas] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [namaKalender, setNamaKalender] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const calculateKalender = () => {
    if (!selectedVarietas || !tanggalMulai) return null;

    const startDate = new Date(tanggalMulai);
    const varietas = varietasTembakau.find(v => v.nama === selectedVarietas);
    if (!varietas) return null;

    const faseKalender: FaseTanameKalender[] = faseList.map(fase => {
      const mulai = new Date(startDate);
      mulai.setDate(startDate.getDate() + fase.hariMulai);
      
      const selesai = new Date(startDate);
      selesai.setDate(startDate.getDate() + fase.hariSelesai);

      return {
        faseId: fase.id,
        nama: fase.nama,
        tanggalMulai: mulai.toISOString().split('T')[0],
        tanggalSelesai: selesai.toISOString().split('T')[0],
        status: 'upcoming' as const,
        progress: 0,
        catatan: ''
      };
    });

    const estimasiPanen = new Date(startDate);
    estimasiPanen.setDate(startDate.getDate() + varietas.totalDurasiTanam);

    return {
      namaKalender: namaKalender || `Kalender ${selectedVarietas} - ${startDate.toLocaleDateString('id-ID')}`,
      jenisVarietas: selectedVarietas,
      tanggalMulai: tanggalMulai,
      estimasiPanen: estimasiPanen.toISOString().split('T')[0],
      totalDurasi: varietas.totalDurasiTanam,
      faseTanamList: faseKalender,
      status: 'draft' as const,
      createdBy: 'Admin'
    };
  };

  const kalenderPreview = calculateKalender();

  const handleCreateKalender = () => {
    if (kalenderPreview) {
      onCreateKalender(kalenderPreview);
      // Reset form
      setSelectedVarietas('');
      setTanggalMulai('');
      setNamaKalender('');
      setShowPreview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Buat Kalender Tanam Baru
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Kalender
            </label>
            <input
              type="text"
              value={namaKalender}
              onChange={(e) => setNamaKalender(e.target.value)}
              placeholder="Kalender Tanam 2024..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenis Varietas
            </label>
            <select
              value={selectedVarietas}
              onChange={(e) => setSelectedVarietas(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Pilih Varietas</option>
              {varietasTembakau.map(varietas => (
                <option key={varietas.id} value={varietas.nama}>
                  {varietas.nama} ({varietas.totalDurasiTanam} hari)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tanggal Mulai Tanam
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            disabled={!selectedVarietas || !tanggalMulai}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {showPreview ? 'Sembunyikan' : 'Preview'} Kalender
          </button>
          
          {showPreview && kalenderPreview && (
            <button
              onClick={handleCreateKalender}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Buat Kalender
            </button>
          )}
        </div>
      </div>

      {/* Preview Kalender */}
      {showPreview && kalenderPreview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preview Kalender Tanam
          </h3>
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <div className="text-sm text-emerald-600 dark:text-emerald-400">Varietas</div>
              <div className="font-semibold text-emerald-900 dark:text-emerald-100">
                {kalenderPreview.jenisVarietas}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400">Mulai Tanam</div>
              <div className="font-semibold text-blue-900 dark:text-blue-100">
                {formatDate(kalenderPreview.tanggalMulai)}
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Estimasi Panen</div>
              <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                {formatDate(kalenderPreview.estimasiPanen)}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400">Total Durasi</div>
              <div className="font-semibold text-purple-900 dark:text-purple-100">
                {kalenderPreview.totalDurasi} hari
              </div>
            </div>
          </div>

          {/* Timeline Fase */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Timeline Fase Tanam</h4>
            {kalenderPreview.faseTanamList.map((fase, index) => {
              const faseDetail = faseList.find(f => f.id === fase.faseId);
              return (
                <div 
                  key={fase.faseId}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {index + 1}.
                      </span>
                      {faseDetail && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: faseDetail.warna }}
                        ></div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {fase.nama}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(fase.status)}`}>
                      {fase.status === 'upcoming' ? 'Akan Datang' : fase.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(fase.tanggalMulai)} - {formatDate(fase.tanggalSelesai)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KalenderTanamComponent;
