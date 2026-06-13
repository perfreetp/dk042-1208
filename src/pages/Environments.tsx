import { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Database,
  Globe,
  Activity,
  Clock,
  User,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  Settings,
  RefreshCw,
  Layers,
  MapPin,
} from 'lucide-react';
import { environments } from '../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, relativeTime, cn, getEnvText } from '../utils';
import type { Environment, EnvironmentType } from '../types';

export function Environments() {
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);

  const getEnvGradient = (type: EnvironmentType) => {
    const gradients: Record<EnvironmentType, string> = {
      test: 'from-blue-500/20 to-cyan-500/20',
      staging: 'from-amber-500/20 to-orange-500/20',
      production: 'from-rose-500/20 to-pink-500/20',
    };
    return gradients[type];
  };

  const getEnvBorder = (type: EnvironmentType) => {
    const borders: Record<EnvironmentType, string> = {
      test: 'border-blue-500/30',
      staging: 'border-amber-500/30',
      production: 'border-rose-500/30',
    };
    return borders[type];
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-red-400';
    if (usage >= 60) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getUsageBarColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {environments.map((env) => (
          <div
            key={env.id}
            onClick={() => setSelectedEnv(env)}
            className={cn(
              'relative overflow-hidden rounded-xl p-5 border cursor-pointer transition-all duration-300 hover:scale-[1.02] group',
              `bg-gradient-to-br ${getEnvGradient(env.type)}`,
              getEnvBorder(env.type),
              selectedEnv?.id === env.id && 'ring-2 ring-blue-500/50'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{env.name}</h3>
                  <p className="text-xs text-white/60">{getEnvText(env.type)}</p>
                </div>
              </div>
              <StatusBadge status={env.status} />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">当前版本</span>
                  <span className="text-sm font-mono text-white font-medium">
                    {env.currentVersion}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white/60" />
                  <span className="text-xs text-white/60">{env.instances} 实例</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-xs text-white/60">{env.region}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">最后部署</span>
                <span className="text-xs text-white/80">
                  {relativeTime(env.deployHistory[0]?.deployedAt || '')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">资源使用情况</h3>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> 刷新
            </button>
          </div>

          <div className="space-y-5">
            {environments.map((env) => (
              <div key={env.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{env.name}</span>
                  <StatusBadge status={env.status} size="sm" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-400">CPU</span>
                      </div>
                      <span className={cn('text-xs font-medium', getUsageColor(env.cpuUsage))}>
                        {env.cpuUsage}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', getUsageBarColor(env.cpuUsage))}
                        style={{ width: `${env.cpuUsage}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs text-slate-400">内存</span>
                      </div>
                      <span className={cn('text-xs font-medium', getUsageColor(env.memoryUsage))}>
                        {env.memoryUsage}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', getUsageBarColor(env.memoryUsage))}
                        style={{ width: `${env.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">部署历史</h3>
            </div>
          </div>

          <div className="space-y-3">
            {environments[2]?.deployHistory.slice(0, 4).map((deploy) => (
              <div
                key={deploy.id}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    deploy.status === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  )}
                >
                  {deploy.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium font-mono truncate">
                    {deploy.version}
                  </p>
                  <p className="text-xs text-slate-500">{deploy.deployedBy}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {relativeTime(deploy.deployedAt)}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 transition-colors">
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedEnv && (
        <div className="mt-6 bg-slate-900/50 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-semibold text-white">{selectedEnv.name} - 详细配置</h3>
                <p className="text-xs text-slate-500">环境配置与参数</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg transition-colors">
              编辑配置
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">数据库</span>
              </div>
              <p className="text-sm text-white font-medium">MySQL 8.0</p>
              <p className="text-xs text-slate-500">主从复制</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">域名</span>
              </div>
              <p className="text-sm text-white font-mono text-xs">{selectedEnv.type === 'test' ? 'test.example.com' : selectedEnv.type === 'staging' ? 'staging.example.com' : 'www.example.com'}</p>
              <p className="text-xs text-slate-500">HTTPS</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">实例规格</span>
              </div>
              <p className="text-sm text-white font-medium">{selectedEnv.instances} 台</p>
              <p className="text-xs text-slate-500">4C8G</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-slate-400">QPS</span>
              </div>
              <p className="text-sm text-white font-medium">
                {selectedEnv.type === 'production' ? '12.5k' : selectedEnv.type === 'staging' ? '2.3k' : '500'}
              </p>
              <p className="text-xs text-slate-500">峰值</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
