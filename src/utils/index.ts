export function formatDuration(seconds: number): string {
  if (seconds === 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}秒`;
  if (secs === 0) return `${mins}分`;
  return `${mins}分${secs}秒`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(dateStr);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'text-emerald-400 bg-emerald-400/10',
    failed: 'text-red-400 bg-red-400/10',
    running: 'text-blue-400 bg-blue-400/10',
    pending: 'text-gray-400 bg-gray-400/10',
    healthy: 'text-emerald-400 bg-emerald-400/10',
    warning: 'text-amber-400 bg-amber-400/10',
    error: 'text-red-400 bg-red-400/10',
    pending_approval: 'text-amber-400 bg-amber-400/10',
    approved: 'text-blue-400 bg-blue-400/10',
    deploying: 'text-cyan-400 bg-cyan-400/10',
    completed: 'text-emerald-400 bg-emerald-400/10',
    rollback: 'text-orange-400 bg-orange-400/10',
    rejected: 'text-red-400 bg-red-400/10',
    backlog: 'text-gray-400 bg-gray-400/10',
    in_progress: 'text-blue-400 bg-blue-400/10',
    testing: 'text-amber-400 bg-amber-400/10',
    done: 'text-emerald-400 bg-emerald-400/10',
    closed: 'text-gray-400 bg-gray-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
}

export function getStatusDotColor(status: string): string {
  const colors: Record<string, string> = {
    success: 'bg-emerald-400',
    failed: 'bg-red-400',
    running: 'bg-blue-400',
    pending: 'bg-gray-400',
    healthy: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
  };
  return colors[status] || 'bg-gray-400';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-gray-400 bg-gray-400/10',
    medium: 'text-blue-400 bg-blue-400/10',
    high: 'text-amber-400 bg-amber-400/10',
    critical: 'text-red-400 bg-red-400/10',
  };
  return colors[priority] || 'text-gray-400 bg-gray-400/10';
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '运行中',
    pending: '等待中',
    healthy: '正常',
    warning: '警告',
    error: '异常',
    pending_approval: '待审批',
    approved: '已批准',
    deploying: '部署中',
    completed: '已完成',
    rollback: '已回滚',
    rejected: '已驳回',
    backlog: '待开始',
    in_progress: '开发中',
    testing: '测试中',
    done: '已完成',
    closed: '已关闭',
  };
  return texts[status] || status;
}

export function getPriorityText(priority: string): string {
  const texts: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急',
  };
  return texts[priority] || priority;
}

export function getEnvText(env: string): string {
  const texts: Record<string, string> = {
    test: '测试环境',
    staging: '预发环境',
    production: '生产环境',
  };
  return texts[env] || env;
}

export function getIssueTypeText(type: string): string {
  return type === 'feature' ? '需求' : '缺陷';
}

export function getTriggerText(type: string): string {
  const texts: Record<string, string> = {
    manual: '手动触发',
    scheduled: '定时触发',
    webhook: '代码触发',
  };
  return texts[type] || type;
}
