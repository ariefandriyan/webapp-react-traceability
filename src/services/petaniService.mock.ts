import { Petani, PetaniFormData } from '../types/petani';
import { mockPetaniData, PetaniApiResponse, PetaniApiRequest } from '../data/petaniMockData';

// Simulasi delay untuk membuat response lebih realistis
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulasi error random untuk testing
const shouldSimulateError = () => Math.random() < 0.1; // 10% chance of error

class PetaniService {
  private data: Petani[] = [...mockPetaniData];

  // GET - Fetch all petani with filters, pagination, and sorting
  async getAllPetani(request?: PetaniApiRequest): Promise<PetaniApiResponse> {
    await delay(500 + Math.random() * 500); // 500-1000ms delay

    if (shouldSimulateError()) {
      throw new Error('Gagal mengambil data petani. Silakan coba lagi.');
    }

    try {
      let filteredData = [...this.data];

      // Apply filters
      if (request?.filters) {
        const { nama, nik, kelompokTani, statusAktif, kabupaten } = request.filters;
        
        filteredData = filteredData.filter(petani => {
          return (
            (!nama || petani.nama.toLowerCase().includes(nama.toLowerCase())) &&
            (!nik || petani.nik.includes(nik)) &&
            (!kelompokTani || petani.kelompokTani?.toLowerCase().includes(kelompokTani.toLowerCase())) &&
            (statusAktif === undefined || petani.statusAktif === statusAktif) &&
            (!kabupaten || petani.kabupaten.toLowerCase().includes(kabupaten.toLowerCase()))
          );
        });
      }

      // Apply sorting
      if (request?.sort) {
        const { field, direction } = request.sort;
        filteredData.sort((a, b) => {
          const aValue = (a as any)[field];
          const bValue = (b as any)[field];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          return 0;
        });
      }

      // Apply pagination
      const total = filteredData.length;
      let paginatedData = filteredData;
      let page = 1;
      let limit = total;

      if (request?.pagination) {
        page = request.pagination.page;
        limit = request.pagination.limit;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedData = filteredData.slice(startIndex, endIndex);
      }

      return {
        success: true,
        message: 'Data petani berhasil diambil',
        data: paginatedData,
        total,
        page,
        limit
      };
    } catch (error) {
      throw new Error('Terjadi kesalahan saat mengambil data petani');
    }
  }

  // GET - Fetch single petani by ID
  async getPetaniById(id: string): Promise<PetaniApiResponse> {
    await delay(300 + Math.random() * 300); // 300-600ms delay

    if (shouldSimulateError()) {
      throw new Error('Gagal mengambil detail petani. Silakan coba lagi.');
    }

    const petani = this.data.find(p => p.id === id);
    
    if (!petani) {
      throw new Error('Data petani tidak ditemukan');
    }

    return {
      success: true,
      message: 'Detail petani berhasil diambil',
      data: [petani]
    };
  }

  // POST - Create new petani
  async createPetani(formData: PetaniFormData): Promise<PetaniApiResponse> {
    await delay(800 + Math.random() * 700); // 800-1500ms delay

    if (shouldSimulateError()) {
      throw new Error('Gagal menambahkan petani baru. Silakan coba lagi.');
    }

    try {
      // Check if NIK already exists
      const existingPetani = this.data.find(p => p.nik === formData.nik);
      if (existingPetani) {
        throw new Error('NIK sudah terdaftar dalam sistem');
      }

      // Generate new ID
      const newId = (Math.max(...this.data.map(p => parseInt(p.id))) + 1).toString();
      
      const newPetani: Petani = {
        ...formData,
        id: newId,
        tanggalDaftar: new Date().toISOString().split('T')[0]
      };

      this.data.push(newPetani);

      return {
        success: true,
        message: 'Data petani berhasil ditambahkan',
        data: [newPetani]
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Terjadi kesalahan saat menambahkan data petani');
    }
  }

  // PUT - Update existing petani
  async updatePetani(id: string, formData: PetaniFormData): Promise<PetaniApiResponse> {
    await delay(800 + Math.random() * 700); // 800-1500ms delay

    if (shouldSimulateError()) {
      throw new Error('Gagal mengupdate data petani. Silakan coba lagi.');
    }

    try {
      const index = this.data.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Data petani tidak ditemukan');
      }

      // Check if NIK already exists for other petani
      const existingPetani = this.data.find(p => p.nik === formData.nik && p.id !== id);
      if (existingPetani) {
        throw new Error('NIK sudah terdaftar untuk petani lain');
      }

      // Keep original registration date
      const originalTanggalDaftar = this.data[index].tanggalDaftar;
      
      const updatedPetani: Petani = {
        ...formData,
        id,
        tanggalDaftar: originalTanggalDaftar
      };

      this.data[index] = updatedPetani;

      return {
        success: true,
        message: 'Data petani berhasil diupdate',
        data: [updatedPetani]
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Terjadi kesalahan saat mengupdate data petani');
    }
  }

  // DELETE - Delete petani
  async deletePetani(id: string): Promise<PetaniApiResponse> {
    await delay(600 + Math.random() * 400); // 600-1000ms delay

    if (shouldSimulateError()) {
      throw new Error('Gagal menghapus data petani. Silakan coba lagi.');
    }

    try {
      const index = this.data.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Data petani tidak ditemukan');
      }

      const deletedPetani = this.data[index];
      this.data.splice(index, 1);

      return {
        success: true,
        message: 'Data petani berhasil dihapus',
        data: [deletedPetani]
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Terjadi kesalahan saat menghapus data petani');
    }
  }

  // GET - Get statistics
  async getPetaniStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalLahan: number;
    avgLahan: number;
    kelompokTaniCount: number;
  }> {
    await delay(200 + Math.random() * 200); // 200-400ms delay

    const total = this.data.length;
    const active = this.data.filter(p => p.statusAktif).length;
    const inactive = total - active;
    const totalLahan = this.data.reduce((sum, p) => sum + p.luasLahan, 0);
    const avgLahan = total > 0 ? totalLahan / total : 0;
    const kelompokTaniCount = new Set(this.data.map(p => p.kelompokTani).filter(k => k)).size;

    return {
      total,
      active,
      inactive,
      totalLahan: Math.round(totalLahan * 100) / 100,
      avgLahan: Math.round(avgLahan * 100) / 100,
      kelompokTaniCount
    };
  }
}

// Export singleton instance
export const petaniService = new PetaniService();
export default petaniService;
