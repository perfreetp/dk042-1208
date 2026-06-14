import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Boxes,
  Users,
  Calendar,
  GitBranch,
  Rocket,
  Bug,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { usePipelineStore } from '../store/usePipelineStore';
import { useReleaseStore } from '../store/useReleaseStore';
import { useIssueStore } from '../store/useIssueStore';
import { StatusBadge } from '../components/StatusBadge';
import { relativeTime, formatDate, cn } from '../utils';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getProjectById = useProjectStore((s) => s.getProjectById);
  const pipelines = usePipelineStore((s) => s.pipelines);
  const releases = useReleaseStore((s) => s.releases);
  const issues = useIssueStore((s) => s.issues);

  const project = id ? getProjectById(id) : undefined;

  const projectPipelines = pipelines.filter((p) => p.projectId === id);
  const projectReleases = releases.filter((r) => r.projectId === id);
  const projectIssues = issues.filter((i) => i.projectId === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
          <Boxes className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">项目不存在</h2>
        <p className="text-sm text-slate-500 mb-6">未找到该项目或已被归档</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回项目列表
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: '流水线',
      value: projectPipelines.length,
      icon: GitBranch,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      onClick: () => navigate('/pipelines'),
    },
    {
      label: '发布',
      value: projectReleases.length,
      icon: Rocket,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      onClick: () => navigate('/releases'),
    },
    {
      label: '问题',
      value: projectIssues.length,
      icon: Bug,
      color: 'text-rose-400',
      bg: 'bg-rose-500/20',
      onClick: () => navigate('/issues'),
    },
    {
      label: '团队成员',
      value: project.team ? 1 : 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <Boxes className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <StatusBadge status={project.status === 'active' ? 'success' : 'pending'} text={project.status === 'active' ? '活跃' : '已归档'} />
              </div>
              <p className="text-sm text-slate-400 mb-3 max-w-2xl">{project.description || '暂无项目描述'}</p>
              <div className="flex items-center gap-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{project.team}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>创建于 {formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={card.onClick}
              className={cn(
                'p-5 bg-slate-900/50 rounded-xl border border-slate-800 text-left transition-all duration-300',
                card.onClick && 'hover:bg-slate-800/70 hover:border-slate-700 cursor-pointer'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('p-2.5 rounded-lg', card.bg)}>
                  <Icon className={cn('w-5 h-5', card.color)} />
                </div>
                {card.onClick && <ChevronRight className="w-4 h-4 text-slate-600" />}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">最近流水线</h3>
            </div>
            <button
              onClick={() => navigate('/pipelines')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {projectPipelines.slice(0, 3).length > 0 ? (
              projectPipelines.slice(0, 3).map((pipeline) => (
                <div
                  key={pipeline.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/pipelines/${pipeline.id}`)}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{pipeline.name}</p>
                    <p className="text-xs text-slate-500">{pipeline.branch} · {relativeTime(pipeline.lastRunAt)}</p>
                  </div>
                  <StatusBadge status={pipeline.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">暂无流水线记录</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-semibold text-white">最近发布</h3>
            </div>
            <button
              onClick={() => navigate('/releases')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {projectReleases.slice(0, 3).length > 0 ? (
              projectReleases.slice(0, 3).map((release) => (
                <div
                  key={release.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => navigate('/releases')}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{release.title}</p>
                    <p className="text-xs text-slate-500 font-mono">{release.version} · {relativeTime(release.createdAt)}</p>
                  </div>
                  <StatusBadge status={release.status === 'completed' ? 'success' : release.status === 'deploying' ? 'running' : 'pending'} text={release.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">暂无发布记录</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-semibold text-white">问题列表</h3>
          </div>
          <button
            onClick={() => navigate('/issues')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            查看全部 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {projectIssues.slice(0, 4).length > 0 ? (
            projectIssues.slice(0, 4).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => navigate('/issues')}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    issue.type === 'bug' ? 'bg-rose-500/20' : 'bg-blue-500/20'
                  )}
                >
                  <Bug className={cn('w-4 h-4', issue.type === 'bug' ? 'text-rose-400' : 'text-blue-400')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{issue.title}</p>
                  <p className="text-xs text-slate-500">
                    #{issue.id.slice(-5)} · 负责人: {issue.assignee} · {relativeTime(issue.createdAt)}
                  </p>
                </div>
                <StatusBadge status={issue.status === 'done' ? 'success' : issue.status === 'in_progress' ? 'running' : 'pending'} text={issue.status} />
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-sm">暂无问题</div>
          )}
        </div>
      </div>
    </div>
  );
}
