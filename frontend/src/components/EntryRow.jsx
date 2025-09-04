// src/components/EntryRow.jsx
import api from "../utils/api";

export default function EntryRow({ entry, canEdit }) {
  const handleDelete = async () => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`/movies/${entry.id}`);
      window.location.reload();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <tr className="border-b">
      <td className="p-2">
        {entry.image_url && <img src={entry.image_url} alt={entry.title} className="h-12 w-12 object-cover rounded" />}
      </td>
      <td className="p-2">{entry.title}</td>
      <td className="p-2">{entry.type}</td>
      <td className="p-2">{entry.director}</td>
      <td className="p-2">{entry.year}</td>
      <td className="p-2">
        {entry.approved ? (
          <span className="text-green-600">Approved</span>
        ) : (
          <span className="text-yellow-600">Pending</span>
        )}
      </td>
      <td className="p-2">
        {canEdit && (
          <>
            <button className="text-blue-600 mr-2">Edit</button>
            <button onClick={handleDelete} className="text-red-600">Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}
