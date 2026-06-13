import { Bell, Search, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索项目、流水线、问题..."
            className="w-72 h-9 pl-10 pr-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <button className="relative w-9 h-9 rounded-lg bg-slate-800/50 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">管理员</span>
            <span className="text-xs text-slate-500">admin@devops.com</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
    </header>
  );
}
