import { create } from 'zustand';
import type { Issue } from '../types';
import { issues as mockIssues } from '../data/mockData';

interface IssueState {
  issues: Issue[];
  filterType: 'all' | 'feature' | 'bug';
  filterStatus: 'all' | Issue['status'];
  searchQuery: string;
  selectedIssue: Issue | null;
  showDetailModal: boolean;
  showCreateModal: boolean;
  setIssues: (issues: Issue[]) => void;
  setFilterType: (type: 'all' | 'feature' | 'bug') => void;
  setFilterStatus: (status: 'all' | Issue['status']) => void;
  setSearchQuery: (query: string) => void;
  selectIssue: (issue: Issue | null) => void;
  setShowDetailModal: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssueStatus: (id: string, status: Issue['status']) => void;
  getFilteredIssues: () => Issue[];
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: mockIssues,
  filterType: 'all',
  filterStatus: 'all',
  searchQuery: '',
  selectedIssue: null,
  showDetailModal: false,
  showCreateModal: false,

  setIssues: (issues) => set({ issues }),

  setFilterType: (type) => set({ filterType: type }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  selectIssue: (issue) => set({ selectedIssue: issue }),

  setShowDetailModal: (show) => set({ showDetailModal: show }),

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  addIssue: (issue) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      ...issue,
      id: `issue-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ issues: [newIssue, ...state.issues] }));
  },

  updateIssueStatus: (id, status) => {
    set((state) => ({
      issues: state.issues.map((i) =>
        i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i
      ),
    }));
  },

  getFilteredIssues: () => {
    const { issues, filterType, filterStatus, searchQuery } = get();
    return issues.filter((issue) => {
      if (filterType !== 'all' && issue.type !== filterType) return false;
      if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
      if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  },
}));
