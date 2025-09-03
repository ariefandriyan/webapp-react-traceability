import React, { useState, useEffect } from 'react';
import { AksesibilitasLahan } from '../../types/aksesibilitas';

interface AksesibilitasFormProps {
  initialData?: AksesibilitasLahan | null;
  onSubmit: (data: AksesibilitasLahan) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AksesibilitasForm: React.FC<AksesibilitasFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Partial<AksesibilitasLahan>>({
    namaPetani: '',
    kelompokTani: '',
    kecamatan: '',
    desa: '',
    lokasiLahan: '',
    alamatLahan: '',
    koordinat: { latitude: 0, longitude: 0 },
    jenisJalan: 'aspal',
    kondisiJalan: 'baik',
    lebarJalan: 3,
    jarakDariJalanUtama: 0,
    aksesKendaraan: 'mobil',
    aksesMusimHujan: 'mudah',
    aksesMusimKemarau: 'mudah',
    adaPembatasJalan: false,
    adaPenerangan: false,
    adaPapanNama: false,
    adaJembatan: false,
    kondisiJembatan: 'tidak_ada',
    waktuTempuhDariKota: 15,
    biayaTransportasi: 15000,
    frekuensiTransportUmum: 'sering',
    kendalaUtama: [],
    solusiYangDiperlukan: [],
    prioritasUrgency: 'sedang',
    statusVerifikasi: 'pending',
    catatan: '',
    tanggalSurvey: new Date().toISOString().split('T')[0],
    surveyor: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AksesibilitasLahan, string>>>({});

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

  const kondisiJembatanOptions = [
    { value: 'baik', label: 'Baik' },
    { value: 'rusak', label: 'Rusak' },
    { value: 'tidak_ada', label: 'Tidak Ada' }
  ];

  const frekuensiTransportOptions = [
    { value: 'sering', label: 'Sering' },
    { value: 'jarang', label: 'Jarang' },
    { value: 'tidak_ada', label: 'Tidak Ada' }
  ];

  const prioritasOptions = [
    { value: 'rendah', label: 'Rendah' },
    { value: 'sedang', label: 'Sedang' },
    { value: 'tinggi', label: 'Tinggi' },
    { value: 'sangat_tinggi', label: 'Sangat Tinggi' }
  ];

  const statusVerifikasiOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const kendalaOptions = [
    'Jalan rusak',
    'Banjir saat musim hujan',
    'Longsor',
    'Jembatan rusak',
    'Tidak ada penerangan',
    'Akses terlalu sempit',
    'Tidak ada transport umum',
    'Biaya transport mahal'
  ];

  const solusiOptions = [
    'Perbaikan jalan',
    'Pembangunan drainase',
    'Perbaikan jembatan',
    'Pemasangan lampu jalan',
    'Pelebaran jalan',
    'Penambahan transport umum',
    'Subsidi transport'
  ];

  const handleInputChange = (field: keyof AksesibilitasLahan, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleArrayChange = (field: 'kendalaUtama' | 'solusiYangDiperlukan', item: string, checked: boolean) => {
    const currentArray = formData[field] || [];
    if (checked) {
      handleInputChange(field, [...currentArray, item]);
    } else {
      handleInputChange(field, currentArray.filter((f: string) => f !== item));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AksesibilitasLahan, string>> = {};

    if (!formData.namaPetani?.trim()) {
      newErrors.namaPetani = 'Nama petani harus diisi';
    }

    if (!formData.kelompokTani?.trim()) {
      newErrors.kelompokTani = 'Kelompok tani harus diisi';
    }

    if (!formData.kecamatan?.trim()) {
      newErrors.kecamatan = 'Kecamatan harus diisi';
    }

    if (!formData.desa?.trim()) {
      newErrors.desa = 'Desa harus diisi';
    }

    if (!formData.lokasiLahan?.trim()) {
      newErrors.lokasiLahan = 'Lokasi lahan harus diisi';
    }

    if (!formData.alamatLahan?.trim()) {
      newErrors.alamatLahan = 'Alamat lahan harus diisi';
    }

    if (!formData.lebarJalan || formData.lebarJalan < 0.5) {
      newErrors.lebarJalan = 'Lebar jalan minimal 0.5 meter';
    }

    if (!formData.waktuTempuhDariKota || formData.waktuTempuhDariKota < 1) {
      newErrors.waktuTempuhDariKota = 'Waktu tempuh minimal 1 menit';
    }

    if (!formData.biayaTransportasi || formData.biayaTransportasi < 0) {
      newErrors.biayaTransportasi = 'Biaya transportasi tidak boleh negatif';
    }

    if (!formData.tanggalSurvey) {
      newErrors.tanggalSurvey = 'Tanggal survey harus diisi';
    }

    if (!formData.surveyor?.trim()) {
      newErrors.surveyor = 'Nama surveyor harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: AksesibilitasLahan = {
      id: formData.id || crypto.randomUUID(),
      petaniId: formData.petaniId || crypto.randomUUID(),
      namaPetani: formData.namaPetani!,
      kelompokTani: formData.kelompokTani!,
      lokasiLahan: formData.lokasiLahan!,
      koordinat: formData.koordinat!,
      alamatLahan: formData.alamatLahan!,
      kecamatan: formData.kecamatan!,
      desa: formData.desa!,
      jenisJalan: formData.jenisJalan!,
      kondisiJalan: formData.kondisiJalan!,
      lebarJalan: formData.lebarJalan!,
      jarakDariJalanUtama: formData.jarakDariJalanUtama!,
      aksesKendaraan: formData.aksesKendaraan!,
      aksesMusimHujan: formData.aksesMusimHujan!,
      aksesMusimKemarau: formData.aksesMusimKemarau!,
      adaPembatasJalan: formData.adaPembatasJalan!,
      adaPenerangan: formData.adaPenerangan!,
      adaPapanNama: formData.adaPapanNama!,
      adaJembatan: formData.adaJembatan!,
      kondisiJembatan: formData.kondisiJembatan,
      waktuTempuhDariKota: formData.waktuTempuhDariKota!,
      biayaTransportasi: formData.biayaTransportasi!,
      frekuensiTransportUmum: formData.frekuensiTransportUmum!,
      kendalaUtama: formData.kendalaUtama || [],
      solusiYangDiperlukan: formData.solusiYangDiperlukan || [],
      prioritasUrgency: formData.prioritasUrgency!,
      tanggalSurvey: formData.tanggalSurvey!,
      surveyor: formData.surveyor!,
      statusVerifikasi: formData.statusVerifikasi!,
      catatan: formData.catatan || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEdit ? 'Edit' : 'Tambah'} Data Aksesibilitas Lahan
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
          {/* Informasi Petani */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Petani</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Petani *
              </label>
              <input
                type="text"
                value={formData.namaPetani || ''}
                onChange={(e) => handleInputChange('namaPetani', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.namaPetani ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan nama petani"
              />
              {errors.namaPetani && (
                <p className="text-red-500 text-sm mt-1">{errors.namaPetani}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kelompok Tani *
              </label>
              <input
                type="text"
                value={formData.kelompokTani || ''}
                onChange={(e) => handleInputChange('kelompokTani', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.kelompokTani ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan kelompok tani"
              />
              {errors.kelompokTani && (
                <p className="text-red-500 text-sm mt-1">{errors.kelompokTani}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lokasi Lahan *
              </label>
              <input
                type="text"
                value={formData.lokasiLahan || ''}
                onChange={(e) => handleInputChange('lokasiLahan', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.lokasiLahan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan lokasi lahan"
              />
              {errors.lokasiLahan && (
                <p className="text-red-500 text-sm mt-1">{errors.lokasiLahan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alamat Lahan *
              </label>
              <input
                type="text"
                value={formData.alamatLahan || ''}
                onChange={(e) => handleInputChange('alamatLahan', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.alamatLahan ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan alamat lengkap lahan"
              />
              {errors.alamatLahan && (
                <p className="text-red-500 text-sm mt-1">{errors.alamatLahan}</p>
              )}
            </div>
          </div>

          {/* Koordinat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Koordinat Lahan</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.koordinat?.latitude || ''}
                onChange={(e) => handleInputChange('koordinat', {
                  ...formData.koordinat,
                  latitude: parseFloat(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="-7.977"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.koordinat?.longitude || ''}
                onChange={(e) => handleInputChange('koordinat', {
                  ...formData.koordinat,
                  longitude: parseFloat(e.target.value) || 0
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="112.633"
              />
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
                Jarak dari Jalan Utama (meter)
              </label>
              <input
                type="number"
                min="0"
                value={formData.jarakDariJalanUtama || ''}
                onChange={(e) => handleInputChange('jarakDariJalanUtama', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
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

          {/* Fasilitas Pendukung */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fasilitas Pendukung</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaPembatasJalan || false}
                  onChange={(e) => handleInputChange('adaPembatasJalan', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pembatas Jalan</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaPenerangan || false}
                  onChange={(e) => handleInputChange('adaPenerangan', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Penerangan</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.adaPapanNama || false}
                  onChange={(e) => handleInputChange('adaPapanNama', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Papan Nama</span>
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

            {formData.adaJembatan && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kondisi Jembatan
                </label>
                <select
                  value={formData.kondisiJembatan || ''}
                  onChange={(e) => handleInputChange('kondisiJembatan', e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  {kondisiJembatanOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Estimasi Biaya & Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Estimasi Biaya & Waktu</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Waktu Tempuh dari Kota (menit) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.waktuTempuhDariKota || ''}
                onChange={(e) => handleInputChange('waktuTempuhDariKota', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.waktuTempuhDariKota ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="15"
              />
              {errors.waktuTempuhDariKota && (
                <p className="text-red-500 text-sm mt-1">{errors.waktuTempuhDariKota}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Biaya Transportasi (Rp) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.biayaTransportasi || ''}
                onChange={(e) => handleInputChange('biayaTransportasi', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.biayaTransportasi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="15000"
              />
              {errors.biayaTransportasi && (
                <p className="text-red-500 text-sm mt-1">{errors.biayaTransportasi}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frekuensi Transport Umum
              </label>
              <select
                value={formData.frekuensiTransportUmum || ''}
                onChange={(e) => handleInputChange('frekuensiTransportUmum', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {frekuensiTransportOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kendala Utama */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kendala Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kendalaOptions.map(kendala => (
                <label key={kendala} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.kendalaUtama?.includes(kendala) || false}
                    onChange={(e) => handleArrayChange('kendalaUtama', kendala, e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{kendala}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Solusi yang Diperlukan */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Solusi yang Diperlukan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {solusiOptions.map(solusi => (
                <label key={solusi} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.solusiYangDiperlukan?.includes(solusi) || false}
                    onChange={(e) => handleArrayChange('solusiYangDiperlukan', solusi, e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{solusi}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prioritas & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Prioritas & Status</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioritas Urgency
              </label>
              <select
                value={formData.prioritasUrgency || ''}
                onChange={(e) => handleInputChange('prioritasUrgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {prioritasOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Verifikasi
              </label>
              <select
                value={formData.statusVerifikasi || ''}
                onChange={(e) => handleInputChange('statusVerifikasi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {statusVerifikasiOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Survey Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informasi Survey</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Survey *
              </label>
              <input
                type="date"
                value={formData.tanggalSurvey || ''}
                onChange={(e) => handleInputChange('tanggalSurvey', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.tanggalSurvey ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.tanggalSurvey && (
                <p className="text-red-500 text-sm mt-1">{errors.tanggalSurvey}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Surveyor *
              </label>
              <input
                type="text"
                value={formData.surveyor || ''}
                onChange={(e) => handleInputChange('surveyor', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.surveyor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Masukkan nama surveyor"
              />
              {errors.surveyor && (
                <p className="text-red-500 text-sm mt-1">{errors.surveyor}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan
              </label>
              <textarea
                value={formData.catatan || ''}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Catatan tambahan..."
              />
            </div>
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

export default AksesibilitasForm;
