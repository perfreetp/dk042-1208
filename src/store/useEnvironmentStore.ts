import { create } from 'zustand';
import type { Environment } from '../types';
import { environments as mockEnvironments } from '../data/mockData';

interface EnvironmentState {
  environments: Environment[];
  selectedEnv: Environment | null;
  showEditModal: boolean;
  editingEnv: Environment | null;
  setEnvironments: (environments: Environment[]) => void;
  setSelectedEnv: (env: Environment | null) => void;
  setShowEditModal: (show: boolean) => void;
  setEditingEnv: (env: Environment | null) => void;
  updateEnvironment: (id: string, updates: Partial<Environment>) => void;
  getEnvironmentById: (id: string) => Environment | undefined;
}

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  environments: mockEnvironments,
  selectedEnv: null,
  showEditModal: false,
  editingEnv: null,

  setEnvironments: (environments) => set({ environments }),

  setSelectedEnv: (env) => set({ selectedEnv: env }),

  setShowEditModal: (show) => set({ showEditModal: show }),

  setEditingEnv: (env) => set({ editingEnv: env }),

  updateEnvironment: (id, updates) => {
    set((state) => ({
      environments: state.environments.map((env) =>
        env.id === id ? { ...env, ...updates } : env
      ),
    }));
  },

  getEnvironmentById: (id) => {
    return get().environments.find((env) => env.id === id);
  },
}));
