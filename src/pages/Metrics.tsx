import { useState } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  FileText,
  Download,
  ChevronRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  BarChart,
  PieChart,
  LineChart,
  CalendarDays,
} from 'lucide-react';
import { metricsData } from '../data/mockData';
import { cn } from '../utils';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { useProjectStore } from '../store/useProjectStore';
import { usePipelineStore } from '../store/usePipelineStore';
import { useReleaseStore } from '../store/useReleaseStore';
import { useIssueStore } from '../store/useIssueStore';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6'];

export function Metrics() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const { projects } = useProjectStore();
  const { pipelines } = usePipelineStore();
  const { releases } = useReleaseStore();
  const { issues } = useIssueStore();

  const avgDeliveryCycle = 5;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyReleases = releases.filter(
    (release) => new Date(release.createdAt) > sevenDaysAgo
  ).length;

  const successfulReleases = releases.filter(
    (release) => release.status === 'completed' || release.status === 'approved'
  ).length;
  const successRate = releases.length > 0
    ? Math.round((successfulReleases / releases.length) * 100)
    : 100;

  const failedCount = releases.filter(
    (release) => release.status === 'rejected'
  ).length;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select className="h-9 px-3 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option>本周</option>
            <option>本月</option>
            <option>本季度</option>
            <option>本年度</option>
          </select>
          <select className="h-9 px-3 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option>全部团队</option>
            <option>基础架构组</option>
            <option>电商业务组</option>
            <option>支付技术组</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          导出报表
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">平均交付周期</span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {avgDeliveryCycle}
            <span className="text-base font-normal text-slate-500 ml-1">天</span>
          </p>
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
            <TrendingDown className="w-3 h-3" />
            <span>较上周缩短 8%</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">发布频率</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {weeklyReleases}
            <span className="text-base font-normal text-slate-500 ml-1">次/周</span>
          </p>
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>较上周增长 25%</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">发布成功率</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {successRate}
            <span className="text-base font-normal text-slate-500 ml-1">%</span>
          </p>
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>较上周提升 3%</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">失败次数</span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {failedCount}
            <span className="text-base font-normal text-slate-500 ml-1">次</span>
          </p>
          <div className="flex items-center gap-1 mt-2 text-rose-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>较上周增加 2 次</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <LineChart className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">交付周期趋势</h3>
            </div>
            <span className="text-xs text-slate-500">近14天</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsData.deliveryCycle.trend}>
                <defs>
                  <linearGradient id="colorCycle" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorCycle)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-3 mb-5">
            <PieChart className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">失败原因分布</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={metricsData.failureReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {metricsData.failureReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [`${value} 次`, name]}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {metricsData.failureReasons.slice(0, 3).map((reason, idx) => (
              <div key={reason.reason} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx] }}
                />
                <span className="text-xs text-slate-400 flex-1">{reason.reason}</span>
                <span className="text-xs text-slate-300 font-medium">{reason.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BarChart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">发布频率统计</h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('weekly')}
              className={cn(
                'px-3 py-1.5 text-xs rounded-md transition-colors',
                activeTab === 'weekly'
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              按周
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={cn(
                'px-3 py-1.5 text-xs rounded-md transition-colors',
                activeTab === 'monthly'
                  ? 'bg-blue-500/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              按月
            </button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart
              data={
                activeTab === 'weekly'
                  ? metricsData.releaseFrequency.weekly
                  : metricsData.releaseFrequency.monthly
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey={activeTab === 'weekly' ? 'week' : 'month'}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                formatter={(value: string) => (
                  <span className="text-slate-400">
                    {value === 'count' ? '总发布数' : '成功数'}
                  </span>
                )}
              />
              <Bar dataKey="count" name="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="success" fill="#10B981" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">团队周报</h3>
            <span className="text-xs text-slate-500">本周交付数据汇总</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <CalendarDays className="w-4 h-4" />
            生成完整周报
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  团队
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  发布次数
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  完成需求
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  修复缺陷
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  平均交付周期
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  成功率
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {metricsData.teamWeekly.map((team, index) => (
                <tr
                  key={team.team}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                          index === 0
                            ? 'bg-amber-500/20 text-amber-400'
                            : index === 1
                              ? 'bg-slate-400/20 text-slate-400'
                              : 'bg-orange-600/20 text-orange-400'
                        )}
                      >
                        {index + 1}
                      </div>
                      <span className="text-sm text-white font-medium">{team.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-white font-medium">{team.releases}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-emerald-400 font-medium">{team.issues}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-rose-400 font-medium">{team.bugs}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-blue-400 font-medium">{team.avgCycleTime} 天</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${team.successRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-emerald-400 font-medium">
                        {team.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 ml-auto">
                      查看详情 <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
