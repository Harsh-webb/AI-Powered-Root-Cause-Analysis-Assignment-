import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Mail, 
  FileCode, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  X,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { populateFromAI } from '../store/rcaSlice';
import { setIsExtracting, setNotification, toggleAIPanel, setActiveRcaTab } from '../store/uiSlice';
import { rcaApi } from '../api/rcaApi';

const AIPanel = () => {
  const dispatch = useDispatch();
  const { isAIPanelOpen, isExtracting } = useSelector((state) => state.ui);
  const { isPopulatedByAI, aiRawResult } = useSelector((state) => state.rca);

  const [inputMode, setInputMode] = useState('text'); // 'text', 'email', 'pdf', 'samples'
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  // Load sample deviations from backend
  useEffect(() => {
    const loadSamples = async () => {
      try {
        const data = await rcaApi.getSamples();
        setSamples(data);
        if (data.length > 0) {
          setSelectedSampleId(data[0].id);
          setInputText(data[0].description);
        }
      } catch (err) {
        console.error('Failed to load sample incidents', err);
      }
    };
    loadSamples();
  }, []);

  const handleSampleChange = (id) => {
    setSelectedSampleId(id);
    const found = samples.find(s => s.id === id);
    if (found) {
      setInputText(found.description);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleExtract = async () => {
    if (inputMode === 'pdf') {
      if (!selectedFile) {
        dispatch(setNotification({
          type: 'error',
          message: 'Please select a PDF document first.',
        }));
        return;
      }
      try {
        dispatch(setIsExtracting(true));
        const result = await rcaApi.uploadDocument(selectedFile);
        setExtractedData(result);
        dispatch(populateFromAI(result));
        dispatch(setNotification({
          type: 'success',
          message: `AI extraction completed from ${selectedFile.name}! Form populated.`,
        }));
      } catch (err) {
        dispatch(setNotification({
          type: 'error',
          message: `Document extraction failed: ${err.response?.data?.detail || err.message}`,
        }));
      } finally {
        dispatch(setIsExtracting(false));
      }
    } else {
      if (!inputText.trim()) {
        dispatch(setNotification({
          type: 'error',
          message: 'Please paste or enter incident details to extract.',
        }));
        return;
      }
      try {
        dispatch(setIsExtracting(true));
        const result = await rcaApi.extractFromText(
          inputText,
          inputMode,
          inputMode === 'email' ? 'Email Incident Memo' : 'Pasted Incident Note'
        );
        setExtractedData(result);
        dispatch(populateFromAI(result));
        dispatch(setNotification({
          type: 'success',
          message: `AI extraction completed for ${result.product_name}! Form populated.`,
        }));
      } catch (err) {
        dispatch(setNotification({
          type: 'error',
          message: `AI extraction failed: ${err.response?.data?.detail || err.message}`,
        }));
      } finally {
        dispatch(setIsExtracting(false));
      }
    }
  };

  const handleApplyToForm = () => {
    if (extractedData) {
      dispatch(populateFromAI(extractedData));
      dispatch(setActiveRcaTab('overview'));
      dispatch(setNotification({
        type: 'success',
        message: 'RCA Form fields updated with AI extraction.',
      }));
    }
  };

  if (!isAIPanelOpen) {
    return null;
  }

  return (
    <aside style={{
      width: '420px',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.04)',
      zIndex: 20
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1d4ed8'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
              AI RCA Intake Panel
            </h3>
            <p style={{ fontSize: '0.725rem', color: '#64748b' }}>
              LangGraph + Groq Quality Agent
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleAIPanel())}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Input Mode Tabs */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
          backgroundColor: '#f1f5f9',
          padding: '3px',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => setInputMode('samples')}
            style={{
              padding: '6px 4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: inputMode === 'samples' ? '#ffffff' : 'transparent',
              color: inputMode === 'samples' ? '#1e3a8a' : '#64748b',
              boxShadow: inputMode === 'samples' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Samples
          </button>
          <button
            onClick={() => setInputMode('text')}
            style={{
              padding: '6px 4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: inputMode === 'text' ? '#ffffff' : 'transparent',
              color: inputMode === 'text' ? '#1e3a8a' : '#64748b',
              boxShadow: inputMode === 'text' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Paste Text
          </button>
          <button
            onClick={() => setInputMode('email')}
            style={{
              padding: '6px 4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: inputMode === 'email' ? '#ffffff' : 'transparent',
              color: inputMode === 'email' ? '#1e3a8a' : '#64748b',
              boxShadow: inputMode === 'email' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Email Memo
          </button>
          <button
            onClick={() => setInputMode('pdf')}
            style={{
              padding: '6px 4px',
              fontSize: '0.725rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: inputMode === 'pdf' ? '#ffffff' : 'transparent',
              color: inputMode === 'pdf' ? '#1e3a8a' : '#64748b',
              boxShadow: inputMode === 'pdf' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            Upload PDF
          </button>
        </div>
      </div>

      {/* Main Panel Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Sample Selection Mode */}
        {inputMode === 'samples' && (
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Select API Manufacturing Incident</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {samples.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSampleChange(sample.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: selectedSampleId === sample.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: selectedSampleId === sample.id ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                    {sample.title}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>
                    Batch: {sample.batch} • {sample.product}
                  </div>
                </div>
              ))}
            </div>
            <label className="form-label">Incident Document Content</label>
            <textarea
              className="form-textarea"
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Incident text..."
              style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>
        )}

        {/* Text / Email Mode */}
        {(inputMode === 'text' || inputMode === 'email') && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                {inputMode === 'email' ? 'Paste Incident Email Memo' : 'Paste Deviation / Incident Log'}
              </label>
              <button
                onClick={() => setInputText('')}
                style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
            <textarea
              className="form-textarea"
              rows={11}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                inputMode === 'email'
                  ? "From: plant_qa@pharmaco.com\nSubject: Deviation Alert - Reactor R-301 Temperature Spike\n\nIncident summary..."
                  : "Enter raw incident log, observation notes, or laboratory failure notice..."
              }
              style={{ fontSize: '0.825rem', lineHeight: '1.45' }}
            />
          </div>
        )}

        {/* PDF Upload Mode */}
        {inputMode === 'pdf' && (
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Upload Deviation Report / PDF</label>
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
              onClick={() => document.getElementById('pdf-upload-input').click()}
            >
              <UploadCloud size={36} color="#64748b" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                {selectedFile ? selectedFile.name : 'Click to select or drop PDF file'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '4px' }}>
                Supports standard pharma deviation PDFs and QA audit scans
              </div>
              <input
                id="pdf-upload-input"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Link to sample PDF in workspace */}
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Sample PDF generated:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>sample_deviation_report.pdf</span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleExtract}
          disabled={isExtracting}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          {isExtracting ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Running LangGraph Workflow...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze & Populate RCA Form
            </>
          )}
        </button>

        {/* Loading Progress State */}
        {isExtracting && (
          <div style={{
            marginTop: '16px',
            padding: '14px',
            backgroundColor: '#f0f7ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e40af', marginBottom: '8px' }}>
              LangGraph StateGraph Execution:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2563eb" />
                <span>Extracting deviation parameters & CQA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2563eb" />
                <span>Synthesizing 5 Whys & 6M Fishbone tree</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2563eb" />
                <span>Evaluating root cause hypotheses (Suggested)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2563eb" />
                <span>Checking missing evidence & calibration logs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} color="#2563eb" />
                <span>Generating Corrective & Preventive Actions</span>
              </div>
            </div>
          </div>
        )}

        {/* Extraction Results Summary */}
        {(extractedData || aiRawResult) && !isExtracting && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={14} /> Extraction Complete
              </span>
              <span style={{
                fontSize: '0.675rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Cpu size={11} />
                {(extractedData || aiRawResult).llm_source || 'Groq / Heuristics'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '12px', lineHeight: '1.4' }}>
              {(extractedData || aiRawResult).ai_summary}
            </div>

            {/* Breakdown Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              fontSize: '0.725rem',
              color: '#475569',
              marginBottom: '14px'
            }}>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Product:</strong> {(extractedData || aiRawResult).product_name?.substring(0, 18)}...
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Batch:</strong> {(extractedData || aiRawResult).batch_number}
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>5 Whys Steps:</strong> {(extractedData || aiRawResult).five_whys?.length || 0}
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Root Causes:</strong> {(extractedData || aiRawResult).root_causes?.length || 0}
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>Evidence Gaps:</strong> {(extractedData || aiRawResult).missing_evidence?.length || 0}
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong>CAPA Plan:</strong> {(extractedData || aiRawResult).capa_items?.length || 0} items
              </div>
            </div>

            {/* Re-apply button */}
            <button
              onClick={handleApplyToForm}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <FileCheck2 size={14} />
              Re-populate Form Fields
            </button>
          </div>
        )}

        {/* Regulatory cGMP Note */}
        <div style={{
          marginTop: '20px',
          padding: '10px 12px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.725rem', color: '#92400e', lineHeight: '1.4' }}>
            <strong>cGMP Compliance Rule:</strong> All AI-generated root causes and causal factors are initially marked as <em>"AI Suggested"</em>. They must be reviewed, verified with supporting records, and formally confirmed by a qualified QA investigator.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AIPanel;
