import React from 'react';
import { Petani } from '../../types/petani';

interface PetaniDetailModalProps {
  petani: Petani;
  onClose: () => void;
  onEdit: () => void;
}

const PetaniDetailModal: React.FC<PetaniDetailModalProps> = ({
  petani,
  onClose,
  onEdit
}) => {
  const formatTanggal = (tanggal: string) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detail Data Petani
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Informasi lengkap data petani
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {petani.nama}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  NIK: {petani.nik}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                petani.statusAktif 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {petani.statusAktif ? 'Aktif' : 'Tidak Aktif'}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Terdaftar: {formatTanggal(petani.tanggalDaftar)}
              </p>
            </div>
          </div>

          {/* Data Pribadi */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Data Pribadi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tempat, Tanggal Lahir
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.tempatLahir}, {formatTanggal(petani.tanggalLahir)} ({calculateAge(petani.tanggalLahir)} tahun)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Jenis Kelamin
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status Perkawinan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.statusPerkawinan}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pendidikan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.pendidikan}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pekerjaan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.pekerjaan}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Alamat
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Alamat Lengkap
                </label>
                <p className="text-gray-900 dark:text-white">
                  {petani.alamat}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Desa
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.desa}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kecamatan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.kecamatan}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kabupaten
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.kabupaten}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Provinsi
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.provinsi}
                  </p>
                </div>
              </div>
              {petani.kodePos && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kode Pos
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.kodePos}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Informasi Kontak
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  No. Telepon
                </label>
                <p className="text-gray-900 dark:text-white">
                  {petani.noTelepon}
                </p>
              </div>
              {petani.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Data Pertanian */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Data Pertanian
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status Kepemilikan Lahan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.statusKepemilikanLahan}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Luas Lahan
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {petani.luasLahan.toLocaleString('id-ID')} Hektar
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {petani.kelompokTani && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kelompok Tani
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {petani.kelompokTani}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Catatan */}
          {petani.catatan && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                Catatan
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {petani.catatan}
                </p>
              </div>
            </div>
          )}

          {/* Statistik Tambahan */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Informasi Tambahan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Status Aktif
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {petani.statusAktif ? 'Ya' : 'Tidak'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Terdaftar Sejak
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {formatTanggal(petani.tanggalDaftar)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      Usia
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {calculateAge(petani.tanggalLahir)} tahun
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Tutup
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
            >
              Edit Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetaniDetailModal;
