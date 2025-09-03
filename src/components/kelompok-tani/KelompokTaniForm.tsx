import React, { useState, useEffect } from 'react';
import { KelompokTani } from '../../types/kelompokTani';

interface KelompokTaniFormProps {
  kelompok?: KelompokTani | null;
  isEditing: boolean;
  onSave: (kelompok: Omit<KelompokTani, 'id' | 'tanggalDaftar'>) => void;
  onCancel: () => void;
}

const KelompokTaniForm: React.FC<KelompokTaniFormProps> = ({
  kelompok,
  isEditing,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    kodeKelompok: '',
    namaKelompok: '',
    ketuaKelompok: '',
    waktuBentuk: '',
    alamat: '',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kodePos: '',
    noTelepon: '',
    email: '',
    jumlahAnggota: 0,
    luasTotalLahan: 0,
    komoditasUtama: '',
    statusLegalitas: 'Belum Terdaftar' as 'Terdaftar' | 'Belum Terdaftar' | 'Dalam Proses',
    skKelompok: '',
    tanggalSK: '',
    pembina: '',
    bankMitra: '',
    noRekeningKelompok: '',
    statusAktif: true,
    catatan: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (kelompok) {
      setFormData({
        kodeKelompok: kelompok.kodeKelompok,
        namaKelompok: kelompok.namaKelompok,
        ketuaKelompok: kelompok.ketuaKelompok,
        waktuBentuk: kelompok.waktuBentuk,
        alamat: kelompok.alamat,
        desa: kelompok.desa,
        kecamatan: kelompok.kecamatan,
        kabupaten: kelompok.kabupaten,
        provinsi: kelompok.provinsi,
        kodePos: kelompok.kodePos || '',
        noTelepon: kelompok.noTelepon,
        email: kelompok.email || '',
        jumlahAnggota: kelompok.jumlahAnggota,
        luasTotalLahan: kelompok.luasTotalLahan,
        komoditasUtama: kelompok.komoditasUtama,
        statusLegalitas: kelompok.statusLegalitas,
        skKelompok: kelompok.skKelompok || '',
        tanggalSK: kelompok.tanggalSK || '',
        pembina: kelompok.pembina || '',
        bankMitra: kelompok.bankMitra || '',
        noRekeningKelompok: kelompok.noRekeningKelompok || '',
        statusAktif: kelompok.statusAktif,
        catatan: kelompok.catatan || ''
      });
    }
  }, [kelompok]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.kodeKelompok.trim()) newErrors.kodeKelompok = 'Kode kelompok wajib diisi';
    if (!formData.namaKelompok.trim()) newErrors.namaKelompok = 'Nama kelompok wajib diisi';
    if (!formData.ketuaKelompok.trim()) newErrors.ketuaKelompok = 'Ketua kelompok wajib diisi';
    if (!formData.waktuBentuk) newErrors.waktuBentuk = 'Tanggal pembentukan wajib diisi';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.desa.trim()) newErrors.desa = 'Desa wajib diisi';
    if (!formData.kecamatan.trim()) newErrors.kecamatan = 'Kecamatan wajib diisi';
    if (!formData.kabupaten.trim()) newErrors.kabupaten = 'Kabupaten wajib diisi';
    if (!formData.provinsi.trim()) newErrors.provinsi = 'Provinsi wajib diisi';
    if (!formData.noTelepon.trim()) newErrors.noTelepon = 'No. telepon wajib diisi';
    if (!formData.komoditasUtama.trim()) newErrors.komoditasUtama = 'Komoditas utama wajib diisi';
    if (formData.jumlahAnggota <= 0) newErrors.jumlahAnggota = 'Jumlah anggota harus lebih dari 0';
    if (formData.luasTotalLahan <= 0) newErrors.luasTotalLahan = 'Luas total lahan harus lebih dari 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Data Kelompok Tani' : 'Tambah Kelompok Tani Baru'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Data Dasar Kelompok */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Dasar Kelompok</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Kelompok *
                </label>
                <input
                  type="text"
                  value={formData.kodeKelompok}
                  onChange={(e) => handleInputChange('kodeKelompok', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.kodeKelompok ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Contoh: KT001"
                />
                {errors.kodeKelompok && <p className="text-red-500 text-xs mt-1">{errors.kodeKelompok}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Kelompok Tani *
                </label>
                <input
                  type="text"
                  value={formData.namaKelompok}
                  onChange={(e) => handleInputChange('namaKelompok', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.namaKelompok ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan nama kelompok tani"
                />
                {errors.namaKelompok && <p className="text-red-500 text-xs mt-1">{errors.namaKelompok}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ketua Kelompok *
                </label>
                <input
                  type="text"
                  value={formData.ketuaKelompok}
                  onChange={(e) => handleInputChange('ketuaKelompok', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.ketuaKelompok ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama ketua kelompok"
                />
                {errors.ketuaKelompok && <p className="text-red-500 text-xs mt-1">{errors.ketuaKelompok}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Pembentukan *
                </label>
                <input
                  type="date"
                  value={formData.waktuBentuk}
                  onChange={(e) => handleInputChange('waktuBentuk', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.waktuBentuk ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.waktuBentuk && <p className="text-red-500 text-xs mt-1">{errors.waktuBentuk}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jumlah Anggota *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.jumlahAnggota}
                  onChange={(e) => handleInputChange('jumlahAnggota', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.jumlahAnggota ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Jumlah anggota"
                />
                {errors.jumlahAnggota && <p className="text-red-500 text-xs mt-1">{errors.jumlahAnggota}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Luas Total Lahan (Hektar) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.luasTotalLahan}
                  onChange={(e) => handleInputChange('luasTotalLahan', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.luasTotalLahan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.0"
                />
                {errors.luasTotalLahan && <p className="text-red-500 text-xs mt-1">{errors.luasTotalLahan}</p>}
              </div>
            </div>
          </div>

          {/* Alamat Kelompok */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alamat Kelompok</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alamat Lengkap *
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => handleInputChange('alamat', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.alamat ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Jl. Nama Jalan No. XX, RT/RW, dll"
                />
                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desa *
                </label>
                <input
                  type="text"
                  value={formData.desa}
                  onChange={(e) => handleInputChange('desa', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.desa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama desa"
                />
                {errors.desa && <p className="text-red-500 text-xs mt-1">{errors.desa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kecamatan *
                </label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.kecamatan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama kecamatan"
                />
                {errors.kecamatan && <p className="text-red-500 text-xs mt-1">{errors.kecamatan}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kabupaten *
                </label>
                <input
                  type="text"
                  value={formData.kabupaten}
                  onChange={(e) => handleInputChange('kabupaten', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.kabupaten ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama kabupaten"
                />
                {errors.kabupaten && <p className="text-red-500 text-xs mt-1">{errors.kabupaten}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provinsi *
                </label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => handleInputChange('provinsi', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.provinsi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama provinsi"
                />
                {errors.provinsi && <p className="text-red-500 text-xs mt-1">{errors.provinsi}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => handleInputChange('kodePos', e.target.value)}
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Kode pos"
                />
              </div>
            </div>
          </div>

          {/* Kontak dan Komunikasi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kontak dan Komunikasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No. Telepon *
                </label>
                <input
                  type="tel"
                  value={formData.noTelepon}
                  onChange={(e) => handleInputChange('noTelepon', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.noTelepon ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.noTelepon && <p className="text-red-500 text-xs mt-1">{errors.noTelepon}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="email@contoh.com (opsional)"
                />
              </div>
            </div>
          </div>

          {/* Data Pertanian dan Legalitas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Pertanian dan Legalitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Komoditas Utama *
                </label>
                <select
                  value={formData.komoditasUtama}
                  onChange={(e) => handleInputChange('komoditasUtama', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.komoditasUtama ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Pilih komoditas utama</option>
                  <option value="Tembakau Virginia">Tembakau Virginia</option>
                  <option value="Tembakau Burley">Tembakau Burley</option>
                  <option value="Tembakau Rajangan">Tembakau Rajangan</option>
                  <option value="Tembakau Oriental">Tembakau Oriental</option>
                </select>
                {errors.komoditasUtama && <p className="text-red-500 text-xs mt-1">{errors.komoditasUtama}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Legalitas
                </label>
                <select
                  value={formData.statusLegalitas}
                  onChange={(e) => handleInputChange('statusLegalitas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Belum Terdaftar">Belum Terdaftar</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Terdaftar">Terdaftar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No. SK Kelompok
                </label>
                <input
                  type="text"
                  value={formData.skKelompok}
                  onChange={(e) => handleInputChange('skKelompok', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SK/XXX/YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal SK
                </label>
                <input
                  type="date"
                  value={formData.tanggalSK}
                  onChange={(e) => handleInputChange('tanggalSK', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Petugas Pembina
                </label>
                <input
                  type="text"
                  value={formData.pembina}
                  onChange={(e) => handleInputChange('pembina', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nama petugas pembina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.statusAktif.toString()}
                  onChange={(e) => handleInputChange('statusAktif', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Perbankan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Perbankan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bank Mitra
                </label>
                <input
                  type="text"
                  value={formData.bankMitra}
                  onChange={(e) => handleInputChange('bankMitra', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nama bank mitra"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  No. Rekening Kelompok
                </label>
                <input
                  type="text"
                  value={formData.noRekeningKelompok}
                  onChange={(e) => handleInputChange('noRekeningKelompok', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nomor rekening kelompok"
                />
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Catatan</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catatan Tambahan
              </label>
              <textarea
                value={formData.catatan}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Catatan tambahan tentang kelompok tani (opsional)"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors duration-200"
            >
              {isEditing ? 'Update Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KelompokTaniForm;
