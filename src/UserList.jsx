import React, { useEffect, useState } from "react";
import api from "./api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      setError("");
      api
        .get("/users")
        .then((res) => setUsers(res.data))
        .catch((err) => {
          console.error("Lỗi khi lấy user:", err);
          setError("Không tải được danh sách người dùng");
        })
        .finally(() => setLoading(false));
    };

    fetchUsers();

    const onRefresh = () => fetchUsers();
    window.addEventListener("users:refresh", onRefresh);
    return () => window.removeEventListener("users:refresh", onRefresh);
  }, []);

  if (loading) return <div className="card" style={{ marginTop: 20 }}>Đang tải danh sách...</div>;
  if (error) return <div className="card" style={{ marginTop: 20, color: 'red' }}>{error}</div>;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h2 className="section-title">Danh sách User</h2>
      {users.length === 0 ? (
        <div className="empty">Chưa có người dùng nào.</div>
      ) : (
      <ul className="list">
        {users.map((u, i) => (
          <li key={i}>
            <div className="col-name">{u.name || "(Không tên)"}</div>
            <div className="col-email">{u.email || "(Không email)"}</div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export default UserList;
