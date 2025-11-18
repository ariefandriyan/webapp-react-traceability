'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('petani', 'tempat_lahir', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'nama_lengkap'
    });

    await queryInterface.addColumn('petani', 'status_perkawinan', {
      type: Sequelize.ENUM('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'),
      allowNull: true,
      after: 'jenis_kelamin'
    });

    await queryInterface.addColumn('petani', 'pendidikan', {
      type: Sequelize.ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'),
      allowNull: true,
      after: 'status_perkawinan'
    });

    await queryInterface.addColumn('petani', 'pekerjaan', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'pendidikan'
    });

    await queryInterface.addColumn('petani', 'status_kepemilikan_lahan', {
      type: Sequelize.ENUM('Milik Sendiri', 'Sewa', 'Bagi Hasil', 'Lainnya'),
      allowNull: true,
      after: 'kelompok_tani_id'
    });

    await queryInterface.addColumn('petani', 'luas_lahan', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Luas lahan dalam hektar',
      after: 'status_kepemilikan_lahan'
    });

    await queryInterface.addColumn('petani', 'catatan', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('petani', 'tempat_lahir');
    await queryInterface.removeColumn('petani', 'status_perkawinan');
    await queryInterface.removeColumn('petani', 'pendidikan');
    await queryInterface.removeColumn('petani', 'pekerjaan');
    await queryInterface.removeColumn('petani', 'status_kepemilikan_lahan');
    await queryInterface.removeColumn('petani', 'luas_lahan');
    await queryInterface.removeColumn('petani', 'catatan');
  }
};
