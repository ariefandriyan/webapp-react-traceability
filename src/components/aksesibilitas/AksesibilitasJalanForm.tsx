import React, { useState, useEffect } from 'react';
import { AksesibilitasJalan } from '../../types/aksesibilitasJalan';

interface AksesibilitasJalanFormProps {
  initialData?: AksesibilitasJalan | null;
  onSubmit: (data: AksesibilitasJalan) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AksesibilitasJalanForm: React.FC<AksesibilitasJalanFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Partial<AksesibilitasJalan>>({
    namaJalan: '',
    kecamatan: '',
    desa: '',
    jenisJalan: 'aspal',
    kondisiJalan: 'baik',
    lebarJalan: 3,
    panjangJalan: 1000,
    aksesKendaraan: 'mobil',
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    adaPenerangan: false,
    adaJembatan: false,
    kondisiJembatan: undefined,
    adaDrainase: false,
    kondisiDrainase: undefined,
    catatan: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AksesibilitasJalan, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const jenisJalanOptions = [
    { value: 'aspal', label: 'Aspal' },
    { value: 'beton', label: 'Beton' },
    { value: 'tanah', label: 'Tanah' },
    { value: 'kerikil', label: 'Kerikil' },
    { value: 'paving', label: 'Paving' }
  ];

  const kondisiJalanOptions = [
    { value: 'baik', label: 'Baik' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'rusak_ringan', label: 'Rusak Ringan' },
    { value: 'rusak_berat', label: 'Rusak Berat' }
  ];

  const aksesKendaraanOptions = [
    { value: 'mobil', label: 'Mobil' },
    { value: 'motor', label: 'Motor' },
    { value: 'sepeda', label: 'Sepeda' },
    { value: 'jalan_kaki', label: 'Jalan Kaki' }
  ];

  const aksesMusimOptions = [
    { value: 'mudah', label: 'Mudah' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'sulit', label: 'Sulit' },
    { value: 'tidak_bisa', label: 'Tidak Bisa' }
  ];

  const kondisiDrainaseOptions = [
    { value: 'baik', label: 'Baik' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'buruk', label: 'Buruk' }
  ];

  const kondisiJembatanOptions = [
    { value: 'baik', label: 'Baik' },
    { value: 'rusak', label: 'Rusak' }
  ];

  const handleInputChange = (field: keyof AksesibilitasJalan, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AksesibilitasJalan, string>> = {};

    if (!formData.namaJalan?.trim()) {
      newErrors.namaJalan = 'Nama jalan harus diisi';
    }

    if (!formData.kecamatan?.trim()) {
      newErrors.kecamatan = 'Kecamatan harus diisi';
    }

    if (!formData.desa?.trim()) {
      newErrors.desa = 'Desa harus diisi';
    }

    if (!formData.lebarJalan || formData.lebarJalan < 0.5) {
      newErrors.lebarJalan = 'Lebar jalan minimal 0.5 meter';
    }

    if (!formData.panjangJalan || formData.panjangJalan < 1) {
      newErrors.panjangJalan = 'Panjang jalan minimal 1 meter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: AksesibilitasJalan = {
      id: formData.id || crypto.randomUUID(),
      namaJalan: formData.namaJalan!,
      kecamatan: formData.kecamatan!,
      desa: formData.desa!,
      jenisJalan: formData.jenisJalan!,
      kondisiJalan: formData.kondisiJalan!,
      lebarJalan: formData.lebarJalan!,
      panjangJalan: formData.panjangJalan!,
      aksesKendaraan: formData.aksesKendaraan!,
      aksesMusimHujan: formData.aksesMusimHujan!,
      aksesMusimKemarau: formData.aksesMusimKemarau!,
      adaPenerangan: formData.adaPenerangan!,
      adaJembatan: formData.adaJembatan!,
      kondisiJembatan: formData.kondisiJembatan,
      adaDrainase: formData.adaDrainase!,
      kondisiDrainase: formData.kondisiDrainase,
      catatan: formData.catatan,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit' : 'Tambah'} Data Aksesibilitas Jalan
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informasi Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Dasar</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Jalan *
              </label>
              <input
                type="text"
                value={formData.namaJalan || ''}
                onChange={(e) => handleInputChange('namaJalan', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.namaJalan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan nama jalan"
              />
              {errors.namaJalan && (
                <p className="text-red-500 text-sm mt-1">{errors.namaJalan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kecamatan *
              </label>
              <input
                type="text"
                value={formData.kecamatan || ''}
                onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.kecamatan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan kecamatan"
              />
              {errors.kecamatan && (
                <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desa *
              </label>
              <input
                type="text"
                value={formData.desa || ''}
                onChange={(e) => handleInputChange('desa', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.desa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan desa"
              />
              {errors.desa && (
                <p className="text-red-500 text-sm mt-1">{errors.desa}</p>
              )}
            </div>
          </div>

          {/* Kondisi Jalan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kondisi Jalan</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Jalan
              </label>
              <select
                value={formData.jenisJalan || ''}
                onChange={(e) => handleInputChange('jenisJalan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {jenisJalanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kondisi Jalan
              </label>
              <select
                value={formData.kondisiJalan || ''}
                onChange={(e) => handleInputChange('kondisiJalan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {kondisiJalanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Akses Kendaraan
              </label>
              <select
                value={formData.aksesKendaraan || ''}
                onChange={(e) => handleInputChange('aksesKendaraan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {aksesKendaraanOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lebar Jalan (meter) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={formData.lebarJalan || ''}
                onChange={(e) => handleInputChange('lebarJalan', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.lebarJalan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="3.0"
              />
              {errors.lebarJalan && (
                <p className="text-red-500 text-sm mt-1">{errors.lebarJalan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Panjang Jalan (meter) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.panjangJalan || ''}
                onChange={(e) => handleInputChange('panjangJalan', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.panjangJalan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="1000"
              />
              {errors.panjangJalan && (
                <p className="text-red-500 text-sm mt-1">{errors.panjangJalan}</p>
              )}
            </div>
          </div>

          {/* Aksesibilitas Musiman */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Aksesibilitas Musiman</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Akses Musim Hujan
              </label>
              <select
                value={formData.aksesMusimHujan || ''}
                onChange={(e) => handleInputChange('aksesMusimHujan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {aksesMusimOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Akses Musim Kemarau
              </label>
              <select
                value={formData.aksesMusimKemarau || ''}
                onChange={(e) => handleInputChange('aksesMusimKemarau', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {aksesMusimOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fasilitas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fasilitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaPenerangan || false}
                  onChange={(e) => handleInputChange('adaPenerangan', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Penerangan Jalan</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaDrainase || false}
                  onChange={(e) => handleInputChange('adaDrainase', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Drainase</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaJembatan || false}
                  onChange={(e) => handleInputChange('adaJembatan', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Jembatan</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {formData.adaDrainase && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kondisi Drainase
                  </label>
                  <select
                    value={formData.kondisiDrainase || ''}
                    onChange={(e) => handleInputChange('kondisiDrainase', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    {kondisiDrainaseOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.adaJembatan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kondisi Jembatan
                  </label>
                  <select
                    value={formData.kondisiJembatan || ''}
                    onChange={(e) => handleInputChange('kondisiJembatan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    {kondisiJembatanOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan
            </label>
            <textarea
              value={formData.catatan || ''}
              onChange={(e) => handleInputChange('catatan', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              placeholder="Catatan tambahan tentang kondisi jalan..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              {isEdit ? 'Update' : 'Simpan'} Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AksesibilitasJalanForm;
