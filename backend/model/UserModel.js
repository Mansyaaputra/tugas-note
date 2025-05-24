import { Sequelize } from "sequelize";
import db from "../config/database.js";


const User = db.define(
  "users",{ 
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

export default User;

(async () => {
  await db.sync();
})();