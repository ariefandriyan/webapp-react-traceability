import React, { useState } from 'react';
import { FaseTanam } from '../../types/faseTanam';

interface FaseManagementProps {
  faseList: FaseTanam[];
  onEdit: (fase: FaseTanam) => void;
  onDelete: (faseId: string) => void;
  onAdd: () => void;
  onReorder: (faseList: FaseTanam[]) => void;
}

const FaseManagement: React.FC<FaseManagementProps> = ({
  faseList,
  onEdit,
  onDelete,
  onAdd,
  onReorder
}) => {
  const [sortBy, setSortBy] = useState<'urutan' | 'nama' | 'durasi'>('urutan');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedFaseList = [...faseList].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'urutan':
        valueA = a.urutan;
        valueB = b.urutan;
        break;
      case 'nama':
        valueA = a.nama.toLowerCase();
        valueB = b.nama.toLowerCase();
        break;
      case 'durasi':
        valueA = a.durasi;
        valueB = b.durasi;
        break;
      default:
        valueA = a.urutan;
        valueB = b.urutan;
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleSort = (field: 'urutan' | 'nama' | 'durasi') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (faseId: string) => {
    if (deleteConfirm === faseId) {
      onDelete(faseId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(faseId);
      // Auto hide confirmation after 5 seconds
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const movePhase = (index: number, direction: 'up' | 'down') => {
    const newList = [...sortedFaseList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newList.length) {
      // Swap phases
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      
      // Update urutan values
      newList.forEach((fase, i) => {
        fase.urutan = i + 1;
      });
      
      onReorder(newList);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l4-4 4 4" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manajemen Fase Tanam ({faseList.length} fase)
          </h3>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Fase</span>
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Kelola fase tanam tembakau: tambah, edit, hapus, dan atur urutan fase sesuai kebutuhan.</p>
        </div>
      </div>

      <div className="p-6">
        {faseList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Fase Tanam</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Mulai dengan menambahkan fase tanam pertama untuk tanaman tembakau.
            </p>
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Tambah Fase Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('urutan')}
                      className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <span>Urutan</span>
                      {getSortIcon('urutan')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('nama')}
                      className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <span>Nama Fase</span>
                      {getSortIcon('nama')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('durasi')}
                      className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <span>Durasi</span>
                      {getSortIcon('durasi')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Periode</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Kegiatan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedFaseList.map((fase, index) => (
                  <tr key={fase.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: fase.warna }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {fase.urutan}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{fase.nama}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {fase.deskripsi}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {fase.durasi} hari
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div>Mulai: Hari {fase.hariMulai}</div>
                        <div>Selesai: Hari {fase.hariSelesai}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {fase.kegiatan.length} kegiatan
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        fase.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {fase.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Move Up/Down */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => movePhase(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Pindah ke atas"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l4-4 4 4" />
                            </svg>
                          </button>
                          <button
                            onClick={() => movePhase(index, 'down')}
                            disabled={index === sortedFaseList.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Pindah ke bawah"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" />
                            </svg>
                          </button>
                        </div>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(fase)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit fase"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(fase.id)}
                          className={`p-2 ${
                            deleteConfirm === fase.id
                              ? 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900'
                              : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                          } rounded`}
                          title={deleteConfirm === fase.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus fase'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaseManagement;
