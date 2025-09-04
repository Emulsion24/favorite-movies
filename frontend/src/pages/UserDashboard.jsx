// src/pages/UserDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import EntryFormModal from "../components/EntryFormModal";
import EntriesTable from "../components/EntriesTable";

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <p className="text-gray-700">
            Welcome {user?.email} (Role: {user?.role})
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add New Entry
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Table */}
      <EntriesTable userId={user?.id} />

      {/* Add/Edit Modal */}
      {showForm && <EntryFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
