import React, { useState, useMemo } from 'react';
import Toast from '../ui/Toast';

// Data Types
interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'master-data' | 'activities' | 'reports' | 'settings' | 'approval';
  icon: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  permissions: string[];
}

interface PermissionCategory {
  id: string;
  name: string;
  icon: string;
  permissions: Permission[];
}

const HakAksesContent: React.FC = () => {
  // State untuk modal dan form
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{[roleId: string]: string[]}>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State untuk tree view
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['dashboard', 'master-data']);

  // State untuk loading dan toast
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info'}>({
    show: false, message: '', type: 'success'
  });

  // Mock data permissions
  const [permissions] = useState<Permission[]>([
    // Dashboard
    { id: 'dashboard_view', name: 'Lihat Dashboard', description: 'Akses ke halaman dashboard utama', category: 'dashboard', icon: '📊' },
    { id: 'dashboard_analytics', name: 'Lihat Analytics', description: 'Akses ke fitur analytics dan statistik', category: 'dashboard', icon: '📈' },
    
    // Master Data
    { id: 'petani_view', name: 'Lihat Data Petani', description: 'Melihat daftar dan detail petani', category: 'master-data', icon: '👥' },
    { id: 'petani_create', name: 'Tambah Data Petani', description: 'Menambah data petani baru', category: 'master-data', icon: '➕' },
    { id: 'petani_edit', name: 'Edit Data Petani', description: 'Mengubah data petani yang ada', category: 'master-data', icon: '✏️' },
    { id: 'petani_delete', name: 'Hapus Data Petani', description: 'Menghapus data petani', category: 'master-data', icon: '🗑️' },
    
    { id: 'lahan_view', name: 'Lihat Data Lahan', description: 'Melihat daftar dan detail lahan', category: 'master-data', icon: '🌾' },
    { id: 'lahan_create', name: 'Tambah Data Lahan', description: 'Menambah data lahan baru', category: 'master-data', icon: '➕' },
    { id: 'lahan_edit', name: 'Edit Data Lahan', description: 'Mengubah data lahan yang ada', category: 'master-data', icon: '✏️' },
    { id: 'lahan_delete', name: 'Hapus Data Lahan', description: 'Menghapus data lahan', category: 'master-data', icon: '🗑️' },
    
    { id: 'varietas_view', name: 'Lihat Data Varietas', description: 'Melihat daftar varietas tembakau', category: 'master-data', icon: '🌱' },
    { id: 'varietas_manage', name: 'Kelola Data Varietas', description: 'Mengelola data varietas tembakau', category: 'master-data', icon: '⚙️' },
    
    { id: 'pestisida_view', name: 'Lihat Data Pestisida', description: 'Melihat daftar pestisida', category: 'master-data', icon: '🧪' },
    { id: 'pestisida_manage', name: 'Kelola Data Pestisida', description: 'Mengelola data pestisida', category: 'master-data', icon: '⚙️' },
    
    // Activities
    { id: 'tanam_view', name: 'Lihat Aktivitas Tanam', description: 'Melihat daftar aktivitas tanam', category: 'activities', icon: '🌿' },
    { id: 'tanam_create', name: 'Input Aktivitas Tanam', description: 'Menambah data tanam baru', category: 'activities', icon: '📝' },
    { id: 'tanam_edit', name: 'Edit Aktivitas Tanam', description: 'Mengubah data tanam yang ada', category: 'activities', icon: '✏️' },
    { id: 'tanam_delete', name: 'Hapus Aktivitas Tanam', description: 'Menghapus data tanam', category: 'activities', icon: '🗑️' },
    
    { id: 'fase_view', name: 'Lihat Update Fase', description: 'Melihat update fase tanam', category: 'activities', icon: '🔄' },
    { id: 'fase_update', name: 'Update Fase Tanam', description: 'Mengupdate fase tanam petani', category: 'activities', icon: '📊' },
    
    { id: 'pestisida_usage_view', name: 'Lihat Penggunaan Pestisida', description: 'Melihat riwayat penggunaan pestisida', category: 'activities', icon: '💉' },
    { id: 'pestisida_usage_create', name: 'Input Penggunaan Pestisida', description: 'Mencatat penggunaan pestisida', category: 'activities', icon: '📝' },
    
    { id: 'kalender_view', name: 'Lihat Kalender Tanam', description: 'Akses ke kalender aktivitas tanam', category: 'activities', icon: '📅' },
    
    // Reports
    { id: 'laporan_view', name: 'Lihat Laporan', description: 'Akses ke halaman laporan', category: 'reports', icon: '📋' },
    { id: 'laporan_export', name: 'Export Laporan', description: 'Mengunduh laporan dalam format CSV/PDF', category: 'reports', icon: '💾' },
    { id: 'laporan_advanced', name: 'Laporan Lanjutan', description: 'Akses ke fitur laporan lanjutan', category: 'reports', icon: '📊' },
    
    // Approval
    { id: 'approval_petani', name: 'Approval Pendaftaran Petani', description: 'Menyetujui pendaftaran petani baru', category: 'approval', icon: '✅' },
    { id: 'approval_tanam', name: 'Approval Aktivitas Tanam', description: 'Menyetujui aktivitas tanam petani', category: 'approval', icon: '✅' },
    { id: 'approval_fase', name: 'Approval Update Fase', description: 'Menyetujui update fase tanam', category: 'approval', icon: '✅' },
    
    // Settings
    { id: 'users_view', name: 'Lihat Data Pengguna', description: 'Melihat daftar pengguna sistem', category: 'settings', icon: '👤' },
    { id: 'users_create', name: 'Tambah Pengguna', description: 'Menambah pengguna baru', category: 'settings', icon: '➕' },
    { id: 'users_edit', name: 'Edit Pengguna', description: 'Mengubah data pengguna', category: 'settings', icon: '✏️' },
    { id: 'users_delete', name: 'Hapus Pengguna', description: 'Menghapus pengguna sistem', category: 'settings', icon: '🗑️' },
    
    { id: 'permissions_view', name: 'Lihat Hak Akses', description: 'Melihat pengaturan hak akses', category: 'settings', icon: '🔐' },
    { id: 'permissions_edit', name: 'Edit Hak Akses', description: 'Mengubah pengaturan hak akses', category: 'settings', icon: '⚙️' },
    
    { id: 'app_settings', name: 'Pengaturan Aplikasi', description: 'Mengubah pengaturan aplikasi', category: 'settings', icon: '⚙️' }
  ]);

  // Mock data roles dengan permissions
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrator',
      description: 'Akses penuh ke seluruh sistem dengan hak kelola pengguna dan pengaturan',
      icon: '👑',
      color: 'from-red-600 to-pink-600',
      permissions: [
        'dashboard_view', 'dashboard_analytics',
        'petani_view', 'petani_create', 'petani_edit', 'petani_delete',
        'lahan_view', 'lahan_create', 'lahan_edit', 'lahan_delete',
        'varietas_view', 'varietas_manage',
        'pestisida_view', 'pestisida_manage',
        'tanam_view', 'tanam_create', 'tanam_edit', 'tanam_delete',
        'fase_view', 'fase_update',
        'pestisida_usage_view', 'pestisida_usage_create',
        'kalender_view',
        'laporan_view', 'laporan_export', 'laporan_advanced',
        'approval_petani', 'approval_tanam', 'approval_fase',
        'users_view', 'users_create', 'users_edit', 'users_delete',
        'permissions_view', 'permissions_edit',
        'app_settings'
      ]
    },
    {
      id: 'operator',
      name: 'operator',
      displayName: 'Operator',
      description: 'Mengelola data petani, aktivitas tanam, dan melakukan entry data operasional',
      icon: '⚙️',
      color: 'from-blue-600 to-cyan-600',
      permissions: [
        'dashboard_view',
        'petani_view', 'petani_create', 'petani_edit',
        'lahan_view', 'lahan_create', 'lahan_edit',
        'varietas_view',
        'pestisida_view',
        'tanam_view', 'tanam_create', 'tanam_edit',
        'fase_view', 'fase_update',
        'pestisida_usage_view', 'pestisida_usage_create',
        'kalender_view',
        'laporan_view', 'laporan_export'
      ]
    },
    {
      id: 'petani',
      name: 'petani',
      displayName: 'Petani',
      description: 'Akses terbatas untuk melihat data dan aktivitas tanam milik sendiri',
      icon: '🌱',
      color: 'from-green-600 to-emerald-600',
      permissions: [
        'dashboard_view',
        'petani_view',
        'lahan_view',
        'varietas_view',
        'pestisida_view',
        'tanam_view',
        'fase_view',
        'pestisida_usage_view',
        'kalender_view',
        'laporan_view'
      ]
    }
  ]);

  // Group permissions by category
  const permissionCategories: PermissionCategory[] = useMemo(() => {
    const categories = [
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'master-data', name: 'Master Data', icon: '📋' },
      { id: 'activities', name: 'Aktivitas Tanam', icon: '🌿' },
      { id: 'reports', name: 'Laporan', icon: '📈' },
      { id: 'approval', name: 'Approval', icon: '✅' },
      { id: 'settings', name: 'Pengaturan', icon: '⚙️' }
    ];

    return categories.map(cat => ({
      ...cat,
      permissions: permissions.filter(p => p.category === cat.id)
    }));
  }, [permissions]);

  // Get effective permissions for a role (including pending changes)
  const getEffectivePermissions = (roleId: string): string[] => {
    if (pendingChanges[roleId]) {
      return pendingChanges[roleId];
    }
    const role = roles.find(r => r.id === roleId);
    return role ? role.permissions : [];
  };

  // Handle permission toggle
  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    const currentPerms = getEffectivePermissions(roleId);
    const hasPermission = currentPerms.includes(permissionId);
    
    let newPermissions: string[];
    if (hasPermission) {
      newPermissions = currentPerms.filter(p => p !== permissionId);
    } else {
      newPermissions = [...currentPerms, permissionId];
    }

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions
    }));
    setHasUnsavedChanges(true);
  };

  // Handle bulk role permissions
  const handleSelectAllCategory = (roleId: string, categoryId: string, selectAll: boolean) => {
    const categoryPermissions = permissions
      .filter(p => p.category === categoryId)
      .map(p => p.id);
    
    const currentPerms = getEffectivePermissions(roleId);
    let newPermissions: string[];
    
    if (selectAll) {
      // Add all category permissions
      const existingNonCategoryPerms = currentPerms.filter(p => 
        !categoryPermissions.includes(p)
      );
      newPermissions = [...existingNonCategoryPerms, ...categoryPermissions];
    } else {
      // Remove all category permissions
      newPermissions = currentPerms.filter(p => !categoryPermissions.includes(p));
    }

    setPendingChanges(prev => ({
      ...prev,
      [roleId]: newPermissions
    }));
    setHasUnsavedChanges(true);
  };

  // Handle tree view category toggle
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Check if all permissions in category are selected
  const isCategoryFullySelected = (roleId: string, categoryId: string): boolean => {
    const categoryPermissions = permissions
      .filter(p => p.category === categoryId)
      .map(p => p.id);
    const currentPerms = getEffectivePermissions(roleId);
    
    return categoryPermissions.every(p => currentPerms.includes(p));
  };

  // Check if some permissions in category are selected
  const isCategoryPartiallySelected = (roleId: string, categoryId: string): boolean => {
    const categoryPermissions = permissions
      .filter(p => p.category === categoryId)
      .map(p => p.id);
    const currentPerms = getEffectivePermissions(roleId);
    
    const selectedCount = categoryPermissions.filter(p => currentPerms.includes(p)).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (!hasUnsavedChanges) {
      showToast('Tidak ada perubahan untuk disimpan', 'info');
      return;
    }
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setRoles(prev => prev.map(role => {
        if (pendingChanges[role.id]) {
          return {
            ...role,
            permissions: pendingChanges[role.id]
          };
        }
        return role;
      }));

      setPendingChanges({});
      setHasUnsavedChanges(false);
      setShowSaveModal(false);
      showToast('Hak akses berhasil disimpan', 'success');
    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan perubahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setPendingChanges({});
    setHasUnsavedChanges(false);
    showToast('Perubahan dibatalkan', 'info');
  };

  // Reset specific role permissions
  const handleResetRole = (roleId: string) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[roleId];
      return newChanges;
    });
    
    if (Object.keys(pendingChanges).length <= 1) {
      setHasUnsavedChanges(false);
    }
    
    showToast('Perubahan peran dibatalkan', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const getPermissionCount = (roleId: string): {total: number, selected: number} => {
    const currentPerms = getEffectivePermissions(roleId);
    return {
      total: permissions.length,
      selected: currentPerms.length
    };
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🔐 Pengaturan Hak Akses</h1>
            <p className="text-purple-100">
              Kelola hak akses dan permissions untuk setiap peran pengguna
            </p>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-3">
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                ⚠️ Ada perubahan belum disimpan
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleDiscardChanges}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-200 text-sm"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-3 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-semibold"
                >
                  💾 Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const permCount = getPermissionCount(role.id);
          const hasChanges = pendingChanges[role.id] !== undefined;
          
          return (
            <div
              key={role.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                hasChanges 
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className={`bg-gradient-to-r ${role.color} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <h3 className="font-bold">{role.displayName}</h3>
                    <p className="text-sm opacity-90">{role.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {role.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hak Akses
                    </span>
                    <span className={`text-sm font-semibold ${
                      hasChanges ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {permCount.selected} / {permCount.total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${role.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(permCount.selected / permCount.total) * 100}%` }}
                    />
                  </div>
                  
                  {hasChanges && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800">
                      <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                        🔄 Perubahan tertunda
                      </span>
                      <button
                        onClick={() => handleResetRole(role.id)}
                        className="text-xs text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Tree Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🌳 Tree View Hak Akses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Struktur hierarkis permissions dengan kontrol untuk setiap peran. Expand/collapse kategori untuk navigasi yang lebih mudah.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setExpandedCategories(permissionCategories.map(c => c.id))}
                className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 rounded-lg transition-colors duration-200 text-sm"
              >
                📂 Expand All
              </button>
              <button
                onClick={() => setExpandedCategories([])}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors duration-200 text-sm"
              >
                📁 Collapse All
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Role Headers */}
          <div className="grid grid-cols-12 gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                📋 Permissions Tree
              </h3>
            </div>
            {roles.map((role) => (
              <div key={role.id} className="col-span-2 text-center">
                <div className={`bg-gradient-to-r ${role.color} text-white rounded-lg p-3 shadow-sm`}>
                  <div className="text-lg mb-1">{role.icon}</div>
                  <div className="text-sm font-semibold">{role.displayName}</div>
                  <div className="text-xs opacity-80">
                    {getPermissionCount(role.id).selected}/{getPermissionCount(role.id).total}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tree Structure */}
          <div className="space-y-2">
            {permissionCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Category Node */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                          >
                            {isExpanded ? '📂' : '📁'}
                          </button>
                          <span className="text-xl">{category.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {category.permissions.length} permissions
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Category Level Controls */}
                      {roles.map((role) => {
                        const isFullySelected = isCategoryFullySelected(role.id, category.id);
                        const isPartiallySelected = isCategoryPartiallySelected(role.id, category.id);
                        
                        return (
                          <div key={`${category.id}-${role.id}`} className="col-span-2 flex justify-center">
                            <button
                              onClick={() => handleSelectAllCategory(role.id, category.id, !isFullySelected)}
                              className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center font-semibold ${
                                isFullySelected 
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                                  : isPartiallySelected
                                  ? 'bg-yellow-500 border-yellow-500 text-white shadow-md'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                              }`}
                              title={isFullySelected ? 'Unselect all' : 'Select all'}
                            >
                              {isFullySelected ? '✓' : isPartiallySelected ? '◐' : '○'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Permissions - Collapsible */}
                  {isExpanded && (
                    <div className="bg-white dark:bg-gray-800">
                      {category.permissions.map((permission, index) => (
                        <div 
                          key={permission.id} 
                          className={`grid grid-cols-12 gap-4 items-center py-3 px-4 ${
                            index !== category.permissions.length - 1 
                              ? 'border-b border-gray-100 dark:border-gray-700' 
                              : ''
                          } hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200`}
                        >
                          <div className="col-span-6">
                            <div className="flex items-center space-x-3 ml-9">
                              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mr-2"></div>
                              <span className="text-base">{permission.icon}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {permission.description}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Permission Level Controls */}
                          {roles.map((role) => {
                            const hasPermission = getEffectivePermissions(role.id).includes(permission.id);
                            
                            return (
                              <div key={`${permission.id}-${role.id}`} className="col-span-2 flex justify-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={hasPermission}
                                    onChange={() => handlePermissionToggle(role.id, permission.id)}
                                    className="sr-only"
                                  />
                                  <div className={`w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${
                                    hasPermission 
                                      ? 'bg-emerald-500' 
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
                                      hasPermission ? 'translate-x-6' : 'translate-x-0.5'
                                    } mt-0.5 border border-gray-200`} />
                                  </div>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const permCount = getPermissionCount(role.id);
                const percentage = Math.round((permCount.selected / permCount.total) * 100);
                
                return (
                  <div key={role.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-lg">{role.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {role.displayName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {permCount.selected} dari {permCount.total} permissions
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Coverage</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${role.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Perubahan Belum Disimpan
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Anda memiliki perubahan hak akses yang belum disimpan. Simpan perubahan atau batalkan.
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
              >
                ❌ Batalkan
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
              >
                💾 Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Simpan */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💾</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Konfirmasi Simpan Perubahan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Perubahan akan diterapkan segera
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Apakah Anda yakin ingin menyimpan perubahan hak akses?
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Peran yang akan berubah:
                  </div>
                  {Object.keys(pendingChanges).map(roleId => {
                    const role = roles.find(r => r.id === roleId);
                    if (!role) return null;
                    return (
                      <div key={roleId} className="flex items-center space-x-2 text-sm">
                        <span>{role.icon}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {role.displayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmSave}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Menyimpan...' : '💾 Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default HakAksesContent;
