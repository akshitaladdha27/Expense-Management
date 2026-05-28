import React, { useState } from 'react';
import api from '../api/axios';

const CreateUserForm = ({ onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee'); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const newUser = { name, email, password, role };
      await api.post('/users', newUser);

      setSuccess(`Successfully created ${role}: ${name}`);
      setName('');
      setEmail('');
      setPassword('');
      if (onUserCreated) {
        onUserCreated();
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      <h3>Create New User</h3>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required 
         style={{
        width: '20%',
        padding: '1px',
        paddingLeft: '12px',
        border: '1px solid #999',
        borderRadius: '6px',
        marginLeft: '5px',
        marginTop: '5px'
      }}
        />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
        style={{
        width: '20%',
        padding: '1px',
        paddingLeft: '12px',
        border: '1px solid #999',
        borderRadius: '6px',
        marginLeft: '5px',
        marginTop: '5px',
      }}
        />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
        style={{
        width: '20%',
        padding: '1px',
        paddingLeft: '12px',
        border: '1px solid #999',
        borderRadius: '6px',
        marginLeft: '5px',
        marginTop: '5px'
      }}
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button type="submit"
      style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >Create User</button>
    </form>
  );
};

export default CreateUserForm;