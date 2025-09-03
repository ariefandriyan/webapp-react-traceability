import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { PlotLahan, MapFilters } from '../../types/lahan';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  plots: PlotLahan[];
  selectedPlot?: PlotLahan | null;
  onPlotSelect: (plot: PlotLahan) => void;
  filters: MapFilters;
}

// Component to handle map centering
const MapController = ({ selectedPlot }: { selectedPlot?: PlotLahan | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPlot) {
      map.setView(selectedPlot.center as LatLngExpression, 16);
    }
  }, [selectedPlot, map]);
  
  return null;
};

// Get color based on status tanam
const getPlotColor = (status: string): string => {
  switch (status) {
    case 'Tanam': return '#22c55e'; // green
    case 'Panen': return '#f59e0b'; // amber
    case 'Belum Tanam': return '#6b7280'; // gray
    case 'Istirahat': return '#8b5cf6'; // purple
    default: return '#6b7280';
  }
};

// Get opacity based on status
const getPlotOpacity = (status: string): number => {
  switch (status) {
    case 'Tanam': return 0.7;
    case 'Panen': return 0.8;
    case 'Belum Tanam': return 0.4;
    case 'Istirahat': return 0.6;
    default: return 0.5;
  }
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  plots, 
  selectedPlot, 
  onPlotSelect,
  filters 
}) => {
  // Filter plots based on filters
  const filteredPlots = plots.filter(plot => {
    return (
      (filters.kelompokTani === '' || plot.kelompokTani === filters.kelompokTani) &&
      (filters.jenisVarietas === '' || plot.jenisVarietas === filters.jenisVarietas) &&
      (filters.statusTanam === '' || plot.statusTanam === filters.statusTanam) &&
      (filters.kecamatan === '' || plot.kecamatan === filters.kecamatan) &&
      (plot.luas >= filters.luasMin) &&
      (filters.luasMax === 0 || plot.luas <= filters.luasMax)
    );
  });

  // Center map on Malang area
  const mapCenter: LatLngExpression = [-7.9666, 112.6326];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* Google Satellite Tile Layer */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
        />
        
        {/* Google Hybrid Tile Layer (alternative) */}
        {/* 
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
        />
        */}

        <MapController selectedPlot={selectedPlot} />

        {/* Render plot polygons */}
        {filteredPlots.map((plot) => (
          <Polygon
            key={plot.id}
            positions={plot.coordinates as LatLngExpression[]}
            pathOptions={{
              color: getPlotColor(plot.statusTanam),
              fillColor: getPlotColor(plot.statusTanam),
              fillOpacity: getPlotOpacity(plot.statusTanam),
              weight: selectedPlot?.id === plot.id ? 4 : 2,
              opacity: selectedPlot?.id === plot.id ? 1 : 0.8,
            }}
            eventHandlers={{
              click: () => onPlotSelect(plot),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-gray-900 mb-2">{plot.namaPetani}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Plot:</span>
                    <span className="font-medium">{plot.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kelompok Tani:</span>
                    <span className="font-medium">{plot.kelompokTani}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luas:</span>
                    <span className="font-medium">{plot.luas} ha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Varietas:</span>
                    <span className="font-medium">{plot.jenisVarietas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plot.statusTanam === 'Tanam' ? 'bg-green-100 text-green-800' :
                        plot.statusTanam === 'Panen' ? 'bg-amber-100 text-amber-800' :
                        plot.statusTanam === 'Belum Tanam' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {plot.statusTanam}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lokasi:</span>
                    <span className="font-medium text-right">{plot.kecamatan}</span>
                  </div>
                  {plot.tanggalTanam && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal Tanam:</span>
                      <span className="font-medium">{new Date(plot.tanggalTanam).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  {plot.estimasiPanen && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimasi Panen:</span>
                      <span className="font-medium">{new Date(plot.estimasiPanen).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Status Tanam</h4>
        <div className="space-y-1">
          {[
            { status: 'Tanam', color: '#22c55e', label: 'Sedang Tanam' },
            { status: 'Panen', color: '#f59e0b', label: 'Masa Panen' },
            { status: 'Belum Tanam', color: '#6b7280', label: 'Belum Tanam' },
            { status: 'Istirahat', color: '#8b5cf6', label: 'Istirahat' }
          ].map((item) => (
            <div key={item.status} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plot count indicator */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg z-[1000]">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {filteredPlots.length} plot ditampilkan
        </span>
      </div>
    </div>
  );
};

export default MapComponent;
