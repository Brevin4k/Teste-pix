import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Share2,
  Lock,
  Building2,
  Sparkles,
} from 'lucide-react';
import { PixPaymentLink } from '../types/pix';
import { PixLogo, PixIcon } from './PixLogo';
import { PixQRCode } from './PixQRCode';
import { GovPixBadge } from './GovBadge';
import { createShareablePixUrl } from '../utils/linkSharing';

interface PublicCheckoutViewProps {
  link: PixPaymentLink;
  onBack?: () => void;
  onPaymentSuccess?: (linkId: string) => void;
}

export const PublicCheckoutView: React.FC<PublicCheckoutViewProps> = ({
  link,
  onBack,
  onPaymentSuccess,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [status, setStatus] = useState<'pending' | 'checking' | 'paid'>(
    link.status === 'paid' ? 'paid' : 'pending'
  );
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown

  useEffect(() => {
    if (status === 'paid') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const shareableUrl = createShareablePixUrl(link);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(link.key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(link.payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handleConfirmPayment = () => {
    setStatus('checking');
    setTimeout(() => {
      setStatus('paid');
      if (onPaymentSuccess) {
        onPaymentSuccess(link.id);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070B11] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,212,170,0.12),rgba(255,255,255,0))] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 py-10">
      <div className="w-full max-w-lg">
        {/* Navigation back if inside platform or preview */}
        {onBack && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-teal-400" />
              <span>Voltar ao Painel</span>
            </button>

            <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>Modo Visualização do Pagador</span>
            </span>
          </div>
        )}

        {/* Card */}
        <div className="bg-[#0E1523]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Top Brand & Status */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <PixLogo size={28} />
              <GovPixBadge size="xs" />
            </div>

            {status === 'paid' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pago com Sucesso!</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Expira em {timeFormatted}</span>
              </span>
            )}
          </div>

          {/* Amount and Beneficiary info */}
          <div className="my-6 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Valor a Pagar
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {link.amount !== null
                ? `R$ ${link.amount.toFixed(2).replace('.', ',')}`
                : 'Valor Aberto (Definido no Banco)'}
            </div>

            <div className="mt-2.5 text-xs text-slate-300 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-slate-400">Beneficiário:</span>
              <strong className="text-white font-semibold">{link.recipientName}</strong>
              {link.recipientCity && (
                <span className="text-slate-400">· {link.recipientCity}</span>
              )}
            </div>

            {link.description && (
              <div className="text-xs text-teal-300/90 mt-2 bg-teal-500/10 inline-block px-3.5 py-1 rounded-full border border-teal-500/20">
                {link.description}
              </div>
            )}
          </div>

          {/* QR Code Container */}
          <div className="flex justify-center mb-6">
            {status === 'paid' ? (
              <div className="w-[240px] h-[240px] rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-500/30">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-white">Pagamento Confirmado!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  A transação Pix foi recebida com sucesso.
                </p>
              </div>
            ) : (
              <div className="p-2 bg-white rounded-2xl border border-slate-700 shadow-xl">
                <PixQRCode
                  value={link.payload}
                  size={220}
                  allowDownload={true}
                  downloadFilename={`pix-pagamento-${link.slug}.png`}
                />
              </div>
            )}
          </div>

          {/* Copy Chave & Copia e Cola */}
          {status !== 'paid' && (
            <div className="space-y-3 mb-6">
              {/* Primary Copia e Cola Button */}
              <button
                type="button"
                onClick={handleCopyPayload}
                className="w-full bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-4 h-4 text-[#071311] stroke-[2.5]" />
                    <span>Código Pix Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#071311]" />
                    <span>Copiar Pix Copia e Cola (Padrão Gov.br)</span>
                  </>
                )}
              </button>

              {/* Chave Pix Row */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <PixIcon size={18} className="shrink-0" />
                  <span className="text-xs text-slate-300 font-mono truncate select-all">
                    {link.key}
                  </span>
                  <GovPixBadge size="xs" />
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1 active:scale-95 shadow-sm"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copiada' : 'Copiar Chave'}</span>
                </button>
              </div>

              {/* Shareable Link Row */}
              <div className="bg-[#0B0F17]/70 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-mono truncate flex-1 select-all">
                  {shareableUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1 border border-slate-700 active:scale-95"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px]">Copiar Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security & Official Verification */}
          <div className="mb-5 p-3 rounded-xl bg-[#1351B4]/10 border border-[#1351B4]/30 flex items-center gap-2.5 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="leading-tight">
              <span className="font-semibold text-white">Transação Segura:</span> Homologada no padrão EMVCo do Banco Central e autenticada com proteção Pix de Segurança Gov.br.
            </div>
          </div>

          {/* How to Pay Guide */}
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Como pagar no seu aplicativo bancário:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px] pl-1">
              <li>Abra o app do seu banco (Nubank, Inter, Itaú, Bradesco, Santander, BB, Caixa, Mercado Pago, etc.).</li>
              <li>Acesse a área <strong>Pix</strong> e selecione <strong>Pix Copia e Cola</strong> ou <strong>Ler QR Code</strong>.</li>
              <li>Cole o código copiado acima ou aponte a câmera para a imagem do QR Code.</li>
              <li>Confira o nome do beneficiário (<strong>{link.recipientName}</strong>) e finalize a transferência.</li>
            </ol>
          </div>

          {/* Simulate Payment Confirmation */}
          {status !== 'paid' && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={status === 'checking'}
                className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-800/50"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>
                  {status === 'checking'
                    ? 'Verificando no Banco Central...'
                    : 'Já realizou o Pix? Simular Confirmação'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
