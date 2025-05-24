import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Note = db.define(
  "notes",
  { 
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui"
  }
);

// Force sync to recreate the table
await db.sync({ force: true });

export default Note;