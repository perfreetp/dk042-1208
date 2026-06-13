import { create } from 'zustand';
import type { Pipeline, PipelineStage, PipelineStep } from '../types';
import { pipelines as mockPipelines } from '../data/mockData';

interface PipelineState {
  pipelines: Pipeline[];
  selectedPipeline: Pipeline | null;
  selectedStep: PipelineStep | null;
  isLogsOpen: boolean;
  setPipelines: (pipelines: Pipeline[]) => void;
  selectPipeline: (id: string | null) => void;
  selectStep: (step: PipelineStep | null) => void;
  toggleLogs: (open?: boolean) => void;
  triggerPipeline: (id: string) => void;
  updatePipelineStatus: (id: string, status: Pipeline['status']) => void;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipelines: mockPipelines,
  selectedPipeline: null,
  selectedStep: null,
  isLogsOpen: false,

  setPipelines: (pipelines) => set({ pipelines }),

  selectPipeline: (id) => {
    if (!id) {
      set({ selectedPipeline: null, selectedStep: null, isLogsOpen: false });
      return;
    }
    const pipeline = get().pipelines.find((p) => p.id === id);
    set({ selectedPipeline: pipeline || null, selectedStep: null, isLogsOpen: false });
  },

  selectStep: (step) => set({ selectedStep: step, isLogsOpen: !!step }),

  toggleLogs: (open) =>
    set((state) => ({ isLogsOpen: open !== undefined ? open : !state.isLogsOpen })),

  triggerPipeline: (id) => {
    set((state) => ({
      pipelines: state.pipelines.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'running',
              stages: p.stages.map((s, idx) => ({
                ...s,
                status: idx === 0 ? 'running' : 'pending',
                steps: s.steps.map((st, stIdx) => ({
                  ...st,
                  status: idx === 0 && stIdx === 0 ? 'running' : 'pending',
                })),
              })),
            }
          : p
      ),
    }));
  },

  updatePipelineStatus: (id, status) => {
    set((state) => ({
      pipelines: state.pipelines.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },
}));
