import React, { useState } from 'react';
import { X, Check, Edit2 } from 'lucide-react';
import { PixPaymentLink } from '../types/pix';
import { generatePixPayload } from '../utils/pixPayload';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: PixPaymentLink | null;
  onSave: (updatedLink: PixPaymentLink) => void;
}

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  onClose,
  link,
  onSave,
}) => {
  if (!isOpen || !link) return null;

  const [amount, setAmount] = useState<string>(
    link.amount !== null ? link.amount.toString() : ''
  );
  const [isFixed, setIsFixed] = useState(link.isFixed);
  const [recipientName, setRecipientName] = useState(link.recipientName);
  const [recipientCity, setRecipientCity] = useState(link.recipientCity);
  const [description, setDescription] = useState(link.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = isFixed ? parseFloat(amount.replace(',', '.')) || null : null;

    const newPayload = generatePixPayload({
      key: link.key,
      name: recipientName,
      city: recipientCity,
      amount: numericAmount,
      description: description || undefined,
      txid: link.txid || '***',
      keyType: link.keyType,
    });

    const updated: PixPaymentLink = {
      ...link,
      amount: numericAmount,
      isFixed,
      recipientName,
      recipientCity,
      description,
      payload: newPayload,
    };

    onSave(updated);
    onClose();
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
            <Edit2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Editar Link Pix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chave: <span className="font-mono text-slate-200">{link.key}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tipo
              </label>
              <select
                value={isFixed ? 'fixed' : 'variable'}
                onChange={(e) => setIsFixed(e.target.value === 'fixed')}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
              >
                <option value="fixed">Valor Fixo</option>
                <option value="variable">Valor Variável</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                disabled={!isFixed}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none ${
                  !isFixed ? 'opacity-40' : ''
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Beneficiário
              </label>
              <input
                type="text"
                maxLength={25}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                maxLength={15}
                value={recipientCity}
                onChange={(e) => setRecipientCity(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Descrição
            </label>
            <input
              type="text"
              maxLength={40}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
