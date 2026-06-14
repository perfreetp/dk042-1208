import { useState, useEffect } from 'react';
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
import { useIssueStore } from '../store/useIssueStore';
import { useProjectStore } from '../store/useProjectStore';
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

const envOptions: { key: EnvironmentType; label: string }[] = [
  { key: 'test', label: '测试环境' },
  { key: 'staging', label: '预发环境' },
  { key: 'production', label: '生产环境' },
];

export function Releases() {
  const {
    releases,
    selectRelease,
    setShowDetailModal,
    showDetailModal,
    selectedRelease,
    setShowCreateModal,
    showCreateModal,
    addRelease,
    approveRelease,
    rejectRelease,
    rollbackRelease,
    deployRelease,
    completeRelease,
  } = useReleaseStore();
  const { issues } = useIssueStore();
  const { projects } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'all' | ReleaseStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    version: '',
    projectId: '',
    environment: 'test' as EnvironmentType,
    description: '',
    relatedIssues: [] as string[],
  });

  const [approvalComments, setApprovalComments] = useState('');
  const [showApprovalInput, setShowApprovalInput] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (showDetailModal && selectedRelease) {
      const updated = releases.find((r) => r.id === selectedRelease.id);
      if (updated) {
        selectRelease(updated);
      }
    }
  }, [releases, selectedRelease?.id, showDetailModal, selectRelease]);

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

  const handleCreateRelease = () => {
    if (!formData.title || !formData.version || !formData.projectId) return;

    const project = projects.find((p) => p.id === formData.projectId);

    addRelease({
      title: formData.title,
      version: formData.version,
      projectId: formData.projectId,
      projectName: project?.name || '',
      environment: formData.environment,
      status: 'pending_approval',
      applicant: '当前用户',
      relatedIssues: formData.relatedIssues,
      description: formData.description,
    });

    setFormData({
      title: '',
      version: '',
      projectId: '',
      environment: 'test',
      description: '',
      relatedIssues: [],
    });
    setShowCreateModal(false);
  };

  const handleApprove = () => {
    if (!selectedRelease) return;
    approveRelease(selectedRelease.id, approvalComments, '当前审批人');
    setApprovalComments('');
    setShowApprovalInput(null);
  };

  const handleReject = () => {
    if (!selectedRelease) return;
    rejectRelease(selectedRelease.id, approvalComments, '当前审批人');
    setApprovalComments('');
    setShowApprovalInput(null);
  };

  const handleRollback = () => {
    if (!selectedRelease) return;
    rollbackRelease(selectedRelease.id);
  };

  const handleDeploy = () => {
    if (!selectedRelease) return;
    deployRelease(selectedRelease.id);
  };

  const handleCompleteDeploy = () => {
    if (!selectedRelease) return;
    completeRelease(selectedRelease.id);
  };

  const toggleIssueSelection = (issueId: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedIssues: prev.relatedIssues.includes(issueId)
        ? prev.relatedIssues.filter((id) => id !== issueId)
        : [...prev.relatedIssues, issueId],
    }));
  };

  const getIssueTitle = (issueId: string) => {
    const issue = issues.find((i) => i.id === issueId);
    return issue?.title || '未知问题';
  };

  const getIssueById = (issueId: string) => {
    return issues.find((i) => i.id === issueId);
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
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
              <span
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium border',
                  envColor(release.environment)
                )}
              >
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-[500px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">提交发布申请</h3>
                  <p className="text-sm text-slate-500">填写发布信息并提交审批</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  发布标题 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入发布标题"
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    版本号 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0.0"
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    目标环境
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) =>
                      setFormData({ ...formData, environment: e.target.value as EnvironmentType })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  >
                    {envOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  所属项目 <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="">请选择项目</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">发布描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请描述本次发布的内容..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">关联问题</label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 bg-slate-800/30 rounded-lg p-2">
                  {issues.map((issue) => (
                    <label
                      key={issue.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.relatedIssues.includes(issue.id)}
                        onChange={() => toggleIssueSelection(issue.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-xs font-mono text-slate-500">{issue.id}</span>
                      <span className="text-sm text-slate-300 truncate">{issue.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateRelease}
                disabled={!formData.title || !formData.version || !formData.projectId}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

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
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-md text-sm font-medium border',
                    envColor(selectedRelease.environment)
                  )}
                >
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
                        selectedRelease.approver ? 'bg-emerald-500/20' : 'bg-slate-700/50'
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
                  {selectedRelease.relatedIssues.map((issueId) => {
                    const issue = getIssueById(issueId);
                    return (
                      <div
                        key={issueId}
                        className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg"
                      >
                        <GitBranch className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300 font-mono text-xs">{issueId}</span>
                        <span className="text-sm text-slate-200 flex-1">{getIssueTitle(issueId)}</span>
                        {issue && <StatusBadge status={issue.status} size="sm" />}
                      </div>
                    );
                  })}
                  {selectedRelease.relatedIssues.length === 0 && (
                    <p className="text-sm text-slate-500">暂无关联问题</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRelease.status === 'completed' && (
                  <button
                    onClick={handleRollback}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 text-sm font-medium rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    回滚
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1 justify-end">
                {selectedRelease.status === 'pending_approval' && !showApprovalInput && (
                  <>
                    <button
                      onClick={() => setShowApprovalInput('reject')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium rounded-lg transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      驳回
                    </button>
                    <button
                      onClick={() => setShowApprovalInput('approve')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      批准
                    </button>
                  </>
                )}
                {showApprovalInput && (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                      placeholder={
                        showApprovalInput === 'approve' ? '请输入批准意见...' : '请输入驳回原因...'
                      }
                      className="flex-1 h-8 px-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowApprovalInput(null);
                        setApprovalComments('');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm rounded-lg transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={showApprovalInput === 'approve' ? handleApprove : handleReject}
                      className={cn(
                        'px-4 py-1.5 text-white text-sm font-medium rounded-lg transition-colors',
                        showApprovalInput === 'approve'
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : 'bg-red-500 hover:bg-red-600'
                      )}
                    >
                      确认
                    </button>
                  </div>
                )}
                {selectedRelease.status === 'approved' && (
                  <button
                    onClick={handleDeploy}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Rocket className="w-4 h-4" />
                    开始部署
                  </button>
                )}
                {selectedRelease.status === 'deploying' && (
                  <button
                    onClick={handleCompleteDeploy}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    完成部署
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
