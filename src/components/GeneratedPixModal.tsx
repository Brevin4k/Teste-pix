import React, { useState } from 'react';
import { Check, Copy, Info, X, Share2, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { PixIcon } from './PixLogo';
import { PixQRCode } from './PixQRCode';
import { PixPaymentLink } from '../types/pix';
import { GovPixBadge } from './GovBadge';

interface GeneratedPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixLink: PixPaymentLink | null;
  onMarkAsPaid?: (linkId: string) => void;
}

export const GeneratedPixModal: React.FC<GeneratedPixModalProps> = ({
  isOpen,
  onClose,
  pixLink,
  onMarkAsPaid,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  // Default to official gov.br payload format as requested by user
  const [activeTab, setActiveTab] = useState<'payload' | 'chave'>('payload');
  const [simulatedPaid, setSimulatedPaid] = useState(false);

  if (!isOpen || !pixLink) return null;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixLink.payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pixLink.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/pay/${pixLink.slug}`;
    if (navigator.share) {
      navigator.share({
        title: 'Pagamento Pix',
        text: `Pague via Pix: ${pixLink.amount ? `R$ ${pixLink.amount.toFixed(2)}` : 'Valor aberto'}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShareUrl(true);
      setTimeout(() => setCopiedShareUrl(false), 2000);
    }
  };

  const handleSimulatePayment = () => {
    setSimulatedPaid(true);
    if (onMarkAsPaid) {
      onMarkAsPaid(pixLink.id);
    }
  };

  const isPaid = pixLink.status === 'paid' || simulatedPaid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[560px] bg-[#0E1523] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Green Check Badge matching screenshot */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Check className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Link do Pix Gerado!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm">
            Escaneie o QR Code ou copie o código Pix no padrão oficial gov.br para pagar.
          </p>

          {/* Amount Badge */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs text-slate-300">
            <span>Valor:</span>
            <span className="font-bold text-white">
              {pixLink.amount !== null
                ? `R$ ${pixLink.amount.toFixed(2).replace('.', ',')}`
                : 'Valor Variável'}
            </span>
            {pixLink.isFixed ? (
              <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                Fixo
              </span>
            ) : (
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                Variável
              </span>
            )}
          </div>
        </div>

        {/* QR Code Container matching screenshot */}
        <div className="flex justify-center mb-5">
          <PixQRCode
            value={pixLink.payload}
            size={220}
            allowDownload={true}
            downloadFilename={`pix-${pixLink.slug}.png`}
          />
        </div>

        {/* Official Bacen / gov.br standard badge */}
        <div className="mb-3 flex items-center justify-center gap-1.5 text-[11px] text-teal-400 bg-teal-500/10 border border-teal-500/20 py-1.5 px-3 rounded-xl text-center">
          <ShieldCheck className="w-4 h-4 shrink-0 text-teal-400" />
          <span>Padrão Oficial Banco Central (gov.br / Bacen EMVCo)</span>
        </div>

        {/* Copy Box Section matching screenshot */}
        <div className="bg-[#0B0F17] border border-slate-800/80 rounded-2xl p-4 mb-5">
          {/* Tabs: Padrão Gov.br (Copia e Cola) vs Chave Pix */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PixIcon size={20} />
              <span className="text-xs font-bold text-white">
                {activeTab === 'payload' ? 'Pix Copia e Cola (Padrão Gov.br)' : 'Chave Pix'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#0E1523] p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('payload')}
                className={`px-2.5 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                  activeTab === 'payload'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Padrão Gov.br
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chave')}
                className={`px-2.5 py-1 text-[11px] rounded transition-colors cursor-pointer ${
                  activeTab === 'chave'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chave Simples
              </button>
            </div>
          </div>

          {/* Input field with blue "Copiar" button */}
          {activeTab === 'payload' ? (
            <div className="flex items-center gap-2 bg-[#0E1523] border border-slate-700/70 rounded-xl p-1.5 pl-3.5">
              <span className="text-xs text-slate-200 truncate flex-1 font-mono select-all">
                {pixLink.payload}
              </span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 shrink-0"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copiado (Gov.br)</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Pix</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 bg-[#0E1523] border border-slate-700/70 rounded-xl p-1.5 pl-3.5 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs text-white truncate font-mono select-all">
                    {pixLink.key}
                  </span>
                  <GovPixBadge size="xs" />
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 shrink-0"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-blue-300/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Chave vinculada com proteção antifraude do Pix de Segurança Gov.br.</span>
              </p>
            </div>
          )}

          {activeTab === 'payload' && (
            <p className="text-[10px] text-slate-400 mt-2">
              Código EMVCo BR Code formatado conforme o Manual de Padrões do Pix (Bacen).
            </p>
          )}
        </div>

        {/* Info notice matching screenshot */}
        <div className="flex items-start justify-center gap-2 text-center text-xs text-slate-400 mb-6 px-4">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 leading-relaxed text-xs">
            Após copiar o código Pix (formato oficial gov.br), cole na opção "Pix Copia e Cola" do seu aplicativo bancário para efetuar o pagamento.
          </p>
        </div>

        {/* Status / Simulation footer */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{copiedShareUrl ? 'Link Copiado!' : 'Compartilhar Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isPaid}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              isPaid
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40'
            }`}
          >
            {isPaid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pagamento Confirmado!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simular Pagamento Pago</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
