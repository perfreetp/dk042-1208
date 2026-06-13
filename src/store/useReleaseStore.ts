import { create } from 'zustand';
import type { Release } from '../types';
import { releases as mockReleases } from '../data/mockData';

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
}

export const useReleaseStore = create<ReleaseState>((set, get) => ({
  releases: mockReleases,
  selectedRelease: null,
  showDetailModal: false,
  showCreateModal: false,

  setReleases: (releases) => set({ releases }),

  selectRelease: (release) => set({ selectedRelease: release }),

  setShowDetailModal: (show) => set({ showDetailModal: show }),

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  addRelease: (release) => {
    const newRelease: Release = {
      ...release,
      id: `release-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ releases: [newRelease, ...state.releases] }));
  },

  approveRelease: (id, comments, approver) => {
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id
          ? { ...r, status: 'approved', approvalComments: comments, approver }
          : r
      ),
    }));
  },

  rejectRelease: (id, comments, approver) => {
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id
          ? { ...r, status: 'rejected', approvalComments: comments, approver }
          : r
      ),
    }));
  },

  rollbackRelease: (id) => {
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, status: 'rollback' } : r
      ),
    }));
  },
}));
