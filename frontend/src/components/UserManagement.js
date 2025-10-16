import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { CryptoUtils } from '../utils/crypto';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    status: 'active'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        await userAPI.updateUser(editingUser.id, formData);
        alert('User updated successfully');
      } else {
        await userAPI.createUser(formData);
        alert('User created successfully');
      }
      
      setFormData({ email: '', role: 'user', status: 'active' });
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(id);
        alert('User deleted successfully');
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
        </button>
        
        {editingUser && (
          <button type="button" onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', role: 'user', status: 'active' });
          }}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="users-list">
        <h3>Users ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;