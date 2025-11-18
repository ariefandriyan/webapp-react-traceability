import { Petani } from '../types/petani';
import petaniApiService from './petaniApiService';

/**
 * Unified Petani Service
 * This service automatically uses the real API backend
 * and provides a clean interface for the frontend components
 */
class PetaniService {

  /**
   * Get all petani with optional filters
   */
  async getAllPetani(options?: {
    page?: number;
    limit?: number;
    search?: string;
    statusAktif?: boolean;
  }): Promise<{
    data: Petani[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: 'aktif' | 'nonaktif';
      } = {
        page: options?.page || 1,
        limit: options?.limit || 10,
        search: options?.search
      };

      if (options?.statusAktif !== undefined) {
        params.status = options.statusAktif ? 'aktif' : 'nonaktif';
      }

      const result = await petaniApiService.getAllPetani(params);
      
      return {
        data: result.data,
        total: result.pagination.total,
        page: result.pagination.page,
        limit: result.pagination.limit,
        totalPages: result.pagination.totalPages
      };
    } catch (error) {
      console.error('Error in getAllPetani:', error);
      throw error;
    }
  }

  /**
   * Get single petani by ID
   */
  async getPetaniById(id: string): Promise<Petani> {
    try {
      return await petaniApiService.getPetaniById(id);
    } catch (error) {
      console.error('Error in getPetaniById:', error);
      throw error;
    }
  }

  /**
   * Create new petani
   */
  async createPetani(petaniData: Omit<Petani, 'id' | 'tanggalDaftar'>): Promise<Petani> {
    try {
      return await petaniApiService.createPetani(petaniData);
    } catch (error) {
      console.error('Error in createPetani:', error);
      throw error;
    }
  }

  /**
   * Update existing petani
   */
  async updatePetani(id: string, petaniData: Partial<Petani>): Promise<Petani> {
    try {
      return await petaniApiService.updatePetani(id, petaniData);
    } catch (error) {
      console.error('Error in updatePetani:', error);
      throw error;
    }
  }

  /**
   * Delete petani
   */
  async deletePetani(id: string): Promise<void> {
    try {
      await petaniApiService.deletePetani(id);
    } catch (error) {
      console.error('Error in deletePetani:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{ 
    total: number; 
    aktif: number; 
    nonaktif: number;
    totalLahan: number;
    avgLahan: number;
    kelompokTaniCount: number;
  }> {
    try {
      return await petaniApiService.getPetaniStats();
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }

  /**
   * Search petani by name or NIK
   */
  async searchPetani(query: string, options?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: Petani[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getAllPetani({
      ...options,
      search: query
    });
  }

  /**
   * Check backend availability
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      return await petaniApiService.checkBackendHealth();
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
const petaniService = new PetaniService();
export default petaniService;
