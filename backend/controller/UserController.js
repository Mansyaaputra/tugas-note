import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Sequelize from "sequelize";

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

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        msg: "Username, email, dan password harus diisi",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { username: username },
          { email: email },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        msg:
          existingUser.username === username
            ? "Username sudah digunakan"
            : "Email sudah terdaftar",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      msg: "Terjadi kesalahan saat membuat user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m'
    });

    res.json({
      accessToken,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error); // log detail error
    res.status(500).json({ message: "Internal server error", error: error.message });
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