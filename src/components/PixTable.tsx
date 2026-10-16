import React, { useState } from 'react';
import {
  Link2,
  Filter,
  Eye,
  Trash2,
  Copy,
  Check,
  Edit2,
  ChevronDown,
  Search,
  Sparkles,
  Eraser,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { PixIcon } from './PixLogo';
import { PixQRCode } from './PixQRCode';
import { PixPaymentLink } from '../types/pix';
import { ConfirmModal } from './ConfirmModal';
import { GovPixBadge } from './GovBadge';
import { createShareablePixUrl, formatDisplayPixUrl } from '../utils/linkSharing';

interface PixTableProps {
  links: PixPaymentLink[];
  onViewLink: (link: PixPaymentLink) => void;
  onEditLink: (link: PixPaymentLink) => void;
  onDeleteLink: (linkId: string) => void;
  onClearAllLinks?: () => void;
  onOpenGenerateModal?: () => void;
  onVisitCheckout?: (link: PixPaymentLink) => void;
}

export const PixTable: React.FC<PixTableProps> = ({
  links,
  onViewLink,
  onEditLink,
  onDeleteLink,
  onClearAllLinks,
  onOpenGenerateModal,
  onVisitCheckout,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedGovId, setCopiedGovId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // In-app delete confirmation state (no window.confirm, 100% iframe-safe)
  const [linkToDelete, setLinkToDelete] = useState<PixPaymentLink | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleCopyLink = (link: PixPaymentLink) => {
    const fullUrl = `${window.location.origin}/pay/${link.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyGovPayload = (link: PixPaymentLink) => {
    navigator.clipboard.writeText(link.payload);
    setCopiedGovId(link.id);
    setTimeout(() => setCopiedGovId(null), 2000);
  };

  const handleCopyRawKey = (link: PixPaymentLink) => {
    navigator.clipboard.writeText(link.key);
    setCopiedKeyId(link.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleConfirmDelete = () => {
    if (linkToDelete) {
      onDeleteLink(linkToDelete.id);
      setLinkToDelete(null);
    }
  };

  const filteredLinks = links.filter((link) => {
    if (filterType !== 'all') {
      if (filterType === 'fixed' && !link.isFixed) return false;
      if (filterType === 'variable' && link.isFixed) return false;
      if (['email', 'telefone', 'cpf', 'cnpj', 'aleatoria'].includes(filterType)) {
        if (link.keyType !== filterType) return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchKey = link.key.toLowerCase().includes(q);
      const matchName = link.recipientName.toLowerCase().includes(q);
      const matchDesc = (link.description || '').toLowerCase().includes(q);
      const matchSlug = link.slug.toLowerCase().includes(q);
      return matchKey || matchName || matchDesc || matchSlug;
    }

    return true;
  });

  const getFilterLabel = () => {
    switch (filterType) {
      case 'email':
        return 'E-mail';
      case 'telefone':
        return 'Telefone';
      case 'cpf':
        return 'CPF';
      case 'cnpj':
        return 'CNPJ';
      case 'aleatoria':
        return 'Aleatória';
      case 'fixed':
        return 'Valor Fixo';
      case 'variable':
        return 'Valor Variável';
      default:
        return 'Todos';
    }
  };

  return (
    <>
      <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Chaves Pix e Links Gerados
                </h2>
                <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 font-semibold">
                  {filteredLinks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter and Clean Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar chave ou link..."
                className="bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-36 sm:w-44 transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0B0F17] hover:bg-slate-800/80 border border-slate-700/70 rounded-xl text-xs text-slate-300 font-medium transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>{getFilterLabel()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-[#0E1523] border border-slate-700/80 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden text-xs">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'cpf', label: 'CPF' },
                      { id: 'cnpj', label: 'CNPJ' },
                      { id: 'email', label: 'E-mail' },
                      { id: 'telefone', label: 'Telefone' },
                      { id: 'aleatoria', label: 'Aleatória' },
                      { id: 'fixed', label: 'Valor Fixo' },
                      { id: 'variable', label: 'Valor Variável' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setFilterType(opt.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex items-center justify-between ${
                          filterType === opt.id
                            ? 'bg-blue-600/20 text-blue-400 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {filterType === opt.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Limpar Painel Button */}
            {links.length > 0 && onClearAllLinks && (
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                title="Limpar todos os links e deixar o painel limpo"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar Painel</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-[#0B0F17]/50">
                <th className="py-3.5 px-5">Chave Pix</th>
                <th className="py-3.5 px-5">Link & Pix Copia e Cola</th>
                <th className="py-3.5 px-5">QR Code</th>
                <th className="py-3.5 px-5">Valor</th>
                <th className="py-3.5 px-5">Data</th>
                <th className="py-3.5 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">
                        Painel Limpo
                      </h4>
                      <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                        Nenhum link ou chave ativo no momento. Gere um novo link ou cadastre uma chave para começar.
                      </p>
                      {onOpenGenerateModal && (
                        <button
                          type="button"
                          onClick={onOpenGenerateModal}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                        >
                          <Link2 className="w-4 h-4 text-[#071311]" />
                          <span>Gerar Link do Pix</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const formattedDate = new Date(link.createdAt);
                  const dateStr = !isNaN(formattedDate.getTime())
                    ? formattedDate.toLocaleDateString('pt-BR')
                    : '10/10/2026';
                  const timeStr = !isNaN(formattedDate.getTime())
                    ? formattedDate.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '14:32';

                  return (
                    <tr
                      key={link.id}
                      className="hover:bg-[#121B2C]/70 transition-colors group"
                    >
                      {/* CHAVE PIX & PIX DO GOV */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            <PixIcon size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-100 font-mono text-xs">
                                {link.key}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyRawKey(link)}
                                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Copiar Chave Pix"
                              >
                                {copiedKeyId === link.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30 uppercase">
                                {link.keyType}
                              </span>
                              <GovPixBadge size="xs" />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* LINK DE PAGAMENTO & COPIA E COLA GOV.BR */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1.5 max-w-[260px]">
                          <div className="flex items-center gap-1.5 text-slate-300 truncate font-mono text-[11px]">
                            <Link2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">
                              https://pix.com/pay/{link.slug}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Copiar Pix Padrão Gov.br */}
                            <button
                              type="button"
                              onClick={() => handleCopyGovPayload(link)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer active:scale-95"
                              title="Copiar código Pix Copia e Cola oficial gov.br (Bacen)"
                            >
                              {copiedGovId === link.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Pix Copiado (Gov.br)</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Copiar Pix (Gov.br)</span>
                                </>
                              )}
                            </button>

                              {/* Copiar Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(link)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer active:scale-95 border border-slate-700"
                              title="Copiar link web de pagamento"
                            >
                              {copiedId === link.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Link Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* QR CODE */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          onClick={() => onViewLink(link)}
                          className="cursor-pointer group/qr transition-transform hover:scale-105"
                          title="Clique para expandir o QR Code"
                        >
                          <div className="p-1 bg-white rounded-lg border border-slate-700 shadow inline-block">
                            <PixQRCode value={link.payload} size={42} />
                          </div>
                        </button>
                      </td>

                      {/* VALOR */}
                      <td className="py-4 px-5">
                        <div>
                          <div className="font-bold text-white text-sm">
                            {link.amount !== null
                              ? `R$ ${link.amount.toFixed(2).replace('.', ',')}`
                              : 'R$ 0,00'}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${
                                link.isFixed
                                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                                  : 'bg-slate-800/80 text-blue-300 border-blue-500/30'
                              }`}
                            >
                              {link.isFixed ? 'Fixo' : 'Variável'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DATA */}
                      <td className="py-4 px-5 text-slate-400">
                        <div>{dateStr}</div>
                        <div className="text-[11px] text-slate-500">{timeStr}</div>
                      </td>

                      {/* AÇÕES (View, Edit, Delete) */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Quick Copy Pix Gov.br */}
                          <button
                            type="button"
                            onClick={() => handleCopyGovPayload(link)}
                            className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 transition-colors cursor-pointer border border-teal-500/30"
                            title="Copiar Código Pix Copia e Cola (Padrão Gov.br)"
                          >
                            {copiedGovId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* View QR Code & Link Details */}
                          <button
                            type="button"
                            onClick={() => onViewLink(link)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                            title="Visualizar QR Code e Detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Link */}
                          <button
                            type="button"
                            onClick={() => onEditLink(link)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                            title="Editar Link"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Link */}
                          <button
                            type="button"
                            onClick={() => setLinkToDelete(link)}
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer border border-slate-700/60 hover:border-red-500/30"
                            title="Excluir este item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-App Delete Modal for single item */}
      <ConfirmModal
        isOpen={!!linkToDelete}
        title="Excluir Link Pix?"
        message={`Tem certeza que deseja apagar o link para "${linkToDelete?.key}" (${linkToDelete?.amount ? `R$ ${linkToDelete.amount.toFixed(2)}` : 'Valor variável'})? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setLinkToDelete(null)}
        isDestructive={true}
      />

      {/* In-App Clear All Modal */}
      <ConfirmModal
        isOpen={isClearAllModalOpen}
        title="Limpar Todo o Painel?"
        message="Deseja remover todos os links Pix gerados e deixar seu painel completamente limpo?"
        confirmLabel="Sim, Limpar Painel"
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (onClearAllLinks) onClearAllLinks();
          setIsClearAllModalOpen(false);
        }}
        onCancel={() => setIsClearAllModalOpen(false)}
        isDestructive={true}
      />
    </>
  );
};
