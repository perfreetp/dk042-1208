import { useState } from 'react';
import {
  GitBranch,
  Play,
  Clock,
  ChevronRight,
  Settings,
  Plus,
  MoreHorizontal,
  GitCommit,
  User,
  Calendar,
  Terminal,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Circle,
  RefreshCw,
} from 'lucide-react';
import { usePipelineStore } from '../store/usePipelineStore';
import { StatusBadge } from '../components/StatusBadge';
import { formatDuration, formatDateTime, relativeTime, cn, getTriggerText } from '../utils';
import type { PipelineStep } from '../types';

export function Pipelines() {
  const {
    pipelines,
    selectedPipeline,
    selectedStep,
    isLogsOpen,
    selectPipeline,
    selectStep,
    toggleLogs,
    triggerPipeline,
  } = usePipelineStore();
  const [activeTab, setActiveTab] = useState<'list' | 'history'>('list');

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

  return (
    <div className="h-full flex gap-4 animate-fade-in">
      <div className={cn('flex-1 flex flex-col transition-all duration-300', selectedPipeline ? 'mr-0' : '')}>
        <div className="flex items-center justify-between mb-4">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
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
        <div className="w-[480px] bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
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
    </div>
  );
}
