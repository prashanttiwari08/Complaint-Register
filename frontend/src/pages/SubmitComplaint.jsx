import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function SubmitComplaint({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/complaints', formData);
      
      // Call AI Analysis
      await axios.post('http://localhost:5000/api/ai/analyze', { id: res.data.data._id });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting complaint');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-panel" 
      style={{ maxWidth: '600px', margin: '0 auto' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 style={{ marginBottom: '24px' }}>Submit a Complaint</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Complaint Title</label>
          <input 
            type="text" 
            name="title"
            className="form-input" 
            value={formData.title}
            onChange={handleChange}
            required 
            placeholder="E.g., Water leakage in Main Street"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea 
            name="description"
            className="form-input" 
            value={formData.description}
            onChange={handleChange}
            required 
            rows="4"
            placeholder="Provide detailed information about the issue..."
          ></textarea>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              name="category"
              className="form-input" 
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              name="location"
              className="form-input" 
              value={formData.location}
              onChange={handleChange}
              required 
              placeholder="E.g., Ghaziabad Sector 4"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
          {loading ? 'Submitting & Analyzing...' : 'Submit Complaint'}
        </button>
      </form>
    </motion.div>
  );
}
