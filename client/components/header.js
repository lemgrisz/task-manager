import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <h1>My Task Manager</h1>
        <nav>
          {user && (
            <div className="nav-user">
              <span>Welcome, {user.username}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;