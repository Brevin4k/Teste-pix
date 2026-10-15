import React, { useState } from 'react';
import { Plus, ExternalLink, Trash2, Eye, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { PixPaymentLink } from '../types/pix';
import { PixIcon } from './PixLogo';
import { ConfirmModal } from './ConfirmModal';

interface LinksGeradosViewProps {
  links: PixPaymentLink[];
  onOpenGenerateModal: () => void;
  onViewLink: (link: PixPaymentLink) => void;
  onDeleteLink: (linkId: string) => void;
}

export const LinksGeradosView: React.FC<LinksGeradosViewProps> = ({
  links,
  onOpenGenerateModal,
  onViewLink,
  onDeleteLink,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedGovId, setCopiedGovId] = useState<string | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<PixPaymentLink | null>(null);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/pay/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCopyGov = (link: PixPaymentLink) => {
    navigator.clipboard.writeText(link.payload);
    setCopiedGovId(link.id);
    setTimeout(() => setCopiedGovId(null), 2000);
  };

  const handleConfirmDelete = () => {
    if (linkToDelete) {
      onDeleteLink(linkToDelete.id);
      setLinkToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Links Gerados
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Todos os seus links e códigos Pix no padrão oficial gov.br (Bacen).
          </p>
        </div>

        <button
          onClick={onOpenGenerateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#071311]" />
          <span>Criar Novo Link</span>
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Nenhum Link Gerado
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Seu histórico de links está limpo. Crie seu primeiro link Pix para começar a receber.
          </p>
          <button
            onClick={onOpenGenerateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#071311]" />
            <span>Criar Novo Link</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PixIcon size={20} />
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[160px]">
                      {link.key}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      link.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {link.status === 'paid' ? 'Pago' : 'Ativo'}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white mb-1">
                  {link.amount !== null
                    ? `R$ ${link.amount.toFixed(2).replace('.', ',')}`
                    : 'Valor Variável'}
                </div>

                {link.description && (
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {link.description}
                  </p>
                )}

                {/* Primary Button: Copiar Pix Gov.br */}
                <button
                  type="button"
                  onClick={() => handleCopyGov(link)}
                  className="w-full mb-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer active:scale-98"
                >
                  {copiedGovId === link.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pix Copiado (Padrão Gov.br)!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Copiar Pix (Padrão Gov.br)</span>
                    </>
                  )}
                </button>

                {/* Link Box */}
                <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-mono truncate">
                    /pay/{link.slug}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(link.slug)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px] inline-flex items-center gap-1"
                    title="Copiar Link"
                  >
                    {copiedSlug === link.slug ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => onViewLink(link)}
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver QR Code</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(`/pay/${link.slug}`, '_blank')}
                    className="text-slate-400 hover:text-teal-400 transition-colors cursor-pointer p-1"
                    title="Abrir Página de Checkout"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkToDelete(link)}
                    className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer p-1"
                    title="Excluir Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={!!linkToDelete}
        title="Excluir Link Pix?"
        message={`Deseja realmente apagar este link (${linkToDelete?.slug}) para a chave "${linkToDelete?.key}"?`}
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setLinkToDelete(null)}
        isDestructive={true}
      />
    </div>
  );
};
