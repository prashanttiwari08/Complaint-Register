import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar({ isAuthenticated, user, onLogout }) {
  return (
    <motion.nav 
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertTriangle color="var(--accent)" size={28} />
        <h2 style={{ margin: 0 }} className="text-gradient">SmartComplaint</h2>
      </div>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/submit" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <PlusCircle size={18} /> Submit Complaint
            </Link>
            <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Hello, {user?.name}</span>
              <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}
