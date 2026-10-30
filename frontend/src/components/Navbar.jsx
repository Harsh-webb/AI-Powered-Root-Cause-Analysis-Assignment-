import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FileText, 
  Database, 
  Sparkles, 
  Save, 
  PlusCircle, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { setActiveView, toggleAIPanel, setIsSaving, setNotification } from '../store/uiSlice';
import { resetForm, markSaved } from '../store/rcaSlice';
import { rcaApi } from '../api/rcaApi';

const Navbar = () => {
  const dispatch = useDispatch();
  const { activeView, isAIPanelOpen, isSaving } = useSelector((state) => state.ui);
  const { currentForm, hasUnsavedChanges, isPopulatedByAI } = useSelector((state) => state.rca);

  const handleSave = async () => {
    if (!currentForm.product_name || !currentForm.batch_number) {
      dispatch(setNotification({
        type: 'error',
        message: 'Product Name and Batch Number are required before saving.',
      }));
      return;
    }

    try {
      dispatch(setIsSaving(true));
      const savedData = await rcaApi.saveInvestigation(currentForm);
      dispatch(markSaved(savedData));
      dispatch(setNotification({
        type: 'success',
        message: `Investigation ${savedData.deviation_number} successfully saved to database.`,
      }));
    } catch (err) {
      dispatch(setNotification({
        type: 'error',
        message: `Failed to save investigation: ${err.response?.data?.detail || err.message}`,
      }));
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  const handleNewRCA = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes in the current investigation. Start a new one?');
      if (!confirmLeave) return;
    }
    dispatch(resetForm());
    dispatch(setActiveView('form'));
  };

  return (
    <header style={{
      height: '65px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Brand & Module */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                PharmaRCA
              </span>
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontWeight: 600,
                border: '1px solid #dbeafe'
              }}>
                API Manufacturing
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Deviation → Root Cause Analysis → CAPA
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '3px',
          borderRadius: '8px',
          marginLeft: '16px'
        }}>
          <button
            onClick={() => dispatch(setActiveView('form'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.825rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeView === 'form' ? '#ffffff' : 'transparent',
              color: activeView === 'form' ? '#1e3a8a' : '#64748b',
              boxShadow: activeView === 'form' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={15} />
            Investigation Form
            {hasUnsavedChanges && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            )}
          </button>

          <button
            onClick={() => dispatch(setActiveView('records'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.825rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeView === 'records' ? '#ffffff' : 'transparent',
              color: activeView === 'records' ? '#1e3a8a' : '#64748b',
              boxShadow: activeView === 'records' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Database size={15} />
            Saved Records
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* New Investigation Button */}
        <button
          onClick={handleNewRCA}
          className="btn btn-secondary btn-sm"
          title="Start fresh investigation form"
        >
          <PlusCircle size={15} />
          New Investigation
        </button>

        {/* AI Assistant Drawer Toggle Button */}
        <button
          onClick={() => dispatch(toggleAIPanel())}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 14px',
            fontSize: '0.825rem',
            fontWeight: 600,
            borderRadius: '8px',
            border: isAIPanelOpen ? '1px solid #93c5fd' : '1px solid #cbd5e1',
            backgroundColor: isAIPanelOpen ? '#eff6ff' : '#ffffff',
            color: isAIPanelOpen ? '#1d4ed8' : '#334155',
            cursor: 'pointer',
            boxShadow: isAIPanelOpen ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={16} color={isAIPanelOpen ? '#2563eb' : '#64748b'} />
          AI Intake Panel
          {isPopulatedByAI && (
            <span style={{
              fontSize: '0.65rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              padding: '1px 5px',
              borderRadius: '4px'
            }}>
              Active
            </span>
          )}
        </button>

        {/* Save Investigation Button */}
        {activeView === 'form' && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`btn ${hasUnsavedChanges ? 'btn-primary' : 'btn-emerald'}`}
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : currentForm.id ? 'Update Record' : 'Save Investigation'}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
