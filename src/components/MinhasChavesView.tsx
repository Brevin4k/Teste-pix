import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Trash2,
  Star,
  Link2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { PixKey } from '../types/pix';
import { PixIcon } from './PixLogo';
import { ConfirmModal } from './ConfirmModal';
import { GovPixBadge, GovSecurityBanner } from './GovBadge';

interface MinhasChavesViewProps {
  keys: PixKey[];
  onAddNewKey: () => void;
  onSetDefaultKey: (keyId: string) => void;
  onDeleteKey: (keyId: string) => void;
  onGenerateLinkFromKey: (key: string) => void;
  onToggleGovSecurity?: (keyId: string) => void;
}

export const MinhasChavesView: React.FC<MinhasChavesViewProps> = ({
  keys,
  onAddNewKey,
  onSetDefaultKey,
  onDeleteKey,
  onGenerateLinkFromKey,
  onToggleGovSecurity,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<PixKey | null>(null);
  const [filterGovOnly, setFilterGovOnly] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = () => {
    if (keyToDelete) {
      onDeleteKey(keyToDelete.id);
      setKeyToDelete(null);
    }
  };

  const displayedKeys = filterGovOnly
    ? keys.filter((k) => k.isGovSecurity !== false)
    : keys;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Minhas Chaves Pix
            </h2>
            <GovPixBadge size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre, organize e proteja suas chaves com o Pix de Segurança Gov.br.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setFilterGovOnly(!filterGovOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              filterGovOnly
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                : 'bg-[#0E1523] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Apenas Pix do GOV</span>
          </button>

          <button
            onClick={onAddNewKey}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Chave</span>
          </button>
        </div>
      </div>

      {/* Gov Security Banner */}
      <GovSecurityBanner />

      {/* Grid of keys */}
      {displayedKeys.length === 0 ? (
        <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {filterGovOnly ? 'Nenhuma Chave Pix do GOV' : 'Nenhuma Chave Cadastrada'}
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            {filterGovOnly
              ? 'Nenhuma chave marcada com Pix de Segurança Gov.br no momento.'
              : 'Cadastre sua primeira chave Pix (CPF, CNPJ, e-mail, celular ou aleatória) com segurança.'}
          </p>
          <button
            onClick={onAddNewKey}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Chave Pix</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedKeys.map((k) => {
            const isGov = k.isGovSecurity !== false;
            return (
              <div
                key={k.id}
                className={`bg-[#0E1523]/90 border rounded-2xl p-5 shadow-lg relative transition-all ${
                  k.isDefault
                    ? 'border-blue-500/50 bg-gradient-to-br from-[#0E1523] to-[#0A1B3A]/30 shadow-blue-500/5'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Default badge */}
                {k.isDefault && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>Padrão</span>
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                    <PixIcon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        {k.type}
                      </span>
                      {isGov && <GovPixBadge size="xs" />}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {k.label || (isGov ? 'Pix do GOV' : 'Chave Pix')}
                    </h4>
                  </div>
                </div>

                {/* Key display with copy */}
                <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-xs text-slate-100 font-mono truncate select-all">
                      {k.key}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(k.id, k.key)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copiar Chave"
                  >
                    {copiedId === k.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Bottom actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
                  <button
                    type="button"
                    onClick={() => onGenerateLinkFromKey(k.key)}
                    className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold transition-colors cursor-pointer"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Gerar Link</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!k.isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefaultKey(k.id)}
                        className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer p-1"
                        title="Definir como chave padrão"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setKeyToDelete(k)}
                      className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                      title="Excluir Chave"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation modal for deleting key */}
      <ConfirmModal
        isOpen={!!keyToDelete}
        title="Excluir Chave Pix?"
        message={`Deseja realmente remover a chave "${keyToDelete?.key}" (${keyToDelete?.type.toUpperCase()})?`}
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setKeyToDelete(null)}
        isDestructive={true}
      />
    </div>
  );
};
