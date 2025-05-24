import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" }); // tambahkan ini
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: { id: req.params.id },
    });
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" }); // tambahkan ini
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Cek apakah username sudah terdaftar
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ msg: "Username sudah digunakan" });
    }

    // ✅ Enkripsi password dan simpan
    const encryptPassword = await bcrypt.hash(password, 5);
    await User.create({
      username,
      email,
      password: encryptPassword,
    });

    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Terjadi kesalahan di server" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let updatedData = {
      username,
      email,
    }; //nyimpen jadi object

    if (password) {
      const encryptPassword = await bcrypt.hash(password, 5);
      updatedData.password = encryptPassword;
    }

    const result = await User.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    // Periksa apakah ada baris yang terpengaruh (diupdate)
    if (result[0] === 0) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan atau tidak ada data yang berubah",
        updatedData: updatedData,
        result,
      });
    }

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      const userPlain = user.toJSON(); // Konversi ke object
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;

      const decryptPassword = await bcrypt.compare(password, user.password);
      if (decryptPassword) {
        const accessToken = jwt.sign(
          safeUserData,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30m",
          }
        );
        const refreshToken = jwt.sign(
          safeUserData,
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        await User.update(
          { refresh_token: refreshToken },
          {
            where: {
              id: user.id,
            },
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: false, //ngatur cross-site scripting, untuk penggunaan asli aktifkan karena bisa nyegah serangan fetch data dari website "document.cookies"
          sameSite: "none", //ini ngatur domain yg request misal kalo strict cuman bisa akseske link dari dan menuju domain yg sama, lax itu bisa dari domain lain tapi cuman bisa get
          maxAge: 24 * 60 * 60 * 1000,
          secure: true, //ini ngirim cookies cuman bisa dari https, kenapa? nyegah skema MITM di jaringan publik, tapi pas development di false in aja
        });
        res.status(200).json({
          status: "Succes",
          message: "Login Berhasil",
          safeUserData,
          accessToken,
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Paassword atau email salah",
        });
      }
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Paassword atau email salah",
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
};

//nambah logout
const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user.refresh_token) return res.sendStatus(204);
  const userId = user.id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken"); //ngehapus cookies yg tersimpan
  return res.sendStatus(200);
};
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout,
};