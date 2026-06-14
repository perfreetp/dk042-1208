import { create } from 'zustand';
import type { Project } from '../types';
import { projects as mockProjects } from '../data/mockData';
import { saveToStorage, loadFromStorage } from '../lib/persist';

interface ProjectState {
  projects: Project[];
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'status'>) => void;
  getProjectById: (id: string) => Project | undefined;
  getActiveProjects: () => Project[];
}

const initialProjects = loadFromStorage<Project[]>('projects', mockProjects);

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: initialProjects,
  showCreateModal: false,

  setShowCreateModal: (show) => set({ showCreateModal: show }),

  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    set((state) => {
      const newProjects = [newProject, ...state.projects];
      saveToStorage('projects', newProjects);
      return { projects: newProjects };
    });
  },

  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },

  getActiveProjects: () => {
    return get().projects.filter((p) => p.status === 'active');
  },
}));
