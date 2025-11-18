import { 
  KelompokTani,
  KelompokTaniBackend, 
  KelompokTaniStatsResponse,
  mapBackendToFrontend,
  mapFrontendToBackend
} from '../types/kelompokTani';
import { API_BASE_URL } from '../config/api';

const kelompokTaniApiService = {
  async getAllKelompokTani(params?: {
    page?: number;
    limit?: number;
    search?: string;
    statusLegalitas?: string;
    statusAktif?: boolean;
    kecamatan?: string;
    kabupaten?: string;
    komoditasUtama?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.statusLegalitas) queryParams.append('statusLegalitas', params.statusLegalitas);
    if (params?.statusAktif !== undefined) queryParams.append('statusAktif', params.statusAktif.toString());
    if (params?.kecamatan) queryParams.append('kecamatan', params.kecamatan);
    if (params?.kabupaten) queryParams.append('kabupaten', params.kabupaten);
    if (params?.komoditasUtama) queryParams.append('komoditasUtama', params.komoditasUtama);

    const response = await fetch(`${API_BASE_URL}/kelompok-tani?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    
    return {
      data: result.data.kelompok_tani.map((item: KelompokTaniBackend) => 
        mapBackendToFrontend(item)
      ),
      pagination: {
        page: result.data.pagination.page,
        limit: result.data.pagination.limit,
        total: result.data.pagination.total,
        totalPages: result.data.pagination.total_pages
      }
    };
  },

  async getKelompokTaniById(id: string) {
    const response = await fetch(`${API_BASE_URL}/kelompok-tani/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return mapBackendToFrontend(result.data);
  },

  async createKelompokTani(data: Partial<KelompokTani>) {
    const backendData = mapFrontendToBackend(data);
    const response = await fetch(`${API_BASE_URL}/kelompok-tani`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return mapBackendToFrontend(result.data);
  },

  async updateKelompokTani(id: string, data: Partial<KelompokTani>) {
    const backendData = mapFrontendToBackend(data);
    const response = await fetch(`${API_BASE_URL}/kelompok-tani/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return mapBackendToFrontend(result.data);
  },

  async deleteKelompokTani(id: string) {
    const response = await fetch(`${API_BASE_URL}/kelompok-tani/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return result;
  },

  async getKelompokTaniStats(): Promise<KelompokTaniStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/kelompok-tani/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: any = await response.json();
    return result.data;
  }
};

export default kelompokTaniApiService;
