import React, { useState } from 'react';
import { User, MapPin, Check, RotateCcw, Trash2 } from 'lucide-react';
import { UserProfile } from '../types/pix';
import { ConfirmModal } from './ConfirmModal';

interface ConfiguracoesViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({
  user,
  onUpdateUser,
  onResetDemoData,
  onClearAllData,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [defaultCity, setDefaultCity] = useState(user.defaultCity || 'SAO PAULO');
  const [defaultName, setDefaultName] = useState(user.defaultName || 'USUARIO TESTE');
  const [saved, setSaved] = useState(false);

  const [confirmClearModal, setConfirmClearModal] = useState(false);
  const [confirmResetModal, setConfirmResetModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      defaultCity: defaultCity.trim().toUpperCase(),
      defaultName: defaultName.trim().toUpperCase(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Configurações da Conta
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ajuste os dados do titular e padrões para geração do QR Code Pix.
        </p>
      </div>

      <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nome do Usuário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Padrões para QR Code Pix (EMVCo)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Beneficiário Padrão (Max 25 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={defaultName}
                  onChange={(e) => setDefaultName(e.target.value)}
                  placeholder="Ex: USUARIO TESTE"
                  className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none uppercase"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Aparecerá nos dados de pagamento no app do banco
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Cidade do Recebedor (Max 15 caracteres)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={15}
                    value={defaultCity}
                    onChange={(e) => setDefaultCity(e.target.value)}
                    placeholder="Ex: SAO PAULO"
                    className="w-full bg-[#0B0F17] border border-slate-700/70 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none uppercase"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Exigido pelo Banco Central (sem acentos)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Configurações Salvas!</span>
                </>
              ) : (
                <span>Salvar Alterações</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gerenciamento de Dados */}
      <div className="bg-[#0E1523]/90 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Limpeza e Gerenciamento do Painel
          </h3>
          <p className="text-xs text-slate-400">
            Você pode limpar completamente o painel para começar do zero ou restaurar dados de teste.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Limpar Tudo */}
          <button
            type="button"
            onClick={() => setConfirmClearModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Deixar Painel Totalmente Limpo</span>
          </button>

          {/* Restaurar Exemplos */}
          <button
            type="button"
            onClick={() => setConfirmResetModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Restaurar Chaves de Exemplo</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmClearModal}
        title="Limpar Todo o Painel?"
        message="Esta ação irá remover todas as chaves cadastradas e todos os links gerados, deixando seu painel 100% limpo e vazio."
        confirmLabel="Sim, Limpar Tudo"
        cancelLabel="Cancelar"
        onConfirm={() => {
          onClearAllData();
          setConfirmClearModal(false);
        }}
        onCancel={() => setConfirmClearModal(false)}
        isDestructive={true}
      />

      <ConfirmModal
        isOpen={confirmResetModal}
        title="Restaurar Dados de Exemplo?"
        message="Deseja recarregar as chaves e links de demonstração no seu painel?"
        confirmLabel="Restaurar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          onResetDemoData();
          setConfirmResetModal(false);
        }}
        onCancel={() => setConfirmResetModal(false)}
        isDestructive={false}
      />
    </div>
  );
};
