import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Cpu, 
  Boxes, 
  FileSpreadsheet, 
  Gauge, 
  CloudSun, 
  Plus, 
  X, 
  Sparkles,
  GitBranch
} from 'lucide-react';
import { addFishboneItem, removeFishboneItem } from '../store/rcaSlice';

const CATEGORY_META = {
  man: { label: 'People / Manpower', icon: Users, color: '#3b82f6', bg: '#eff6ff', desc: 'Training, shift turnover, procedural adherence' },
  machine: { label: 'Machine / Equipment', icon: Cpu, color: '#8b5cf6', bg: '#f5f3ff', desc: 'Valves, sensors, agitators, calibration' },
  material: { label: 'Material / Reagents', icon: Boxes, color: '#10b981', bg: '#ecfdf5', desc: 'Raw materials, solvents, catalysts, purity' },
  method: { label: 'Method / Procedures', icon: FileSpreadsheet, color: '#f59e0b', bg: '#fffbeb', desc: 'SOPs, batch records, recipes, agitation cycle' },
  measurement: { label: 'Measurement / QC', icon: Gauge, color: '#06b6d4', bg: '#ecfeff', desc: 'HPLC, GC, online probes, analytical resolution' },
  environment: { label: 'Environment / Milieu', icon: CloudSun, color: '#64748b', bg: '#f8fafc', desc: 'Cleanroom humidity, HVAC, summer ambient' },
};

const FishboneView = () => {
  const dispatch = useDispatch();
  const { fishbone, cqa_affected, title } = useSelector((state) => state.rca.currentForm);
  const { isPopulatedByAI } = useSelector((state) => state.rca);

  const [inputValues, setInputValues] = useState({
    man: '', machine: '', material: '', method: '', measurement: '', environment: ''
  });

  const handleAdd = (cat) => {
    const text = inputValues[cat]?.trim();
    if (text) {
      dispatch(addFishboneItem({ category: cat, text }));
      setInputValues({ ...inputValues, [cat]: '' });
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
            Ishikawa Fishbone Analysis (6M Framework)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Systematic categorization of potential contributing factors leading to the quality deviation.
          </p>
        </div>
      </div>

      {/* Fishbone Problem Head Banner */}
      <div style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <GitBranch size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Primary Effect / Deviation Symptom (Fishbone Spine)
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
              {cqa_affected || title || 'Quality Deviation Excursion'}
            </div>
          </div>
        </div>
        {isPopulatedByAI && (
          <span className="badge badge-ai-suggested">
            <Sparkles size={11} /> AI Categorized
          </span>
        )}
      </div>

      {/* 6M Category Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const items = fishbone[key] || [];
          const Icon = meta.icon;

          return (
            <div
              key={key}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    backgroundColor: meta.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: meta.color
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {meta.label}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {items.length} {items.length === 1 ? 'factor' : 'factors'}
                </span>
              </div>

              <p style={{ fontSize: '0.725rem', color: '#94a3b8', marginBottom: '12px' }}>
                {meta.desc}
              </p>

              {/* Items List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                {items.length === 0 ? (
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                    No factors identified in this branch.
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '7px 10px',
                        fontSize: '0.8rem',
                        color: '#334155',
                        lineHeight: '1.35'
                      }}
                    >
                      <span style={{ flex: 1 }}>{item}</span>
                      <button
                        onClick={() => dispatch(removeFishboneItem({ category: key, index: idx }))}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '1px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove factor"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add item input */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.775rem', padding: '6px 10px' }}
                  placeholder={`Add ${meta.label.split('/')[0].trim()} factor...`}
                  value={inputValues[key]}
                  onChange={(e) => setInputValues({ ...inputValues, [key]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd(key);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAdd(key)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 10px' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FishboneView;
