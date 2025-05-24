import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Note = db.define(
  "notes",{ 
    title: {type: Sequelize.STRING,},
    description: {type: Sequelize.STRING,},
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

export default Note;

(async () => {
  await db.sync();
})();