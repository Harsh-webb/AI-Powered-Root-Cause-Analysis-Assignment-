import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import Navbar from './components/Navbar';
import RCAForm from './components/RCAForm';
import AIPanel from './components/AIPanel';
import SavedInvestigations from './components/SavedInvestigations';
import { clearNotification } from './store/uiSlice';

function App() {
  const dispatch = useDispatch();
  const { activeView, notification } = useSelector((state) => state.ui);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '75px',
          right: '24px',
          zIndex: 50,
          backgroundColor: notification.type === 'error' ? '#fff1f2' : notification.type === 'success' ? '#ecfdf5' : '#eff6ff',
          color: notification.type === 'error' ? '#9f1239' : notification.type === 'success' ? '#065f46' : '#1e40af',
          border: '1px solid',
          borderColor: notification.type === 'error' ? '#fecdd3' : notification.type === 'success' ? '#a7f3d0' : '#bfdbfe',
          borderRadius: '10px',
          padding: '12px 18px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '440px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {notification.type === 'error' && <AlertTriangle size={18} color="#e11d48" />}
          {notification.type === 'success' && <CheckCircle2 size={18} color="#059669" />}
          {notification.type === 'info' && <Info size={18} color="#2563eb" />}
          <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>
            {notification.message}
          </span>
          <button
            onClick={() => dispatch(clearNotification())}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '2px' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace + AI Side Panel Drawer */}
      <div className="main-content">
        <main className="workspace-area">
          {activeView === 'form' ? <RCAForm /> : <SavedInvestigations />}
        </main>
        
        {/* Right AI Drawer Panel */}
        <AIPanel />
      </div>
    </div>
  );
}

export default App;
