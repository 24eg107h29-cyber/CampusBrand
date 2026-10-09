import { useState } from 'react';
import axios from 'axios';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

const api = axios.create({ baseURL: '/api' });

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('campusBrandUser') || 'null'); }
    catch { return null; }
  });

  async function handleLogin(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const loggedInUser = { name: response.data.name, email: response.data.email };
      sessionStorage.setItem('campusBrandUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Make sure the backend and MySQL are running.');
      return false;
    }
  }

  async function handleRegister(details) {
    try {
      const response = await api.post('/auth/register', details);
      alert(response.data.message || 'Account created. Please sign in.');
      return true;
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed. Make sure the backend and MySQL are running.');
      return false;
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('campusBrandUser');
    setUser(null);
  }

  return user
    ? <Dashboard onLogout={handleLogout} />
    : <Login onLogin={handleLogin} onRegister={handleRegister} />;
}
