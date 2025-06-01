import { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: '',
    maxGroupSize: '',
    status: '',
    endDate: ''
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    axios.get('http://localhost:5000/api/seller/my-groups', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => setGroups(res.data))
    .catch(err => console.error("Erreur récupération des groupes", err));
  };

  const deleteGroup = (id) => {
    if (!window.confirm("Supprimer ce groupe ?")) return;
    axios.delete(`http://localhost:5000/api/seller/group/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(fetchGroups)
    .catch(err => console.error("Erreur suppression", err));
  };

  const startEdit = (group) => {
    setEditingGroupId(group.id);
    setEditForm({
      productName: group.productName,
      maxGroupSize: group.maxGroupSize,
      status: group.status,
      endDate: group.endDate?.split('T')[0] || ''
    });
  };

  const cancelEdit = () => {
    setEditingGroupId(null);
    setEditForm({ productName: '', maxGroupSize: '', status: '', endDate: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const submitEdit = (id) => {
    axios.put(`http://localhost:5000/api/seller/group/${id}`, editForm, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      fetchGroups();
      cancelEdit();
    })
    .catch(err => console.error("Erreur modification", err));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mes Groupes Créés</h2>

      {groups.map(group => (
        <div key={group.id} className="border p-4 rounded-md shadow-sm flex flex-col gap-2">
          {editingGroupId === group.id ? (
            <div className="space-y-2">
              <input
                type="text"
                name="productName"
                value={editForm.productName}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
                placeholder="Nom du produit"
              />
              <input
                type="number"
                name="maxGroupSize"
                value={editForm.maxGroupSize}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
                placeholder="Taille max"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
              >
                <option value="pending">En attente</option>
                <option value="active">Actif</option>
                <option value="completed">Terminé</option>
              </select>
              <input
                type="date"
                name="endDate"
                value={editForm.endDate}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
              />

              <div className="flex gap-3 mt-2">
                <button onClick={cancelEdit} className="text-red-500 flex items-center gap-1">
                  <XCircle className="w-5 h-5" /> Annuler
                </button>
                <button onClick={() => submitEdit(group.id)} className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-5 h-5" /> Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Produit :</strong> {group.productName}</p>
                <p><strong>Taille max :</strong> {group.maxGroupSize}</p>
                <p><strong>Status :</strong> {group.status}</p>
                <p><strong>Date de fin :</strong> {group.endDate?.split('T')[0]}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(group)} className="text-blue-600"><Edit /></button>
                <button onClick={() => deleteGroup(group.id)} className="text-red-600"><Trash2 /></button>
                <Link
    to={`/seller/group/${group.id}`}
    className="text-green-600 hover:underline flex items-center"
    title="Voir les détails"
  >
    <Eye className="w-5 h-5" />
  </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;

