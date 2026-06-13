import { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  Bug,
  TrendingUp,
  Clock,
  ChevronRight,
  Activity,
  Users,
  Plus,
  X,
  Boxes,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { overviewStats, activities } from '../data/mockData';
import { relativeTime, cn, formatDate } from '../utils';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { metricsData } from '../data/mockData';
import { useProjectStore } from '../store/useProjectStore';

const statCards = [
  {
    key: 'projects',
    label: '项目总数',
    icon: LayoutDashboard,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
  },
  {
    key: 'pipelines',
    label: '流水线数',
    icon: GitBranch,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
  },
  {
    key: 'releases',
    label: '本月发布',
    icon: Rocket,
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'issues',
    label: '活跃问题',
    icon: Bug,
    color: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/20',
  },
];

function getStatValue(key: string, projectCount: number): number {
  const map: Record<string, number> = {
    projects: projectCount,
    pipelines: overviewStats.pipelines,
    releases: overviewStats.releases,
    issues: overviewStats.issues,
  };
  return map[key] || 0;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { projects, showCreateModal, setShowCreateModal, addProject, getActiveProjects } =
    useProjectStore();
  const [formData, setFormData] = useState({ name: '', team: '', description: '' });

  const activeProjects = getActiveProjects();

  const handleCreateProject = () => {
    if (!formData.name.trim() || !formData.team.trim()) return;
    addProject({
      name: formData.name,
      team: formData.team,
      description: formData.description,
    });
    setFormData({ name: '', team: '', description: '' });
    setShowCreateModal(false);
  };

  const quickActions = [
    {
      label: '创建项目',
      icon: LayoutDashboard,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setShowCreateModal(true),
    },
    { label: '触发流水线', icon: GitBranch, color: 'bg-emerald-500 hover:bg-emerald-600', onClick: () => navigate('/pipelines') },
    { label: '提交发布', icon: Rocket, color: 'bg-amber-500 hover:bg-amber-600', onClick: () => navigate('/releases') },
    { label: '创建问题', icon: Bug, color: 'bg-rose-500 hover:bg-rose-600', onClick: () => navigate('/issues') },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={cn(
                'relative overflow-hidden rounded-xl bg-gradient-to-br p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer',
                card.color,
                card.borderColor
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{getStatValue(card.key, activeProjects.length)}</p>
                </div>
                <div className={cn('p-2.5 rounded-lg bg-slate-900/50', card.iconColor)}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>较上周 +12%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">我的项目</h3>
              <p className="text-xs text-slate-500">共 {activeProjects.length} 个活跃项目</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activeProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
                    <Boxes className="w-5 h-5 text-blue-400" />
                  </div>
                  <button className="p-1 rounded hover:bg-slate-700 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-white font-medium mb-1">{project.name}</h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    <span>{project.team}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowCreateModal(true)}
              className="p-4 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-400 min-h-[120px]"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">创建新项目</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">快捷操作</h3>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all group"
                >
                  <div className={cn('p-2 rounded-lg text-white', action.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-200 flex-1 text-left">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">发布成功率</span>
              <span className="text-sm font-semibold text-emerald-400">{overviewStats.successRate}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${overviewStats.successRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">交付周期趋势</h3>
              <p className="text-xs text-slate-500">近14天需求从创建到上线的平均周期</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{metricsData.deliveryCycle.average}</span>
              <span className="text-sm text-slate-400">天</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> -8%
              </span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsData.deliveryCycle.trend}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit=" 天" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} 天`, '交付周期']}
                />
                <Area
                  type="monotone"
                  dataKey="days"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorDays)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-5">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">最近活动</h3>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-slate-800/50 last:border-0 last:pb-0"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'pipeline' && <GitBranch className="w-3.5 h-3.5 text-blue-400" />}
                  {activity.type === 'release' && <Rocket className="w-3.5 h-3.5 text-amber-400" />}
                  {activity.type === 'issue' && <Bug className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-white font-medium truncate">{activity.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-slate-600 mt-1">{relativeTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-[480px] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">创建项目</h3>
                  <p className="text-xs text-slate-500">创建新的项目空间</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">项目名称 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入项目名称"
                  className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">所属团队 *</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  placeholder="请输入团队名称"
                  className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">项目说明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入项目描述"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!formData.name.trim() || !formData.team.trim()}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
                  formData.name.trim() && formData.team.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                )}
              >
                <Plus className="w-4 h-4" />
                创建项目
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
