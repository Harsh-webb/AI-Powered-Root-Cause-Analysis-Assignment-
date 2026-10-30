import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Target, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { 
  toggleRootCauseStatus, 
  updateRootCause, 
  addRootCause, 
  removeRootCause 
} from '../store/rcaSlice';

const RootCausesView = () => {
  const dispatch = useDispatch();
  const { root_causes } = useSelector((state) => state.rca.currentForm);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Root Cause & Contributing Factors Synthesis
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Synthesized conclusions establishing root causality. Under cGMP guidelines, AI causes remain suggestions until confirmed by a qualified QA investigator.
          </p>
        </div>
        <button
          onClick={() => dispatch(addRootCause())}
          className="btn btn-secondary btn-sm"
        >
          <Plus size={14} />
          Add Cause Hypothesis
        </button>
      </div>

      {root_causes.length === 0 ? (
        <div style={{
          padding: '36px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px'
        }}>
          <Target size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            No root causes identified yet.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Click <strong>Analyze & Populate</strong> in the AI panel to generate evidence-backed hypotheses.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {root_causes.map((rc) => {
            const isConfirmed = rc.status === 'QA Confirmed';

            return (
              <div
                key={rc.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: isConfirmed ? '1.5px solid #10b981' : '1.5px solid #fde68a',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
              >
                {/* Header bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: rc.is_primary ? '#1e3a8a' : '#475569',
                      backgroundColor: rc.is_primary ? '#dbeafe' : '#f1f5f9',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {rc.id} • {rc.is_primary ? 'Primary Root Cause' : 'Contributing Factor'}
                    </span>

                    {/* Verification Status Badge */}
                    {isConfirmed ? (
                      <span className="badge badge-qa-confirmed">
                        <CheckCircle2 size={13} /> QA Confirmed by Qualified Person
                      </span>
                    ) : (
                      <span className="badge badge-ai-suggested">
                        <Sparkles size={13} /> AI Suggested (Pending Verification)
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Confirmation Button */}
                    <button
                      onClick={() => dispatch(toggleRootCauseStatus(rc.id))}
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: isConfirmed ? '1px solid #10b981' : '1px solid #f59e0b',
                        backgroundColor: isConfirmed ? '#ecfdf5' : '#fffbeb',
                        color: isConfirmed ? '#047857' : '#b45309',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <ShieldCheck size={14} />
                      {isConfirmed ? 'Revoke Confirmation' : 'Confirm & Validate (QA Signoff)'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => dispatch(removeRootCause(rc.id))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Delete root cause"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Cause Statement */}
                <div style={{ marginBottom: '12px' }}>
                  <label className="form-label">Root Cause Statement</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={rc.cause_statement || ''}
                    onChange={(e) => dispatch(updateRootCause({ id: rc.id, field: 'cause_statement', value: e.target.value }))}
                    placeholder="Concise, verified root cause statement..."
                    style={{ fontWeight: 600, fontSize: '0.925rem', color: '#0f172a' }}
                  />
                </div>

                {/* Metadata Row: Category & Confidence */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <label className="form-label">Category / System</label>
                    <input
                      type="text"
                      className="form-input"
                      value={rc.category || ''}
                      onChange={(e) => dispatch(updateRootCause({ id: rc.id, field: 'category', value: e.target.value }))}
                      placeholder="e.g. Maintenance Governance, Calibration, Automation"
                    />
                  </div>
                  <div>
                    <label className="form-label">Investigation Confidence Score</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '40px' }}>
                      <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.round((rc.confidence || 0.8) * 100)}%`,
                            backgroundColor: isConfirmed ? '#10b981' : '#3b82f6',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#334155' }}>
                        {Math.round((rc.confidence || 0.8) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evidence Rationale */}
                <div>
                  <label className="form-label">Evidence & Rationale Support</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={rc.rationale || ''}
                    onChange={(e) => dispatch(updateRootCause({ id: rc.id, field: 'rationale', value: e.target.value }))}
                    placeholder="Specific documentation, logs, or empirical proof corroborating this cause..."
                    style={{ fontSize: '0.825rem', color: '#475569' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RootCausesView;
