import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FileSearch, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { 
  toggleEvidenceStatus, 
  updateEvidenceItem, 
  addEvidenceItem, 
  removeEvidenceItem 
} from '../store/rcaSlice';

const EvidenceGapsView = () => {
  const dispatch = useDispatch();
  const { missing_evidence } = useSelector((state) => state.rca.currentForm);
  const { isPopulatedByAI } = useSelector((state) => state.rca);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Evidence Verification & Information Gaps Checklist
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Highlights missing documentation, unverified sensor calibrations, or laboratory data required to substantiate the root cause.
          </p>
        </div>
        <button
          onClick={() => dispatch(addEvidenceItem())}
          className="btn btn-secondary btn-sm"
        >
          <Plus size={14} />
          Add Evidence Requirement
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FileSearch size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: '#1e40af' }}>
          <strong>Investigation Rigor:</strong> Under regulatory cGMP expectations (FDA/EMA), quality investigations must prove hypothesis elimination using documented, objective evidence before issuing final CAPA.
        </span>
      </div>

      {missing_evidence.length === 0 ? (
        <div style={{
          padding: '36px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px'
        }}>
          <FileSearch size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            No evidence gaps identified.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Use the <strong>AI Intake Panel</strong> to analyze the deviation for missing calibration logs, SCADA trends, or vendor CoAs.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {missing_evidence.map((evid) => {
            const isCollected = evid.status === 'Collected';

            return (
              <div
                key={evid.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isCollected ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* Top header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: '#1e3a8a',
                      backgroundColor: '#dbeafe',
                      padding: '2px 7px',
                      borderRadius: '5px'
                    }}>
                      {evid.id}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: evid.priority === 'High' ? '#be123c' : '#b45309',
                      backgroundColor: evid.priority === 'High' ? '#ffe4e6' : '#fef3c7',
                      padding: '2px 7px',
                      borderRadius: '5px'
                    }}>
                      {evid.priority || 'High'} Priority
                    </span>
                    {isPopulatedByAI && (
                      <span className="badge badge-ai-suggested">
                        <Sparkles size={11} /> AI Highlighted Gap
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Status Toggle */}
                    <button
                      onClick={() => dispatch(toggleEvidenceStatus(evid.id))}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: isCollected ? '1px solid #10b981' : '1px solid #f59e0b',
                        backgroundColor: isCollected ? '#ecfdf5' : '#fffbeb',
                        color: isCollected ? '#047857' : '#b45309',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      {isCollected ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      {isCollected ? 'Collected & Verified' : 'Mark as Collected'}
                    </button>

                    <button
                      onClick={() => dispatch(removeEvidenceItem(evid.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Evidence Item Name */}
                <div>
                  <label className="form-label">Required Document / Analytical Evidence</label>
                  <input
                    type="text"
                    className="form-input"
                    value={evid.item || ''}
                    onChange={(e) => dispatch(updateEvidenceItem({ id: evid.id, field: 'item', value: e.target.value }))}
                    placeholder="e.g. SCADA continuous temperature trend log for hours 12:00 to 18:00..."
                    style={{ fontWeight: 600 }}
                  />
                </div>

                {/* Grid: Category and Why Needed */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Evidence Domain</label>
                    <input
                      type="text"
                      className="form-input"
                      value={evid.category || ''}
                      onChange={(e) => dispatch(updateEvidenceItem({ id: evid.id, field: 'category', value: e.target.value }))}
                      placeholder="e.g. Metrology / Automation"
                    />
                  </div>
                  <div>
                    <label className="form-label">Investigation Justification (Why Needed)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={evid.why_needed || ''}
                      onChange={(e) => dispatch(updateEvidenceItem({ id: evid.id, field: 'why_needed', value: e.target.value }))}
                      placeholder="Why this record is essential to eliminate alternate hypotheses..."
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

export default EvidenceGapsView;
