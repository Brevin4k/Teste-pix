import React, { useState } from 'react';
import { Wallet, Link2, User, ChevronDown, Menu, LogOut, Settings } from 'lucide-react';
import { UserProfile } from '../types/pix';

interface DashboardHeaderProps {
  user: UserProfile;
  totalKeys: number;
  totalLinks: number;
  onOpenMobileMenu: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  totalKeys,
  totalLinks,
  onOpenMobileMenu,
  onOpenSettings,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="mb-8">
      {/* Top row with User info & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Mobile Toggle & Greeting */}
        <div className="flex items-start gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 mt-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Olá, {user.name}!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Gerencie suas chaves Pix e links de pagamento.
            </p>
          </div>
        </div>

        {/* Right: Stat counters & User Profile matching screenshot */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start lg:self-center">
          {/* Stat 1: Total de chaves */}
          <div className="flex items-center gap-3 bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                Total de chaves
              </div>
              <div className="text-lg font-bold text-white leading-tight">
                {totalKeys}
              </div>
            </div>
          </div>

          {/* Stat 2: Links gerados */}
          <div className="flex items-center gap-3 bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                Links gerados
              </div>
              <div className="text-lg font-bold text-white leading-tight">
                {totalLinks}
              </div>
            </div>
          </div>

          {/* User profile dropdown button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-[#0E1523]/90 hover:bg-slate-800/80 border border-slate-800/80 rounded-2xl px-3.5 py-2 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white hidden sm:inline">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-[#0E1523] border border-slate-700/80 rounded-2xl shadow-2xl z-30 py-2 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Configurações</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da conta</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
