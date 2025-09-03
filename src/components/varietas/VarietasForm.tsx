import React, { useState, useEffect } from 'react';
import { Varietas } from '../../types/varietas';

interface VarietasFormProps {
  varietas?: Varietas | null;
  isEditing: boolean;
  onSave: (varietas: Omit<Varietas, 'id' | 'tanggalDaftar' | 'terakhirDiperbarui'>) => void;
  onCancel: () => void;
}

const VarietasForm: React.FC<VarietasFormProps> = ({
  varietas,
  isEditing,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    kodeVarietas: '',
    namaVarietas: '',
    jenisVarietas: 'Virginia' as 'Virginia' | 'Burley' | 'Oriental' | 'Rajangan' | 'Dark Air Cured' | 'Flue Cured',
    deskripsi: '',
    asalVarietas: '',
    karakteristikDaun: {
      bentukDaun: '',
      ukuranDaun: '',
      warnaDaun: '',
      teksturDaun: '',
      ketebalanDaun: ''
    },
    sifatTanaman: {
      tinggiTanaman: '',
      jumlahDaun: 0,
      umurPanen: 0,
      dayayaHasil: '',
      ketahananHama: '',
      ketahananPenyakit: ''
    },
    syaratTumbuh: {
      iklim: '',
      suhu: '',
      curahHujan: '',
      kelembaban: '',
      jenisLahan: '',
      pHTanah: '',
      ketinggian: ''
    },
    kualitasHasil: {
      kandunganNikotin: '',
      kandunganGula: '',
      kandunganProtein: '',
      aromaTembakau: '',
      warnaRajangan: '',
      teksturRajangan: ''
    },
    penggunaan: [] as string[],
    statusVarietas: 'Aktif' as 'Aktif' | 'Tidak Aktif' | 'Uji Coba',
    sumberBenih: '',
    instansiPengembang: '',
    tahunRilis: new Date().getFullYear(),
    sertifikasi: [] as string[],
    catatanKhusus: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [penggunaanInput, setPenggunaanInput] = useState('');
  const [sertifikasiInput, setSertifikasiInput] = useState('');

  useEffect(() => {
    if (varietas) {
      setFormData({
        kodeVarietas: varietas.kodeVarietas,
        namaVarietas: varietas.namaVarietas,
        jenisVarietas: varietas.jenisVarietas,
        deskripsi: varietas.deskripsi,
        asalVarietas: varietas.asalVarietas,
        karakteristikDaun: varietas.karakteristikDaun,
        sifatTanaman: varietas.sifatTanaman,
        syaratTumbuh: varietas.syaratTumbuh,
        kualitasHasil: varietas.kualitasHasil,
        penggunaan: varietas.penggunaan,
        statusVarietas: varietas.statusVarietas,
        sumberBenih: varietas.sumberBenih,
        instansiPengembang: varietas.instansiPengembang,
        tahunRilis: varietas.tahunRilis,
        sertifikasi: varietas.sertifikasi,
        catatanKhusus: varietas.catatanKhusus || ''
      });
    }
  }, [varietas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.kodeVarietas.trim()) newErrors.kodeVarietas = 'Kode varietas wajib diisi';
    if (!formData.namaVarietas.trim()) newErrors.namaVarietas = 'Nama varietas wajib diisi';
    if (!formData.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!formData.asalVarietas.trim()) newErrors.asalVarietas = 'Asal varietas wajib diisi';
    if (!formData.instansiPengembang.trim()) newErrors.instansiPengembang = 'Instansi pengembang wajib diisi';
    if (!formData.sumberBenih.trim()) newErrors.sumberBenih = 'Sumber benih wajib diisi';
    if (formData.tahunRilis < 1900 || formData.tahunRilis > new Date().getFullYear() + 5) {
      newErrors.tahunRilis = 'Tahun rilis tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentObj = prev[parent as keyof typeof prev] as any;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addPenggunaan = () => {
    if (penggunaanInput.trim() && !formData.penggunaan.includes(penggunaanInput.trim())) {
      setFormData(prev => ({
        ...prev,
        penggunaan: [...prev.penggunaan, penggunaanInput.trim()]
      }));
      setPenggunaanInput('');
    }
  };

  const removePenggunaan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      penggunaan: prev.penggunaan.filter((_, i) => i !== index)
    }));
  };

  const addSertifikasi = () => {
    if (sertifikasiInput.trim() && !formData.sertifikasi.includes(sertifikasiInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sertifikasi: [...prev.sertifikasi, sertifikasiInput.trim()]
      }));
      setSertifikasiInput('');
    }
  };

  const removeSertifikasi = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sertifikasi: prev.sertifikasi.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Data Varietas' : 'Tambah Varietas Baru'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Data Dasar Varietas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Dasar Varietas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kode Varietas *
                </label>
                <input
                  type="text"
                  value={formData.kodeVarietas}
                  onChange={(e) => handleInputChange('kodeVarietas', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.kodeVarietas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Contoh: VT001"
                />
                {errors.kodeVarietas && <p className="text-red-500 text-xs mt-1">{errors.kodeVarietas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Varietas *
                </label>
                <input
                  type="text"
                  value={formData.namaVarietas}
                  onChange={(e) => handleInputChange('namaVarietas', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.namaVarietas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama varietas tembakau"
                />
                {errors.namaVarietas && <p className="text-red-500 text-xs mt-1">{errors.namaVarietas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Varietas
                </label>
                <select
                  value={formData.jenisVarietas}
                  onChange={(e) => handleInputChange('jenisVarietas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Virginia">Virginia</option>
                  <option value="Burley">Burley</option>
                  <option value="Oriental">Oriental</option>
                  <option value="Rajangan">Rajangan</option>
                  <option value="Dark Air Cured">Dark Air Cured</option>
                  <option value="Flue Cured">Flue Cured</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asal Varietas *
                </label>
                <input
                  type="text"
                  value={formData.asalVarietas}
                  onChange={(e) => handleInputChange('asalVarietas', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.asalVarietas ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Negara atau daerah asal"
                />
                {errors.asalVarietas && <p className="text-red-500 text-xs mt-1">{errors.asalVarietas}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tahun Rilis *
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.tahunRilis}
                  onChange={(e) => handleInputChange('tahunRilis', parseInt(e.target.value) || new Date().getFullYear())}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.tahunRilis ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.tahunRilis && <p className="text-red-500 text-xs mt-1">{errors.tahunRilis}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status Varietas
                </label>
                <select
                  value={formData.statusVarietas}
                  onChange={(e) => handleInputChange('statusVarietas', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                  <option value="Uji Coba">Uji Coba</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.deskripsi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Deskripsi singkat tentang varietas ini"
                />
                {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
              </div>
            </div>
          </div>

          {/* Karakteristik Daun */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Karakteristik Daun</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bentuk Daun
                </label>
                <input
                  type="text"
                  value={formData.karakteristikDaun.bentukDaun}
                  onChange={(e) => handleInputChange('karakteristikDaun.bentukDaun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Elips panjang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ukuran Daun
                </label>
                <input
                  type="text"
                  value={formData.karakteristikDaun.ukuranDaun}
                  onChange={(e) => handleInputChange('karakteristikDaun.ukuranDaun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Besar (45-55 cm)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Warna Daun
                </label>
                <input
                  type="text"
                  value={formData.karakteristikDaun.warnaDaun}
                  onChange={(e) => handleInputChange('karakteristikDaun.warnaDaun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Hijau terang"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tekstur Daun
                </label>
                <input
                  type="text"
                  value={formData.karakteristikDaun.teksturDaun}
                  onChange={(e) => handleInputChange('karakteristikDaun.teksturDaun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Halus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ketebalan Daun
                </label>
                <input
                  type="text"
                  value={formData.karakteristikDaun.ketebalanDaun}
                  onChange={(e) => handleInputChange('karakteristikDaun.ketebalanDaun', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Sedang"
                />
              </div>
            </div>
          </div>

          {/* Sifat Tanaman */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sifat Tanaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tinggi Tanaman
                </label>
                <input
                  type="text"
                  value={formData.sifatTanaman.tinggiTanaman}
                  onChange={(e) => handleInputChange('sifatTanaman.tinggiTanaman', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: 180-200 cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Jumlah Daun
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sifatTanaman.jumlahDaun}
                  onChange={(e) => handleInputChange('sifatTanaman.jumlahDaun', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Jumlah daun per tanaman"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Umur Panen (hari)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sifatTanaman.umurPanen}
                  onChange={(e) => handleInputChange('sifatTanaman.umurPanen', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Umur panen dalam hari"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Daya Hasil
                </label>
                <input
                  type="text"
                  value={formData.sifatTanaman.dayayaHasil}
                  onChange={(e) => handleInputChange('sifatTanaman.dayayaHasil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Tinggi (2.5-3 ton/ha)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ketahanan Hama
                </label>
                <input
                  type="text"
                  value={formData.sifatTanaman.ketahananHama}
                  onChange={(e) => handleInputChange('sifatTanaman.ketahananHama', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Tahan terhadap aphids"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ketahanan Penyakit
                </label>
                <input
                  type="text"
                  value={formData.sifatTanaman.ketahananPenyakit}
                  onChange={(e) => handleInputChange('sifatTanaman.ketahananPenyakit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Tahan TMV"
                />
              </div>
            </div>
          </div>

          {/* Penggunaan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Penggunaan</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={penggunaanInput}
                  onChange={(e) => setPenggunaanInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Rokok kretek premium"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPenggunaan())}
                />
                <button
                  type="button"
                  onClick={addPenggunaan}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.penggunaan.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removePenggunaan(index)}
                      className="ml-2 text-emerald-600 hover:text-emerald-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Data Pengembangan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Pengembangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instansi Pengembang *
                </label>
                <input
                  type="text"
                  value={formData.instansiPengembang}
                  onChange={(e) => handleInputChange('instansiPengembang', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.instansiPengembang ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nama instansi yang mengembangkan"
                />
                {errors.instansiPengembang && <p className="text-red-500 text-xs mt-1">{errors.instansiPengembang}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sumber Benih *
                </label>
                <input
                  type="text"
                  value={formData.sumberBenih}
                  onChange={(e) => handleInputChange('sumberBenih', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                    errors.sumberBenih ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Sumber atau supplier benih"
                />
                {errors.sumberBenih && <p className="text-red-500 text-xs mt-1">{errors.sumberBenih}</p>}
              </div>
            </div>
          </div>

          {/* Sertifikasi */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sertifikasi</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sertifikasiInput}
                  onChange={(e) => setSertifikasiInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Contoh: Sertifikat Varietas Unggul"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSertifikasi())}
                />
                <button
                  type="button"
                  onClick={addSertifikasi}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sertifikasi.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeSertifikasi(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Catatan Khusus */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Catatan Khusus</h3>
            <div>
              <textarea
                value={formData.catatanKhusus}
                onChange={(e) => handleInputChange('catatanKhusus', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Catatan tambahan tentang varietas ini (opsional)"
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

export default VarietasForm;
