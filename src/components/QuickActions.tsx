import React from 'react';
import { KeyRound, Link2, QrCode, ChevronRight } from 'lucide-react';

interface QuickActionsProps {
  onNewKey: () => void;
  onGenerateLink: () => void;
  onGenerateQrCode: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewKey,
  onGenerateLink,
  onGenerateQrCode,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Card 1: Nova Chave Pix */}
      <button
        type="button"
        onClick={onNewKey}
        className="group text-left bg-[#0E1523]/90 hover:bg-[#121B2C] border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-200 shadow-lg flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <KeyRound className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Nova Chave Pix
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Cadastre uma nova chave para receber pagamentos.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </button>

      {/* Card 2: Gerar Link de Pagamento */}
      <button
        type="button"
        onClick={onGenerateLink}
        className="group text-left bg-[#0E1523]/90 hover:bg-[#121B2C] border border-slate-800/80 hover:border-teal-500/40 rounded-2xl p-5 transition-all duration-200 shadow-lg flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Link2 className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
              Gerar Link de Pagamento
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Crie um link Pix para facilitar seus recebimentos.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </button>

      {/* Card 3: Gerar QR Code */}
      <button
        type="button"
        onClick={onGenerateQrCode}
        className="group text-left bg-[#0E1523]/90 hover:bg-[#121B2C] border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 transition-all duration-200 shadow-lg flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <QrCode className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              Gerar QR Code
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Receba pagamentos com um QR Code Pix.
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
      </button>
    </div>
  );
};
