import React, { useState } from 'react';
import FaseTimeline from '../components/fase-tanam/FaseTimeline';
import FaseDetailPanel from '../components/fase-tanam/FaseDetailPanel';
import FaseForm from '../components/fase-tanam/FaseForm';
import FaseManagement from '../components/fase-tanam/FaseManagement';
import KalenderTanamComponent from '../components/fase-tanam/KalenderTanamComponent';
import { sampleFaseTanam, varietasTembakau } from '../data/sampleFaseTanam';
import { FaseTanam, KalenderTanam } from '../types/faseTanam';

const FaseTanamPage: React.FC = () => {
  const [selectedFase, setSelectedFase] = useState<FaseTanam | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'kalender' | 'varietas' | 'management'>('timeline');
  const [kalenderList, setKalenderList] = useState<KalenderTanam[]>([]);
  const [faseList, setFaseList] = useState<FaseTanam[]>(sampleFaseTanam);
  const [showForm, setShowForm] = useState(false);
  const [editingFase, setEditingFase] = useState<FaseTanam | null>(null);

  const handleFaseSelect = (fase: FaseTanam) => {
    setSelectedFase(fase);
  };

  const handleFaseDeselect = () => {
    setSelectedFase(null);
  };

  const handleCreateKalender = (kalenderData: Omit<KalenderTanam, 'id' | 'createdAt'>) => {
    const newKalender: KalenderTanam = {
      ...kalenderData,
      id: `KAL${String(kalenderList.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    setKalenderList([...kalenderList, newKalender]);
  };

  // CRUD functions untuk fase
  const handleAddFase = () => {
    setEditingFase(null);
    setShowForm(true);
  };

  const handleEditFase = (fase: FaseTanam) => {
    setEditingFase(fase);
    setShowForm(true);
  };

  const handleSaveFase = (faseData: Omit<FaseTanam, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingFase) {
      // Update existing fase
      const updatedFase: FaseTanam = {
        ...editingFase,
        ...faseData,
        kegiatan: faseData.kegiatan.map((k, index) => ({
          ...k,
          id: k.id === `temp_${index}` ? `KEG${editingFase.id.slice(4)}${String(index + 1).padStart(2, '0')}` : k.id
        })),
        updatedAt: new Date().toISOString()
      };
      setFaseList(prev => prev.map(f => f.id === editingFase.id ? updatedFase : f));
    } else {
      // Create new fase
      const newId = `FASE${String(faseList.length + 1).padStart(3, '0')}`;
      const newFase: FaseTanam = {
        ...faseData,
        id: newId,
        kegiatan: faseData.kegiatan.map((k, index) => ({
          ...k,
          id: `KEG${newId.slice(4)}${String(index + 1).padStart(2, '0')}`
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFaseList(prev => [...prev, newFase]);
    }
    setShowForm(false);
    setEditingFase(null);
  };

  const handleDeleteFase = (faseId: string) => {
    setFaseList(prev => prev.filter(f => f.id !== faseId));
    if (selectedFase?.id === faseId) {
      setSelectedFase(null);
    }
  };

  const handleReorderFase = (newFaseList: FaseTanam[]) => {
    setFaseList(newFaseList);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingFase(null);
  };

  const totalFase = faseList.length;
  const totalDurasi = faseList.length > 0 
    ? Math.max(...faseList.map(fase => fase.hariSelesai)) - Math.min(...faseList.map(fase => fase.hariMulai))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fase Tanam Tembakau
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Konfigurasi dan manajemen fase tanam tanaman tembakau dari persiapan hingga panen
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fase</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalFase}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Durasi</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDurasi} hari</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Varietas</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{varietasTembakau.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kalender Aktif</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kalenderList.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-600">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeline'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Timeline Fase
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'management'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Kelola Fase
              </button>
              <button
                onClick={() => setActiveTab('kalender')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'kalender'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Kalender Tanam
              </button>
              <button
                onClick={() => setActiveTab('varietas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'varietas'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Data Varietas
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <FaseTimeline
                  faseList={faseList}
                  selectedFase={selectedFase}
                  onFaseSelect={handleFaseSelect}
                />
              </div>
            )}

            {activeTab === 'management' && (
              <div className="space-y-6">
                <FaseManagement
                  faseList={faseList}
                  onAdd={handleAddFase}
                  onEdit={handleEditFase}
                  onDelete={handleDeleteFase}
                  onReorder={handleReorderFase}
                />
              </div>
            )}

            {activeTab === 'kalender' && (
              <div className="space-y-6">
                <KalenderTanamComponent 
                  faseList={faseList}
                  onCreateKalender={handleCreateKalender} 
                />
                
                {/* Daftar Kalender */}
                {kalenderList.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Kalender Tanam yang Dibuat ({kalenderList.length})
                    </h3>
                    <div className="space-y-3">
                      {kalenderList.map((kalender) => (
                        <div key={kalender.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {kalender.namaKalender}
                            </h4>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {kalender.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>Varietas: {kalender.jenisVarietas}</div>
                            <div>Mulai: {new Date(kalender.tanggalMulai).toLocaleDateString('id-ID')}</div>
                            <div>Panen: {new Date(kalender.estimasiPanen).toLocaleDateString('id-ID')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'varietas' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Data Varietas Tembakau
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {varietasTembakau.map((varietas) => (
                    <div key={varietas.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {varietas.nama}
                        </h4>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          {varietas.totalDurasiTanam} hari
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{varietas.deskripsi}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Karakteristik:</h5>
                          <ul className="space-y-1">
                            {varietas.karakteristik.map((char, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{char}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Syarat Tumbuh:</h5>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div><span className="font-medium">Iklim:</span> {varietas.syaratTumbuh.iklim}</div>
                            <div><span className="font-medium">Tanah:</span> {varietas.syaratTumbuh.tanah}</div>
                            <div><span className="font-medium">Ketinggian:</span> {varietas.syaratTumbuh.ketinggian}</div>
                            <div><span className="font-medium">Curah Hujan:</span> {varietas.syaratTumbuh.curahHujan}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {activeTab === 'timeline' && selectedFase ? (
              <FaseDetailPanel
                fase={selectedFase}
                onClose={handleFaseDeselect}
              />
            ) : activeTab === 'timeline' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pilih Fase Tanam</h3>
                  <p className="text-sm">
                    Klik pada salah satu fase di timeline untuk melihat detail informasi dan kegiatan
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <FaseForm
          fase={editingFase}
          onSave={handleSaveFase}
          onCancel={handleCancelForm}
          isEdit={!!editingFase}
        />
      )}
    </div>
  );
};

export default FaseTanamPage;
