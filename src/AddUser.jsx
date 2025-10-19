import React, { useState } from "react";
import api from "./api";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email };
    setSubmitting(true);
    setError("");
    api
      .post("/users", newUser)
      .then(() => {
        alert("Thêm user thành công!");
        setName("");
        setEmail("");
        // Thông báo cho danh sách làm mới dữ liệu
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("users:refresh"));
        }
      })
      .catch((err) => {
        console.error("Lỗi khi thêm user:", err);
        setError("Không thể thêm người dùng");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h2 className="section-title">Thêm người dùng</h2>
      <form onSubmit={handleSubmit} className="row">
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Đang thêm..." : "Thêm"}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default AddUser;
