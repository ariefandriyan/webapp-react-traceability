import React, { useState, useEffect } from 'react';
import { Petani } from '../../types/petani';

interface PetaniFormProps {
  petani?: Petani | null;
  isEditing: boolean;
  onSave: (petani: Omit<Petani, 'id' | 'tanggalDaftar'>) => void;
  onCancel: () => void;
}

const PetaniForm: React.FC<PetaniFormProps> = ({
  petani,
  isEditing,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'L' as 'L' | 'P',
    alamat: '',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    kodePos: '',
    noTelepon: '',
    email: '',
    statusPerkawinan: 'Belum Kawin' as 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati',
    pendidikan: 'SMA' as 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2' | 'S3',
    pekerjaan: '',
    statusKepemilikanLahan: 'Milik Sendiri' as 'Milik Sendiri' | 'Sewa' | 'Bagi Hasil' | 'Lainnya',
    luasLahan: 0,
    kelompokTani: '',
    statusAktif: true,
    catatan: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (petani) {
      setFormData({
        nama: petani.nama,
        nik: petani.nik,
        tempatLahir: petani.tempatLahir,
        tanggalLahir: petani.tanggalLahir,
        jenisKelamin: petani.jenisKelamin,
        alamat: petani.alamat,
        desa: petani.desa,
        kecamatan: petani.kecamatan,
        kabupaten: petani.kabupaten,
        provinsi: petani.provinsi,
        kodePos: petani.kodePos,
        noTelepon: petani.noTelepon,
        email: petani.email || '',
        statusPerkawinan: petani.statusPerkawinan,
        pendidikan: petani.pendidikan,
        pekerjaan: petani.pekerjaan,
        statusKepemilikanLahan: petani.statusKepemilikanLahan,
        luasLahan: petani.luasLahan,
        kelompokTani: petani.kelompokTani || '',
        statusAktif: petani.statusAktif,
        catatan: petani.catatan || ''
      });
    }
  }, [petani]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.nik.trim()) newErrors.nik = 'NIK wajib diisi';
    if (formData.nik.length !== 16) newErrors.nik = 'NIK harus 16 digit';
    if (!formData.tempatLahir.trim()) newErrors.tempatLahir = 'Tempat lahir wajib diisi';
    if (!formData.tanggalLahir) newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.desa.trim()) newErrors.desa = 'Desa wajib diisi';
    if (!formData.kecamatan.trim()) newErrors.kecamatan = 'Kecamatan wajib diisi';
    if (!formData.kabupaten.trim()) newErrors.kabupaten = 'Kabupaten wajib diisi';
    if (!formData.provinsi.trim()) newErrors.provinsi = 'Provinsi wajib diisi';
    if (!formData.noTelepon.trim()) newErrors.noTelepon = 'No. telepon wajib diisi';
    if (!formData.pekerjaan.trim()) newErrors.pekerjaan = 'Pekerjaan wajib diisi';
    if (formData.luasLahan <= 0) newErrors.luasLahan = 'Luas lahan harus lebih dari 0';

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
              {isEditing ? 'Edit Data Petani' : 'Tambah Data Petani Baru'}
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
          {/* Data Pribadi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Pribadi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.nama ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIK *
                </label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => handleInputChange('nik', e.target.value)}
                  maxLength={16}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.nik ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan NIK (16 digit)"
                />
                {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tempat Lahir *
                </label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => handleInputChange('tempatLahir', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.tempatLahir ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Masukkan tempat lahir"
                />
                {errors.tempatLahir && <p className="text-red-500 text-xs mt-1">{errors.tempatLahir}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.tanggalLahir ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.tanggalLahir && <p className="text-red-500 text-xs mt-1">{errors.tanggalLahir}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => handleInputChange('jenisKelamin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Perkawinan
                </label>
                <select
                  value={formData.statusPerkawinan}
                  onChange={(e) => handleInputChange('statusPerkawinan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pendidikan
                </label>
                <select
                  value={formData.pendidikan}
                  onChange={(e) => handleInputChange('pendidikan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pekerjaan *
                </label>
                <input
                  type="text"
                  value={formData.pekerjaan}
                  onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.pekerjaan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Contoh: Petani, Buruh Tani, dll"
                />
                {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
              </div>
            </div>
          </div>

          {/* Data Alamat */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alamat</h3>
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

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kontak</h3>
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

          {/* Data Pertanian */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Pertanian</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Kepemilikan Lahan
                </label>
                <select
                  value={formData.statusKepemilikanLahan}
                  onChange={(e) => handleInputChange('statusKepemilikanLahan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Milik Sendiri">Milik Sendiri</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Bagi Hasil">Bagi Hasil</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Luas Lahan (Hektar) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.luasLahan}
                  onChange={(e) => handleInputChange('luasLahan', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.luasLahan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.0"
                />
                {errors.luasLahan && <p className="text-red-500 text-xs mt-1">{errors.luasLahan}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kelompok Tani
                </label>
                <input
                  type="text"
                  value={formData.kelompokTani}
                  onChange={(e) => handleInputChange('kelompokTani', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nama kelompok tani (opsional)"
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => handleInputChange('catatan', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Catatan tambahan (opsional)"
                />
              </div>
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

export default PetaniForm;
