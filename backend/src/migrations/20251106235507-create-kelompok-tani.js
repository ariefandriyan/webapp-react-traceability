'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('kelompok_tani', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      kode_kelompok: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nama_kelompok: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      ketua_kelompok: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      waktu_bentuk: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Tanggal pembentukan kelompok'
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      kelurahan: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      kecamatan: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      kota_kabupaten: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      provinsi: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      kode_pos: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      no_telepon: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      komoditas_utama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      status_legalitas: {
        type: Sequelize.ENUM('Terdaftar', 'Belum Terdaftar', 'Dalam Proses'),
        allowNull: false,
        defaultValue: 'Belum Terdaftar'
      },
      sk_kelompok: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Nomor SK pembentukan kelompok'
      },
      tanggal_sk: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      pembina: {
        type: Sequelize.STRING(200),
        allowNull: true,
        comment: 'Petugas pembina'
      },
      bank_mitra: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      no_rekening_kelompok: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
      },
      tanggal_daftar: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal('(CURDATE())')
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('kelompok_tani', ['kode_kelompok'], {
      name: 'idx_kelompok_tani_kode'
    });
    await queryInterface.addIndex('kelompok_tani', ['nama_kelompok'], {
      name: 'idx_kelompok_tani_nama'
    });
    await queryInterface.addIndex('kelompok_tani', ['status'], {
      name: 'idx_kelompok_tani_status'
    });
    await queryInterface.addIndex('kelompok_tani', ['kecamatan'], {
      name: 'idx_kelompok_tani_kecamatan'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('kelompok_tani');
  }
};
