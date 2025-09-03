import React, { useState } from 'react';
import { FaseTanam } from '../../types/faseTanam';

interface FaseTimelineProps {
  faseList: FaseTanam[];
  selectedFase?: FaseTanam | null;
  onFaseSelect: (fase: FaseTanam) => void;
}

const FaseTimeline: React.FC<FaseTimelineProps> = ({ 
  faseList, 
  selectedFase, 
  onFaseSelect 
}) => {
  const [hoveredFase, setHoveredFase] = useState<string | null>(null);

  const totalDurasi = Math.max(...faseList.map(fase => fase.hariSelesai)) - 
                     Math.min(...faseList.map(fase => fase.hariMulai));

  const getPositionPercentage = (hari: number) => {
    const minHari = Math.min(...faseList.map(fase => fase.hariMulai));
    return ((hari - minHari) / totalDurasi) * 100;
  };

  const getWidthPercentage = (durasi: number) => {
    return (durasi / totalDurasi) * 100;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Timeline Fase Tanam Tembakau
      </h3>
      
      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Base Line */}
        <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        
        {/* Fase Bars */}
        <div className="relative h-16 mb-8">
          {faseList.map((fase) => (
            <div
              key={fase.id}
              className={`absolute top-6 h-4 rounded-full cursor-pointer transition-all duration-200 ${
                selectedFase?.id === fase.id 
                  ? 'ring-2 ring-blue-500 z-20' 
                  : hoveredFase === fase.id 
                    ? 'ring-1 ring-gray-400 z-10' 
                    : 'z-0'
              }`}
              style={{
                left: `${getPositionPercentage(fase.hariMulai)}%`,
                width: `${getWidthPercentage(fase.durasi)}%`,
                backgroundColor: fase.warna,
                minWidth: '60px'
              }}
              onClick={() => onFaseSelect(fase)}
              onMouseEnter={() => setHoveredFase(fase.id)}
              onMouseLeave={() => setHoveredFase(null)}
            >
              {/* Fase Label */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {fase.nama}
              </div>
              
              {/* Duration Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {fase.durasi} hari
              </div>
            </div>
          ))}
        </div>

        {/* Day Markers */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
          <span>Hari {Math.min(...faseList.map(fase => fase.hariMulai))}</span>
          <span>Hari 0 (Tanam)</span>
          <span>Hari {Math.max(...faseList.map(fase => fase.hariSelesai))}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {faseList.map((fase) => (
            <div
              key={fase.id}
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                selectedFase?.id === fase.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => onFaseSelect(fase)}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: fase.warna }}
              ></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {fase.nama}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip for hovered fase */}
      {hoveredFase && (
        <div className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg p-3 pointer-events-none transform -translate-x-1/2 -translate-y-full">
          {(() => {
            const fase = faseList.find(f => f.id === hoveredFase);
            return fase ? (
              <div>
                <div className="font-medium">{fase.nama}</div>
                <div className="text-gray-300">Hari {fase.hariMulai} - {fase.hariSelesai}</div>
                <div className="text-gray-300">{fase.durasi} hari</div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default FaseTimeline;
