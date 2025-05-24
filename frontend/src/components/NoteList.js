import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../context/utils";
import { useAuth } from "../context/AuthContext";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    getNotes();
  }, []);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    }
  });

  const getNotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes`, getAuthHeader());
      setNotes(response.data);
    } catch (error) {
      console.error("Gagal mengambil catatan:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      try {
        await axios.delete(`${BASE_URL}/notes/${id}`, getAuthHeader());
        getNotes();
      } catch (error) {
        console.error("Gagal menghapus catatan:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  };

  const openModal = (note = null) => {
    setSelectedNote(note);
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedNote) {
        await axios.put(
          `${BASE_URL}/notes/${selectedNote.id}`,
          { title, description },
          getAuthHeader()
        );
      } else {
        await axios.post(
          `${BASE_URL}/notes`,
          { title, description },
          getAuthHeader()
        );
      }
      closeModal();
      getNotes();
    } catch (error) {
      console.log("Gagal menyimpan catatan:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">Daftar Catatan</h2>
        <div>
          <button className="btn-add" onClick={() => openModal()}>
            + Tambah Catatan
          </button>
          <button className="btn-logout" onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </div>
      </div>

      <div className="note-list">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3 className="note-title">{note.title}</h3>
              <p className="note-description">{note.description}</p>
              <div className="note-actions">
                <button onClick={() => openModal(note)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => deleteNote(note.id)} className="btn-delete">
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">Tidak ada catatan tersedia</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedNote ? "Edit Catatan" : "Tambah Catatan"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                name="description"
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Simpan
                </button>
                <button type="button" className="btn-close" onClick={closeModal}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;
