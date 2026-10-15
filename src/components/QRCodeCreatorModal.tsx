import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { PixKey, PixPaymentLink } from '../types/pix';
import { PixQRCode } from './PixQRCode';
import { generatePixPayload, detectPixKeyType } from '../utils/pixPayload';
import { GovPixBadge } from './GovBadge';

interface QRCodeCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableKeys: PixKey[];
  onSaveAsLink: (link: PixPaymentLink) => void;
  initialKey?: string;
  defaultBeneficiary?: string;
  defaultCity?: string;
}

export const QRCodeCreatorModal: React.FC<QRCodeCreatorModalProps> = ({
  isOpen,
  onClose,
  availableKeys,
  onSaveAsLink,
  initialKey = '',
  defaultBeneficiary = 'USUARIO TESTE',
  defaultCity = 'SAO PAULO',
}) => {
  const [pixKey, setPixKey] = useState(initialKey || availableKeys[0]?.key || '');
  const [amount, setAmount] = useState('25.00');
  const [hasFixedAmount, setHasFixedAmount] = useState(true);
  const [name, setName] = useState(defaultBeneficiary);
  const [city, setCity] = useState(defaultCity);
  const [txid, setTxid] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  React.useEffect(() => {
    if (initialKey) {
      setPixKey(initialKey);
    } else if (availableKeys.length > 0 && !pixKey) {
      setPixKey(availableKeys[0].key);
    }
  }, [initialKey, availableKeys]);

  if (!isOpen) return null;

  const numericAmount = hasFixedAmount ? parseFloat(amount.replace(',', '.')) || null : null;

  const detectedKeyType = detectPixKeyType(pixKey);

  const currentPayload = generatePixPayload({
    key: pixKey.trim() || 'chave@email.com',
    name: name.trim() || 'USUARIO',
    city: city.trim() || 'SAO PAULO',
    amount: numericAmount,
    txid: txid.trim() || '***',
    keyType: detectedKeyType,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleSaveAndClose = () => {
    const slug = Math.random().toString(36).substring(2, 8);
    const link: PixPaymentLink = {
      id: `link-${Date.now()}`,
      slug,
      key: pixKey.trim() || 'chave@email.com',
      keyType: detectPixKeyType(pixKey),
      recipientName: name.trim() || 'USUARIO',
      recipientCity: city.trim() || 'SAO PAULO',
      amount: numericAmount,
      isFixed: hasFixedAmount,
      txid: txid.trim() || '***',
      payload: currentPayload,
      createdAt: new Date().toISOString(),
      status: 'active',
      views: 0,
    };
    onSaveAsLink(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1523] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <QrCode className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Gerador de QR Code Pix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Crie QR Codes estáticos e dinâmicos para impressão ou cobrança na tela
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Chave Pix
                  </label>
                  <GovPixBadge size="xs" />
                </div>
              </div>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Informe sua chave Pix"
                className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none font-mono"
              />
              {availableKeys.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableKeys.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => setPixKey(k.key)}
                      className={`text-[10px] px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 ${
                        pixKey === k.key
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{k.label || k.key}</span>
                      {k.isGovSecurity !== false && (
                        <span className="text-[8px] px-1 bg-blue-500/30 text-blue-200 rounded font-bold">
                          GOV
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Valor
                </label>
                <button
                  type="button"
                  onClick={() => setHasFixedAmount(!hasFixedAmount)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  {hasFixedAmount ? 'Alterar para Aberto' : 'Alterar para Fixo'}
                </button>
              </div>
              <input
                type="number"
                step="0.01"
                disabled={!hasFixedAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full bg-[#0B0F17] border border-slate-700/70 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none ${
                  !hasFixedAmount ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Beneficiário
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-indigo-400 rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Cidade
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-indigo-400 rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Identificador (TxID opcional)
              </label>
              <input
                type="text"
                maxLength={25}
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Ex: PEDIDO123"
                className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-indigo-400 rounded-xl px-3 py-2 text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center bg-[#0B0F17] border border-slate-800 rounded-2xl p-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Pré-visualização em Tempo Real
            </div>

            <PixQRCode
              value={currentPayload}
              size={180}
              allowDownload={true}
              downloadFilename="pix-qrcode.png"
            />

            <div className="w-full mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pix Copiado (Padrão Gov.br)!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Pix (Padrão Gov.br / Bacen)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveAndClose}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <span>Salvar na Minha Lista</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
