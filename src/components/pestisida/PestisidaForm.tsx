import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { PestisidaData, PestisidaFormData } from '../../types/pestisida';
import { jenisHamaOptions, produsenOptions } from '../../data/samplePestisida';

interface PestisidaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PestisidaFormData) => void;
  editData?: PestisidaData | null;
  title: string;
}

const PestisidaForm: React.FC<PestisidaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  title
}) => {
  const [formData, setFormData] = useState<PestisidaFormData>({
    merek: '',
    namaPestisida: '',
    jenisHama: [],
    bentukSediaan: 'Cair',
    kandunganAktif: '',
    konsentrasi: '',
    dosisRekomendasi: '',
    masaKarensi: 0,
    kategoriRisiko: 'Rendah',
    nomorRegistrasi: '',
    produsen: '',
    tanggalProduksi: '',
    tanggalKadaluarsa: '',
    petunjukPenggunaan: '',
    peringatanKeamanan: [],
    statusAktif: true
  });

  const [selectedHama, setSelectedHama] = useState<string[]>([]);
  const [selectedPeringatan, setSelectedPeringatan] = useState<string[]>([]);
  const [newHama, setNewHama] = useState('');
  const [newPeringatan, setNewPeringatan] = useState('');

  useEffect(() => {
    if (editData) {
      setFormData({
        merek: editData.merek,
        namaPestisida: editData.namaPestisida,
        jenisHama: editData.jenisHama,
        bentukSediaan: editData.bentukSediaan,
        kandunganAktif: editData.kandunganAktif,
        konsentrasi: editData.konsentrasi,
        dosisRekomendasi: editData.dosisRekomendasi,
        masaKarensi: editData.masaKarensi,
        kategoriRisiko: editData.kategoriRisiko,
        nomorRegistrasi: editData.nomorRegistrasi,
        produsen: editData.produsen,
        tanggalProduksi: editData.tanggalProduksi || '',
        tanggalKadaluarsa: editData.tanggalKadaluarsa || '',
        petunjukPenggunaan: editData.petunjukPenggunaan,
        peringatanKeamanan: editData.peringatanKeamanan,
        statusAktif: editData.statusAktif
      });
      setSelectedHama(editData.jenisHama);
      setSelectedPeringatan(editData.peringatanKeamanan);
    } else {
      // Reset form for new data
      setFormData({
        merek: '',
        namaPestisida: '',
        jenisHama: [],
        bentukSediaan: 'Cair',
        kandunganAktif: '',
        konsentrasi: '',
        dosisRekomendasi: '',
        masaKarensi: 0,
        kategoriRisiko: 'Rendah',
        nomorRegistrasi: '',
        produsen: '',
        tanggalProduksi: '',
        tanggalKadaluarsa: '',
        petunjukPenggunaan: '',
        peringatanKeamanan: [],
        statusAktif: true
      });
      setSelectedHama([]);
      setSelectedPeringatan([]);
    }
  }, [editData, isOpen]);

  const handleInputChange = (name: keyof PestisidaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addHama = () => {
    if (newHama.trim() && !selectedHama.includes(newHama.trim())) {
      const updatedHama = [...selectedHama, newHama.trim()];
      setSelectedHama(updatedHama);
      setFormData(prev => ({ ...prev, jenisHama: updatedHama }));
      setNewHama('');
    }
  };

  const removeHama = (hama: string) => {
    const updatedHama = selectedHama.filter(h => h !== hama);
    setSelectedHama(updatedHama);
    setFormData(prev => ({ ...prev, jenisHama: updatedHama }));
  };

  const addPeringatan = () => {
    if (newPeringatan.trim() && !selectedPeringatan.includes(newPeringatan.trim())) {
      const updatedPeringatan = [...selectedPeringatan, newPeringatan.trim()];
      setSelectedPeringatan(updatedPeringatan);
      setFormData(prev => ({ ...prev, peringatanKeamanan: updatedPeringatan }));
      setNewPeringatan('');
    }
  };

  const removePeringatan = (peringatan: string) => {
    const updatedPeringatan = selectedPeringatan.filter(p => p !== peringatan);
    setSelectedPeringatan(updatedPeringatan);
    setFormData(prev => ({ ...prev, peringatanKeamanan: updatedPeringatan }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Merek Pestisida *
              </label>
              <Input
                value={formData.merek}
                onChange={(e) => handleInputChange('merek', e.target.value)}
                placeholder="Contoh: BAYER, SYNGENTA"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Pestisida *
              </label>
              <Input
                value={formData.namaPestisida}
                onChange={(e) => handleInputChange('namaPestisida', e.target.value)}
                placeholder="Contoh: Confidor 200SL"
                required
              />
            </div>
          </div>

          {/* Producer and Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Produsen *
              </label>
              <select
                value={formData.produsen}
                onChange={(e) => handleInputChange('produsen', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Pilih Produsen</option>
                {produsenOptions.map((produsen) => (
                  <option key={produsen} value={produsen}>
                    {produsen}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nomor Registrasi *
              </label>
              <Input
                value={formData.nomorRegistrasi}
                onChange={(e) => handleInputChange('nomorRegistrasi', e.target.value)}
                placeholder="Contoh: RI.01030120082978"
                required
              />
            </div>
          </div>

          {/* Active Ingredient and Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kandungan Aktif *
              </label>
              <Input
                value={formData.kandunganAktif}
                onChange={(e) => handleInputChange('kandunganAktif', e.target.value)}
                placeholder="Contoh: Imidakloprid"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konsentrasi *
              </label>
              <Input
                value={formData.konsentrasi}
                onChange={(e) => handleInputChange('konsentrasi', e.target.value)}
                placeholder="Contoh: 200 g/l"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bentuk Sediaan *
              </label>
              <select
                value={formData.bentukSediaan}
                onChange={(e) => handleInputChange('bentukSediaan', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="Cair">Cair</option>
                <option value="Granul">Granul</option>
                <option value="Tablet">Tablet</option>
                <option value="Bubuk">Bubuk</option>
                <option value="Emulsi">Emulsi</option>
              </select>
            </div>
          </div>

          {/* Dosage and Safety */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosis Rekomendasi *
              </label>
              <Input
                value={formData.dosisRekomendasi}
                onChange={(e) => handleInputChange('dosisRekomendasi', e.target.value)}
                placeholder="Contoh: 0.5-1 ml/liter air"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Masa Karensi (hari) *
              </label>
              <Input
                type="number"
                value={formData.masaKarensi.toString()}
                onChange={(e) => handleInputChange('masaKarensi', parseInt(e.target.value) || 0)}
                placeholder="Contoh: 14"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori Risiko *
              </label>
              <select
                value={formData.kategoriRisiko}
                onChange={(e) => handleInputChange('kategoriRisiko', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Produksi
              </label>
              <Input
                type="date"
                value={formData.tanggalProduksi}
                onChange={(e) => handleInputChange('tanggalProduksi', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Kadaluarsa
              </label>
              <Input
                type="date"
                value={formData.tanggalKadaluarsa}
                onChange={(e) => handleInputChange('tanggalKadaluarsa', e.target.value)}
              />
            </div>
          </div>

          {/* Pest Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jenis Hama yang Dapat Diatasi *
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={newHama}
                  onChange={(e) => setNewHama(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Pilih jenis hama</option>
                  {jenisHamaOptions
                    .filter(hama => !selectedHama.includes(hama))
                    .map((hama) => (
                      <option key={hama} value={hama}>
                        {hama}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  onPress={addHama}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                  disabled={!newHama}
                >
                  Tambah
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedHama.map((hama) => (
                  <span
                    key={hama}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                  >
                    {hama}
                    <button
                      type="button"
                      onClick={() => removeHama(hama)}
                      className="ml-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Petunjuk Penggunaan *
            </label>
            <textarea
              value={formData.petunjukPenggunaan}
              onChange={(e) => handleInputChange('petunjukPenggunaan', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Jelaskan cara penggunaan pestisida..."
              required
            />
          </div>

          {/* Safety Warnings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peringatan Keamanan
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newPeringatan}
                  onChange={(e) => setNewPeringatan(e.target.value)}
                  placeholder="Tambahkan peringatan keamanan..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onPress={addPeringatan}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  disabled={!newPeringatan}
                >
                  Tambah
                </Button>
              </div>
              
              <div className="space-y-1">
                {selectedPeringatan.map((peringatan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900 rounded-lg"
                  >
                    <span className="text-sm text-red-800 dark:text-red-300">{peringatan}</span>
                    <button
                      type="button"
                      onClick={() => removePeringatan(peringatan)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.statusAktif}
                onChange={(e) => handleInputChange('statusAktif', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status Aktif
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="light"
              onPress={onClose}
              className="rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
            >
              {editData ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PestisidaForm;
