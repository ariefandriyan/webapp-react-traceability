import React from 'react';
import DashboardContent from '../dashboard/DashboardContent';
import PetaniPage from '../../pages/master-data/PetaniPage';
import KelompokTaniPage from '../../pages/master-data/KelompokTaniPage';
import VarietasPage from '../../pages/master-data/VarietasPage';
import LahanPetaPage from '../../pages/LahanPetaPage';
import FaseTanamPage from '../../pages/FaseTanamPage';
import AksesibilitasJalanPage from '../../pages/AksesibilitasJalanPage';
import PestisidaContent from '../pestisida/PestisidaContent';
import PendaftaranPetaniContent from '../approval/PendaftaranPetaniContent';
import AktivitasTanamApprovalContent from '../activities/AktivitasTanamApprovalContent';
import ManajemenTanamContent from '../activities/ManajemenTanamContent';
import UpdateFaseTanamContent from '../activities/UpdateFaseTanamContent';
import UpdatePestisidaContent from '../activities/UpdatePestisidaContent';
import KalenderTanamContent from '../activities/KalenderTanamContent';

interface ContentRendererProps {
  activeMenuItem: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ activeMenuItem }) => {
  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <DashboardContent />;
      
      case 'petani':
        return <PetaniPage />;
      
      case 'kelompok-tani':
        return <KelompokTaniPage />;
      
      case 'lahan':
        return <LahanPetaPage />;
      
      case 'varietas':
        return <VarietasPage />;
      
      case 'fase-tanam':
        return <FaseTanamPage />;
      
      case 'aksesibilitas-lahan':
        return <AksesibilitasJalanPage />;
      
      case 'pestisida':
        return <PestisidaContent />;
      
      case 'hama-penyakit':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hama & Penyakit</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman hama & penyakit akan segera tersedia</p>
          </div>
        );
      
      case 'pendaftaran-petani':
        return <PendaftaranPetaniContent />;
      
      case 'aktivitas-tanam-approval':
        return <AktivitasTanamApprovalContent />;

      case 'manajemen-tanam':
      case 'daftar-tanam':
      case 'tambah-tanam-baru':
        return <ManajemenTanamContent />;
      
      case 'update-fase-tanam':
        return <UpdateFaseTanamContent />;
      
      case 'update-pestisida':
        return <UpdatePestisidaContent />;
      
      case 'update-penyakit':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Data Penyakit Tanaman</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman update penyakit akan segera tersedia</p>
          </div>
        );
      
      case 'kalender-tanam':
        return <KalenderTanamContent />;
      
      case 'laporan':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Laporan</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman laporan akan segera tersedia</p>
          </div>
        );
      
      case 'pengguna':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pengaturan Pengguna</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman pengaturan pengguna akan segera tersedia</p>
          </div>
        );
      
      case 'hak-akses':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pengaturan Hak Akses</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman pengaturan hak akses akan segera tersedia</p>
          </div>
        );
      
      case 'aplikasi':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pengaturan Aplikasi</h2>
            <p className="text-gray-600 dark:text-gray-400">Halaman pengaturan aplikasi akan segera tersedia</p>
          </div>
        );
      
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default ContentRenderer;
