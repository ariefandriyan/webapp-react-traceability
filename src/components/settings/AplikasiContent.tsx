import React, { useState, useEffect } from 'react';
import Toast from '../ui/Toast';

// Data Types
interface AppInfo {
  name: string;
  version: string;
  build: string;
  lastUpdate: string;
  developer: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  license: string;
  description: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'id' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    sound: boolean;
  };
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  timezone: string;
  autoSave: boolean;
  sessionTimeout: number; // in minutes
  maxFileSize: number; // in MB
}

const AplikasiContent: React.FC = () => {
  // State untuk modal dan form
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'support'>('info');

  // State untuk loading dan toast
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info'}>({
    show: false, message: '', type: 'success'
  });

  // Mock data aplikasi
  const [appInfo] = useState<AppInfo>({
    name: 'Tobacco Traceability System',
    version: '2.1.0',
    build: '2025.09.05.001',
    lastUpdate: '2025-09-05T10:30:00Z',
    developer: 'Universitas Brawijaya - Tim Pengembang Sistem',
    contact: {
      email: 'support@tobacco-system.ub.ac.id',
      phone: '+62 341 551611',
      website: 'https://tobacco-system.ub.ac.id'
    },
    license: 'Proprietary License - Universitas Brawijaya 2025',
    description: 'Sistem manajemen traceability tembakau untuk mendukung transparansi dan kualitas produksi tembakau di Indonesia.'
  });

  // State untuk pengaturan aplikasi
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'system',
    language: 'id',
    notifications: {
      email: true,
      push: true,
      sms: false,
      sound: true
    },
    dateFormat: 'dd/mm/yyyy',
    timezone: 'Asia/Jakarta',
    autoSave: true,
    sessionTimeout: 120,
    maxFileSize: 10
  });

  const [originalSettings, setOriginalSettings] = useState<AppSettings>(appSettings);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(appSettings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(hasChanges);
  }, [appSettings, originalSettings]);

  // Handle setting changes
  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: keyof AppSettings['notifications'], value: boolean) => {
    setAppSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
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

      // Apply theme change immediately
      if (appSettings.theme !== originalSettings.theme) {
        applyTheme(appSettings.theme);
      }

      setOriginalSettings(appSettings);
      setHasUnsavedChanges(false);
      setShowSaveModal(false);
      showToast('Pengaturan berhasil disimpan', 'success');
    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan pengaturan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setAppSettings(originalSettings);
    setHasUnsavedChanges(false);
    showToast('Perubahan dibatalkan', 'info');
  };

  // Apply theme
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.className = prefersDark ? 'dark' : '';
    } else {
      root.className = theme === 'dark' ? 'dark' : '';
    }
  };

  // Reset to defaults
  const handleResetToDefaults = () => {
    const defaultSettings: AppSettings = {
      theme: 'system',
      language: 'id',
      notifications: {
        email: true,
        push: true,
        sms: false,
        sound: true
      },
      dateFormat: 'dd/mm/yyyy',
      timezone: 'Asia/Jakarta',
      autoSave: true,
      sessionTimeout: 120,
      maxFileSize: 10
    };
    
    setAppSettings(defaultSettings);
    showToast('Pengaturan direset ke default', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSystemStatus = () => {
    const uptime = Math.floor(Math.random() * 720) + 24; // Mock uptime
    const memoryUsage = Math.floor(Math.random() * 30) + 40; // Mock memory usage
    const diskUsage = Math.floor(Math.random() * 20) + 60; // Mock disk usage
    
    return { uptime, memoryUsage, diskUsage };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">⚙️ Pengaturan Aplikasi</h1>
            <p className="text-indigo-100">
              Kelola informasi aplikasi dan pengaturan umum sistem
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
                  className="px-3 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-semibold"
                >
                  💾 Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: '📊 Informasi Aplikasi', icon: '📊' },
              { id: 'settings', label: '⚙️ Pengaturan Umum', icon: '⚙️' },
              { id: 'support', label: '🆘 Dukungan & Bantuan', icon: '🆘' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab: Informasi Aplikasi */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* App Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">🚀</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Informasi Dasar
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nama Aplikasi:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{appInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Versi:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">v{appInfo.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Build:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{appInfo.build}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Update Terakhir:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(appInfo.lastUpdate)}</span>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">💻</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Status Sistem
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{systemStatus.uptime} jam</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Memory Usage:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{systemStatus.memoryUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${systemStatus.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{systemStatus.diskUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${systemStatus.diskUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Info */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">👨‍💻</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Informasi Pengembang
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Dikembangkan oleh:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{appInfo.developer}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{appInfo.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Lisensi:</p>
                    <p className="text-sm text-gray-900 dark:text-white">{appInfo.license}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Pengaturan Umum */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Appearance Settings */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Tampilan & Tema
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🌓 Tema Aplikasi
                    </label>
                    <select
                      value={appSettings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="light">☀️ Terang</option>
                      <option value="dark">🌙 Gelap</option>
                      <option value="system">🖥️ Mengikuti Sistem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🌐 Bahasa
                    </label>
                    <select
                      value={appSettings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="id">🇮🇩 Bahasa Indonesia</option>
                      <option value="en">🇺🇸 English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">🔔</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Notifikasi
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'email', label: '📧 Email Notifikasi', desc: 'Terima notifikasi melalui email' },
                    { key: 'push', label: '📱 Push Notifikasi', desc: 'Notifikasi browser dan aplikasi' },
                    { key: 'sms', label: '💬 SMS Notifikasi', desc: 'Notifikasi melalui pesan SMS' },
                    { key: 'sound', label: '🔊 Suara Notifikasi', desc: 'Mainkan suara saat ada notifikasi' }
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{notif.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{notif.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appSettings.notifications[notif.key as keyof typeof appSettings.notifications]}
                          onChange={(e) => handleNotificationChange(notif.key as keyof typeof appSettings.notifications, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          appSettings.notifications[notif.key as keyof typeof appSettings.notifications]
                            ? 'bg-indigo-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            appSettings.notifications[notif.key as keyof typeof appSettings.notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          } mt-0.5`} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">⚙️</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Pengaturan Sistem
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📅 Format Tanggal
                    </label>
                    <select
                      value={appSettings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🕒 Zona Waktu
                    </label>
                    <select
                      value={appSettings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Asia/Jakarta">WIB (Jakarta)</option>
                      <option value="Asia/Makassar">WITA (Makassar)</option>
                      <option value="Asia/Jayapura">WIT (Jayapura)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ⏱️ Session Timeout (menit)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="480"
                      value={appSettings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📎 Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={appSettings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">💾 Auto Save</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Simpan otomatis perubahan data</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appSettings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        appSettings.autoSave ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          appSettings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                        } mt-0.5`} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleResetToDefaults}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  🔄 Reset ke Default
                </button>
                
                <div className="flex space-x-3">
                  {hasUnsavedChanges && (
                    <button
                      onClick={handleDiscardChanges}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                    >
                      ❌ Batalkan
                    </button>
                  )}
                  <button
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💾 Simpan Pengaturan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Dukungan & Bantuan */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">📞</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Kontak Dukungan
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📧</span>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Email:</div>
                        <a 
                          href={`mailto:${appInfo.contact.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {appInfo.contact.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📱</span>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Telepon:</div>
                        <a 
                          href={`tel:${appInfo.contact.phone}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {appInfo.contact.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🌐</span>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Website:</div>
                        <a 
                          href={appInfo.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {appInfo.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">🕒</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Jam Operasional
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Senin - Jumat:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">08:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sabtu:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">08:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Minggu:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">Tutup</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      * Waktu Indonesia Barat (WIB)
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Resources */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">📚</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sumber Bantuan
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: '📖', title: 'User Manual', desc: 'Panduan lengkap penggunaan aplikasi', action: 'Download Manual' },
                    { icon: '🎥', title: 'Video Tutorial', desc: 'Tutorial video step-by-step', action: 'Tonton Video' },
                    { icon: '❓', title: 'FAQ', desc: 'Pertanyaan yang sering diajukan', action: 'Lihat FAQ' }
                  ].map((item) => (
                    <div key={item.title} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.desc}</p>
                      <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors duration-200">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🔧</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Informasi Teknis
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Browser:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{navigator.userAgent.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{navigator.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Screen Resolution:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{screen.width}x{screen.height}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Local Time:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Language:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{navigator.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Online Status:</span>
                      <span className={`font-semibold ${navigator.onLine ? 'text-green-600' : 'text-red-600'}`}>
                        {navigator.onLine ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Simpan */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💾</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Konfirmasi Simpan Pengaturan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pengaturan akan diterapkan segera
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Apakah Anda yakin ingin menyimpan perubahan pengaturan aplikasi?
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Perubahan akan mempengaruhi:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Tampilan dan tema aplikasi</li>
                      <li>Pengaturan notifikasi</li>
                      <li>Format tanggal dan zona waktu</li>
                      <li>Pengaturan sistem lainnya</li>
                    </ul>
                  </div>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AplikasiContent;
