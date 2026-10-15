import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types/pix';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [identifier, setIdentifier] = useState('gustavolangue@outlook.com');
  const [name, setName] = useState('Usuário Teste');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Por favor, informe seu usuário ou e-mail.');
      return;
    }

    if (!password) {
      setError('Por favor, informe sua senha.');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    // Success
    const loggedUser: UserProfile = {
      name: isRegister ? (name.trim() || 'Usuário') : (identifier.includes('@') ? identifier.split('@')[0] : identifier),
      email: identifier.includes('@') ? identifier : `${identifier}@email.com`,
      defaultCity: 'SAO PAULO',
      defaultName: isRegister ? name : 'USUARIO TESTE',
    };

    onLoginSuccess(loggedUser);
  };

  const handleQuickDemo = () => {
    onLoginSuccess({
      name: 'Usuário Teste',
      email: 'gustavolangue@outlook.com',
      defaultCity: 'SAO PAULO',
      defaultName: 'USUARIO TESTE',
    });
  };

  return (
    <div className="min-h-screen bg-[#070B11] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card matching screenshot */}
      <div className="w-full max-w-[480px] bg-[#0E1523]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Shield Icon with glowing blue lock */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            {/* Ambient glow behind shield */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <div className="relative flex items-center justify-center">
                <Shield className="w-12 h-12 text-blue-500 stroke-[1.75]" />
                <Lock className="w-5 h-5 text-blue-400 absolute fill-blue-500/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta!'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isRegister
              ? 'Preencha seus dados para começar a gerar Pix'
              : 'Faça login para acessar sua conta'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo ou fantasia"
                  className="w-full bg-[#0B0F17]/90 border border-slate-700/70 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* User/Email Input */}
          <div>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Usuário ou e-mail"
                className="w-full bg-[#0B0F17]/90 border border-slate-700/70 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-[#0B0F17]/90 border border-slate-700/70 focus:border-blue-500 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (Register mode) */}
          {isRegister && (
            <div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="w-full bg-[#0B0F17]/90 border border-slate-700/70 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Remember me & Forgot Password */}
          {/* Remember me & Forgot Password */}
          {!isRegister && (
            <div className="flex items-center justify-between text-xs pt-1 pb-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-blue-500/30 accent-blue-600"
                />
                <span>Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={() => setError('Para redefinir a senha ou testar rapidamente, utilize o botão "Acesso Rápido de Teste" abaixo.')}
                className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-[0.99]"
          >
            {isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Entrar</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-[#0E1523] px-3 text-xs text-slate-500 uppercase tracking-wider">
            ou
          </span>
        </div>

        {/* Toggle between Login and Register */}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="w-full bg-[#0B0F17]/60 hover:bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {isRegister ? (
            <>
              <User className="w-4 h-4 text-blue-400" />
              <span>Já possuo uma conta (Entrar)</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Criar uma conta</span>
            </>
          )}
        </button>

        {/* Fast Instant Demo Access Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Acesso Rápido de Teste (Usuário Demo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
