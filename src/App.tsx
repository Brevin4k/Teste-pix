import React, { useState, useEffect } from 'react';
import { UserProfile, PixKey, PixPaymentLink } from './types/pix';
import { INITIAL_USER, INITIAL_KEYS, INITIAL_LINKS, DEMO_KEYS, DEMO_LINKS } from './data/initialData';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { QuickActions } from './components/QuickActions';
import { PixTable } from './components/PixTable';
import { GenerateLinkModal } from './components/GenerateLinkModal';
import { GeneratedPixModal } from './components/GeneratedPixModal';
import { NewKeyModal } from './components/NewKeyModal';
import { QRCodeCreatorModal } from './components/QRCodeCreatorModal';
import { EditLinkModal } from './components/EditLinkModal';
import { MinhasChavesView } from './components/MinhasChavesView';
import { LinksGeradosView } from './components/LinksGeradosView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { PublicCheckoutView } from './components/PublicCheckoutView';
import { HomePixKeysSection } from './components/HomePixKeysSection';

const STORAGE_CLEAN_FLAG = 'pixpay_clean_v3';

export default function App() {
  // Check if current URL is a public checkout link (/pay/:slug or ?pay=slug)
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;

      if (path.startsWith('/pay/')) {
        const slug = path.replace('/pay/', '').split('/')[0];
        if (slug) setCheckoutSlug(slug);
      } else if (search.includes('pay=')) {
        const params = new URLSearchParams(search);
        const slug = params.get('pay');
        if (slug) setCheckoutSlug(slug);
      } else if (hash.startsWith('#pay/')) {
        const slug = hash.replace('#pay/', '').split('/')[0];
        if (slug) setCheckoutSlug(slug);
      } else {
        setCheckoutSlug(null);
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, []);

  // Persistent user state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('pix_user');
    return stored ? JSON.parse(stored) : INITIAL_USER;
  });

  // Ensure clean slate on first load if user requested "PAINEL LIMPO"
  // Persistent keys state (initializes with official Gov security keys if not set)
  const [keys, setKeys] = useState<PixKey[]>(() => {
    try {
      const stored = localStorage.getItem('pix_keys');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem('pix_keys', JSON.stringify(INITIAL_KEYS));
    return INITIAL_KEYS;
  });

  // Persistent links state
  const [links, setLinks] = useState<PixPaymentLink[]>(() => {
    try {
      const stored = localStorage.getItem('pix_links');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem('pix_links', JSON.stringify(INITIAL_LINKS));
    return INITIAL_LINKS;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isNewKeyModalOpen, setIsNewKeyModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [generatedPixModalData, setGeneratedPixModalData] = useState<PixPaymentLink | null>(null);
  const [editingLink, setEditingLink] = useState<PixPaymentLink | null>(null);
  const [generateInitialKey, setGenerateInitialKey] = useState<string>('');

  // Toast notifications for user feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('pix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pix_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pix_keys', JSON.stringify(keys));
  }, [keys]);

  useEffect(() => {
    localStorage.setItem('pix_links', JSON.stringify(links));
  }, [links]);

  // Handlers
  const handleLoginSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLinkCreated = (newLink: PixPaymentLink) => {
    setLinks((prev) => [newLink, ...prev]);
    showToast('Link Pix criado com sucesso!');
  };

  const handleKeyAdded = (newKey: PixKey) => {
    setKeys((prev) => {
      if (newKey.isDefault) {
        return [newKey, ...prev.map((k) => ({ ...k, isDefault: false }))];
      }
      return [newKey, ...prev];
    });
    showToast(`Chave ${newKey.type.toUpperCase()} cadastrada!`);
  };

  const handleSetDefaultKey = (keyId: string) => {
    setKeys((prev) =>
      prev.map((k) => ({
        ...k,
        isDefault: k.id === keyId,
      }))
    );
    showToast('Chave padrão atualizada!');
  };

  const handleRestoreGovKeys = () => {
    setKeys(INITIAL_KEYS);
    localStorage.setItem('pix_keys', JSON.stringify(INITIAL_KEYS));
    showToast('Chaves Pix do GOV restauradas com sucesso!');
  };

  const handleToggleGovSecurity = (keyId: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId ? { ...k, isGovSecurity: !k.isGovSecurity } : k
      )
    );
    showToast('Segurança Gov.br atualizada na chave!');
  };

  const handleDeleteKey = (keyId: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== keyId));
    showToast('Chave Pix excluída com sucesso.');
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
    if (generatedPixModalData?.id === linkId) {
      setGeneratedPixModalData(null);
    }
    showToast('Link Pix excluído com sucesso.');
  };

  const handleClearAllLinks = () => {
    setLinks([]);
    localStorage.setItem('pix_links', JSON.stringify([]));
    showToast('Painel de links limpo com sucesso.');
  };

  const handleClearAllData = () => {
    setKeys([]);
    setLinks([]);
    localStorage.setItem('pix_keys', JSON.stringify([]));
    localStorage.setItem('pix_links', JSON.stringify([]));
    showToast('Painel totalmente limpo (0 chaves e 0 links).');
  };

  const handleResetDemoData = () => {
    setUser(INITIAL_USER);
    setKeys(DEMO_KEYS);
    setLinks(DEMO_LINKS);
    localStorage.setItem('pix_user', JSON.stringify(INITIAL_USER));
    localStorage.setItem('pix_keys', JSON.stringify(DEMO_KEYS));
    localStorage.setItem('pix_links', JSON.stringify(DEMO_LINKS));
    showToast('Dados de exemplo carregados no painel.');
  };

  const handleEditLinkSave = (updated: PixPaymentLink) => {
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    showToast('Link atualizado com sucesso.');
  };

  const handleMarkAsPaid = (linkId: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, status: 'paid' as const } : l))
    );
    if (generatedPixModalData?.id === linkId) {
      setGeneratedPixModalData((prev) => (prev ? { ...prev, status: 'paid' } : null));
    }
    showToast('Pagamento marcado como recebido!');
  };

  // If user requested a direct checkout URL:
  if (checkoutSlug) {
    const checkoutLink = links.find((l) => l.slug === checkoutSlug) || {
      id: 'demo-checkout',
      slug: checkoutSlug,
      key: 'joao@email.com',
      keyType: 'email' as const,
      recipientName: 'USUARIO TESTE',
      recipientCity: 'SAO PAULO',
      amount: 50.0,
      isFixed: true,
      description: 'Pagamento Pix',
      txid: checkoutSlug.toUpperCase(),
      payload: '00020101021126580014br.gov.bcb.pix0114joao@email.com520400005303986540550.005802BR5913USUARIO TESTE6009SAO PAULO62100506AB12E463045E1A',
      createdAt: new Date().toISOString(),
      status: 'active' as const,
      views: 1,
    };

    return (
      <PublicCheckoutView
        link={checkoutLink}
        onBack={() => {
          window.history.pushState({}, '', '/');
          setCheckoutSlug(null);
        }}
        onPaymentSuccess={(id) => handleMarkAsPaid(id)}
      />
    );
  }

  // Not logged in -> Show Login Screen matching screenshot
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Logged in -> Render Platform Dashboard
  return (
    <div className="min-h-screen bg-[#070B11] text-slate-100 flex flex-col md:flex-row">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[150] bg-[#0E1523] border border-teal-500/40 text-teal-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <DashboardHeader
            user={user}
            totalKeys={keys.length}
            totalLinks={links.length}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenSettings={() => setActiveTab('configuracoes')}
            onLogout={handleLogout}
          />

          {/* Conditional View Rendering based on active tab */}
          {activeTab === 'inicio' && (
            <>
              {/* Quick Action Cards */}
              <QuickActions
                onNewKey={() => setIsNewKeyModalOpen(true)}
                onGenerateLink={() => {
                  setGenerateInitialKey('');
                  setIsGenerateModalOpen(true);
                }}
                onGenerateQrCode={() => {
                  setGenerateInitialKey('');
                  setIsQrCodeModalOpen(true);
                }}
              />

              {/* Minhas Chaves Pix & Pix de Segurança GOV.BR */}
              <HomePixKeysSection
                keys={keys}
                onAddNewKey={() => setIsNewKeyModalOpen(true)}
                onGenerateLinkFromKey={(k) => {
                  setGenerateInitialKey(k);
                  setIsGenerateModalOpen(true);
                }}
                onOpenQrCodeWithKey={(k) => {
                  setGenerateInitialKey(k);
                  setIsQrCodeModalOpen(true);
                }}
                onSetDefaultKey={handleSetDefaultKey}
                onRestoreGovKeys={handleRestoreGovKeys}
              />

              {/* Table section with in-app deletion and clean empty states */}
              <PixTable
                links={links}
                onViewLink={(link) => setGeneratedPixModalData(link)}
                onEditLink={(link) => setEditingLink(link)}
                onDeleteLink={handleDeleteLink}
                onClearAllLinks={handleClearAllLinks}
                onOpenGenerateModal={() => {
                  setGenerateInitialKey('');
                  setIsGenerateModalOpen(true);
                }}
              />
            </>
          )}

          {activeTab === 'chaves' && (
            <MinhasChavesView
              keys={keys}
              onAddNewKey={() => setIsNewKeyModalOpen(true)}
              onSetDefaultKey={handleSetDefaultKey}
              onDeleteKey={handleDeleteKey}
              onGenerateLinkFromKey={(k) => {
                setGenerateInitialKey(k);
                setIsGenerateModalOpen(true);
              }}
              onToggleGovSecurity={handleToggleGovSecurity}
            />
          )}

          {activeTab === 'links' && (
            <LinksGeradosView
              links={links}
              onOpenGenerateModal={() => {
                setGenerateInitialKey('');
                setIsGenerateModalOpen(true);
              }}
              onViewLink={(link) => setGeneratedPixModalData(link)}
              onDeleteLink={handleDeleteLink}
            />
          )}

          {activeTab === 'configuracoes' && (
            <ConfiguracoesView
              user={user}
              onUpdateUser={setUser}
              onResetDemoData={handleResetDemoData}
              onClearAllData={handleClearAllData}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {/* 1. Modal Gerador de Link do Pix */}
      <GenerateLinkModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        availableKeys={keys}
        initialKey={generateInitialKey}
        defaultBeneficiary={user.defaultName || 'USUARIO TESTE'}
        defaultCity={user.defaultCity || 'SAO PAULO'}
        onLinkCreated={handleLinkCreated}
        onViewGeneratedPix={(link) => {
          setIsGenerateModalOpen(false);
          setGeneratedPixModalData(link);
        }}
      />

      {/* 2. Modal Link do Pix Gerado! */}
      <GeneratedPixModal
        isOpen={!!generatedPixModalData}
        onClose={() => setGeneratedPixModalData(null)}
        pixLink={generatedPixModalData}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* 3. Modal Nova Chave Pix */}
      <NewKeyModal
        isOpen={isNewKeyModalOpen}
        onClose={() => setIsNewKeyModalOpen(false)}
        onKeyAdded={handleKeyAdded}
      />

      {/* 4. Modal Gerar QR Code */}
      <QRCodeCreatorModal
        isOpen={isQrCodeModalOpen}
        onClose={() => setIsQrCodeModalOpen(false)}
        availableKeys={keys}
        initialKey={generateInitialKey}
        defaultBeneficiary={user.defaultName || 'USUARIO TESTE'}
        defaultCity={user.defaultCity || 'SAO PAULO'}
        onSaveAsLink={handleLinkCreated}
      />

      {/* 5. Modal Editar Link */}
      <EditLinkModal
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        link={editingLink}
        onSave={handleEditLinkSave}
      />
    </div>
  );
}
