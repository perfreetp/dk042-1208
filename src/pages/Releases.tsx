import { useState } from 'react';
import {
  Rocket,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  RotateCcw,
  ChevronRight,
  GitBranch,
  Server,
  X,
  Send,
  ThumbsUp,
  ThumbsDown,
  FileText,
  CalendarClock,
  ArrowRightLeft,
} from 'lucide-react';
import { useReleaseStore } from '../store/useReleaseStore';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, relativeTime, cn, getEnvText } from '../utils';
import type { Release, EnvironmentType, ReleaseStatus } from '../types';

const statusTabs: { key: 'all' | ReleaseStatus; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending_approval', label: '待审批' },
  { key: 'approved', label: '已批准' },
  { key: 'deploying', label: '部署中' },
  { key: 'completed', label: '已完成' },
  { key: 'rollback', label: '已回滚' },
];

export function Releases() {
  const { releases, selectRelease, setShowDetailModal, showDetailModal, selectedRelease } =
    useReleaseStore();
  const [activeTab, setActiveTab] = useState<'all' | ReleaseStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = releases.filter((release) => {
    if (activeTab !== 'all' && release.status !== activeTab) return false;
    if (searchQuery && !release.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const handleViewDetail = (release: Release) => {
    selectRelease(release);
    setShowDetailModal(true);
  };

  const envColor = (env: EnvironmentType) => {
    const colors: Record<EnvironmentType, string> = {
      test: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      staging: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      production: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    };
    return colors[env];
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-md transition-colors',
                  activeTab === tab.key
                    ? 'bg-blue-500/20 text-blue-400 font-medium'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索发布..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 h-8 pl-9 pr-3 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          提交发布申请
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredReleases.map((release) => (
          <div
            key={release.id}
            onClick={() => handleViewDetail(release)}
            className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 cursor-pointer transition-all hover:border-blue-500/30 hover:bg-slate-900/80 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    release.status === 'completed' && 'bg-emerald-500/20',
                    release.status === 'pending_approval' && 'bg-amber-500/20',
                    release.status === 'deploying' && 'bg-blue-500/20',
                    release.status === 'rollback' && 'bg-orange-500/20',
                    release.status === 'rejected' && 'bg-red-500/20',
                    release.status === 'approved' && 'bg-cyan-500/20'
                  )}
                >
                  <Rocket className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{release.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{release.projectName}</p>
                </div>
              </div>
              <StatusBadge status={release.status} size="sm" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className={cn('px-2 py-1 rounded-md text-xs font-medium border', envColor(release.environment))}>
                {getEnvText(release.environment)}
              </span>
              <span className="text-xs text-slate-400 font-mono">{release.version}</span>
            </div>

            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{release.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span>{release.applicant}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{relativeTime(release.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                查看详情 <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetailModal && selectedRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative w-[600px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedRelease.title}</h3>
                  <p className="text-sm text-slate-500">{selectedRelease.projectName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center gap-4">
                <StatusBadge status={selectedRelease.status} />
                <span className={cn('px-2.5 py-1 rounded-md text-sm font-medium border', envColor(selectedRelease.environment))}>
                  {getEnvText(selectedRelease.environment)}
                </span>
                <span className="text-sm text-slate-400 font-mono">{selectedRelease.version}</span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">发布描述</h4>
                <p className="text-sm text-slate-400">{selectedRelease.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">申请人</p>
                  <p className="text-sm text-white font-medium">{selectedRelease.applicant}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">申请时间</p>
                  <p className="text-sm text-white font-medium">
                    {formatDateTime(selectedRelease.createdAt)}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">审批人</p>
                  <p className="text-sm text-white font-medium">
                    {selectedRelease.approver || '待分配'}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">部署时间</p>
                  <p className="text-sm text-white font-medium">
                    {selectedRelease.deployedAt ? formatDateTime(selectedRelease.deployedAt) : '--'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-3">审批流程</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">提交申请</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedRelease.applicant} · {formatDateTime(selectedRelease.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        selectedRelease.approver
                          ? 'bg-emerald-500/20'
                          : 'bg-slate-700/50'
                      )}
                    >
                      {selectedRelease.approver ? (
                        selectedRelease.status === 'rejected' ? (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        )
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">
                        {selectedRelease.approver ? '已审批' : '待审批'}
                      </p>
                      {selectedRelease.approver && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {selectedRelease.approver}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        selectedRelease.status === 'completed' ||
                        selectedRelease.status === 'deploying'
                          ? 'bg-emerald-500/20'
                          : 'bg-slate-700/50'
                      )}
                    >
                      {selectedRelease.status === 'completed' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : selectedRelease.status === 'deploying' ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-400 animate-pulse" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">
                        {selectedRelease.status === 'completed'
                          ? '部署完成'
                          : selectedRelease.status === 'deploying'
                            ? '部署中'
                            : '待部署'}
                      </p>
                      {selectedRelease.deployedAt && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDateTime(selectedRelease.deployedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedRelease.approvalComments && (
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">审批意见</span>
                  </div>
                  <p className="text-sm text-slate-400">{selectedRelease.approvalComments}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-white mb-2">关联需求</h4>
                <div className="space-y-2">
                  {selectedRelease.relatedIssues.map((issueId) => (
                    <div
                      key={issueId}
                      className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg"
                    >
                      <GitBranch className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300 font-mono text-xs">{issueId}</span>
                      <span className="text-sm text-slate-400">需求标题...</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRelease.status === 'completed' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 text-sm font-medium rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4" />
                    回滚
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedRelease.status === 'pending_approval' && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium rounded-lg transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      驳回
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      批准
                    </button>
                  </>
                )}
                {selectedRelease.status === 'approved' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                    <Rocket className="w-4 h-4" />
                    开始部署
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
