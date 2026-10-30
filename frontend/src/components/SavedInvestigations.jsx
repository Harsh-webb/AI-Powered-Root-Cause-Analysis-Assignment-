import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Database, 
  Search, 
  Filter, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Clock,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { loadInvestigation } from '../store/rcaSlice';
import { setActiveView, setActiveRcaTab, setNotification } from '../store/uiSlice';
import { rcaApi } from '../api/rcaApi';

const SavedInvestigations = () => {
  const dispatch = useDispatch();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await rcaApi.getAllInvestigations(statusFilter, searchTerm);
      setRecords(data);
    } catch (err) {
      dispatch(setNotification({
        type: 'error',
        message: `Failed to load investigations from database: ${err.message}`,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleLoad = (record) => {
    dispatch(loadInvestigation(record));
    dispatch(setActiveView('form'));
    dispatch(setActiveRcaTab('overview'));
    dispatch(setNotification({
      type: 'info',
      message: `Loaded investigation ${record.deviation_number} into form.`,
    }));
  };

  const handleDelete = async (id, devNum) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete investigation ${devNum}?`);
    if (!confirmDelete) return;

    try {
      await rcaApi.deleteInvestigation(id);
      dispatch(setNotification({
        type: 'success',
        message: `Investigation ${devNum} removed from database.`,
      }));
      fetchRecords();
    } catch (err) {
      dispatch(setNotification({
        type: 'error',
        message: `Delete failed: ${err.message}`,
      }));
    }
  };

  // Metrics
  const totalCount = records.length;
  const criticalCount = records.filter(r => r.severity === 'Critical').length;
  const confirmedCount = records.filter(r => r.status === 'QA Confirmed').length;
  let totalCapas = 0;
  records.forEach(r => {
    if (r.capa_items) totalCapas += r.capa_items.length;
  });

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
            Saved RCA Investigations Database
          </h2>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Central repository of pharmaceutical API quality deviations, 5 Whys causal records, and CAPA commitments.
          </p>
        </div>
        <button
          onClick={fetchRecords}
          className="btn btn-secondary btn-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Total Investigations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#059669', marginTop: '2px' }}>
            Active quality records
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Critical Deviations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#be123c', marginTop: '4px' }}>
            {criticalCount}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#be123c', marginTop: '2px' }}>
            High regulatory priority
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            QA Confirmed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#047857', marginTop: '4px' }}>
            {confirmedCount}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#047857', marginTop: '2px' }}>
            Verified with evidence
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Total CAPA Actions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d4ed8', marginTop: '4px' }}>
            {totalCapas}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#1d4ed8', marginTop: '2px' }}>
            Corrective & preventive items
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '34px' }}
              placeholder="Search by deviation number, product, batch, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
          <select
            className="form-select"
            style={{ width: '170px', padding: '6px 10px', fontSize: '0.8rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="QA Confirmed">QA Confirmed</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
            Loading investigations from database...
          </div>
        ) : records.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Database size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>No matching investigations found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Deviation #</th>
                <th style={{ padding: '12px 18px' }}>Product & Title</th>
                <th style={{ padding: '12px 18px' }}>Batch</th>
                <th style={{ padding: '12px 18px' }}>Severity</th>
                <th style={{ padding: '12px 18px' }}>Status</th>
                <th style={{ padding: '12px 18px' }}>RCA Elements</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '14px 18px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#1e3a8a' }}>
                    {r.deviation_number}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.product_name}</div>
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'JetBrains Mono, monospace', color: '#334155' }}>
                    {r.batch_number}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge ${
                      r.severity === 'Critical' ? 'badge-critical' :
                      r.severity === 'Major' ? 'badge-major' : 'badge-minor'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: r.status === 'QA Confirmed' ? '#d1fae5' : '#f1f5f9',
                      color: r.status === 'QA Confirmed' ? '#047857' : '#475569'
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.725rem' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        5 Whys: {r.five_whys?.length || 0}
                      </span>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        CAPA: {r.capa_items?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleLoad(r)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        title="Load into investigation workbench"
                      >
                        <ExternalLink size={13} />
                        Open Form
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.deviation_number)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete investigation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SavedInvestigations;
