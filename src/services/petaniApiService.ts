import { 
  Petani, 
  PetaniBackend, 
  PetaniApiResponse, 
  PetaniStatsResponse,
  mapBackendToFrontend,
  mapFrontendToBackend
} from '../types/petani';
import { API_BASE_URL } from '../config/api';

class PetaniApiService {
  
  /**
   * Get all petani with pagination, search, and filters
   */
  async getAllPetani(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'aktif' | 'nonaktif';
    sort_by?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<{ data: Petani[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.order) queryParams.append('order', params.order);

      const response = await fetch(`${API_BASE_URL}/petani?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: any = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch petani data');
      }

      // Backend returns { data: { petani: [...], pagination: {...} } }
      const petaniArray = result.data?.petani || [];
      const frontendData = petaniArray.map(mapBackendToFrontend);
      
      // Map backend pagination format to frontend format
      const backendPagination = result.data?.pagination || {};

      return {
        data: frontendData,
        pagination: {
          total: backendPagination.total || frontendData.length,
          page: backendPagination.current_page || params?.page || 1,
          limit: backendPagination.per_page || params?.limit || 10,
          totalPages: backendPagination.total_pages || 1
        }
      };
    } catch (error) {
      console.error('Error fetching petani:', error);
      throw new Error('Gagal mengambil data petani. Pastikan backend server berjalan.');
    }
  }

  /**
   * Get single petani by ID
   */
  async getPetaniById(id: string | number): Promise<Petani> {
    try {
      const response = await fetch(`${API_BASE_URL}/petani/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Data petani tidak ditemukan');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PetaniApiResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch petani');
      }

      const backendData = result.data as PetaniBackend;
      return mapBackendToFrontend(backendData);
    } catch (error) {
      console.error('Error fetching petani by ID:', error);
      throw error;
    }
  }

  /**
   * Create new petani
   */
  async createPetani(petaniData: Partial<Petani>): Promise<Petani> {
    try {
      const backendPayload = mapFrontendToBackend(petaniData);

      const response = await fetch(`${API_BASE_URL}/petani`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      const result: PetaniApiResponse = await response.json();

      if (!response.ok || !result.success) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = result.errors
            .map(err => `${err.field}: ${err.message}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Gagal menambahkan data petani');
      }

      const backendData = result.data as PetaniBackend;
      return mapBackendToFrontend(backendData);
    } catch (error) {
      console.error('Error creating petani:', error);
      throw error;
    }
  }

  /**
   * Update existing petani
   */
  async updatePetani(id: string | number, petaniData: Partial<Petani>): Promise<Petani> {
    try {
      const backendPayload = mapFrontendToBackend(petaniData);

      const response = await fetch(`${API_BASE_URL}/petani/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      const result: PetaniApiResponse = await response.json();

      if (!response.ok || !result.success) {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = result.errors
            .map(err => `${err.field}: ${err.message}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(result.message || 'Gagal mengupdate data petani');
      }

      const backendData = result.data as PetaniBackend;
      return mapBackendToFrontend(backendData);
    } catch (error) {
      console.error('Error updating petani:', error);
      throw error;
    }
  }

  /**
   * Delete petani
   */
  async deletePetani(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/petani/${id}`, {
        method: 'DELETE',
      });

      const result: PetaniApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menghapus data petani');
      }
    } catch (error) {
      console.error('Error deleting petani:', error);
      throw error;
    }
  }

  /**
   * Get petani statistics
   */
  async getPetaniStats(): Promise<{ 
    total: number; 
    aktif: number; 
    nonaktif: number;
    totalLahan: number;
    avgLahan: number;
    kelompokTaniCount: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/petani/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PetaniStatsResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch statistics');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching petani stats:', error);
      throw new Error('Gagal mengambil statistik petani');
    }
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3000/health');
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
const petaniApiService = new PetaniApiService();
export default petaniApiService;
