import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  // Get initials from name — "John Doe" → "J"
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 11l3 3L22 4"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="navbar-logo-name">TaskPortal</span>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <div className="user-avatar" title={user?.name}>
          {initial}
        </div>
        <span className="user-name">{user?.name}</span>

        {/* Logout */}
        <button
          className="logout-btn"
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}