import { create } from 'zustand';
import type { Release } from '../types';
import { releases as mockReleases } from '../data/mockData';
import { saveToStorage, loadFromStorage } from '../lib/persist';
import { useEnvironmentStore } from './useEnvironmentStore';

interface ReleaseState {
  releases: Release[];
  selectedRelease: Release | null;
  showDetailModal: boolean;
  showCreateModal: boolean;
  setReleases: (releases: Release[]) => void;
  selectRelease: (release: Release | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  addRelease: (release: Omit<Release, 'id' | 'createdAt'>) => void;
  approveRelease: (id: string, comments: string, approver: string) => void;
  rejectRelease: (id: string, comments: string, approver: string) => void;
  rollbackRelease: (id: string) => void;
  deployRelease: (id: string) => void;
  completeRelease: (id: string) => void;
}

const initialReleases = loadFromStorage<Release[]>('releases', mockReleases);

export const useReleaseStore = create<ReleaseState>((set, get) => ({
  releases: initialReleases,
  selectedRelease: null,
  showDetailModal: false,
  showCreateModal: false,

  setReleases: (releases) => {
    saveToStorage('releases', releases);
    set({ releases });
  },

  selectRelease: (release) => set({ selectedRelease: release }),

  setShowDetailModal: (show) => set({ showDetailModal: show }),

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  addRelease: (release) => {
    const newRelease: Release = {
      ...release,
      id: `release-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const newReleases = [newRelease, ...state.releases];
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });
  },

  approveRelease: (id, comments, approver) => {
    set((state) => {
      const newReleases: Release[] = state.releases.map((r) =>
        r.id === id
          ? { ...r, status: 'approved', approvalComments: comments, approver }
          : r
      );
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });
  },

  rejectRelease: (id, comments, approver) => {
    set((state) => {
      const newReleases: Release[] = state.releases.map((r) =>
        r.id === id
          ? { ...r, status: 'rejected', approvalComments: comments, approver }
          : r
      );
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });
  },

  rollbackRelease: (id) => {
    set((state) => {
      const newReleases: Release[] = state.releases.map((r) =>
        r.id === id ? { ...r, status: 'rollback' } : r
      );
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });
  },

  deployRelease: (id) => {
    const release = get().releases.find((r) => r.id === id);
    if (!release) return;

    set((state) => {
      const newReleases: Release[] = state.releases.map((r) =>
        r.id === id ? { ...r, status: 'deploying' } : r
      );
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });

    const { environments, updateEnvironment } = useEnvironmentStore.getState();
    const targetEnv = environments.find((env) => env.type === release.environment);
    if (targetEnv) {
      const deployRecord = {
        id: `deploy-${Date.now()}`,
        version: release.version,
        deployedAt: new Date().toISOString(),
        deployedBy: release.applicant || '当前用户',
        status: 'success' as const,
      };
      updateEnvironment(targetEnv.id, {
        currentVersion: release.version,
        deployHistory: [...targetEnv.deployHistory, deployRecord],
      });
    }
  },

  completeRelease: (id) => {
    set((state) => {
      const newReleases: Release[] = state.releases.map((r) =>
        r.id === id
          ? { ...r, status: 'completed', deployedAt: new Date().toISOString() }
          : r
      );
      saveToStorage('releases', newReleases);
      return { releases: newReleases };
    });
  },
}));
