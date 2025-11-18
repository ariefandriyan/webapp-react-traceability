'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('petani', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true
      },
      nama_lengkap: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      jenis_kelamin: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: false
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
        type: Sequelize.STRING(5),
        allowNull: true
      },
      no_telepon: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      kelompok_tani_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'aktif'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('petani', ['nik']);
    await queryInterface.addIndex('petani', ['email']);
    await queryInterface.addIndex('petani', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('petani');
  }
};
