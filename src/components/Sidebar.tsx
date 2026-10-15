import React from 'react';
import { Home, KeyRound, Link2, Settings, LogOut, X } from 'lucide-react';
import { PixLogo } from './PixLogo';

export type NavTab = 'inicio' | 'chaves' | 'links' | 'configuracoes';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'inicio' as NavTab, label: 'Início', icon: Home },
    { id: 'chaves' as NavTab, label: 'Minhas Chaves', icon: KeyRound },
    { id: 'links' as NavTab, label: 'Links Gerados', icon: Link2 },
    { id: 'configuracoes' as NavTab, label: 'Configurações', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070B11] border-r border-slate-800/80 w-64 p-5 select-none">
      {/* Brand Logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <PixLogo size={32} />
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop and overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
