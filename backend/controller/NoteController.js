import Note from "../model/NoteModel.js";

const getNotes = async (req, res) => {
  try {
    const response = await Note.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const getNoteById = async (req, res) => {
  try {
    const response = await Note.findOne({
      where: { id: req.params.id },
    });
    if (!response) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createNote = async (req, res) => {
  try {
    await Note.create(req.body);
    res.status(200).json({ message: "Note created" });
  } catch (error) {
    console.log(error.message);
  }
};

const updateNote = async (req, res) => {
  try {
    await Note.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Note updated" });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export { getNotes, createNote, updateNote, deleteNote, getNoteById };