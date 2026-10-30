import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { updateCapaItem, addCapaItem, removeCapaItem } from '../store/rcaSlice';

const CAPATable = () => {
  const dispatch = useDispatch();
  const { capa_items } = useSelector((state) => state.rca.currentForm);
  const { isPopulatedByAI } = useSelector((state) => state.rca);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Corrective & Preventive Actions (CAPA) Plan
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Targeted remediation measures addressing immediate symptoms (Corrective) and systemic recurrence prevention (Preventive).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => dispatch(addCapaItem({ type: 'Corrective' }))}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            Add Corrective Action
          </button>
          <button
            onClick={() => dispatch(addCapaItem({ type: 'Preventive' }))}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            Add Preventive Action
          </button>
        </div>
      </div>

      {capa_items.length === 0 ? (
        <div style={{
          padding: '36px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px'
        }}>
          <ClipboardCheck size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            No CAPA items defined yet.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Click <strong>Analyze & Populate</strong> in the AI panel to generate cGMP-compliant CAPA recommendations.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {capa_items.map((item) => {
            const isCorrective = item.type === 'Corrective';

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isCorrective ? '1px solid #bfdbfe' : '1px solid #d1fae5',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      color: isCorrective ? '#1e40af' : '#065f46',
                      backgroundColor: isCorrective ? '#dbeafe' : '#d1fae5',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.id}
                    </span>

                    {/* Type Selector */}
                    <select
                      className="form-select"
                      style={{
                        width: '135px',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isCorrective ? '#eff6ff' : '#ecfdf5',
                        color: isCorrective ? '#1d4ed8' : '#047857',
                        borderColor: isCorrective ? '#93c5fd' : '#a7f3d0'
                      }}
                      value={item.type || 'Corrective'}
                      onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'type', value: e.target.value }))}
                    >
                      <option value="Corrective">Corrective</option>
                      <option value="Preventive">Preventive</option>
                    </select>

                    {isPopulatedByAI && (
                      <span className="badge badge-ai-suggested">
                        <Sparkles size={11} /> AI Recommended
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Status dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
                      <select
                        className="form-select"
                        style={{ width: '120px', padding: '4px 8px', fontSize: '0.75rem' }}
                        value={item.status || 'Proposed'}
                        onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'status', value: e.target.value }))}
                      >
                        <option value="Proposed">Proposed</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <button
                      onClick={() => dispatch(removeCapaItem(item.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove CAPA"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Action Description</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'description', value: e.target.value }))}
                    placeholder="Specific actionable engineering, operational, or quality system measure..."
                    style={{ fontWeight: 600, fontSize: '0.875rem' }}
                  />
                </div>

                {/* Grid: Owner, Date, Rationale */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 180px 2fr', gap: '14px' }}>
                  <div>
                    <label className="form-label">Responsible Owner</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.owner || ''}
                      onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'owner', value: e.target.value }))}
                      placeholder="e.g. Lead Instrumentation Engineer"
                      style={{ fontSize: '0.825rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Target Completion Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={item.target_date || ''}
                      onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'target_date', value: e.target.value }))}
                      style={{ fontSize: '0.825rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Implementation Rationale</label>
                    <input
                      type="text"
                      className="form-input"
                      value={item.rationale || ''}
                      onChange={(e) => dispatch(updateCapaItem({ id: item.id, field: 'rationale', value: e.target.value }))}
                      placeholder="How this action eliminates the root cause..."
                      style={{ fontSize: '0.825rem' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CAPATable;
