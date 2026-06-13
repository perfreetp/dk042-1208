import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Rocket,
  Server,
  Bug,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Boxes,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils';

const navItems = [
  { path: '/dashboard', label: '项目首页', icon: LayoutDashboard },
  { path: '/pipelines', label: '流水线', icon: GitBranch },
  { path: '/releases', label: '发布计划', icon: Rocket },
  { path: '/environments', label: '环境管理', icon: Server },
  { path: '/issues', label: '问题追踪', icon: Bug },
  { path: '/metrics', label: '度量报表', icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-base">DevOps</span>
              <span className="text-slate-400 text-xs">交付平台</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-blue-400' : '')} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">收起菜单</span>}
        </button>
      </div>
    </aside>
  );
}
