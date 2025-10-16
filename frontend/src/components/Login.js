import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple hardcoded credentials
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin(true);
    } else {
      alert('Invalid credentials! Try: admin / admin123');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Panel Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="login-hint">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;