import React, { useState } from 'react';
import { X, KeyRound, Check } from 'lucide-react';
import { PixKey, PixKeyType } from '../types/pix';
import { detectPixKeyType, sanitizePixKeyForGovStandard } from '../utils/pixPayload';

interface NewKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyAdded: (newKey: PixKey) => void;
}

export const NewKeyModal: React.FC<NewKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyAdded,
}) => {
  const [selectedType, setSelectedType] = useState<PixKeyType>('cpf');
  const [keyValue, setKeyValue] = useState('');
  const [label, setLabel] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isGovSecurity, setIsGovSecurity] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateRandomKey = () => {
    // Generate UUID v4
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setSelectedType('aleatoria');
    setKeyValue(uuid);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!keyValue.trim()) {
      setError('Por favor, informe a chave Pix.');
      return;
    }

    const detected = detectPixKeyType(keyValue);
    const finalType = selectedType || detected;
    const sanitizedKey = sanitizePixKeyForGovStandard(keyValue, finalType);

    const newKey: PixKey = {
      id: `key-${Date.now()}`,
      key: sanitizedKey,
      type: finalType,
      label: label.trim() || undefined,
      isDefault,
      isGovSecurity,
      govSecurityLevel: 'ouro',
      createdAt: new Date().toISOString(),
    };

    onKeyAdded(newKey);
    onClose();
    setKeyValue('');
    setLabel('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0E1523] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Nova Chave Pix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cadastre sua chave para receber pagamentos rápidos
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Key Type Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Tipo de Chave
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-[#0B0F17] border border-slate-700/70 rounded-xl text-center">
              {[
                { id: 'cpf', label: 'CPF' },
                { id: 'cnpj', label: 'CNPJ' },
                { id: 'email', label: 'E-mail' },
                { id: 'telefone', label: 'Telefone' },
                { id: 'aleatoria', label: 'Aleatória' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id as PixKeyType)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedType === t.id
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Value Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Valor da Chave
              </label>
              {selectedType === 'aleatoria' && (
                <button
                  type="button"
                  onClick={handleGenerateRandomKey}
                  className="text-[11px] text-teal-400 hover:text-teal-300 cursor-pointer"
                >
                  + Gerar Chave Aleatória
                </button>
              )}
            </div>
            <input
              type="text"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              placeholder={
                selectedType === 'cpf'
                  ? '000.000.000-00'
                  : selectedType === 'cnpj'
                  ? '00.000.000/0000-00'
                  : selectedType === 'email'
                  ? 'seu-email@dominio.com'
                  : selectedType === 'telefone'
                  ? '(11) 99999-9999'
                  : 'Chave EVP aleatória'
              }
              className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Label / Apelido */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Apelido ou Identificação (Opcional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Conta Nubank, Loja Principal, etc."
              className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Pix do GOV / Pix de Segurança option */}
          <div className="p-3 rounded-xl bg-[#1351B4]/15 border border-[#1351B4]/40 flex items-start gap-3">
            <input
              type="checkbox"
              id="govSecurityCheck"
              checked={isGovSecurity}
              onChange={(e) => setIsGovSecurity(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500/30 accent-blue-600 mt-0.5 cursor-pointer"
            />
            <label htmlFor="govSecurityCheck" className="text-xs cursor-pointer">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white">Pix do GOV (Pix de Segurança)</span>
                <span className="text-[9px] px-1 py-0.2 bg-blue-500/30 text-blue-200 rounded font-mono font-bold">gov.br</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Vincular esta chave à proteção do DICT / Banco Central e Gov.br (Segurança contra fraudes).
              </p>
            </label>
          </div>

          {/* Set as default key */}
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500/30 accent-blue-600"
            />
            <span>Definir como chave padrão para novos links</span>
          </label>

          {/* Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Chave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
