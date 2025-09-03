import React, { useState, useEffect } from 'react';
import { FaseTanam, KegiatanFase } from '../../types/faseTanam';
import { jenisVarietasOptions, kategoriKegiatanOptions } from '../../data/sampleFaseTanam';

interface FaseFormProps {
  fase?: FaseTanam | null;
  onSave: (fase: Omit<FaseTanam, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const FaseForm: React.FC<FaseFormProps> = ({ fase, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    urutan: 1,
    hariMulai: 0,
    hariSelesai: 7,
    warna: '#32CD32',
    jenisVarietas: [] as string[],
    indikatorVisual: [''],
    perawatanKhusus: [''],
    isActive: true
  });

  const [kegiatan, setKegiatan] = useState<Omit<KegiatanFase, 'id'>[]>([]);

  useEffect(() => {
    if (fase) {
      setFormData({
        nama: fase.nama,
        deskripsi: fase.deskripsi,
        urutan: fase.urutan,
        hariMulai: fase.hariMulai,
        hariSelesai: fase.hariSelesai,
        warna: fase.warna,
        jenisVarietas: fase.jenisVarietas,
        indikatorVisual: fase.indikatorVisual,
        perawatanKhusus: fase.perawatanKhusus,
        isActive: fase.isActive
      });
      setKegiatan(fase.kegiatan.map(k => ({
        nama: k.nama,
        deskripsi: k.deskripsi,
        hariOptimal: k.hariOptimal,
        kategori: k.kategori,
        isMandatory: k.isMandatory,
        estimasiWaktu: k.estimasiWaktu,
        peralatan: k.peralatan,
        bahan: k.bahan
      })));
    }
  }, [fase]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'indikatorVisual' | 'perawatanKhusus', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'indikatorVisual' | 'perawatanKhusus') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'indikatorVisual' | 'perawatanKhusus', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleVarietasChange = (varietas: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      jenisVarietas: isChecked 
        ? [...prev.jenisVarietas, varietas]
        : prev.jenisVarietas.filter(v => v !== varietas)
    }));
  };

  const addKegiatan = () => {
    setKegiatan(prev => [...prev, {
      nama: '',
      deskripsi: '',
      hariOptimal: formData.hariMulai,
      kategori: 'pemeliharaan',
      isMandatory: false,
      estimasiWaktu: 1,
      peralatan: [],
      bahan: []
    }]);
  };

  const updateKegiatan = (index: number, field: string, value: any) => {
    setKegiatan(prev => prev.map((k, i) => 
      i === index ? { ...k, [field]: value } : k
    ));
  };

  const removeKegiatan = (index: number) => {
    setKegiatan(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const durasi = formData.hariSelesai - formData.hariMulai;
    
    const faseData = {
      ...formData,
      durasi,
      kegiatan: kegiatan.map((k, index) => ({
        ...k,
        id: `temp_${index}` // Temporary ID, will be replaced by parent
      }))
    };

    onSave(faseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Fase Tanam' : 'Tambah Fase Tanam Baru'}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Fase *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => handleInputChange('nama', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contoh: Fase Vegetatif"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urutan Fase *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.urutan}
                onChange={(e) => handleInputChange('urutan', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hari Mulai *
              </label>
              <input
                type="number"
                required
                value={formData.hariMulai}
                onChange={(e) => handleInputChange('hariMulai', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0 (hari setelah tanam)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hari Selesai *
              </label>
              <input
                type="number"
                required
                min={formData.hariMulai + 1}
                value={formData.hariSelesai}
                onChange={(e) => handleInputChange('hariSelesai', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Warna Timeline
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.warna}
                  onChange={(e) => handleInputChange('warna', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.warna}
                  onChange={(e) => handleInputChange('warna', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="#32CD32"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Durasi (Otomatis)
              </label>
              <input
                type="text"
                disabled
                value={`${formData.hariSelesai - formData.hariMulai} hari`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi *
            </label>
            <textarea
              required
              rows={3}
              value={formData.deskripsi}
              onChange={(e) => handleInputChange('deskripsi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Jelaskan karakteristik dan tujuan dari fase ini..."
            />
          </div>

          {/* Varietas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Varietas yang Berlaku
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {jenisVarietasOptions.map(varietas => (
                <label key={varietas} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.jenisVarietas.includes(varietas)}
                    onChange={(e) => handleVarietasChange(varietas, e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{varietas}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Indikator Visual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Indikator Visual
            </label>
            <div className="space-y-2">
              {formData.indikatorVisual.map((indikator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={indikator}
                    onChange={(e) => handleArrayChange('indikatorVisual', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Contoh: Daun mulai menguning dari bagian bawah"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('indikatorVisual', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('indikatorVisual')}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                + Tambah Indikator
              </button>
            </div>
          </div>

          {/* Perawatan Khusus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Perawatan Khusus
            </label>
            <div className="space-y-2">
              {formData.perawatanKhusus.map((perawatan, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={perawatan}
                    onChange={(e) => handleArrayChange('perawatanKhusus', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Contoh: Monitoring cuaca dan kelembaban"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('perawatanKhusus', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('perawatanKhusus')}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                + Tambah Perawatan
              </button>
            </div>
          </div>

          {/* Kegiatan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kegiatan dalam Fase
              </label>
              <button
                type="button"
                onClick={addKegiatan}
                className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
              >
                + Tambah Kegiatan
              </button>
            </div>
            
            <div className="space-y-4">
              {kegiatan.map((k, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900 dark:text-white">Kegiatan {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeKegiatan(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nama Kegiatan</label>
                      <input
                        type="text"
                        value={k.nama}
                        onChange={(e) => updateKegiatan(index, 'nama', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Contoh: Pemupukan Susulan"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Kategori</label>
                      <select
                        value={k.kategori}
                        onChange={(e) => updateKegiatan(index, 'kategori', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        {kategoriKegiatanOptions.map(kategori => (
                          <option key={kategori} value={kategori}>{kategori}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Hari Optimal</label>
                      <input
                        type="number"
                        min={formData.hariMulai}
                        max={formData.hariSelesai}
                        value={k.hariOptimal}
                        onChange={(e) => updateKegiatan(index, 'hariOptimal', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Estimasi Waktu (jam)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={k.estimasiWaktu}
                        onChange={(e) => updateKegiatan(index, 'estimasiWaktu', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Deskripsi</label>
                    <textarea
                      rows={2}
                      value={k.deskripsi}
                      onChange={(e) => updateKegiatan(index, 'deskripsi', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Jelaskan kegiatan ini..."
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Peralatan (pisah dengan koma)</label>
                      <input
                        type="text"
                        value={k.peralatan.join(', ')}
                        onChange={(e) => updateKegiatan(index, 'peralatan', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="cangkul, gembor, sprayer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Bahan (pisah dengan koma)</label>
                      <input
                        type="text"
                        value={k.bahan.join(', ')}
                        onChange={(e) => updateKegiatan(index, 'bahan', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="pupuk NPK, air, insektisida"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={k.isMandatory}
                        onChange={(e) => updateKegiatan(index, 'isMandatory', e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Kegiatan Wajib</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Fase Aktif</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {isEdit ? 'Update Fase' : 'Simpan Fase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FaseForm;
