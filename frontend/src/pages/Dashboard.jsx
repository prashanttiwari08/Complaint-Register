import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function Dashboard({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [category]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/complaints';
      if (category) {
        url += `?category=${category}`;
      }
      const res = await axios.get(url);
      setComplaints(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return fetchComplaints();
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/complaints/search?location=${search}`);
      setComplaints(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'var(--success)';
      case 'In Progress': return 'var(--warning)';
      default: return 'var(--danger)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 size={16} />;
      case 'In Progress': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Complaint Dashboard</h2>
        <Link to="/submit" className="btn btn-primary">New Complaint</Link>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by location..." 
              className="form-input" 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', minWidth: '200px' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="form-input" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Roads">Roads</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No complaints found.</p>
        </div>
      ) : (
        <div className="grid-2">
          {complaints.map((complaint, i) => (
            <motion.div 
              key={complaint._id} 
              className="glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{complaint.title}</h3>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: `${getStatusColor(complaint.status)}20`,
                  color: getStatusColor(complaint.status)
                }}>
                  {getStatusIcon(complaint.status)}
                  {complaint.status}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', flex: 1 }}>
                {complaint.description.length > 100 
                  ? complaint.description.substring(0, 100) + '...' 
                  : complaint.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                <span><strong>Category:</strong> {complaint.category}</span>
                <span><strong>Location:</strong> {complaint.location}</span>
              </div>

              <Link to={`/complaint/${complaint._id}`} className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
