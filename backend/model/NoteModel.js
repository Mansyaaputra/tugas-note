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

// Remove force: true to prevent data loss
export const initNoteModel = async () => {
  try {
    await Note.sync();
    console.log("Notes table synchronized");
  } catch (error) {
    console.error("Error synchronizing Notes table:", error);
  }
};

export default Note;