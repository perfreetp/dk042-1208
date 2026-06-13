import { create } from 'zustand';
import type { Pipeline, PipelineStage, PipelineStep, TriggerType } from '../types';
import { pipelines as mockPipelines } from '../data/mockData';

interface StageConfig {
  name: string;
  enabled: boolean;
  steps: string[];
}

interface PipelineFormData {
  name: string;
  projectId: string;
  projectName: string;
  triggerType: TriggerType;
  branch: string;
  scheduleCron?: string;
  buildStage: StageConfig;
  testStage: StageConfig;
  deployStage: StageConfig;
}

interface PipelineState {
  pipelines: Pipeline[];
  selectedPipeline: Pipeline | null;
  selectedStep: PipelineStep | null;
  isLogsOpen: boolean;
  showConfigModal: boolean;
  editingPipeline: Pipeline | null;
  setPipelines: (pipelines: Pipeline[]) => void;
  selectPipeline: (id: string | null) => void;
  selectStep: (step: PipelineStep | null) => void;
  toggleLogs: (open?: boolean) => void;
  triggerPipeline: (id: string) => void;
  updatePipelineStatus: (id: string, status: Pipeline['status']) => void;
  setShowConfigModal: (show: boolean) => void;
  setEditingPipeline: (pipeline: Pipeline | null) => void;
  createPipeline: (data: PipelineFormData) => void;
  updatePipeline: (id: string, data: PipelineFormData) => void;
}

const createDefaultStages = (): PipelineStage[] => {
  const createSteps = (stageName: string, count: number): PipelineStep[] => {
    const stepNames: Record<string, string[]> = {
      build: ['代码检出', '依赖安装', '代码编译'],
      test: ['单元测试', '集成测试', '代码质量扫描'],
      deploy: ['镜像构建', '部署到环境'],
    };
    return stepNames[stageName]?.slice(0, count).map((name, idx) => ({
      id: `step-${Date.now()}-${idx}`,
      name,
      status: 'pending' as const,
      logs: [],
      duration: 0,
    })) || [];
  };

  return [
    {
      id: `stage-${Date.now()}-1`,
      name: '构建阶段',
      status: 'pending' as const,
      duration: 0,
      steps: createSteps('build', 3),
    },
    {
      id: `stage-${Date.now()}-2`,
      name: '测试阶段',
      status: 'pending' as const,
      duration: 0,
      steps: createSteps('test', 3),
    },
    {
      id: `stage-${Date.now()}-3`,
      name: '发布阶段',
      status: 'pending' as const,
      duration: 0,
      steps: createSteps('deploy', 2),
    },
  ];
};

export const usePipelineStore = create<PipelineState>((set, get) => ({
  pipelines: mockPipelines,
  selectedPipeline: null,
  selectedStep: null,
  isLogsOpen: false,
  showConfigModal: false,
  editingPipeline: null,

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
              lastRunAt: new Date().toISOString(),
              stages: p.stages.map((s, idx) => ({
                ...s,
                status: idx === 0 ? 'running' : 'pending',
                steps: s.steps.map((st, stIdx) => ({
                  ...st,
                  status: idx === 0 && stIdx === 0 ? 'running' : 'pending',
                  logs: idx === 0 && stIdx === 0 ? ['[INFO] Starting...'] : [],
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

  setShowConfigModal: (show) => set({ showConfigModal: show }),

  setEditingPipeline: (pipeline) => set({ editingPipeline: pipeline }),

  createPipeline: (data) => {
    const newPipeline: Pipeline = {
      id: `pipe-${Date.now()}`,
      name: data.name,
      projectId: data.projectId,
      projectName: data.projectName,
      status: 'pending',
      lastRunAt: new Date().toISOString(),
      triggerType: data.triggerType,
      branch: data.branch,
      commitMessage: '初始配置',
      commitUser: '当前用户',
      stages: createDefaultStages(),
    };
    set((state) => ({
      pipelines: [newPipeline, ...state.pipelines],
      showConfigModal: false,
      editingPipeline: null,
    }));
  },

  updatePipeline: (id, data) => {
    set((state) => ({
      pipelines: state.pipelines.map((p) =>
        p.id === id
          ? {
              ...p,
              name: data.name,
              projectId: data.projectId,
              projectName: data.projectName,
              triggerType: data.triggerType,
              branch: data.branch,
            }
          : p
      ),
      showConfigModal: false,
      editingPipeline: null,
    }));
  },
}));
