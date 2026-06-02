import { useEffect, useState } from "react";
import axios from "axios";

const AVATAR_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#FAECE7", color: "#993C1D" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FBEAF0", color: "#993556" },
];

const cssString = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .form-page {
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #f5f3ff 0%, #e8f5ee 50%, #fef9ec 100%);
    padding: 2rem 2.5rem;
    font-family: 'Segoe UI', system-ui, sans-serif;
    box-sizing: border-box;
  }
  .form-container {
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Header ── */
  .header-bar {
    background: #534AB7;
    border-radius: 16px;
    padding: 1.6rem 2rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }
  .header-icon { font-size: 32px; color: #CECBF6; }
  .header-info { flex: 1; }
  .header-title-row { display: flex; align-items: center; }
  .header-title { font-size: 24px; font-weight: 700; color: #fff; margin: 0; }
  .header-sub { font-size: 14px; color: #AFA9EC; margin-top: 4px; }

  /* ── Mode badges ── */
  .badge-new {
    background: #E1F5EE; color: #0F6E56;
    font-size: 12px; padding: 4px 12px;
    border-radius: 20px; font-weight: 600; margin-left: 12px;
  }
  .badge-edit {
    background: #FAEEDA; color: #854F0B;
    font-size: 12px; padding: 4px 12px;
    border-radius: 20px; font-weight: 600; margin-left: 12px;
  }
  .badge-editing-row {
    background: #FAEEDA; color: #854F0B;
    font-size: 11px; padding: 3px 10px;
    border-radius: 20px; font-weight: 600; margin-left: 10px;
  }

  /* ── Stats ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 1.5rem;
    width: 100%;
  }
  .stat-card { border-radius: 14px; padding: 18px 22px; }
  .stat-purple { background: #EEEDFE; }
  .stat-teal   { background: #E1F5EE; }
  .stat-coral  { background: #FAECE7; }
  .stat-amber  { background: #FAEEDA; }
  .stat-label {
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    display: flex; align-items: center; gap: 6px;
  }
  .stat-purple .stat-label { color: #534AB7; }
  .stat-teal   .stat-label { color: #0F6E56; }
  .stat-coral  .stat-label { color: #993C1D; }
  .stat-amber  .stat-label { color: #854F0B; }
  .stat-value { font-size: 28px; font-weight: 700; margin-top: 6px; }
  .stat-value-sm { font-size: 16px; font-weight: 700; margin-top: 6px; }
  .stat-purple .stat-value,
  .stat-purple .stat-value-sm { color: #3C3489; }
  .stat-teal   .stat-value,
  .stat-teal   .stat-value-sm { color: #085041; }
  .stat-coral  .stat-value,
  .stat-coral  .stat-value-sm { color: #712B13; }
  .stat-amber  .stat-value,
  .stat-amber  .stat-value-sm { color: #633806; }

  /* ── Form card ── */
  .form-card {
    background: #EEEDFE;
    border: 1.5px solid #AFA9EC;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    width: 100%;
  }
  .form-card-title {
    font-size: 17px; font-weight: 700; color: #3C3489;
    margin-bottom: 1.4rem;
    display: flex; align-items: center; gap: 8px;
  }
  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 20px;
    width: 100%;
  }
  .field-label {
    display: block;
    font-size: 12px; font-weight: 700; color: #534AB7;
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 7px;
  }
  .field-input {
    width: 100%;
    padding: 12px 15px;
    border: 1.5px solid #AFA9EC;
    border-radius: 10px;
    font-size: 15px;
    background: #fff;
    color: #26215C;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .field-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 3px #CECBF6;
  }
  .field-input::placeholder { color: #AFA9EC; }
  .btn-row {
    display: flex; gap: 12px; justify-content: flex-end;
  }
  .btn-add {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: #534AB7; color: #fff;
    border: none; border-radius: 10px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: background .15s;
  }
  .btn-add:hover { background: #3C3489; }
  .btn-update {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: #0F6E56; color: #fff;
    border: none; border-radius: 10px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: background .15s;
  }
  .btn-update:hover { background: #085041; }
  .btn-cancel {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: #F1EFE8; color: #5F5E5A;
    border: 1.5px solid #B4B2A9; border-radius: 10px;
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: background .15s;
  }
  .btn-cancel:hover { background: #D3D1C7; }

  /* ── Table card ── */
  .table-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
  }
  .table-header {
    background: #1D9E75;
    padding: 16px 22px;
    display: flex; align-items: center; gap: 12px;
  }
  .table-header-icon { font-size: 20px; color: #9FE1CB; }
  .table-header-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
  .table-count-pill {
    margin-left: auto;
    background: #0F6E56; color: #9FE1CB;
    font-size: 13px; padding: 4px 14px;
    border-radius: 20px; font-weight: 600;
  }
  .table-wrap { overflow-x: auto; width: 100%; }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  thead { background: #E1F5EE; }
  thead th {
    padding: 13px 18px;
    text-align: left;
    font-size: 12px; font-weight: 700; color: #0F6E56;
    text-transform: uppercase; letter-spacing: 0.06em;
    white-space: nowrap;
  }
  thead th.th-right { text-align: right; }
  tbody tr { transition: background .1s; }
  tbody tr.row-even { background: #fff; }
  tbody tr.row-odd  { background: #F9FEFC; }
  tbody tr.row-editing { background: #FAEEDA; }
  tbody tr:hover { background: #E1F5EE; }
  tbody td {
    padding: 14px 18px;
    border-top: 1px solid #E1F5EE;
    vertical-align: middle;
  }
  tbody td.td-right {
    text-align: right; white-space: nowrap;
  }
  .name-cell { display: flex; align-items: center; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    margin-right: 12px; flex-shrink: 0;
  }
  .phone-pill {
    background: #FAEEDA; color: #633806;
    font-size: 13px; padding: 5px 12px;
    border-radius: 20px; font-weight: 600;
  }
  .email-text { color: #185FA5; font-size: 14px; }
  .act-edit {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    background: #EEEDFE; color: #534AB7;
    border: 1px solid #AFA9EC; border-radius: 8px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    margin-right: 8px; transition: background .15s;
  }
  .act-edit:hover { background: #CECBF6; }
  .act-del {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    background: #FCEBEB; color: #A32D2D;
    border: 1px solid #F7C1C1; border-radius: 8px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    transition: background .15s;
  }
  .act-del:hover { background: #F7C1C1; }
  .empty-cell {
    text-align: center; padding: 4rem;
    color: #888780; font-size: 15px;
  }
  .empty-icon { font-size: 36px; margin-bottom: 10px; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .form-page { padding: 1rem; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .form-grid { grid-template-columns: 1fr; }
    .header-title { font-size: 18px; }
  }
  @media (max-width: 480px) {
    .stats-row { grid-template-columns: 1fr 1fr; }
  }
`;

function getInitials(name) {
  return (
    name.trim().split(" ").map((w) => w[0] || "").slice(0, 2).join("").toUpperCase() || "?"
  );
}

function now() {
  const d = new Date();
  return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
}

function FORM() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [lastAction, setLastAction] = useState("—");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const API = "http://localhost:5000/api/users";

  useEffect(() => {
    // Inject CSS once into <head>
    const styleTag = document.createElement("style");
    styleTag.id = "form-crud-styles";
    if (!document.getElementById("form-crud-styles")) {
      styleTag.innerHTML = cssString;
      document.head.appendChild(styleTag);
    }
    getUsers();
    return () => {
      const el = document.getElementById("form-crud-styles");
      if (el) el.remove();
    };
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data.data);
    } catch {}
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email) return;
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
        setUsers((prev) =>
          prev.map((u) => (u._id === editId ? { ...u, ...form } : u))
        );
      } else {
        const res = await axios.post(API, form);
        setUsers((prev) => [...prev, res.data.data]);
      }
    } catch {
      if (editId) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editId ? { ...u, ...form } : u))
        );
      } else {
        setUsers((prev) => [
          ...prev,
          { _id: Date.now().toString(), ...form },
        ]);
      }
    }
    setForm({ name: "", phone: "", email: "" });
    setEditId(null);
    setLastAction(now());
  };

  const editUser = (user) => {
    setEditId(user._id);
    setForm({ name: user.name, phone: user.phone, email: user.email });
  };

  const deleteUser = async (id) => {
    try { await axios.delete(`${API}/${id}`); } catch {}
    setUsers((prev) => prev.filter((u) => u._id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({ name: "", phone: "", email: "" });
    }
    setLastAction(now());
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: "", phone: "", email: "" });
  };

  const editingUser = editId ? users.find((u) => u._id === editId) : null;

  return (
    <div className="form-page">
      <div className="form-container">

        {/* ── Header ── */}
        <div className="header-bar">
          <span className="header-icon">📋</span>
          <div className="header-info">
            <div className="header-title-row">
              <h2 className="header-title">User Management</h2>
              <span className={editId ? "badge-edit" : "badge-new"}>
                {editId ? `Editing: ${editingUser?.name || ""}` : "New Entry"}
              </span>
            </div>
            <div className="header-sub">
              Add, edit and remove users from the directory
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card stat-purple">
            <div className="stat-label">👥 Total</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card stat-teal">
            <div className="stat-label">✅ Active</div>
            <div className="stat-value">{users.length}</div>
          </div>
          <div className="stat-card stat-coral">
            <div className="stat-label">✏️ Editing</div>
            <div className={editingUser ? "stat-value-sm" : "stat-value"}>
              {editingUser ? editingUser.name : "—"}
            </div>
          </div>
          <div className="stat-card stat-amber">
            <div className="stat-label">🕐 Last Action</div>
            <div className="stat-value-sm">{lastAction}</div>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="form-card">
          <div className="form-card-title">
            {editId ? "✏️ Edit User" : "➕ Add New User"}
          </div>
          <div className="form-grid">
            <div>
              <label className="field-label">👤 Name</label>
              <input
                className="field-input"
                name="name" type="text" placeholder="Full name"
                value={form.name} onChange={handleChange}
              />
            </div>
            <div>
              <label className="field-label">📱 Phone</label>
              <input
                className="field-input"
                name="phone" type="text" placeholder="+1 (555) 000-0000"
                value={form.phone} onChange={handleChange}
              />
            </div>
            <div>
              <label className="field-label">✉️ Email</label>
              <input
                className="field-input"
                name="email" type="email" placeholder="user@example.com"
                value={form.email} onChange={handleChange}
              />
            </div>
          </div>
          <div className="btn-row">
            {editId && (
              <button className="btn-cancel" onClick={cancelEdit}>
                ✕ Cancel
              </button>
            )}
            <button
              className={editId ? "btn-update" : "btn-add"}
              onClick={handleSubmit}
            >
              {editId ? "✔ Update User" : "✚ Add User"}
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-card">
          <div className="table-header">
            <span className="table-header-icon">📊</span>
            <span className="table-header-title">User Directory</span>
            <span className="table-count-pill">
              {users.length} {users.length === 1 ? "user" : "users"}
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th className="th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      <div className="empty-icon">📭</div>
                      No users yet — add one above
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => {
                    const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const isEditing = editId === user._id;
                    return (
                      <tr
                        key={user._id}
                        className={
                          isEditing ? "row-editing"
                          : i % 2 === 0 ? "row-even" : "row-odd"
                        }
                      >
                        <td>
                          <div className="name-cell">
                            <div
                              className="avatar"
                              style={{ background: av.bg, color: av.color }}
                            >
                              {getInitials(user.name)}
                            </div>
                            <span style={{ fontWeight: isEditing ? 700 : 400 }}>
                              {user.name}
                            </span>
                            {isEditing && (
                              <span className="badge-editing-row">editing</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="phone-pill">📞 {user.phone}</span>
                        </td>
                        <td>
                          <span className="email-text">{user.email}</span>
                        </td>
                        <td className="td-right">
                          <button className="act-edit" onClick={() => editUser(user)}>
                            ✏️ Edit
                          </button>
                          <button className="act-del" onClick={() => deleteUser(user._id)}>
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FORM;