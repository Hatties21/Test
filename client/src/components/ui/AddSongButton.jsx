import React, { useState } from "react";
import axios from "axios";
import styles from "./AddSongButton.module.css";
import { FaPlus } from "react-icons/fa";

const AddSongButton = ({ onSongAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    type: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const toggleModal = () => {
    setShowModal(!showModal);
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.artist || !form.type || !imageFile || !audioFile) {
      return setError("Vui lòng điền đầy đủ thông tin");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("artist", form.artist);
      formData.append("type", form.type);
      formData.append("description", form.description || "");
      formData.append("image", imageFile);
      formData.append("audio", audioFile);
      formData.append("username", userInfo.name || "guest");

      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        throw new Error("Vui lòng đăng nhập để thêm bài hát");
      }

      const res = await axios.post("/api/songs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Thêm token xác thực
        },
      });

      onSongAdded?.(res.data);
      setForm({ title: "", artist: "", type: "", description: "" });
      setImageFile(null);
      setAudioFile(null);
      setShowModal(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Lỗi khi thêm bài hát");
      console.error("❌ Lỗi khi thêm bài hát:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={styles.addButton}
        onClick={toggleModal}
        title="Thêm bài hát"
      >
        <FaPlus />
      </button>
      {showModal && (
        <div className={styles.modalBackdrop} onClick={toggleModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Thêm bài hát mới</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Tên bài hát"
                value={form.title}
                onChange={handleChange}
              />
              <input
                name="artist"
                placeholder="Nghệ sĩ"
                value={form.artist}
                onChange={handleChange}
              />
              <input
                name="type"
                placeholder="Thể loại"
                value={form.type}
                onChange={handleChange}
              />
              <input
                name="description"
                placeholder="Mô tả bài hát (tùy chọn)"
                value={form.description}
                onChange={handleChange}
                rows={5}
              />
              <label>Chọn ảnh:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <label>Chọn file nhạc:</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files[0])}
              />
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? "Thêm..." : "Thêm bài hát"}
              </button>
            </form>
            <button className={styles.closeBtn} onClick={toggleModal}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSongButton;