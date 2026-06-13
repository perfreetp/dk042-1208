import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  Bug,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity,
  GitCommit,
  Users,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { overviewStats, activities } from '../data/mockData';
import { relativeTime, cn } from '../utils';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { metricsData } from '../data/mockData';

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

const quickActions = [
  { label: '创建项目', icon: LayoutDashboard, color: 'bg-blue-500 hover:bg-blue-600', path: '/dashboard' },
  { label: '触发流水线', icon: GitBranch, color: 'bg-emerald-500 hover:bg-emerald-600', path: '/pipelines' },
  { label: '提交发布', icon: Rocket, color: 'bg-amber-500 hover:bg-amber-600', path: '/releases' },
  { label: '创建问题', icon: Bug, color: 'bg-rose-500 hover:bg-rose-600', path: '/issues' },
];

function getStatValue(key: string): number {
  const map: Record<string, number> = {
    projects: overviewStats.projects,
    pipelines: overviewStats.pipelines,
    releases: overviewStats.releases,
    issues: overviewStats.issues,
  };
  return map[key] || 0;
}

export function Dashboard() {
  const navigate = useNavigate();

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
                  <p className="text-3xl font-bold text-white">{getStatValue(card.key)}</p>
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
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">快捷操作</h3>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
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
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">最近活动</h3>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              查看全部 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'pipeline' && <GitBranch className="w-4 h-4 text-blue-400" />}
                  {activity.type === 'release' && <Rocket className="w-4 h-4 text-amber-400" />}
                  {activity.type === 'issue' && <Bug className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium truncate">{activity.title}</p>
                    <StatusBadge status={activity.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{relativeTime(activity.time)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">团队交付排行</h3>
          </div>
          <div className="space-y-3">
            {metricsData.teamWeekly.map((team, index) => (
              <div key={team.team} className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index === 0
                      ? 'bg-amber-500/20 text-amber-400'
                      : index === 1
                        ? 'bg-slate-400/20 text-slate-400'
                        : 'bg-orange-600/20 text-orange-400'
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{team.team}</p>
                  <p className="text-xs text-slate-500">
                    发布 {team.releases} 次 · 成功率 {team.successRate}%
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-400">{team.releases}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
