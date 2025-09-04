import React, { useState } from 'react';
import { Button } from "@heroui/button";

interface FarmerRegistration {
  id: string;
  nama: string;
  email: string;
  nomorTelepon: string;
  alamat: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pendidikan: string;
  pengalaman: string;
  luasLahan: number;
  statusLahan: 'Milik Sendiri' | 'Sewa' | 'Bagi Hasil';
  alamatLahan: string;
  tanggalDaftar: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  catatan?: string;
  dokumen: {
    ktp: string;
    sertifikatLahan?: string;
    suratKeteranganDesa: string;
  };
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: FarmerRegistration | null;
  onSubmit: (id: string, action: 'approved' | 'rejected' | 'suspended', catatan: string) => void;
  preSelectedAction?: 'approved' | 'rejected' | 'suspended';
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  registration,
  onSubmit,
  preSelectedAction
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'decision'>('info');
  const [decision, setDecision] = useState<'approved' | 'rejected' | 'suspended' | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Set pre-selected action when modal opens
  React.useEffect(() => {
    if (isOpen && preSelectedAction) {
      setDecision(preSelectedAction);
      setActiveTab('decision'); // Go directly to decision tab
    } else if (isOpen) {
      setDecision('');
      setActiveTab('info'); // Start with info tab
    }
  }, [isOpen, preSelectedAction]);

  if (!isOpen || !registration) return null;

  const handleSubmit = async () => {
    if (!decision || !notes.trim()) return;
    
    setLoading(true);
    
    try {
      await onSubmit(registration.id, decision as 'approved' | 'rejected' | 'suspended', notes);
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
    setActiveTab('info');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusLahanBadge = (statusLahan: FarmerRegistration['statusLahan']) => {
    const statusConfig = {
      'Milik Sendiri': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Sewa': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      'Bagi Hasil': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[statusLahan]}`}>
        {statusLahan}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">
                    Review Pendaftaran Petani
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {registration.nama} • ID: {registration.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-emerald-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex space-x-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'info'
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-emerald-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📋 Informasi Lengkap
              </button>
              <button
                onClick={() => setActiveTab('decision')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'decision'
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-emerald-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                ⚖️ Keputusan Review
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Profile Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        {registration.nama.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {registration.nama}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {registration.jenisKelamin} • {registration.pendidikan} • {registration.pengalaman} pengalaman
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          📧 {registration.email}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          📱 {registration.nomorTelepon}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mendaftar pada</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(registration.tanggalDaftar)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      👤 Informasi Pribadi
                    </h5>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">NIK</span>
                        <span className="text-sm text-gray-900 dark:text-white font-mono">
                          {registration.nik}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Lahir</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(registration.tanggalLahir)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Alamat</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {registration.alamat}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Land Information */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      🌾 Informasi Lahan
                    </h5>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Luas Lahan</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {registration.luasLahan} ha
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Lahan</span>
                        {getStatusLahanBadge(registration.statusLahan)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">Alamat Lahan</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {registration.alamatLahan}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    📄 Dokumen Pendukung
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">KTP</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">Surat Desa</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between p-3 border rounded-lg ${
                      registration.dokumen.sertifikatLahan
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          registration.dokumen.sertifikatLahan
                            ? 'bg-green-100 dark:bg-green-900'
                            : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          {registration.dokumen.sertifikatLahan ? (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${
                          registration.dokumen.sertifikatLahan
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                          Sertifikat Lahan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Info Tab */}
                <div className="flex justify-between">
                  <Button
                    onPress={handleClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Tutup
                  </Button>
                  <Button
                    onPress={() => setActiveTab('decision')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Lanjut ke Keputusan →
                  </Button>
                </div>
              </div>
            )}

            {/* Decision Tab */}
            {activeTab === 'decision' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                      {registration.luasLahan}
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">Luas Lahan (ha)</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                      {registration.pengalaman}
                    </div>
                    <div className="text-sm text-purple-800 dark:text-purple-300">Pengalaman</div>
                  </div>
                  
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">
                      {registration.dokumen.sertifikatLahan ? '3/3' : '2/3'}
                    </div>
                    <div className="text-sm text-amber-800 dark:text-amber-300">Dokumen</div>
                  </div>
                </div>

                {/* Decision Form */}
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                    ⚖️ Keputusan Verifikasi
                  </h4>

                  <div className="space-y-6">
                    {/* Decision Buttons */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pilih Keputusan
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => setDecision('approved')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            decision === 'approved'
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">✅</div>
                            <div className="font-medium">Setujui</div>
                            <div className="text-xs opacity-70">Petani memenuhi syarat</div>
                          </div>
                        </button>

                        <button
                          onClick={() => setDecision('rejected')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            decision === 'rejected'
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">❌</div>
                            <div className="font-medium">Tolak</div>
                            <div className="text-xs opacity-70">Tidak memenuhi syarat</div>
                          </div>
                        </button>

                        <button
                          onClick={() => setDecision('suspended')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            decision === 'suspended'
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">⏸️</div>
                            <div className="font-medium">Tunda</div>
                            <div className="text-xs opacity-70">Butuh review tambahan</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Notes Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Catatan {decision && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={
                          decision === 'approved' ? 'Tulis alasan persetujuan...' :
                          decision === 'rejected' ? 'Tulis alasan penolakan...' :
                          decision === 'suspended' ? 'Tulis alasan penangguhan dan dokumen yang dibutuhkan...' :
                          'Pilih keputusan terlebih dahulu...'
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                        disabled={!decision}
                      />
                      {decision && !notes.trim() && (
                        <p className="text-sm text-red-500 mt-1">Catatan wajib diisi</p>
                      )}
                    </div>

                    {/* Recommendation based on data */}
                    {decision && (
                      <div className={`p-4 rounded-lg border ${
                        decision === 'approved' 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : decision === 'rejected'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                      }`}>
                        <h5 className={`font-medium mb-2 ${
                          decision === 'approved' 
                            ? 'text-green-800 dark:text-green-300'
                            : decision === 'rejected'
                            ? 'text-red-800 dark:text-red-300'
                            : 'text-amber-800 dark:text-amber-300'
                        }`}>
                          💡 Rekomendasi Sistem
                        </h5>
                        <p className={`text-sm ${
                          decision === 'approved' 
                            ? 'text-green-700 dark:text-green-300'
                            : decision === 'rejected'
                            ? 'text-red-700 dark:text-red-300'
                            : 'text-amber-700 dark:text-amber-300'
                        }`}>
                          {decision === 'approved' && 
                            "Petani memiliki lahan yang memadai dan dokumen lengkap. Cocok untuk program."}
                          {decision === 'rejected' && 
                            "Pastikan alasan penolakan jelas dan dapat dikomunikasikan kepada petani."}
                          {decision === 'suspended' && 
                            "Berikan panduan jelas dokumen apa yang masih dibutuhkan."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    onPress={() => setActiveTab('info')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    ← Kembali ke Info
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button
                      onPress={handleClose}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
                    >
                      Batal
                    </Button>
                    <Button
                      onPress={handleSubmit}
                      disabled={!decision || !notes.trim()}
                      isLoading={loading}
                      className={`rounded-lg transition-colors duration-200 ${
                        decision && notes.trim()
                          ? decision === 'approved'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : decision === 'rejected'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {decision === 'approved' && '✅ Setujui Petani'}
                      {decision === 'rejected' && '❌ Tolak Pendaftaran'}
                      {decision === 'suspended' && '⏸️ Tunda untuk Review'}
                      {!decision && 'Pilih Keputusan'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
