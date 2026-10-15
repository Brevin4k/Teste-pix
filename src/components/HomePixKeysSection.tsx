import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  Link2,
  Plus,
  Star,
  QrCode,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PixKey } from '../types/pix';
import { PixIcon } from './PixLogo';
import { GovPixBadge, GovSecurityBanner } from './GovBadge';

interface HomePixKeysSectionProps {
  keys: PixKey[];
  onAddNewKey: () => void;
  onGenerateLinkFromKey: (key: string) => void;
  onOpenQrCodeWithKey?: (key: string) => void;
  onSetDefaultKey?: (keyId: string) => void;
  onRestoreGovKeys?: () => void;
}

export const HomePixKeysSection: React.FC<HomePixKeysSectionProps> = ({
  keys,
  onAddNewKey,
  onGenerateLinkFromKey,
  onOpenQrCodeWithKey,
  onSetDefaultKey,
  onRestoreGovKeys,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600/30 to-teal-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
            <KeyRound className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Minhas Chaves Pix
              </h2>
              <GovPixBadge size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Suas chaves cadastradas e protegidas pelo Pix de Segurança Gov.br
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {keys.length === 0 && onRestoreGovKeys && (
            <button
              type="button"
              onClick={onRestoreGovKeys}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Carregar Chaves do GOV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddNewKey}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Chave Pix</span>
          </button>
        </div>
      </div>

      {/* Gov Security Banner */}
      <GovSecurityBanner className="mb-4" />

      {/* Keys Cards Grid */}
      {keys.length === 0 ? (
        <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            Nenhuma chave cadastrada no painel
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Cadastre sua chave Pix ou carregue seu Pix do GOV (Pix de Segurança) para começar a gerar links de cobrança.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {onRestoreGovKeys && (
              <button
                type="button"
                onClick={onRestoreGovKeys}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                Ativar Minhas Chaves Pix do GOV
              </button>
            )}
            <button
              type="button"
              onClick={onAddNewKey}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 cursor-pointer transition-all"
            >
              Cadastrar Nova Chave
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {keys.map((k) => {
            const isGov = k.isGovSecurity !== false;
            return (
              <div
                key={k.id}
                className={`bg-[#0E1523]/90 border rounded-2xl p-4 shadow-lg relative transition-all group hover:border-blue-500/40 flex flex-col justify-between ${
                  k.isDefault
                    ? 'border-blue-500/50 bg-gradient-to-br from-[#0E1523] to-[#0A1B3A]/40'
                    : 'border-slate-800/80'
                }`}
              >
                <div>
                  {/* Top card row: Logo, badges, default star */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0B0F17] border border-slate-800 flex items-center justify-center shrink-0">
                        <PixIcon size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                            {k.type}
                          </span>
                          {isGov && <GovPixBadge size="xs" />}
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 truncate max-w-[150px]">
                          {k.label || (isGov ? 'Pix do GOV' : 'Chave Pix')}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {k.isDefault ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Padrão</span>
                        </span>
                      ) : onSetDefaultKey ? (
                        <button
                          type="button"
                          onClick={() => onSetDefaultKey(k.id)}
                          className="text-slate-500 hover:text-amber-400 p-1 rounded transition-colors cursor-pointer"
                          title="Definir como chave padrão"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Chave Pix display box with 1-click copy */}
                  <div className="bg-[#070B11] border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-3 group-hover:border-slate-700 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-xs text-slate-100 font-mono truncate select-all">
                        {k.key}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(k.id, k.key)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-white px-2 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Copiar chave Pix"
                    >
                      {copiedId === k.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiada</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-blue-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom action row: Gerar Link + QR Code */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-800/70 text-xs">
                  <button
                    type="button"
                    onClick={() => onGenerateLinkFromKey(k.key)}
                    className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer text-xs"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Gerar Link Pix</span>
                  </button>

                  {onOpenQrCodeWithKey && (
                    <button
                      type="button"
                      onClick={() => onOpenQrCodeWithKey(k.key)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                      title="Criar QR Code direto com esta chave"
                    >
                      <QrCode className="w-3.5 h-3.5 text-slate-400" />
                      <span>QR Code</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
