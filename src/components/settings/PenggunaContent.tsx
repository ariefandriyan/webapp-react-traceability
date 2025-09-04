import React, { useState, useMemo } from 'react';
import Toast from '../ui/Toast';

// Data Types
interface User {
  id: string;
  nama: string;
  email: string;
  username: string;
  peran: 'admin' | 'operator' | 'petani';
  status: 'active' | 'inactive';
  telepon?: string;
  alamat?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface UserForm {
  nama: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  peran: 'admin' | 'operator' | 'petani';
  status: 'active' | 'inactive';
  telepon: string;
  alamat: string;
}

type SortField = 'nama' | 'email' | 'peran' | 'status' | 'lastLogin' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const PenggunaContent: React.FC = () => {
  // State untuk modal dan form
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // State untuk form
  const [userForm, setUserForm] = useState<UserForm>({
    nama: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    peran: 'operator',
    status: 'active',
    telepon: '',
    alamat: ''
  });

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeran, setFilterPeran] = useState<'all' | 'admin' | 'operator' | 'petani'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // State untuk sorting
  const [sortField, setSortField] = useState<SortField>('nama');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State untuk loading dan toast
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info'}>({
    show: false, message: '', type: 'success'
  });

  // Mock data pengguna
  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR001',
      nama: 'Admin Super',
      email: 'admin@tobacco-system.com',
      username: 'admin',
      peran: 'admin',
      status: 'active',
      telepon: '081234567890',
      alamat: 'Jl. Admin No. 1, Malang',
      lastLogin: '2025-09-05T08:30:00Z',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-09-05T08:30:00Z',
      createdBy: 'system'
    },
    {
      id: 'USR002',
      nama: 'Operator Satu',
      email: 'operator1@tobacco-system.com',
      username: 'operator1',
      peran: 'operator',
      status: 'active',
      telepon: '081234567891',
      alamat: 'Jl. Operator No. 2, Malang',
      lastLogin: '2025-09-04T16:45:00Z',
      createdAt: '2025-02-01T00:00:00Z',
      updatedAt: '2025-09-04T16:45:00Z',
      createdBy: 'USR001'
    },
    {
      id: 'USR003',
      nama: 'Operator Dua',
      email: 'operator2@tobacco-system.com',
      username: 'operator2',
      peran: 'operator',
      status: 'active',
      telepon: '081234567892',
      alamat: 'Jl. Operator No. 3, Malang',
      lastLogin: '2025-09-03T10:20:00Z',
      createdAt: '2025-02-15T00:00:00Z',
      updatedAt: '2025-09-03T10:20:00Z',
      createdBy: 'USR001'
    },
    {
      id: 'USR004',
      nama: 'Budi Santoso',
      email: 'budi.santoso@petani.com',
      username: 'budi_petani',
      peran: 'petani',
      status: 'active',
      telepon: '081234567893',
      alamat: 'Jl. Raya No. 123, Desa Sumberejo',
      lastLogin: '2025-09-02T14:15:00Z',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-09-02T14:15:00Z',
      createdBy: 'USR002'
    },
    {
      id: 'USR005',
      nama: 'Siti Aminah',
      email: 'siti.aminah@petani.com',
      username: 'siti_petani',
      peran: 'petani',
      status: 'active',
      telepon: '081234567894',
      alamat: 'Jl. Melati No. 45, Desa Tumpang',
      lastLogin: '2025-09-01T09:30:00Z',
      createdAt: '2025-03-15T00:00:00Z',
      updatedAt: '2025-09-01T09:30:00Z',
      createdBy: 'USR002'
    },
    {
      id: 'USR006',
      nama: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@petani.com',
      username: 'ahmad_petani',
      peran: 'petani',
      status: 'inactive',
      telepon: '081234567895',
      alamat: 'Jl. Kenanga No. 67, Desa Dampit',
      lastLogin: '2025-08-28T11:45:00Z',
      createdAt: '2025-04-01T00:00:00Z',
      updatedAt: '2025-08-30T15:20:00Z',
      createdBy: 'USR003'
    },
    {
      id: 'USR007',
      nama: 'Operator Tiga',
      email: 'operator3@tobacco-system.com',
      username: 'operator3',
      peran: 'operator',
      status: 'inactive',
      telepon: '081234567896',
      alamat: 'Jl. Operator No. 4, Malang',
      lastLogin: '2025-08-20T13:10:00Z',
      createdAt: '2025-05-01T00:00:00Z',
      updatedAt: '2025-08-25T09:30:00Z',
      createdBy: 'USR001'
    }
  ]);

  // Filter dan sorting data
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Filter berdasarkan pencarian
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        user.nama.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower);

      // Filter berdasarkan peran
      const matchesPeran = filterPeran === 'all' || user.peran === filterPeran;
      
      // Filter berdasarkan status
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

      return matchesSearch && matchesPeran && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'nama':
          aValue = a.nama;
          bValue = b.nama;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'peran':
          aValue = a.peran;
          bValue = b.peran;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'lastLogin':
          aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.nama;
          bValue = b.nama;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, filterPeran, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form validation
  const validateForm = () => {
    if (!userForm.nama.trim()) {
      showToast('Nama harus diisi', 'error');
      return false;
    }
    if (!userForm.email.trim()) {
      showToast('Email harus diisi', 'error');
      return false;
    }
    if (!userForm.username.trim()) {
      showToast('Username harus diisi', 'error');
      return false;
    }
    if (modalMode === 'add' && !userForm.password.trim()) {
      showToast('Password harus diisi', 'error');
      return false;
    }
    if (modalMode === 'add' && userForm.password !== userForm.confirmPassword) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return false;
    }
    
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      showToast('Format email tidak valid', 'error');
      return false;
    }

    // Validasi username unik
    const existingUser = users.find(u => 
      u.username === userForm.username && 
      (modalMode === 'add' || u.id !== selectedUser?.id)
    );
    if (existingUser) {
      showToast('Username sudah digunakan', 'error');
      return false;
    }

    // Validasi email unik
    const existingEmail = users.find(u => 
      u.email === userForm.email && 
      (modalMode === 'add' || u.id !== selectedUser?.id)
    );
    if (existingEmail) {
      showToast('Email sudah digunakan', 'error');
      return false;
    }

    return true;
  };

  // Modal handlers
  const handleAddUser = () => {
    setModalMode('add');
    setSelectedUser(null);
    setUserForm({
      nama: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      peran: 'operator',
      status: 'active',
      telepon: '',
      alamat: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setUserForm({
      nama: user.nama,
      email: user.email,
      username: user.username,
      password: '',
      confirmPassword: '',
      peran: user.peran,
      status: user.status,
      telepon: user.telepon || '',
      alamat: user.alamat || ''
    });
    setShowModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setUserForm({
      nama: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      peran: 'operator',
      status: 'active',
      telepon: '',
      alamat: ''
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // CRUD operations
  const handleSubmitUser = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (modalMode === 'add') {
        const newUser: User = {
          id: `USR${String(users.length + 1).padStart(3, '0')}`,
          nama: userForm.nama.trim(),
          email: userForm.email.trim(),
          username: userForm.username.trim(),
          peran: userForm.peran,
          status: userForm.status,
          telepon: userForm.telepon.trim(),
          alamat: userForm.alamat.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'current_user'
        };

        setUsers(prev => [...prev, newUser]);
        showToast('Pengguna berhasil ditambahkan', 'success');
      } else {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser?.id 
            ? {
                ...user,
                nama: userForm.nama.trim(),
                email: userForm.email.trim(),
                username: userForm.username.trim(),
                peran: userForm.peran,
                status: userForm.status,
                telepon: userForm.telepon.trim(),
                alamat: userForm.alamat.trim(),
                updatedAt: new Date().toISOString()
              }
            : user
        ));
        showToast('Pengguna berhasil diperbarui', 'success');
      }

      handleCloseModal();
    } catch (error) {
      showToast('Terjadi kesalahan saat menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      showToast('Pengguna berhasil dihapus', 'success');
      handleCloseDeleteModal();
    } catch (error) {
      showToast('Terjadi kesalahan saat menghapus data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterPeran('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // Badge components
  const getPeranBadge = (peran: string) => {
    const badges = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      operator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      petani: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };

    const icons = {
      admin: '👑',
      operator: '⚙️',
      petani: '🌱'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badges[peran as keyof typeof badges]}`}>
        {icons[peran as keyof typeof icons]} {peran.charAt(0).toUpperCase() + peran.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };

    const icons = {
      active: '✅',
      inactive: '❌'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badges[status as keyof typeof badges]}`}>
        {icons[status as keyof typeof icons]} {status === 'active' ? 'Aktif' : 'Non-aktif'}
      </span>
    );
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ show: true, message, type });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">👥 Master Data Pengguna</h1>
        <p className="text-emerald-100">
          Kelola pengguna sistem dengan peran admin, operator, dan petani
        </p>
      </div>

      {/* Filter dan Kontrol */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Pencarian
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, email, username..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              👤 Peran
            </label>
            <select
              value={filterPeran}
              onChange={(e) => setFilterPeran(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Peran</option>
              <option value="admin">👑 Admin</option>
              <option value="operator">⚙️ Operator</option>
              <option value="petani">🌱 Petani</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">✅ Aktif</option>
              <option value="inactive">❌ Non-aktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📈 Total Data
            </label>
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 font-semibold">
              {filteredAndSortedUsers.length} pengguna
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
            >
              🔄 Reset Filter
            </button>
          </div>

          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
          >
            ➕ Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('nama')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nama Pengguna</span>
                    {sortField === 'nama' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email & Username</span>
                    {sortField === 'email' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('peran')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Peran</span>
                    {sortField === 'peran' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === 'status' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Kontak
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Login Terakhir</span>
                    {sortField === 'lastLogin' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">👥</span>
                      <span>Tidak ada data pengguna yang ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.nama}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          ID: {user.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-gray-900 dark:text-white">
                          {user.email}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getPeranBadge(user.peran)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        {user.telepon && (
                          <div className="text-gray-900 dark:text-white">
                            📞 {user.telepon}
                          </div>
                        )}
                        {user.alamat && (
                          <div className="text-gray-500 dark:text-gray-400">
                            📍 {user.alamat.length > 30 ? user.alamat.substring(0, 30) + '...' : user.alamat}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.lastLogin ? formatDateTime(user.lastLogin) : 'Belum pernah login'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded text-xs transition-colors duration-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded text-xs transition-colors duration-200"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tampilkan
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  per halaman
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ⟪
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    ⟫
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit Pengguna */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {modalMode === 'add' ? '➕ Tambah Pengguna Baru' : '✏️ Edit Pengguna'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.nama}
                    onChange={(e) => setUserForm(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="contoh@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={userForm.telepon}
                    onChange={(e) => setUserForm(prev => ({ ...prev, telepon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="081234567890"
                  />
                </div>

                {modalMode === 'add' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Masukkan password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Konfirmasi Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Ulangi password"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peran <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.peran}
                    onChange={(e) => setUserForm(prev => ({ ...prev, peran: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="admin">👑 Admin</option>
                    <option value="operator">⚙️ Operator</option>
                    <option value="petani">🌱 Petani</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">✅ Aktif</option>
                    <option value="inactive">❌ Non-aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alamat
                </label>
                <textarea
                  value={userForm.alamat}
                  onChange={(e) => setUserForm(prev => ({ ...prev, alamat: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitUser}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Menyimpan...' : (modalMode === 'add' ? '➕ Tambah' : '✏️ Update')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Konfirmasi Hapus
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Apakah Anda yakin ingin menghapus pengguna:
                </p>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {userToDelete.nama}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userToDelete.email} • {getPeranBadge(userToDelete.peran)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Menghapus...' : '🗑️ Hapus'}
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

export default PenggunaContent;
