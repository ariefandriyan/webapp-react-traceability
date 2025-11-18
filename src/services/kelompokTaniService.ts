import kelompokTaniApiService from './kelompokTaniApiService';
import { KelompokTani } from '../types/kelompokTani';

const kelompokTaniService = {
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
    return await kelompokTaniApiService.getAllKelompokTani(params);
  },

  async getKelompokTaniById(id: string) {
    return await kelompokTaniApiService.getKelompokTaniById(id);
  },

  async createKelompokTani(data: Partial<KelompokTani>) {
    return await kelompokTaniApiService.createKelompokTani(data);
  },

  async updateKelompokTani(id: string, data: Partial<KelompokTani>) {
    return await kelompokTaniApiService.updateKelompokTani(id, data);
  },

  async deleteKelompokTani(id: string) {
    return await kelompokTaniApiService.deleteKelompokTani(id);
  },

  async getStats() {
    return await kelompokTaniApiService.getKelompokTaniStats();
  }
};

export default kelompokTaniService;
