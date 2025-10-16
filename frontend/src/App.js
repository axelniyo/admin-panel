import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import UserGraph from './components/UserGraph';
import ProtobufExport from './components/ProtobufExport';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('management');

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'management':
        return <UserManagement />;
      case 'graph':
        return <UserGraph />;
      case 'export':
        return <ProtobufExport />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <h1>Mini Admin Panel</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'management' ? 'active' : ''}
            onClick={() => setActiveTab('management')}
          >
            User Management
          </button>
          <button 
            className={activeTab === 'graph' ? 'active' : ''}
            onClick={() => setActiveTab('graph')}
          >
            User Graph
          </button>
          <button 
            className={activeTab === 'export' ? 'active' : ''}
            onClick={() => setActiveTab('export')}
          >
            Protobuf Export
          </button>
        </nav>
      </header>
      
      <main className="App-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;