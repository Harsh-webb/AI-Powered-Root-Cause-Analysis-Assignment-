import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HelpCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  updateWhyItem, 
  toggleWhyConfirmed, 
  addWhyItem, 
  removeWhyItem 
} from '../store/rcaSlice';

const FiveWhysView = () => {
  const dispatch = useDispatch();
  const { five_whys } = useSelector((state) => state.rca.currentForm);
  const { isPopulatedByAI } = useSelector((state) => state.rca);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            5 Whys Causal Pathway Analysis
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Iterative interrogative technique to explore the cause-and-effect relationships underlying the deviation.
          </p>
        </div>
        <button
          onClick={() => dispatch(addWhyItem())}
          className="btn btn-secondary btn-sm"
        >
          <Plus size={14} />
          Add Why Step
        </button>
      </div>

      {five_whys.length === 0 ? (
        <div style={{
          padding: '36px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '12px'
        }}>
          <HelpCircle size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            No 5 Whys steps recorded yet.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Use the <strong>AI Intake Panel</strong> to automatically generate a causal chain from the incident document, or click <em>"Add Why Step"</em> above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {five_whys.map((item, index) => {
            const isConfirmed = item.is_confirmed;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '10px',
                  border: isConfirmed ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  position: 'relative'
                }}
              >
                {/* Step Number Circle */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isConfirmed ? '#d1fae5' : '#eff6ff',
                  color: isConfirmed ? '#047857' : '#1d4ed8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {item.why_number || index + 1}
                </div>

                {/* Form Fields */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                        Why Level {item.why_number || index + 1}
                      </span>
                      {isPopulatedByAI && !isConfirmed && (
                        <span className="badge badge-ai-suggested">
                          <Sparkles size={11} /> AI Suggested
                        </span>
                      )}
                      {isConfirmed && (
                        <span className="badge badge-qa-confirmed">
                          <CheckCircle2 size={11} /> QA Confirmed
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Confirmation Toggle */}
                      <button
                        onClick={() => dispatch(toggleWhyConfirmed(index))}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: isConfirmed ? '1px solid #10b981' : '1px solid #cbd5e1',
                          backgroundColor: isConfirmed ? '#ecfdf5' : '#ffffff',
                          color: isConfirmed ? '#059669' : '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <CheckCircle2 size={13} />
                        {isConfirmed ? 'Confirmed' : 'Confirm Finding'}
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => dispatch(removeWhyItem(index))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Delete step"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      value={item.question || ''}
                      onChange={(e) => dispatch(updateWhyItem({ index, field: 'question', value: e.target.value }))}
                      placeholder="e.g. Why did the temperature excursion occur?"
                      style={{ fontWeight: 600, color: '#1e293b' }}
                    />
                  </div>

                  {/* Answer */}
                  <div>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={item.answer || ''}
                      onChange={(e) => dispatch(updateWhyItem({ index, field: 'answer', value: e.target.value }))}
                      placeholder="Root answer supported by batch records or SCADA logs..."
                      style={{ fontSize: '0.85rem' }}
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

export default FiveWhysView;
