import React, { useState, useEffect } from 'react';
import { Check, Copy, ArrowLeft, ShieldCheck, Clock, CheckCircle2, QrCode } from 'lucide-react';
import { PixPaymentLink } from '../types/pix';
import { PixLogo, PixIcon } from './PixLogo';
import { PixQRCode } from './PixQRCode';
import { GovPixBadge } from './GovBadge';

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
  const [status, setStatus] = useState<'pending' | 'checking' | 'paid'>(
    link.status === 'paid' ? 'paid' : 'pending'
  );
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

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
    <div className="min-h-screen bg-[#070B11] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,212,170,0.12),rgba(255,255,255,0))] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Navigation back if inside platform */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Plataforma</span>
          </button>
        )}

        {/* Card */}
        <div className="bg-[#0E1523]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Top Brand & Status */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <PixLogo size={28} />

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
          <div className="my-5 text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Valor a Pagar
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {link.amount !== null
                ? `R$ ${link.amount.toFixed(2).replace('.', ',')}`
                : 'Valor Aberto'}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Beneficiário: <strong className="text-slate-200">{link.recipientName}</strong>
              {link.recipientCity && ` · ${link.recipientCity}`}
            </div>

            {link.description && (
              <div className="text-xs text-teal-400/90 mt-1 bg-teal-500/10 inline-block px-3 py-0.5 rounded-full border border-teal-500/20">
                {link.description}
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            {status === 'paid' ? (
              <div className="w-[240px] h-[240px] rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-500/30">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-white">Pagamento Confirmado!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Obrigado! A transação foi processada com êxito.
                </p>
              </div>
            ) : (
              <PixQRCode
                value={link.payload}
                size={220}
                allowDownload={true}
                downloadFilename={`pix-pagamento-${link.slug}.png`}
              />
            )}
          </div>

          {/* Copy Chave & Copia e Cola */}
          {status !== 'paid' && (
            <div className="space-y-3 mb-6">
              {/* Chave Pix */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <PixIcon size={18} className="shrink-0" />
                  <span className="text-xs text-slate-300 font-mono truncate">
                    {link.key}
                  </span>
                  <GovPixBadge size="xs" />
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1 active:scale-95"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copiado' : 'Copiar Chave'}</span>
                </button>
              </div>

              {/* Copia e Cola Button */}
              <button
                type="button"
                onClick={handleCopyPayload}
                className="w-full bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-98"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-4 h-4 text-[#071311]" />
                    <span>Código Copiado para a Área de Transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#071311]" />
                    <span>Copiar Pix Copia e Cola (Padrão Oficial Gov.br)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* How to Pay Accordion / Help */}
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">Como pagar:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed text-[11px]">
              <li>Abra o aplicativo do seu banco ou carteira digital.</li>
              <li>Acesse a área <strong>Pix</strong> e selecione <strong>Pagar com QR Code</strong> ou <strong>Pix Copia e Cola</strong>.</li>
              <li>Cole o código copiado ou aponte a câmera para o QR Code acima.</li>
              <li>Confira o valor e confirme a transação.</li>
            </ol>
          </div>

          {/* Simulate Payment Confirmation */}
          {status !== 'paid' && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={status === 'checking'}
                className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>
                  {status === 'checking'
                    ? 'Verificando pagamento...'
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
