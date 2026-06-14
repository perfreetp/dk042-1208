import { useState, useEffect } from 'react';
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
  X,
  Save,
  Pencil,
} from 'lucide-react';
import { useEnvironmentStore } from '../store/useEnvironmentStore';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, relativeTime, cn, getEnvText } from '../utils';
import type { Environment, EnvironmentType, EnvStatus } from '../types';

export function Environments() {
  const {
    environments,
    selectedEnv,
    showEditModal,
    editingEnv,
    setSelectedEnv,
    setShowEditModal,
    setEditingEnv,
    updateEnvironment,
    getAuditLogsByEnvId,
  } = useEnvironmentStore();

  const [editForm, setEditForm] = useState({
    name: '',
    currentVersion: '',
    instances: 0,
    region: '',
    cpuUsage: 0,
    memoryUsage: 0,
    status: 'healthy' as EnvStatus,
  });

  useEffect(() => {
    if (editingEnv) {
      setEditForm({
        name: editingEnv.name,
        currentVersion: editingEnv.currentVersion,
        instances: editingEnv.instances,
        region: editingEnv.region,
        cpuUsage: editingEnv.cpuUsage,
        memoryUsage: editingEnv.memoryUsage,
        status: editingEnv.status,
      });
    }
  }, [editingEnv]);

  useEffect(() => {
    if (selectedEnv) {
      const updated = environments.find((e) => e.id === selectedEnv.id);
      if (updated) {
        setSelectedEnv(updated);
      }
    }
  }, [environments, selectedEnv?.id, setSelectedEnv]);

  const handleEditClick = (env: Environment) => {
    setEditingEnv(env);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!editingEnv) return;

    updateEnvironment(editingEnv.id, {
      name: editForm.name,
      currentVersion: editForm.currentVersion,
      instances: editForm.instances,
      region: editForm.region,
      cpuUsage: editForm.cpuUsage,
      memoryUsage: editForm.memoryUsage,
      status: editForm.status,
      lastModifiedBy: '当前用户',
      lastModifiedAt: new Date().toISOString(),
    });

    setShowEditModal(false);
    setEditingEnv(null);
  };

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

  const getDomain = (type: EnvironmentType) => {
    const domains: Record<EnvironmentType, string> = {
      test: 'test.example.com',
      staging: 'staging.example.com',
      production: 'www.example.com',
    };
    return domains[type];
  };

  const getQps = (type: EnvironmentType) => {
    const qps: Record<EnvironmentType, string> = {
      test: '500',
      staging: '2.3k',
      production: '12.5k',
    };
    return qps[type];
  };

  const auditLogsByEnvId = selectedEnv
    ? getAuditLogsByEnvId(selectedEnv.id)
        .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
        .slice(0, 5)
    : [];

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

            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">最后部署</span>
                <span className="text-xs text-white/80">
                  {relativeTime(env.deployHistory[0]?.deployedAt || '')}
                </span>
              </div>
              {env.lastModifiedBy && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    最近修改
                  </span>
                  <span className="text-xs text-white/80">
                    {env.lastModifiedBy} · {relativeTime(env.lastModifiedAt || '')}
                  </span>
                </div>
              )}
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
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          getUsageBarColor(env.cpuUsage)
                        )}
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
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          getUsageBarColor(env.memoryUsage)
                        )}
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
                <h3 className="text-base font-semibold text-white">
                  {selectedEnv.name} - 详细配置
                </h3>
                <p className="text-xs text-slate-500">环境配置与参数</p>
              </div>
            </div>
            <button
              onClick={() => handleEditClick(selectedEnv)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
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
              <p className="text-sm text-white font-mono text-xs">
                {getDomain(selectedEnv.type)}
              </p>
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
              <p className="text-sm text-white font-medium">{getQps(selectedEnv.type)}</p>
              <p className="text-xs text-slate-500">峰值</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">最近修改记录</h3>
            </div>
            <div className="space-y-2">
              {auditLogsByEnvId.length > 0 ? (
                auditLogsByEnvId.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">{log.modifiedBy}</span>{' '}
                        修改了【<span className="text-blue-400">{log.field}</span>】:{' '}
                        <span className="text-slate-400 line-through">{log.oldValue}</span>{' '}
                        → <span className="text-emerald-400">{log.newValue}</span>
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {relativeTime(log.modifiedAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">暂无修改记录</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingEnv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowEditModal(false);
              setEditingEnv(null);
            }}
          />
          <div className="relative w-[500px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">编辑环境配置</h3>
                  <p className="text-sm text-slate-500">{editingEnv.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnv(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  环境名称
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    当前版本
                  </label>
                  <input
                    type="text"
                    value={editForm.currentVersion}
                    onChange={(e) =>
                      setEditForm({ ...editForm, currentVersion: e.target.value })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    实例数量
                  </label>
                  <input
                    type="number"
                    value={editForm.instances}
                    onChange={(e) =>
                      setEditForm({ ...editForm, instances: parseInt(e.target.value) || 0 })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  部署区域
                </label>
                <input
                  type="text"
                  value={editForm.region}
                  onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    CPU 使用率 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.cpuUsage}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cpuUsage: parseInt(e.target.value) || 0 })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    内存使用率 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.memoryUsage}
                    onChange={(e) =>
                      setEditForm({ ...editForm, memoryUsage: parseInt(e.target.value) || 0 })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  环境状态
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value as EnvStatus })
                  }
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="healthy">健康</option>
                  <option value="warning">警告</option>
                  <option value="error">异常</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEnv(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
