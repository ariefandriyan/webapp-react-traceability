/**
 * MENTAS API Test - JavaScript Example
 * 
 * Simple JavaScript examples to test the Petani API endpoints
 * Can be run in browser console or Node.js
 */

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Example 1: Health Check
async function testHealthCheck() {
  console.log('=== Testing Health Check ===');
  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Example 2: Get All Petani
async function getAllPetani(options = {}) {
  console.log('=== Testing Get All Petani ===');
  const { page = 1, limit = 10, search = '', status = '', sort_by = '', order = '' } = options;
  
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sort_by) params.append('sort_by', sort_by);
  if (order) params.append('order', order);
  
  const url = `${API_URL}/petani?${params.toString()}`;
  console.log('URL:', url);
  
  const response = await fetch(url);
  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Example 3: Get Petani Statistics
async function getPetaniStats() {
  console.log('=== Testing Get Petani Statistics ===');
  const response = await fetch(`${API_URL}/petani/stats`);
  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Example 4: Get Single Petani by ID
async function getPetaniById(id) {
  console.log(`=== Testing Get Petani by ID: ${id} ===`);
  const response = await fetch(`${API_URL}/petani/${id}`);
  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Example 5: Create New Petani
async function createPetani(petaniData) {
  console.log('=== Testing Create Petani ===');
  console.log('Data:', petaniData);
  
  const response = await fetch(`${API_URL}/petani`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(petaniData),
  });
  
  const data = await response.json();
  console.log('Response Status:', response.status);
  console.log('Response:', data);
  return data;
}

// Example 6: Update Petani
async function updatePetani(id, updateData) {
  console.log(`=== Testing Update Petani ID: ${id} ===`);
  console.log('Update Data:', updateData);
  
  const response = await fetch(`${API_URL}/petani/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  
  const data = await response.json();
  console.log('Response Status:', response.status);
  console.log('Response:', data);
  return data;
}

// Example 7: Delete Petani
async function deletePetani(id) {
  console.log(`=== Testing Delete Petani ID: ${id} ===`);
  
  const response = await fetch(`${API_URL}/petani/${id}`, {
    method: 'DELETE',
  });
  
  const data = await response.json();
  console.log('Response Status:', response.status);
  console.log('Response:', data);
  return data;
}

// Example 8: Complete Test Flow
async function runCompleteTest() {
  console.log('\n========================================');
  console.log('MENTAS API - Complete Test Flow');
  console.log('========================================\n');
  
  try {
    // 1. Health check
    await testHealthCheck();
    console.log('\n---\n');
    
    // 2. Get initial stats
    await getPetaniStats();
    console.log('\n---\n');
    
    // 3. Create petani #1
    const petani1 = await createPetani({
      nik: '3507021234567890',
      nama_lengkap: 'Ahmad Suryadi',
      tanggal_lahir: '1985-05-15',
      jenis_kelamin: 'L',
      alamat: 'Jl. Tembakau No. 123, RT 02/RW 05',
      kelurahan: 'Sanan Wetan',
      kecamatan: 'Blimbing',
      kota_kabupaten: 'Malang',
      provinsi: 'Jawa Timur',
      kode_pos: '65131',
      no_telepon: '081234567890',
      email: 'ahmad.suryadi@example.com',
      status: 'aktif'
    });
    console.log('\n---\n');
    
    // 4. Create petani #2
    const petani2 = await createPetani({
      nik: '3507029876543210',
      nama_lengkap: 'Siti Nurhaliza',
      tanggal_lahir: '1990-08-20',
      jenis_kelamin: 'P',
      alamat: 'Jl. Mawar No. 45, RT 03/RW 02',
      kelurahan: 'Lowokwaru',
      kecamatan: 'Lowokwaru',
      kota_kabupaten: 'Malang',
      provinsi: 'Jawa Timur',
      kode_pos: '65141',
      no_telepon: '082345678901',
      email: 'siti.nurhaliza@example.com',
      status: 'aktif'
    });
    console.log('\n---\n');
    
    // 5. Get all petani
    await getAllPetani();
    console.log('\n---\n');
    
    // 6. Search petani
    await getAllPetani({ search: 'Ahmad' });
    console.log('\n---\n');
    
    // 7. Get petani by ID
    if (petani1.success && petani1.data) {
      await getPetaniById(petani1.data.id);
      console.log('\n---\n');
      
      // 8. Update petani
      await updatePetani(petani1.data.id, {
        no_telepon: '081999888777',
        status: 'nonaktif'
      });
      console.log('\n---\n');
    }
    
    // 9. Get updated stats
    await getPetaniStats();
    console.log('\n---\n');
    
    // 10. Delete petani
    if (petani2.success && petani2.data) {
      await deletePetani(petani2.data.id);
      console.log('\n---\n');
    }
    
    // 11. Final stats
    await getPetaniStats();
    console.log('\n---\n');
    
    // 12. Final list
    await getAllPetani();
    
    console.log('\n========================================');
    console.log('Test Flow Completed!');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Export functions for use in other modules (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testHealthCheck,
    getAllPetani,
    getPetaniStats,
    getPetaniById,
    createPetani,
    updatePetani,
    deletePetani,
    runCompleteTest
  };
}

// Sample data for testing
const samplePetani = {
  nik: '3507021234567890',
  nama_lengkap: 'Ahmad Suryadi',
  tanggal_lahir: '1985-05-15',
  jenis_kelamin: 'L',
  alamat: 'Jl. Tembakau No. 123, RT 02/RW 05',
  kelurahan: 'Sanan Wetan',
  kecamatan: 'Blimbing',
  kota_kabupaten: 'Malang',
  provinsi: 'Jawa Timur',
  kode_pos: '65131',
  no_telepon: '081234567890',
  email: 'ahmad.suryadi@example.com',
  status: 'aktif'
};

// Usage examples in browser console:
// 
// // Single tests:
// testHealthCheck();
// getAllPetani();
// getPetaniStats();
// createPetani(samplePetani);
// getAllPetani({ search: 'Ahmad', status: 'aktif' });
// getPetaniById(1);
// updatePetani(1, { status: 'nonaktif' });
// deletePetani(1);
//
// // Complete test flow:
// runCompleteTest();
