import { create } from 'zustand';
import type { Project } from '../types';
import { projects as mockProjects } from '../data/mockData';

interface ProjectState {
  projects: Project[];
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  getProjectById: (id: string) => Project | undefined;
  getActiveProjects: () => Project[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: mockProjects,
  showCreateModal: false,

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },

  getActiveProjects: () => {
    return get().projects.filter((p) => p.status === 'active');
  },
}));
