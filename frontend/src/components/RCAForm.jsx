import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FileText, 
  HelpCircle, 
  GitBranch, 
  Target, 
  FileSearch, 
  ClipboardCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Edit3
} from 'lucide-react';
import { updateFormField } from '../store/rcaSlice';
import { setActiveRcaTab } from '../store/uiSlice';
import FiveWhysView from './FiveWhysView';
import FishboneView from './FishboneView';
import RootCausesView from './RootCausesView';
import EvidenceGapsView from './EvidenceGapsView';
import CAPATable from './CAPATable';

const RCAForm = () => {
  const dispatch = useDispatch();
  const { currentForm, isPopulatedByAI, hasUnsavedChanges } = useSelector((state) => state.rca);
  const { activeRcaTab } = useSelector((state) => state.ui);

  const handleFieldChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  // Counts for tab badges
  const whyCount = currentForm.five_whys?.length || 0;
  const confirmedWhys = currentForm.five_whys?.filter(w => w.is_confirmed).length || 0;
  
  let fishboneCount = 0;
  if (currentForm.fishbone) {
    Object.values(currentForm.fishbone).forEach(arr => {
      fishboneCount += Array.isArray(arr) ? arr.length : 0;
    });
  }

  const rootCauseCount = currentForm.root_causes?.length || 0;
  const confirmedCauses = currentForm.root_causes?.filter(rc => rc.status === 'QA Confirmed').length || 0;
  
  const evidenceCount = currentForm.missing_evidence?.length || 0;
  const pendingEvidence = currentForm.missing_evidence?.filter(e => e.status !== 'Collected').length || 0;

  const capaCount = currentForm.capa_items?.length || 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Deviation Summary Header Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1e3a8a',
                backgroundColor: '#eff6ff',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #dbeafe'
              }}>
                {currentForm.deviation_number || 'DEV-2026-DRAFT'}
              </span>

              {/* Severity Badge */}
              <span className={`badge ${
                currentForm.severity === 'Critical' ? 'badge-critical' :
                currentForm.severity === 'Major' ? 'badge-major' : 'badge-minor'
              }`}>
                {currentForm.severity} Severity
              </span>

              {/* Status Badge */}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: currentForm.status === 'QA Confirmed' ? '#d1fae5' : '#f1f5f9',
                color: currentForm.status === 'QA Confirmed' ? '#047857' : '#475569',
                border: '1px solid',
                borderColor: currentForm.status === 'QA Confirmed' ? '#a7f3d0' : '#cbd5e1'
              }}>
                {currentForm.status}
              </span>

              {isPopulatedByAI && (
                <span className="badge badge-ai-suggested">
                  <Sparkles size={11} /> AI Populated
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
              {currentForm.title || 'Untitled Deviation Investigation'}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', fontSize: '0.825rem', color: '#64748b' }}>
              <div><strong>Product:</strong> {currentForm.product_name || 'Not specified'}</div>
              <div><strong>Batch:</strong> {currentForm.batch_number || 'Not specified'}</div>
              <div><strong>Facility:</strong> {currentForm.facility || 'Plant 1'}</div>
              <div><strong>Date:</strong> {currentForm.date_occurred || 'Pending'}</div>
            </div>
          </div>
        </div>

        {/* AI Banner Alert */}
        {isPopulatedByAI && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#1e40af'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={15} color="#2563eb" />
              <span>
                <strong>Reviewer Workflow:</strong> All fields, causal trees, and CAPAs have been auto-populated by AI. You can edit any parameter directly or toggle root causes to <em>QA Confirmed</em> before saving.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Form Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <button
          onClick={() => dispatch(setActiveRcaTab('overview'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === 'overview' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === 'overview' ? '#ffffff' : 'transparent',
            color: activeRcaTab === 'overview' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <FileText size={16} />
          1. Deviation Overview
        </button>

        <button
          onClick={() => dispatch(setActiveRcaTab('5whys'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === '5whys' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === '5whys' ? '#ffffff' : 'transparent',
            color: activeRcaTab === '5whys' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <HelpCircle size={16} />
          2. 5 Whys ({whyCount})
        </button>

        <button
          onClick={() => dispatch(setActiveRcaTab('fishbone'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === 'fishbone' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === 'fishbone' ? '#ffffff' : 'transparent',
            color: activeRcaTab === 'fishbone' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <GitBranch size={16} />
          3. Fishbone (6M) ({fishboneCount})
        </button>

        <button
          onClick={() => dispatch(setActiveRcaTab('root_causes'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === 'root_causes' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === 'root_causes' ? '#ffffff' : 'transparent',
            color: activeRcaTab === 'root_causes' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Target size={16} />
          4. Root Causes ({rootCauseCount})
          {confirmedCauses > 0 && (
            <span style={{ fontSize: '0.7rem', backgroundColor: '#d1fae5', color: '#047857', padding: '1px 6px', borderRadius: '9999px' }}>
              {confirmedCauses} confirmed
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch(setActiveRcaTab('evidence'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === 'evidence' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === 'evidence' ? '#ffffff' : 'transparent',
            color: activeRcaTab === 'evidence' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <FileSearch size={16} />
          5. Evidence Gaps ({evidenceCount})
          {pendingEvidence > 0 && (
            <span style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '9999px' }}>
              {pendingEvidence} pending
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch(setActiveRcaTab('capa'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeRcaTab === 'capa' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeRcaTab === 'capa' ? '#ffffff' : 'transparent',
            color: activeRcaTab === 'capa' ? '#1d4ed8' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ClipboardCheck size={16} />
          6. CAPA Plan ({capaCount})
        </button>
      </div>

      {/* Tab Contents */}
      {activeRcaTab === 'overview' && (
        <div className="form-card animate-fade-in">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Deviation Details & Immediate Containment
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Investigation Title</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Descriptive title of the deviation..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Deviation Tracking Number</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.deviation_number || ''}
                onChange={(e) => handleFieldChange('deviation_number', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Active Pharmaceutical Ingredient (API)</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.product_name || ''}
                onChange={(e) => handleFieldChange('product_name', e.target.value)}
                placeholder="e.g. Paracetamol API"
              />
            </div>
            <div>
              <label className="form-label">Batch / Lot Number</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.batch_number || ''}
                onChange={(e) => handleFieldChange('batch_number', e.target.value)}
                placeholder="e.g. PRC-26-0419"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="form-label">Manufacturing Facility</label>
              <input
                type="text"
                className="form-input"
                value={currentForm.facility || ''}
                onChange={(e) => handleFieldChange('facility', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Date Occurred</label>
              <input
                type="date"
                className="form-input"
                value={currentForm.date_occurred || ''}
                onChange={(e) => handleFieldChange('date_occurred', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Deviation Severity</label>
              <select
                className="form-select"
                value={currentForm.severity || 'Major'}
                onChange={(e) => handleFieldChange('severity', e.target.value)}
              >
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="form-label">Investigation Status</label>
              <select
                className="form-select"
                value={currentForm.status || 'Under Investigation'}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                <option value="Draft">Draft</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="QA Confirmed">QA Confirmed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Critical Quality Attribute (CQA) Affected</label>
            <input
              type="text"
              className="form-input"
              value={currentForm.cqa_affected || ''}
              onChange={(e) => handleFieldChange('cqa_affected', e.target.value)}
              placeholder="e.g. Related Substances (4-Aminophenol Impurity C > 0.15%), Dissolution Rate, Particle Size"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Event Description & Chronological Observations</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={currentForm.event_description || ''}
              onChange={(e) => handleFieldChange('event_description', e.target.value)}
              placeholder="Detailed chronological summary of what occurred in the manufacturing plant..."
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Immediate Containment Actions (Quarantine & Isolation)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={currentForm.immediate_containment || ''}
              onChange={(e) => handleFieldChange('immediate_containment', e.target.value)}
              placeholder="Initial containment steps taken to prevent non-conforming API from distribution..."
            />
          </div>

          <div>
            <label className="form-label">Investigator Notes & Comments</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={currentForm.investigator_notes || ''}
              onChange={(e) => handleFieldChange('investigator_notes', e.target.value)}
              placeholder="Additional remarks from lead investigator or QA manager..."
            />
          </div>
        </div>
      )}

      {activeRcaTab === '5whys' && <FiveWhysView />}
      {activeRcaTab === 'fishbone' && <FishboneView />}
      {activeRcaTab === 'root_causes' && <RootCausesView />}
      {activeRcaTab === 'evidence' && <EvidenceGapsView />}
      {activeRcaTab === 'capa' && <CAPATable />}
    </div>
  );
};

export default RCAForm;
