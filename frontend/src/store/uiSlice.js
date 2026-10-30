import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeView: 'form', // 'form' or 'records'
    isAIPanelOpen: true, // Side drawer panel open by default
    activeRcaTab: 'overview', // 'overview', '5whys', 'fishbone', 'root_causes', 'evidence', 'capa'
    isExtracting: false,
    isSaving: false,
    notification: null,
  },
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    toggleAIPanel: (state) => {
      state.isAIPanelOpen = !state.isAIPanelOpen;
    },
    setAIPanelOpen: (state, action) => {
      state.isAIPanelOpen = action.payload;
    },
    setActiveRcaTab: (state, action) => {
      state.activeRcaTab = action.payload;
    },
    setIsExtracting: (state, action) => {
      state.isExtracting = action.payload;
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  setActiveView,
  toggleAIPanel,
  setAIPanelOpen,
  setActiveRcaTab,
  setIsExtracting,
  setIsSaving,
  setNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
