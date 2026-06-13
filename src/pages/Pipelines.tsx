import { useState, useEffect } from 'react';
import {
  GitBranch,
  Play,
  Clock,
  Settings,
  Plus,
  MoreHorizontal,
  GitCommit,
  User,
  Terminal,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Circle,
  Wrench,
  TestTube,
  Rocket,
  Timer,
  MousePointerClick,
  Webhook,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { usePipelineStore } from '../store/usePipelineStore';
import { useProjectStore } from '../store/useProjectStore';
import { StatusBadge } from '../components/StatusBadge';
import { formatDuration, relativeTime, cn, getTriggerText } from '../utils';
import type { PipelineStep, TriggerType } from '../types';

interface ConfigStep {
  id: string;
  name: string;
  enabled: boolean;
}

interface StageConfig {
  enabled: boolean;
  steps: ConfigStep[];
}

interface PipelineConfigForm {
  name: string;
  projectId: string;
  triggerType: TriggerType;
  branch: string;
  scheduleCron: string;
  buildStage: StageConfig;
  testStage: StageConfig;
  deployStage: StageConfig;
}

const defaultBuildSteps: ConfigStep[] = [
  { id: 'b1', name: '代码检出', enabled: true },
  { id: 'b2', name: '依赖安装', enabled: true },
  { id: 'b3', name: '代码编译', enabled: true },
];

const defaultTestSteps: ConfigStep[] = [
  { id: 't1', name: '单元测试', enabled: true },
  { id: 't2', name: '集成测试', enabled: true },
  { id: 't3', name: '代码质量扫描', enabled: true },
];

const defaultDeploySteps: ConfigStep[] = [
  { id: 'd1', name: '镜像构建', enabled: true },
  { id: 'd2', name: '部署到环境', enabled: true },
];

const initialForm: PipelineConfigForm = {
  name: '',
  projectId: '',
  triggerType: 'manual',
  branch: 'main',
  scheduleCron: '0 0 * * *',
  buildStage: { enabled: true, steps: [...defaultBuildSteps] },
  testStage: { enabled: true, steps: [...defaultTestSteps] },
  deployStage: { enabled: true, steps: [...defaultDeploySteps] },
};

export function Pipelines() {
  const {
    pipelines,
    selectedPipeline,
    selectedStep,
    isLogsOpen,
    showConfigModal,
    editingPipeline,
    selectPipeline,
    selectStep,
    toggleLogs,
    triggerPipeline,
    setShowConfigModal,
    setEditingPipeline,
    createPipeline,
    updatePipeline,
  } = usePipelineStore();
  const { projects, getActiveProjects } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');
  const [formData, setFormData] = useState<PipelineConfigForm>(initialForm);
  const [expandedStage, setExpandedStage] = useState<string | null>('build');

  const activeProjects = getActiveProjects();

  useEffect(() => {
    if (editingPipeline) {
      const buildSteps = editingPipeline.stages[0]?.steps.map((s, i) => ({
        id: `b${i}`,
        name: s.name,
        enabled: true,
      })) || defaultBuildSteps;
      const testSteps = editingPipeline.stages[1]?.steps.map((s, i) => ({
        id: `t${i}`,
        name: s.name,
        enabled: true,
      })) || defaultTestSteps;
      const deploySteps = editingPipeline.stages[2]?.steps.map((s, i) => ({
        id: `d${i}`,
        name: s.name,
        enabled: true,
      })) || defaultDeploySteps;

      setFormData({
        name: editingPipeline.name,
        projectId: editingPipeline.projectId,
        triggerType: editingPipeline.triggerType,
        branch: editingPipeline.branch,
        scheduleCron: '0 0 * * *',
        buildStage: { enabled: true, steps: buildSteps },
        testStage: { enabled: true, steps: testSteps },
        deployStage: { enabled: true, steps: deploySteps },
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingPipeline]);

  const handleViewDetail = (pipelineId: string) => {
    selectPipeline(pipelineId);
  };

  const handleTrigger = (e: React.MouseEvent, pipelineId: string) => {
    e.stopPropagation();
    triggerPipeline(pipelineId);
  };

  const handleStepClick = (step: PipelineStep) => {
    selectStep(step);
  };

  const handleCloseDetail = () => {
    selectPipeline(null);
  };

  const handleOpenConfig = (e: React.MouseEvent, pipeline?: typeof pipelines[0]) => {
    e.stopPropagation();
    if (pipeline) {
      setEditingPipeline(pipeline);
    } else {
      setEditingPipeline(null);
      setFormData(initialForm);
    }
    setShowConfigModal(true);
  };

  const handleCloseConfig = () => {
    setShowConfigModal(false);
    setEditingPipeline(null);
    setFormData(initialForm);
  };

  const handleSavePipeline = () => {
    if (!formData.name.trim() || !formData.projectId) return;

    const project = projects.find((p) => p.id === formData.projectId);
    const projectName = project?.name || '';

    const formDataForSubmit = {
      ...formData,
      projectName,
    };

    if (editingPipeline) {
      updatePipeline(editingPipeline.id, formDataForSubmit as any);
    } else {
      createPipeline(formDataForSubmit as any);
    }
  };

  const toggleStage = (stage: 'build' | 'test' | 'deploy') => {
    const stageKey = `${stage}Stage` as const;
    setFormData({
      ...formData,
      [stageKey]: {
        ...formData[stageKey],
        enabled: !formData[stageKey].enabled,
      },
    });
  };

  const toggleStageStep = (stage: 'build' | 'test' | 'deploy', stepId: string) => {
    const stageKey = `${stage}Stage` as const;
    setFormData({
      ...formData,
      [stageKey]: {
        ...formData[stageKey],
        steps: formData[stageKey].steps.map((s) =>
          s.id === stepId ? { ...s, enabled: !s.enabled } : s
        ),
      },
    });
  };

  const updateStepName = (stage: 'build' | 'test' | 'deploy', stepId: string, name: string) => {
    const stageKey = `${stage}Stage` as const;
    setFormData({
      ...formData,
      [stageKey]: {
        ...formData[stageKey],
        steps: formData[stageKey].steps.map((s) => (s.id === stepId ? { ...s, name } : s)),
      },
    });
  };

  const addStep = (stage: 'build' | 'test' | 'deploy') => {
    const stageKey = `${stage}Stage` as const;
    const prefix = stage === 'build' ? 'b' : stage === 'test' ? 't' : 'd';
    const newStep: ConfigStep = {
      id: `${prefix}${Date.now()}`,
      name: '新步骤',
      enabled: true,
    };
    setFormData({
      ...formData,
      [stageKey]: {
        ...formData[stageKey],
        steps: [...formData[stageKey].steps, newStep],
      },
    });
  };

  const removeStep = (stage: 'build' | 'test' | 'deploy', stepId: string) => {
    const stageKey = `${stage}Stage` as const;
    setFormData({
      ...formData,
      [stageKey]: {
        ...formData[stageKey],
        steps: formData[stageKey].steps.filter((s) => s.id !== stepId),
      },
    });
  };

  const StageConfigSection = ({
    stageKey,
    title,
    icon: Icon,
    color,
  }: {
    stageKey: 'build' | 'test' | 'deploy';
    title: string;
    icon: typeof Wrench;
    color: string;
  }) => {
    const stageData = formData[`${stageKey}Stage` as const];
    const isExpanded = expandedStage === stageKey;

    return (
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <div
          className="flex items-center justify-between p-3 bg-slate-800/50 cursor-pointer"
          onClick={() => setExpandedStage(isExpanded ? null : stageKey)}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleStage(stageKey);
              }}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                stageData.enabled
                  ? `${color} border-current`
                  : 'border-slate-600 text-transparent'
              )}
            >
              {stageData.enabled && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <div className={cn('p-1.5 rounded', stageData.enabled ? `${color} bg-current/10` : 'bg-slate-700/50')}>
              <Icon className={cn('w-4 h-4', stageData.enabled ? '' : 'text-slate-500')} />
            </div>
            <span className={cn('text-sm font-medium', stageData.enabled ? 'text-white' : 'text-slate-500')}>
              {title}
            </span>
            <span className="text-xs text-slate-500">
              {stageData.steps.filter((s) => s.enabled).length} 个步骤
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>

        {isExpanded && stageData.enabled && (
          <div className="p-3 space-y-2">
            {stageData.steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 group">
                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                <button
                  onClick={() => toggleStageStep(stageKey, step.id)}
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                    step.enabled
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-slate-600'
                  )}
                >
                  {step.enabled && <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />}
                </button>
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => updateStepName(stageKey, step.id, e.target.value)}
                  className={cn(
                    'flex-1 h-7 px-2 bg-transparent border border-transparent rounded text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/50',
                    !step.enabled && 'text-slate-500 line-through'
                  )}
                />
                <button
                  onClick={() => removeStep(stageKey, step.id)}
                  className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addStep(stageKey)}
              className="w-full py-1.5 text-xs text-slate-500 hover:text-blue-400 hover:bg-slate-800/50 rounded border border-dashed border-slate-700 hover:border-blue-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" />
              添加步骤
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex gap-4 animate-fade-in">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('list')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-md transition-colors',
                activeTab === 'list'
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              全部流水线
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-md transition-colors',
                activeTab === 'history'
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              执行历史
            </button>
          </div>
          <button
            onClick={(e) => handleOpenConfig(e)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建流水线
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              onClick={() => handleViewDetail(pipeline.id)}
              className={cn(
                'bg-slate-900/50 rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:border-blue-500/30 hover:bg-slate-900/80 group',
                selectedPipeline?.id === pipeline.id
                  ? 'border-blue-500/50 ring-1 ring-blue-500/20'
                  : 'border-slate-800'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      pipeline.status === 'success' && 'bg-emerald-500/20',
                      pipeline.status === 'failed' && 'bg-red-500/20',
                      pipeline.status === 'running' && 'bg-blue-500/20',
                      pipeline.status === 'pending' && 'bg-slate-700/50'
                    )}
                  >
                    <GitBranch
                      className={cn(
                        'w-5 h-5',
                        pipeline.status === 'success' && 'text-emerald-400',
                        pipeline.status === 'failed' && 'text-red-400',
                        pipeline.status === 'running' && 'text-blue-400',
                        pipeline.status === 'pending' && 'text-slate-500'
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{pipeline.name}</h3>
                      <StatusBadge status={pipeline.status} size="sm" />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{pipeline.projectName}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <GitCommit className="w-3.5 h-3.5" />
                        <span className="font-mono">{pipeline.branch}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{pipeline.commitUser}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getTriggerText(pipeline.triggerType)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleTrigger(e, pipeline.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      pipeline.status === 'running'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    )}
                    disabled={pipeline.status === 'running'}
                    title="触发执行"
                  >
                    {pipeline.status === 'running' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleOpenConfig(e, pipeline)}
                    className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="设置"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="更多"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                {pipeline.stages.map((stage, idx) => (
                  <div key={stage.id} className="flex items-center">
                    <div
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5',
                        stage.status === 'success' && 'bg-emerald-500/15 text-emerald-400',
                        stage.status === 'failed' && 'bg-red-500/15 text-red-400',
                        stage.status === 'running' && 'bg-blue-500/15 text-blue-400',
                        stage.status === 'pending' && 'bg-slate-700/50 text-slate-500'
                      )}
                    >
                      {stage.status === 'success' && <CheckCircle className="w-3 h-3" />}
                      {stage.status === 'failed' && <XCircle className="w-3 h-3" />}
                      {stage.status === 'running' && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {stage.status === 'pending' && <Circle className="w-3 h-3" />}
                      {stage.name}
                    </div>
                    {idx < pipeline.stages.length - 1 && (
                      <div className="w-6 h-px bg-slate-700 mx-1" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <p className="text-xs text-slate-500 truncate flex-1">
                  <span className="text-slate-400">最近提交：</span>
                  {pipeline.commitMessage}
                </p>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-slate-500">
                    {formatDuration(
                      pipeline.stages.reduce((acc, s) => acc + s.duration, 0)
                    )}
                  </span>
                  <span className="text-xs text-slate-500">
                    {relativeTime(pipeline.lastRunAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPipeline && (
        <div className="w-[480px] bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">执行详情</h3>
                <p className="text-xs text-slate-500">{selectedPipeline.name}</p>
              </div>
            </div>
            <button
              onClick={handleCloseDetail}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {selectedPipeline.stages.map((stage) => (
                <div key={stage.id} className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg">
                    {stage.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    {stage.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                    {stage.status === 'running' && (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    )}
                    {stage.status === 'pending' && <Circle className="w-4 h-4 text-slate-500" />}
                    <span className="text-sm font-medium text-white flex-1">{stage.name}</span>
                    <span className="text-xs text-slate-500">
                      {formatDuration(stage.duration)}
                    </span>
                  </div>

                  <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800 pl-4">
                    {stage.steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => handleStepClick(step)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors',
                          selectedStep?.id === step.id
                            ? 'bg-blue-500/15 border border-blue-500/30'
                            : 'hover:bg-slate-800/50 border border-transparent'
                        )}
                      >
                        {step.status === 'success' && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        )}
                        {step.status === 'failed' && (
                          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        )}
                        {step.status === 'running' && (
                          <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin flex-shrink-0" />
                        )}
                        {step.status === 'pending' && (
                          <Circle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-300 flex-1">{step.name}</span>
                        <span className="text-xs text-slate-500">
                          {formatDuration(step.duration)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isLogsOpen && selectedStep && (
            <div className="h-72 border-t border-slate-800 flex flex-col bg-slate-950">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">执行日志 - {selectedStep.name}</span>
                <button
                  onClick={() => toggleLogs(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
                {selectedStep.logs.length > 0 ? (
                  selectedStep.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'py-0.5',
                        log.includes('[ERROR]') && 'text-red-400',
                        log.includes('[WARNING]') && 'text-amber-400',
                        log.includes('[INFO]') && 'text-slate-400',
                        log.includes('[DEBUG]') && 'text-slate-500'
                      )}
                    >
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 italic">暂无日志</div>
                )}
              </div>
            </div>
          )}

          {!isLogsOpen && (
            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => selectedStep && toggleLogs(true)}
                disabled={!selectedStep}
                className={cn(
                  'w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2',
                  selectedStep
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                )}
              >
                <Terminal className="w-4 h-4" />
                查看日志
              </button>
            </div>
          )}
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseConfig}
          />
          <div className="relative w-[600px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-scale-in">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {editingPipeline ? '编辑流水线' : '新建流水线'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingPipeline ? '修改流水线配置' : '创建新的 CI/CD 流水线'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseConfig}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">流水线名称 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入流水线名称"
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">所属项目 *</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  >
                    <option value="">请选择项目</option>
                    {activeProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">触发方式</label>
                  <div className="flex gap-2">
                    {[
                      { key: 'manual' as TriggerType, label: '手动', icon: MousePointerClick },
                      { key: 'scheduled' as TriggerType, label: '定时', icon: Timer },
                      { key: 'webhook' as TriggerType, label: '代码触发', icon: Webhook },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.key}
                          onClick={() => setFormData({ ...formData, triggerType: item.key })}
                          className={cn(
                            'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all',
                            formData.triggerType === item.key
                              ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">代码分支</label>
                  <div className="flex items-center gap-2 h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <GitBranch className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                      placeholder="main"
                    />
                  </div>
                </div>
              </div>

              {formData.triggerType === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">定时表达式</label>
                  <input
                    type="text"
                    value={formData.scheduleCron}
                    onChange={(e) => setFormData({ ...formData, scheduleCron: e.target.value })}
                    placeholder="0 0 * * *"
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Cron 表达式：分 时 日 月 周</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">阶段配置</h4>
                  <span className="text-xs text-slate-500">点击展开配置步骤</span>
                </div>
                <div className="space-y-3">
                  <StageConfigSection
                    stageKey="build"
                    title="构建阶段"
                    icon={Wrench}
                    color="text-blue-400"
                  />
                  <StageConfigSection
                    stageKey="test"
                    title="测试阶段"
                    icon={TestTube}
                    color="text-amber-400"
                  />
                  <StageConfigSection
                    stageKey="deploy"
                    title="发布阶段"
                    icon={Rocket}
                    color="text-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseConfig}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePipeline}
                disabled={!formData.name.trim() || !formData.projectId}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                  formData.name.trim() && formData.projectId
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                )}
              >
                {editingPipeline ? '保存修改' : '创建流水线'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
