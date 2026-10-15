import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, X, QrCode, ArrowUpRight, DollarSign, User, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { PixIcon } from './PixLogo';
import { PixKey, PixPaymentLink } from '../types/pix';
import { detectPixKeyType, generatePixPayload, sanitizePixKeyForGovStandard } from '../utils/pixPayload';
import { GovPixBadge } from './GovBadge';

interface GenerateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableKeys: PixKey[];
  onLinkCreated: (link: PixPaymentLink) => void;
  onViewGeneratedPix: (link: PixPaymentLink) => void;
  initialKey?: string;
  defaultBeneficiary?: string;
  defaultCity?: string;
}

export const GenerateLinkModal: React.FC<GenerateLinkModalProps> = ({
  isOpen,
  onClose,
  availableKeys,
  onLinkCreated,
  onViewGeneratedPix,
  initialKey = '',
  defaultBeneficiary = 'USUARIO TESTE',
  defaultCity = 'SAO PAULO',
}) => {
  const [pixKey, setPixKey] = useState(initialKey);
  const [isFixed, setIsFixed] = useState(true);
  const [amountInput, setAmountInput] = useState('50.00');
  const [recipientName, setRecipientName] = useState(defaultBeneficiary);
  const [recipientCity, setRecipientCity] = useState(defaultCity);
  const [description, setDescription] = useState('Pagamento Pix');
  const [txid, setTxid] = useState('');
  const [generatedLink, setGeneratedLink] = useState<PixPaymentLink | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialKey) {
      setPixKey(initialKey);
    } else if (availableKeys.length > 0 && !pixKey) {
      const defaultKey = availableKeys.find((k) => k.isDefault) || availableKeys[0];
      setPixKey(defaultKey.key);
    }
  }, [initialKey, availableKeys]);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pixKey.trim()) {
      setError('Por favor, informe uma chave Pix válida.');
      return;
    }

    const numericAmount = isFixed ? parseFloat(amountInput.replace(',', '.')) : null;
    if (isFixed && (isNaN(numericAmount!) || numericAmount! <= 0)) {
      setError('Por favor, informe um valor maior que R$ 0,00.');
      return;
    }

    const keyType = detectPixKeyType(pixKey);
    const finalTxid = txid.trim() ? txid.trim().replace(/[^a-zA-Z0-9]/g, '') : '***';

    // Generate valid EMVCo BR Code payload compliant with BACEN / gov.br standard
    const payload = generatePixPayload({
      key: pixKey.trim(),
      name: recipientName.trim() || 'RECEBEDOR',
      city: recipientCity.trim() || 'SAO PAULO',
      amount: numericAmount,
      description: description.trim() || undefined,
      txid: finalTxid,
      keyType,
    });

    const slug = Math.random().toString(36).substring(2, 8);
    const newLink: PixPaymentLink = {
      id: `link-${Date.now()}`,
      slug,
      key: pixKey.trim(),
      keyType,
      recipientName: recipientName.trim() || 'USUARIO',
      recipientCity: recipientCity.trim() || 'SAO PAULO',
      amount: numericAmount,
      isFixed,
      description: description.trim() || undefined,
      txid: finalTxid,
      payload,
      createdAt: new Date().toISOString(),
      status: 'active',
      views: 0,
    };

    setGeneratedLink(newLink);
    onLinkCreated(newLink);
  };

  const getFullShareableUrl = (slug: string) => {
    const origin = window.location.origin;
    return `${origin}/pay/${slug}`;
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    const url = getFullShareableUrl(generatedLink.slug);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyGovPayload = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink.payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[620px] bg-[#0E1523] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header matching screenshot */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <PixIcon size={44} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Gerador de Link do Pix
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md">
            Digite a chave Pix e gere um link ou código padrão gov.br para receber pagamentos.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Chave Pix input */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-300">
                  Chave Pix
                </label>
                <GovPixBadge size="xs" />
              </div>
              {availableKeys.length > 0 && (
                <div className="text-[11px] text-teal-400">
                  {availableKeys.length} chave(s) salva(s)
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Digite sua chave Pix (CPF, CNPJ, e-mail, telefone ou aleatória)"
                className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-teal-400 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-400/20 font-mono"
              />
            </div>

            {/* Quick selector of saved keys */}
            {availableKeys.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[11px] text-slate-500 mr-1">Ou selecione:</span>
                {availableKeys.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setPixKey(k.key)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      pixKey === k.key
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    <span>{k.label || k.key}</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-black/40 rounded font-semibold text-teal-300">
                      {k.type}
                    </span>
                    {k.isGovSecurity !== false && (
                      <span className="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-300 rounded font-bold">
                        GOV
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tipo de Valor
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0B0F17] border border-slate-700/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsFixed(true)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isFixed
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Valor Fixo
                </button>
                <button
                  type="button"
                  onClick={() => setIsFixed(false)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    !isFixed
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Variável (Aberto)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Valor {isFixed ? '(R$)' : '(Opcional)'}
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  disabled={!isFixed}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0,00"
                  className={`w-full bg-[#0B0F17] border border-slate-700/70 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-teal-400/20 ${
                    !isFixed ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Details (Beneficiary, City, Description) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nome do Beneficiário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={25}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={15}
                  value={recipientCity}
                  onChange={(e) => setRecipientCity(e.target.value)}
                  placeholder="Ex: SAO PAULO"
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Descrição / Mensagem (Opcional)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={40}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Pagamento referente a serviço"
                className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-teal-400 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Gerar Link do Pix Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#00D4AA] hover:bg-[#00BF98] text-[#071311] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer active:scale-[0.99]"
          >
            <Link2 className="w-5 h-5 text-[#071311]" />
            <span>Gerar Link do Pix (Padrão Gov.br)</span>
          </button>
        </form>

        {/* Link Gerado Output Section matching screenshot */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Link Gerado
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-teal-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Padrão Gov.br / Bacen</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0E1523] border border-slate-700/70 rounded-xl p-1.5 pl-3.5">
              <span className="text-xs text-slate-400 truncate flex-1 font-mono">
                {generatedLink
                  ? getFullShareableUrl(generatedLink.slug)
                  : 'O link do Pix aparecerá aqui...'}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!generatedLink}
                className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                  generatedLink
                    ? copiedLink
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
                title={copiedLink ? 'Link Copiado!' : 'Copiar Link'}
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Actions once generated */}
            {generatedLink && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                {/* Copiar Pix Gov.br */}
                <button
                  type="button"
                  onClick={handleCopyGovPayload}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  {copiedPayload ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pix Copiado (Gov.br)!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-teal-400" />
                      <span>Copiar Pix (Padrão Gov.br)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onViewGeneratedPix(generatedLink)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ver QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.open(`/pay/${generatedLink.slug}`, '_blank');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
