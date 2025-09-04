import React, { useState } from 'react';
import { Button } from "@heroui/button";

interface ActivityRecord {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  aktivitas: string;
  fase: string;
  tanggalRencana: string;
  tanggalRealisasi: string;
  namaOperator: string;
  emailOperator: string;
  metadata: {
    cuaca: string;
    suhuUdara: number;
    kelembaban: number;
    kondisiTanah: string;
    pupukDigunakan?: string;
    pestisidaDigunakan?: string;
    catatanKhusus?: string;
    fotoAktivitas?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  catatan?: string;
}

interface ActivityApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityRecord | null;
  onSubmit: (id: string, action: 'approved' | 'rejected', catatan: string) => void;
  preSelectedAction?: 'approved' | 'rejected';
}

const ActivityApprovalModal: React.FC<ActivityApprovalModalProps> = ({
  isOpen,
  onClose,
  activity,
  onSubmit,
  preSelectedAction
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'decision'>('details');
  const [decision, setDecision] = useState<'approved' | 'rejected' | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Set pre-selected action when modal opens
  React.useEffect(() => {
    if (isOpen && preSelectedAction) {
      setDecision(preSelectedAction);
      setActiveTab('decision'); // Go directly to decision tab
    } else if (isOpen) {
      setDecision('');
      setActiveTab('details'); // Start with details tab
    }
  }, [isOpen, preSelectedAction]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async () => {
    if (!decision) return;
    if (decision === 'rejected' && !notes.trim()) return; // Notes required for rejection
    
    setLoading(true);
    
    try {
      await onSubmit(activity.id, decision as 'approved' | 'rejected', notes);
      handleClose();
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDecision('');
    setNotes('');
    setLoading(false);
    setActiveTab('details');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysDifference = (plannedDate: string, actualDate: string) => {
    const planned = new Date(plannedDate);
    const actual = new Date(actualDate);
    const diffTime = actual.getTime() - planned.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Tepat waktu', color: 'text-green-600', bg: 'bg-green-100' };
    if (diffDays > 0) return { text: `Terlambat ${diffDays} hari`, color: 'text-red-600', bg: 'bg-red-100' };
    return { text: `Lebih awal ${Math.abs(diffDays)} hari`, color: 'text-blue-600', bg: 'bg-blue-100' };
  };

  const timingInfo = getDaysDifference(activity.tanggalRencana, activity.tanggalRealisasi);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">
                    Review Aktivitas Tanam
                  </h3>
                  <p className="text-green-100 text-sm">
                    {activity.aktivitas} • {activity.kodeLahan}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-green-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex space-x-1">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'details'
                    ? 'bg-white text-green-700 shadow-md'
                    : 'text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📋 Detail Aktivitas
              </button>
              <button
                onClick={() => setActiveTab('decision')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'decision'
                    ? 'bg-white text-green-700 shadow-md'
                    : 'text-green-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                ⚖️ Keputusan Review
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Details Tab */}
            <div className={`space-y-6 ${activeTab === 'details' ? 'block' : 'hidden'}`}>
              {/* Activity Overview */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Informasi Aktivitas
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Aktivitas:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.aktivitas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fase:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.fase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Kode Lahan:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.kodeLahan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nama Lahan:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.namaLahan}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Jadwal & Realisasi
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rencana:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(activity.tanggalRencana)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Realisasi:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(activity.tanggalRealisasi)}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${timingInfo.bg} ${timingInfo.color}`}>
                          {timingInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Operator
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nama:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.namaOperator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.emailOperator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dilaporkan:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDateTime(activity.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Environmental Conditions */}
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    🌤️ Kondisi Lingkungan
                  </h5>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          ☀️
                        </div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Cuaca</span>
                      </div>
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-200">{activity.metadata.cuaca}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                          🌡️
                        </div>
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Suhu Udara</span>
                      </div>
                      <span className="text-sm font-bold text-orange-900 dark:text-orange-200">{activity.metadata.suhuUdara}°C</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mr-3">
                          💧
                        </div>
                        <span className="text-sm font-medium text-cyan-800 dark:text-cyan-300">Kelembaban</span>
                      </div>
                      <span className="text-sm font-bold text-cyan-900 dark:text-cyan-200">{activity.metadata.kelembaban}%</span>
                    </div>
                  </div>
                </div>

                {/* Agricultural Data */}
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    🌱 Data Pertanian
                  </h5>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-2">
                          🌾
                        </div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">Kondisi Tanah</span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 ml-8">{activity.metadata.kondisiTanah}</p>
                    </div>

                    {activity.metadata.pupukDigunakan && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-2">
                            🧪
                          </div>
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Pupuk Digunakan</span>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300 ml-8">{activity.metadata.pupukDigunakan}</p>
                      </div>
                    )}

                    {activity.metadata.pestisidaDigunakan && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-2">
                            🔬
                          </div>
                          <span className="text-sm font-medium text-red-800 dark:text-red-300">Pestisida Digunakan</span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 ml-8">{activity.metadata.pestisidaDigunakan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              {activity.metadata.catatanKhusus && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 p-5">
                  <h5 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center">
                    📝 Catatan Khusus dari Operator
                  </h5>
                  <p className="text-amber-700 dark:text-amber-300 italic">
                    "{activity.metadata.catatanKhusus}"
                  </p>
                </div>
              )}

              {/* Current Status */}
              {activity.status !== 'pending' && (
                <div className={`rounded-lg border p-5 ${
                  activity.status === 'approved' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <h5 className={`text-lg font-semibold mb-3 flex items-center ${
                    activity.status === 'approved' 
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {activity.status === 'approved' ? '✅ Status: Disetujui' : '❌ Status: Ditolak'}
                  </h5>
                  <div className="space-y-2">
                    <p className={`text-sm ${
                      activity.status === 'approved' 
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      <strong>Reviewer:</strong> {activity.status === 'approved' ? activity.approvedBy : activity.rejectedBy}
                    </p>
                    <p className={`text-sm ${
                      activity.status === 'approved' 
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      <strong>Waktu:</strong> {formatDateTime(activity.status === 'approved' ? activity.approvedAt! : activity.rejectedAt!)}
                    </p>
                    {activity.catatan && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                        <p className={`text-sm ${
                          activity.status === 'approved' 
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          <strong>Catatan:</strong>
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">"{activity.catatan}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Details Tab */}
              <div className="flex justify-between">
                <Button
                  onPress={handleClose}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Tutup
                </Button>
                {activity.status === 'pending' && (
                  <Button
                    onPress={() => setActiveTab('decision')}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Lanjut ke Keputusan →
                  </Button>
                )}
              </div>
            </div>

            {/* Decision Tab */}
            <div className={`space-y-6 ${activeTab === 'decision' ? 'block' : 'hidden'}`}>
              {/* Quick Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {activity.aktivitas}
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">Aktivitas</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {timingInfo.text.includes('Tepat') ? '✓' : timingInfo.text.includes('Terlambat') ? '⚠️' : '✅'}
                  </div>
                  <div className="text-sm text-purple-800 dark:text-purple-300">{timingInfo.text}</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {activity.metadata.suhuUdara}°C
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-300">Suhu saat aktivitas</div>
                </div>
              </div>

              {/* Decision Form */}
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  ⚖️ Keputusan Review
                </h4>

                <div className="space-y-6">
                  {/* Decision Buttons */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                      Pilih Keputusan
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setDecision('approved')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          decision === 'approved'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-700 text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">✅</div>
                          <div className="font-medium text-lg">Setujui</div>
                          <div className="text-sm opacity-70">Aktivitas sesuai SOP</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setDecision('rejected')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          decision === 'rejected'
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-700 text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">❌</div>
                          <div className="font-medium text-lg">Tolak</div>
                          <div className="text-sm opacity-70">Tidak sesuai standar</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                      Catatan {decision === 'rejected' && <span className="text-red-500">*</span>}
                      {decision === 'approved' && <span className="text-gray-500">(opsional)</span>}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        decision === 'approved' ? 'Catatan persetujuan (opsional)...' :
                        decision === 'rejected' ? 'Jelaskan alasan penolakan (wajib diisi)...' :
                        'Pilih keputusan terlebih dahulu...'
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-green-500 focus:border-green-500
                               placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                      disabled={!decision}
                    />
                    {decision === 'rejected' && !notes.trim() && (
                      <p className="text-sm text-red-500 mt-1">Catatan penolakan wajib diisi</p>
                    )}
                  </div>

                  {/* Recommendation based on data */}
                  {decision && (
                    <div className={`p-4 rounded-lg border ${
                      decision === 'approved' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <h5 className={`font-medium mb-2 ${
                        decision === 'approved' 
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-red-800 dark:text-red-300'
                      }`}>
                        💡 Panduan Keputusan
                      </h5>
                      <p className={`text-sm ${
                        decision === 'approved' 
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {decision === 'approved' && 
                          "Pastikan aktivitas sudah sesuai dengan SOP dan kondisi lingkungan mendukung."}
                        {decision === 'rejected' && 
                          "Berikan alasan yang jelas untuk membantu operator memperbaiki aktivitas selanjutnya."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  onPress={() => setActiveTab('details')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  ← Kembali ke Detail
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    onPress={handleClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Batal
                  </Button>
                  <Button
                    onPress={handleSubmit}
                    disabled={!decision || (decision === 'rejected' && !notes.trim())}
                    isLoading={loading}
                    className={`rounded-lg transition-colors duration-200 ${
                      decision && (decision === 'approved' || notes.trim())
                        ? decision === 'approved'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {decision === 'approved' && '✅ Setujui Aktivitas'}
                    {decision === 'rejected' && '❌ Tolak Aktivitas'}
                    {!decision && 'Pilih Keputusan'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityApprovalModal;
