import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../NoteList.css";
import { BASE_URL } from "../context/utils";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/notes`, { // Updated endpoint
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
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
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/delete-notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getNotes();
    } catch (error) {
      console.error("Gagal menghapus catatan:", error);
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

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${BASE_URL}/create-notes`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // pastikan ini ada agar cookie dikirim
        }
      );
      closeModal();
      getNotes();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Gagal menyimpan catatan!"
      );
      console.log("Gagal menyimpan catatan:", error);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/update-notes/${selectedNote.id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeModal();
      getNotes();
    } catch (error) {
      console.log("Gagal memperbarui catatan:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
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
            <form onSubmit={selectedNote ? updateNote : saveNote}>
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
