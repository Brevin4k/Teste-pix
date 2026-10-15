import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface GovPixBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSecurityLevel?: boolean;
  level?: 'ouro' | 'prata' | 'padrao';
  className?: string;
}

export const GovPixBadge: React.FC<GovPixBadgeProps> = ({
  size = 'sm',
  showSecurityLevel = false,
  level = 'ouro',
  className = '',
}) => {
  if (size === 'xs') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#1351B4]/25 text-[#60A5FA] border border-[#1351B4]/50 font-bold text-[9px] tracking-wider uppercase ${className}`}
        title="Chave Pix do GOV protegida pelo Mecanismo de Segurança Gov.br"
      >
        <ShieldCheck className="w-2.5 h-2.5 text-[#60A5FA]" />
        <span>PIX GOV</span>
      </span>
    );
  }

  if (size === 'md') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#1351B4]/30 via-[#0A3273]/30 to-[#031A40]/30 text-white border border-[#2563EB]/40 shadow-sm ${className}`}
      >
        <div className="w-5 h-5 rounded-full bg-[#1351B4] flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold tracking-wide text-blue-200">
              PIX DO GOV
            </span>
            <span className="text-[9px] px-1 py-0.2 bg-[#1E3A8A]/80 border border-blue-400/30 rounded text-blue-200 font-mono font-bold">
              gov.br
            </span>
          </div>
          <span className="text-[10px] text-blue-300/80 font-medium -mt-0.5">
            Pix de Segurança
          </span>
        </div>
        {showSecurityLevel && (
          <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
            Nível {level}
          </span>
        )}
      </div>
    );
  }

  // Default 'sm'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1351B4]/20 text-[#60A5FA] border border-[#2563EB]/40 font-semibold text-[10px] tracking-wide shadow-sm ${className}`}
      title="Pix do GOV - Chave de Segurança Registrada Gov.br"
    >
      <ShieldCheck className="w-3 h-3 text-[#60A5FA] shrink-0" />
      <span className="font-bold text-white">PIX DO GOV</span>
      <span className="text-[9px] text-[#93C5FD] font-normal border-l border-blue-500/30 pl-1.5 hidden sm:inline">
        Pix de Segurança
      </span>
      <span className="text-[8px] px-1 py-0.2 bg-[#1E3A8A]/60 rounded text-blue-200 font-mono font-bold">
        gov.br
      </span>
    </span>
  );
};

export const GovSecurityBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`p-3 rounded-2xl bg-gradient-to-r from-[#0C1A38]/90 via-[#0E2042]/90 to-[#0C1A38]/90 border border-blue-500/30 flex items-center justify-between gap-3 text-xs ${className}`}
  >
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white text-xs">
            Pix do GOV • Sistema de Segurança Oficial
          </span>
          <span className="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded font-mono font-bold">
            gov.br
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mt-0.5">
          Chaves Pix com proteção antifraude e validação via DICT / Banco Central do Brasil.
        </p>
      </div>
    </div>
    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>Chaves Seguras</span>
    </div>
  </div>
);
