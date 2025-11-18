'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KelompokTani extends Model {
    static associate(models) {
      // Define associations here
      // KelompokTani has many Petani
      // KelompokTani.hasMany(models.Petani, {
      //   foreignKey: 'kelompok_tani_id',
      //   as: 'anggota'
      // });
    }
  }

  KelompokTani.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_kelompok: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Kode kelompok tidak boleh kosong'
      }
    }
  },
  nama_kelompok: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nama kelompok tidak boleh kosong'
      }
    }
  },
  ketua_kelompok: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Ketua kelompok tidak boleh kosong'
      }
    }
  },
  waktu_bentuk: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Waktu bentuk harus berupa tanggal yang valid'
      },
      notEmpty: {
        msg: 'Waktu bentuk tidak boleh kosong'
      }
    }
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Alamat tidak boleh kosong'
      }
    }
  },
  kelurahan: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Kelurahan tidak boleh kosong'
      }
    }
  },
  kecamatan: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Kecamatan tidak boleh kosong'
      }
    }
  },
  kota_kabupaten: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Kota/Kabupaten tidak boleh kosong'
      }
    }
  },
  provinsi: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Provinsi tidak boleh kosong'
      }
    }
  },
  kode_pos: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isNumeric: {
        msg: 'Kode pos harus berupa angka'
      }
    }
  },
  no_telepon: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nomor telepon tidak boleh kosong'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Format email tidak valid'
      }
    }
  },
  komoditas_utama: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Komoditas utama tidak boleh kosong'
      }
    }
  },
  status_legalitas: {
    type: DataTypes.ENUM('Terdaftar', 'Belum Terdaftar', 'Dalam Proses'),
    allowNull: false,
    defaultValue: 'Belum Terdaftar'
  },
  sk_kelompok: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tanggal_sk: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  pembina: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  bank_mitra: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  no_rekening_kelompok: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif'),
    allowNull: false,
    defaultValue: 'aktif'
  },
  tanggal_daftar: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
  }, {
    tableName: 'kelompok_tani',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    sequelize,
    modelName: 'KelompokTani'
  });

  return KelompokTani;
};
