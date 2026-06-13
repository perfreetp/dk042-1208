import { useState, useEffect } from 'react';
import {
  Bug,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Clock,
  User,
  GitBranch,
  Tag,
  X,
  MessageSquare,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Circle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useIssueStore } from '../store/useIssueStore';
import { useProjectStore } from '../store/useProjectStore';
import { StatusBadge } from '../components/StatusBadge';
import { formatDateTime, relativeTime, cn, getPriorityText, getIssueTypeText } from '../utils';
import type { Issue, IssueType, IssueStatus, Priority } from '../types';

const typeTabs: { key: 'all' | IssueType; label: string; icon: typeof Bug }[] = [
  { key: 'all', label: '全部', icon: Filter },
  { key: 'feature', label: '需求', icon: GitBranch },
  { key: 'bug', label: '缺陷', icon: Bug },
];

const statusOptions: { key: 'all' | IssueStatus; label: string }[] = [
  { key: 'all', label: '全部状态' },
  { key: 'backlog', label: '待开始' },
  { key: 'in_progress', label: '开发中' },
  { key: 'testing', label: '测试中' },
  { key: 'done', label: '已完成' },
  { key: 'closed', label: '已关闭' },
];

const priorityOptions: { key: 'all' | Priority; label: string; color: string }[] = [
  { key: 'all', label: '全部优先级', color: '' },
  { key: 'low', label: '低', color: 'text-gray-400' },
  { key: 'medium', label: '中', color: 'text-blue-400' },
  { key: 'high', label: '高', color: 'text-amber-400' },
  { key: 'critical', label: '紧急', color: 'text-red-400' },
];

const issueStatusList: { key: IssueStatus; label: string }[] = [
  { key: 'backlog', label: '待开始' },
  { key: 'in_progress', label: '开发中' },
  { key: 'testing', label: '测试中' },
  { key: 'done', label: '已完成' },
  { key: 'closed', label: '已关闭' },
];

export function Issues() {
  const {
    issues,
    filterStatus,
    searchQuery,
    selectedIssue,
    showDetailModal,
    showCreateModal,
    setFilterStatus,
    setSearchQuery,
    selectIssue,
    setShowDetailModal,
    setShowCreateModal,
    addIssue,
    updateIssueStatus,
  } = useIssueStore();
  const { projects } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'all' | IssueType>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');

  const [formData, setFormData] = useState({
    title: '',
    type: 'feature' as IssueType,
    priority: 'medium' as Priority,
    projectId: '',
    description: '',
    branchName: '',
    assignee: '',
  });

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    if (showDetailModal && selectedIssue) {
      const updated = issues.find((i) => i.id === selectedIssue.id);
      if (updated) {
        selectIssue(updated);
      }
    }
  }, [issues, selectedIssue?.id, showDetailModal, selectIssue]);

  const filteredIssues = issues.filter((issue) => {
    if (activeTab !== 'all' && issue.type !== activeTab) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const handleViewDetail = (issue: Issue) => {
    selectIssue(issue);
    setShowDetailModal(true);
  };

  const handleCreateIssue = () => {
    if (!formData.title || !formData.projectId) return;

    const project = projects.find((p) => p.id === formData.projectId);

    addIssue({
      title: formData.title,
      type: formData.type,
      status: 'backlog',
      priority: formData.priority,
      projectId: formData.projectId,
      projectName: project?.name || '',
      assignee: formData.assignee || '待分配',
      creator: '当前用户',
      branchName: formData.branchName || undefined,
      description: formData.description,
      labels: [],
    });

    setFormData({
      title: '',
      type: 'feature',
      priority: 'medium',
      projectId: '',
      description: '',
      branchName: '',
      assignee: '',
    });
    setShowCreateModal(false);
  };

  const handleStatusChange = (status: IssueStatus) => {
    if (!selectedIssue) return;
    updateIssueStatus(selectedIssue.id, status);
    setShowStatusDropdown(false);
  };

  const getPriorityColor = (priority: Priority) => {
    const colors: Record<Priority, string> = {
      low: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
      medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      high: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    };
    return colors[priority];
  };

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'testing':
        return <CircleDot className="w-4 h-4 text-amber-400" />;
      case 'backlog':
        return <Circle className="w-4 h-4 text-slate-500" />;
      default:
        return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  const stats = {
    total: issues.length,
    feature: issues.filter((i) => i.type === 'feature').length,
    bug: issues.filter((i) => i.type === 'bug').length,
    done: issues.filter((i) => i.status === 'done').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">全部问题</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">需求</p>
          <p className="text-2xl font-bold text-blue-400">{stats.feature}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">缺陷</p>
          <p className="text-2xl font-bold text-rose-400">{stats.bug}</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <p className="text-xs text-slate-500 mb-1">已完成</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.done}</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg">
            {typeTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
                    activeTab === tab.key
                      ? 'bg-blue-500/20 text-blue-400 font-medium'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-8 pl-9 pr-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as IssueStatus | 'all')}
              className="h-8 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
              className="h-8 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 cursor-pointer"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建问题
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  优先级
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  所属项目
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  负责人
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  更新时间
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => handleViewDetail(issue)}
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(issue.status)}
                      <div>
                        <p className="text-sm text-white font-medium">{issue.title}</p>
                        <p className="text-xs text-slate-500 font-mono">{issue.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
                        issue.type === 'feature'
                          ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                          : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                      )}
                    >
                      {issue.type === 'feature' ? (
                        <GitBranch className="w-3 h-3" />
                      ) : (
                        <Bug className="w-3 h-3" />
                      )}
                      {getIssueTypeText(issue.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
                        getPriorityColor(issue.priority)
                      )}
                    >
                      {getPriorityText(issue.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-300">{issue.projectName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-300">{issue.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{relativeTime(issue.updatedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无匹配的问题</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-[520px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">新建问题</h3>
                  <p className="text-sm text-slate-500">创建新的需求或缺陷</p>
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
                  问题标题 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入问题标题"
                  className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    问题类型
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, type: 'feature' })}
                      className={cn(
                        'flex-1 h-9 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border',
                        formData.type === 'feature'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
                      )}
                    >
                      <GitBranch className="w-4 h-4" />
                      需求
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, type: 'bug' })}
                      className={cn(
                        'flex-1 h-9 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border',
                        formData.type === 'bug'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
                      )}
                    >
                      <Bug className="w-4 h-4" />
                      缺陷
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    优先级
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="critical">紧急</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    负责人
                  </label>
                  <input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="负责人姓名"
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    关联分支
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="feature/xxx"
                    className="w-full h-9 px-3 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">问题描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请详细描述问题内容..."
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
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
                onClick={handleCreateIssue}
                disabled={!formData.title || !formData.projectId}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                创建问题
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative w-[650px] max-h-[85vh] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    selectedIssue.type === 'feature' ? 'bg-blue-500/20' : 'bg-rose-500/20'
                  )}
                >
                  {selectedIssue.type === 'feature' ? (
                    <GitBranch className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Bug className="w-5 h-5 text-rose-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedIssue.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedIssue.id}</p>
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
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedIssue.status} />
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border',
                    getPriorityColor(selectedIssue.priority)
                  )}
                >
                  {getPriorityText(selectedIssue.priority)}优先级
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium border',
                    selectedIssue.type === 'feature'
                      ? 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                      : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                  )}
                >
                  {getIssueTypeText(selectedIssue.type)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">所属项目</p>
                  <p className="text-sm text-white font-medium">{selectedIssue.projectName}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">负责人</p>
                  <p className="text-sm text-white font-medium">{selectedIssue.assignee}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">创建人</p>
                  <p className="text-sm text-white font-medium">{selectedIssue.creator}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">创建时间</p>
                  <p className="text-sm text-white font-medium">
                    {formatDateTime(selectedIssue.createdAt)}
                  </p>
                </div>
              </div>

              {selectedIssue.branchName && (
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">关联分支</span>
                  </div>
                  <code className="text-sm text-emerald-400 font-mono bg-slate-900/50 px-3 py-1.5 rounded">
                    {selectedIssue.branchName}
                  </code>
                </div>
              )}

              {selectedIssue.labels.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-white">标签</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIssue.labels.map((label) => (
                      <span
                        key={label}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">问题描述</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedIssue.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                  编辑
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-400 text-sm rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  更改状态
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute bottom-full right-0 mb-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
                    {issueStatusList.map((status) => (
                      <button
                        key={status.key}
                        onClick={() => handleStatusChange(status.key)}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2',
                          selectedIssue.status === status.key
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'text-slate-300 hover:bg-slate-700'
                        )}
                      >
                        {getStatusIcon(status.key)}
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
