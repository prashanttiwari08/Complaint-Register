import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BrainCircuit, AlertTriangle, Building, MessageSquare, ShieldAlert } from 'lucide-react';

export default function ComplaintDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(`https://complaint-register-pm38.onrender.com/api/complaints`);
      const found = res.data.data.find(c => c._id === id);
      if (found) {
        setComplaint(found);
        setStatus(found.status);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://complaint-register-pm38.onrender.com/api/complaints/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaint({ ...complaint, status });
      setUpdating(false);
    } catch (err) {
      console.error(err);
      setUpdating(false);
    }
  };

  const getPriorityColor = (prio) => {
    if (prio === 'High') return 'var(--danger)';
    if (prio === 'Medium') return 'var(--warning)';
    return 'var(--success)';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  if (!complaint) return <div style={{ textAlign: 'center', padding: '40px' }}>Complaint not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Complaint Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="grid-2">
        <div className="glass-panel">
          <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>{complaint.title}</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Description:</p>
            <p style={{ lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
              {complaint.description}
            </p>
          </div>

          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Category</p>
              <p style={{ fontWeight: '500' }}>{complaint.category}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Location</p>
              <p style={{ fontWeight: '500' }}>{complaint.location}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Reported By</p>
              <p style={{ fontWeight: '500' }}>{complaint.name} ({complaint.email})</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Date</p>
              <p style={{ fontWeight: '500' }}>{new Date(complaint.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
            <h4 style={{ marginBottom: '15px' }}>Update Status</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                className="form-input" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button 
                className="btn btn-primary" 
                onClick={handleStatusUpdate}
                disabled={updating || status === complaint.status}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {complaint.aiPriority && (
          <motion.div 
            className="glass-panel" 
            style={{ border: '1px solid rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
              <BrainCircuit size={150} />
            </div>
            
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a78bfa', marginBottom: '20px' }}>
              <BrainCircuit /> AI Analysis Results
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', color: getPriorityColor(complaint.aiPriority) }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Priority Level</p>
                  <p style={{ fontWeight: '600', fontSize: '16px', color: getPriorityColor(complaint.aiPriority) }}>
                    {complaint.aiPriority} Priority
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', color: '#60a5fa' }}>
                  <Building size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Recommended Department</p>
                  <p style={{ fontWeight: '500', fontSize: '15px' }}>
                    {complaint.aiDepartment}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', color: '#f472b6' }}>
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>AI Summary</p>
                  <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {complaint.aiSummary}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', color: '#34d399' }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Auto-Generated Response</p>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', fontStyle: 'italic', background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
                    "{complaint.aiResponse}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
