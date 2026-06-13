import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { cn } from '../utils';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: '项目首页', subtitle: '概览您的交付数据与最近活动' },
  '/pipelines': { title: '流水线', subtitle: '管理和监控 CI/CD 流水线' },
  '/releases': { title: '发布计划', subtitle: '管理发布申请与审批流程' },
  '/environments': { title: '环境管理', subtitle: '查看和管理各环境状态' },
  '/issues': { title: '问题追踪', subtitle: '跟踪需求与缺陷的全生命周期' },
  '/metrics': { title: '度量报表', subtitle: '查看交付数据与团队周报' },
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = Object.keys(pageTitles).find((p) => location.pathname.startsWith(p));
    return pageTitles[path || '/dashboard'] || pageTitles['/dashboard'];
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={cn(
          'transition-all duration-300 min-h-screen flex flex-col',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
