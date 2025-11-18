'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Petani extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Petani.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: {
        msg: 'NIK sudah terdaftar'
      },
      validate: {
        notEmpty: {
          msg: 'NIK tidak boleh kosong'
        },
        len: {
          args: [16, 16],
          msg: 'NIK harus 16 digit'
        },
        isNumeric: {
          msg: 'NIK harus berupa angka'
        }
      }
    },
    nama_lengkap: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nama lengkap tidak boleh kosong'
        },
        len: {
          args: [3, 100],
          msg: 'Nama lengkap harus antara 3-100 karakter'
        }
      }
    },
    tempat_lahir: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tanggal lahir tidak boleh kosong'
        },
        isDate: {
          msg: 'Format tanggal lahir tidak valid'
        }
      }
    },
    jenis_kelamin: {
      type: DataTypes.ENUM('L', 'P'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Jenis kelamin tidak boleh kosong'
        },
        isIn: {
          args: [['L', 'P']],
          msg: 'Jenis kelamin harus L atau P'
        }
      }
    },
    status_perkawinan: {
      type: DataTypes.ENUM('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'),
      allowNull: true
    },
    pendidikan: {
      type: DataTypes.ENUM('SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'),
      allowNull: true
    },
    pekerjaan: {
      type: DataTypes.STRING(100),
      allowNull: true
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
      type: DataTypes.STRING(5),
      allowNull: true,
      validate: {
        len: {
          args: [5, 5],
          msg: 'Kode pos harus 5 digit'
        },
        isNumeric: {
          msg: 'Kode pos harus berupa angka'
        }
      }
    },
    no_telepon: {
      type: DataTypes.STRING(15),
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
      unique: {
        msg: 'Email sudah terdaftar'
      },
      validate: {
        isEmail: {
          msg: 'Format email tidak valid'
        }
      }
    },
    kelompok_tani_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status_kepemilikan_lahan: {
      type: DataTypes.ENUM('Milik Sendiri', 'Sewa', 'Bagi Hasil', 'Lainnya'),
      allowNull: true
    },
    luas_lahan: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('aktif', 'nonaktif'),
      allowNull: false,
      defaultValue: 'aktif',
      validate: {
        isIn: {
          args: [['aktif', 'nonaktif']],
          msg: 'Status harus aktif atau nonaktif'
        }
      }
    },
    catatan: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Petani',
    tableName: 'petani',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Petani;
};
