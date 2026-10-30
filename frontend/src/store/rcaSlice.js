import { createSlice } from '@reduxjs/toolkit';

const initialFormState = {
  id: null,
  deviation_number: '',
  title: '',
  facility: 'API Synthesis Plant 3',
  product_name: '',
  batch_number: '',
  date_occurred: new Date().toISOString().split('T')[0],
  severity: 'Major',
  status: 'Under Investigation',
  cqa_affected: '',
  event_description: '',
  immediate_containment: '',
  investigation_approach: 'Combined (5 Whys + Fishbone)',
  five_whys: [],
  fishbone: {
    man: [],
    machine: [],
    material: [],
    method: [],
    measurement: [],
    environment: [],
  },
  root_causes: [],
  missing_evidence: [],
  capa_items: [],
  investigator_notes: '',
  source_document_name: '',
  llm_source: '',
};

const rcaSlice = createSlice({
  name: 'rca',
  initialState: {
    currentForm: initialFormState,
    isPopulatedByAI: false,
    hasUnsavedChanges: false,
    aiRawResult: null,
  },
  reducers: {
    // Populate form with AI extracted results
    populateFromAI: (state, action) => {
      const data = action.payload;
      state.currentForm = {
        ...state.currentForm,
        deviation_number: data.deviation_number || state.currentForm.deviation_number,
        title: data.title || '',
        facility: data.facility || 'API Synthesis Plant 3',
        product_name: data.product_name || '',
        batch_number: data.batch_number || '',
        date_occurred: data.date_occurred || new Date().toISOString().split('T')[0],
        severity: data.severity || 'Major',
        cqa_affected: data.cqa_affected || '',
        event_description: data.event_description || '',
        immediate_containment: data.immediate_containment || '',
        five_whys: data.five_whys || [],
        fishbone: data.fishbone || {
          man: [], machine: [], material: [], method: [], measurement: [], environment: []
        },
        root_causes: data.root_causes || [],
        missing_evidence: data.missing_evidence || [],
        capa_items: data.capa_items || [],
        llm_source: data.llm_source || 'Groq / LangGraph',
      };
      state.isPopulatedByAI = true;
      state.hasUnsavedChanges = true;
      state.aiRawResult = data;
    },

    // Update single top-level field (title, product_name, batch_number, etc.)
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.currentForm[field] = value;
      state.hasUnsavedChanges = true;
    },

    // 5 Whys actions
    updateWhyItem: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.currentForm.five_whys[index]) {
        state.currentForm.five_whys[index][field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    toggleWhyConfirmed: (state, action) => {
      const index = action.payload;
      if (state.currentForm.five_whys[index]) {
        state.currentForm.five_whys[index].is_confirmed = !state.currentForm.five_whys[index].is_confirmed;
        state.hasUnsavedChanges = true;
      }
    },
    addWhyItem: (state) => {
      const nextNum = state.currentForm.five_whys.length + 1;
      state.currentForm.five_whys.push({
        why_number: nextNum,
        question: `Why did factor #${nextNum} occur?`,
        answer: '',
        category: 'Process',
        is_confirmed: false,
      });
      state.hasUnsavedChanges = true;
    },
    removeWhyItem: (state, action) => {
      const index = action.payload;
      state.currentForm.five_whys.splice(index, 1);
      // Re-number
      state.currentForm.five_whys.forEach((item, idx) => {
        item.why_number = idx + 1;
      });
      state.hasUnsavedChanges = true;
    },

    // Fishbone actions
    addFishboneItem: (state, action) => {
      const { category, text } = action.payload;
      if (state.currentForm.fishbone[category]) {
        state.currentForm.fishbone[category].push(text);
        state.hasUnsavedChanges = true;
      }
    },
    removeFishboneItem: (state, action) => {
      const { category, index } = action.payload;
      if (state.currentForm.fishbone[category]) {
        state.currentForm.fishbone[category].splice(index, 1);
        state.hasUnsavedChanges = true;
      }
    },

    // Root Cause Actions
    toggleRootCauseStatus: (state, action) => {
      const id = action.payload;
      const cause = state.currentForm.root_causes.find(rc => rc.id === id);
      if (cause) {
        // Toggle between AI Suggested and QA Confirmed
        cause.status = cause.status === 'QA Confirmed' ? 'AI Suggested' : 'QA Confirmed';
        state.hasUnsavedChanges = true;
      }
    },
    updateRootCause: (state, action) => {
      const { id, field, value } = action.payload;
      const cause = state.currentForm.root_causes.find(rc => rc.id === id);
      if (cause) {
        cause[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addRootCause: (state) => {
      const count = state.currentForm.root_causes.length + 1;
      state.currentForm.root_causes.push({
        id: `RC-${count}`,
        cause_statement: '',
        category: 'Equipment & Process',
        is_primary: state.currentForm.root_causes.length === 0,
        confidence: 0.85,
        rationale: '',
        status: 'AI Suggested',
      });
      state.hasUnsavedChanges = true;
    },
    removeRootCause: (state, action) => {
      const id = action.payload;
      state.currentForm.root_causes = state.currentForm.root_causes.filter(rc => rc.id !== id);
      state.hasUnsavedChanges = true;
    },

    // Missing Evidence Gaps Actions
    toggleEvidenceStatus: (state, action) => {
      const id = action.payload;
      const evid = state.currentForm.missing_evidence.find(e => e.id === id);
      if (evid) {
        evid.status = evid.status === 'Collected' ? 'Pending' : 'Collected';
        state.hasUnsavedChanges = true;
      }
    },
    updateEvidenceItem: (state, action) => {
      const { id, field, value } = action.payload;
      const evid = state.currentForm.missing_evidence.find(e => e.id === id);
      if (evid) {
        evid[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addEvidenceItem: (state) => {
      const count = state.currentForm.missing_evidence.length + 1;
      state.currentForm.missing_evidence.push({
        id: `EVID-${count}`,
        item: '',
        category: 'Metrology / Records',
        why_needed: '',
        priority: 'High',
        status: 'Pending',
      });
      state.hasUnsavedChanges = true;
    },
    removeEvidenceItem: (state, action) => {
      const id = action.payload;
      state.currentForm.missing_evidence = state.currentForm.missing_evidence.filter(e => e.id !== id);
      state.hasUnsavedChanges = true;
    },

    // CAPA Actions
    updateCapaItem: (state, action) => {
      const { id, field, value } = action.payload;
      const capa = state.currentForm.capa_items.find(c => c.id === id);
      if (capa) {
        capa[field] = value;
        state.hasUnsavedChanges = true;
      }
    },
    addCapaItem: (state, action) => {
      const count = state.currentForm.capa_items.length + 1;
      const type = action.payload?.type || 'Corrective';
      state.currentForm.capa_items.push({
        id: `CAPA-${count.toString().padStart(2, '0')}`,
        type: type,
        description: '',
        owner: 'Lead Process Engineer',
        target_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        rationale: '',
        status: 'Proposed',
      });
      state.hasUnsavedChanges = true;
    },
    removeCapaItem: (state, action) => {
      const id = action.payload;
      state.currentForm.capa_items = state.currentForm.capa_items.filter(c => c.id !== id);
      state.hasUnsavedChanges = true;
    },

    // Load existing record
    loadInvestigation: (state, action) => {
      state.currentForm = action.payload;
      state.isPopulatedByAI = false;
      state.hasUnsavedChanges = false;
    },

    // Reset Form
    resetForm: (state) => {
      state.currentForm = {
        ...initialFormState,
        deviation_number: `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date_occurred: new Date().toISOString().split('T')[0],
      };
      state.isPopulatedByAI = false;
      state.hasUnsavedChanges = false;
      state.aiRawResult = null;
    },

    markSaved: (state, action) => {
      state.currentForm = action.payload;
      state.hasUnsavedChanges = false;
    },
  },
});

export const {
  populateFromAI,
  updateFormField,
  updateWhyItem,
  toggleWhyConfirmed,
  addWhyItem,
  removeWhyItem,
  addFishboneItem,
  removeFishboneItem,
  toggleRootCauseStatus,
  updateRootCause,
  addRootCause,
  removeRootCause,
  toggleEvidenceStatus,
  updateEvidenceItem,
  addEvidenceItem,
  removeEvidenceItem,
  updateCapaItem,
  addCapaItem,
  removeCapaItem,
  loadInvestigation,
  resetForm,
  markSaved,
} = rcaSlice.actions;

export default rcaSlice.reducer;
