import { Sequelize } from "sequelize";
import db from "../config/database.js";


const User = db.define(
  "users",
  { 
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    refresh_token: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui"
  }
);

// Remove force: true to prevent data loss
export const initUserModel = async () => {
  try {
    await User.sync();
    console.log("Users table synchronized");
  } catch (error) {
    console.error("Error synchronizing Users table:", error);
  }
};

export default User;