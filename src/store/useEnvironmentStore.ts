import { create } from 'zustand';
import type { Environment, EnvAuditLog } from '../types';
import { environments as mockEnvironments } from '../data/mockData';
import { saveToStorage, loadFromStorage } from '../lib/persist';

const FIELD_MAP: Record<string, string> = {
  name: '环境名称',
  currentVersion: '当前版本',
  instances: '实例数量',
  region: '部署区域',
  cpuUsage: 'CPU使用率',
  memoryUsage: '内存使用率',
  status: '环境状态',
};

interface EnvironmentState {
  environments: Environment[];
  selectedEnv: Environment | null;
  showEditModal: boolean;
  editingEnv: Environment | null;
  auditLogs: EnvAuditLog[];
  setEnvironments: (environments: Environment[]) => void;
  setSelectedEnv: (env: Environment | null) => void;
  setShowEditModal: (show: boolean) => void;
  setEditingEnv: (env: Environment | null) => void;
  updateEnvironment: (id: string, updates: Partial<Environment>) => void;
  getEnvironmentById: (id: string) => Environment | undefined;
  addAuditLog: (log: Omit<EnvAuditLog, 'id' | 'modifiedAt'>) => void;
  getAuditLogsByEnvId: (envId: string) => EnvAuditLog[];
}

const initialEnvironments = loadFromStorage<Environment[]>('environments', mockEnvironments);
const initialAuditLogs = loadFromStorage<EnvAuditLog[]>('env-audit-logs', []);

export const useEnvironmentStore = create<EnvironmentState>((set, get) => ({
  environments: initialEnvironments,
  selectedEnv: null,
  showEditModal: false,
  editingEnv: null,
  auditLogs: initialAuditLogs,

  setEnvironments: (environments) => {
    saveToStorage('environments', environments);
    set({ environments });
  },

  setSelectedEnv: (env) => set({ selectedEnv: env }),

  setShowEditModal: (show) => set({ showEditModal: show }),

  setEditingEnv: (env) => set({ editingEnv: env }),

  updateEnvironment: (id, updates) => {
    set((state) => {
      const env = state.environments.find((e) => e.id === id);
      if (!env) return {};

      const now = new Date().toISOString();
      const modifiedBy = '当前用户';

      const finalUpdates: Partial<Environment> = {
        ...updates,
        lastModifiedBy: modifiedBy,
        lastModifiedAt: now,
      };

      const newEnvironments = state.environments.map((e) =>
        e.id === id ? { ...e, ...finalUpdates } : e
      );

      const newAuditLogs: EnvAuditLog[] = [...state.auditLogs];

      for (const key of Object.keys(updates)) {
        const mappedField = FIELD_MAP[key];
        if (!mappedField) continue;

        const oldValue = String(env[key as keyof Environment] ?? '');
        const newValue = String(updates[key as keyof Environment] ?? '');

        if (oldValue !== newValue) {
          newAuditLogs.push({
            id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            envId: id,
            field: mappedField,
            oldValue,
            newValue,
            modifiedBy,
            modifiedAt: now,
          });
        }
      }

      saveToStorage('environments', newEnvironments);
      saveToStorage('env-audit-logs', newAuditLogs);

      return { environments: newEnvironments, auditLogs: newAuditLogs };
    });
  },

  getEnvironmentById: (id) => {
    return get().environments.find((env) => env.id === id);
  },

  addAuditLog: (log) => {
    set((state) => {
      const newLog: EnvAuditLog = {
        ...log,
        id: `audit-${Date.now()}`,
        modifiedAt: new Date().toISOString(),
      };
      const newAuditLogs = [...state.auditLogs, newLog];
      saveToStorage('env-audit-logs', newAuditLogs);
      return { auditLogs: newAuditLogs };
    });
  },

  getAuditLogsByEnvId: (envId) => {
    return get().auditLogs.filter((log) => log.envId === envId);
  },
}));
