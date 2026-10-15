import { PixKey, PixPaymentLink, UserProfile } from '../types/pix';
import { generatePixPayload } from '../utils/pixPayload';

export const INITIAL_USER: UserProfile = {
  name: 'Gustavo',
  email: 'gustavolangue@outlook.com',
  defaultCity: 'SAO PAULO',
  defaultName: 'GUSTAVO LANGUE',
};

// Chaves Pix padrão com integração Pix do GOV (Pix de Segurança oficial Gov.br)
export const INITIAL_KEYS: PixKey[] = [
  {
    id: 'key-gov-email',
    key: 'gustavolangue@outlook.com',
    type: 'email',
    label: 'Pix do GOV (Pix de Segurança Principal)',
    isDefault: true,
    isGovSecurity: true,
    govSecurityLevel: 'ouro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'key-gov-cpf',
    key: '123.456.789-00',
    type: 'cpf',
    label: 'CPF Gov.br - Registrato Bacen',
    isDefault: false,
    isGovSecurity: true,
    govSecurityLevel: 'ouro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'key-gov-phone',
    key: '(11) 98765-4321',
    type: 'telefone',
    label: 'Celular Comercial - Pix de Segurança',
    isDefault: false,
    isGovSecurity: true,
    govSecurityLevel: 'prata',
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_KEYS: PixKey[] = [
  ...INITIAL_KEYS,
  {
    id: 'key-demo-aleatoria',
    key: '8e12d4a9-98fc-4c91-9e8a-21eef090ba23',
    type: 'aleatoria',
    label: 'Chave EVP de Segurança',
    isDefault: false,
    isGovSecurity: true,
    govSecurityLevel: 'ouro',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_LINKS: PixPaymentLink[] = [
  {
    id: 'link-1',
    slug: 'gov100',
    key: 'gustavolangue@outlook.com',
    keyType: 'email',
    recipientName: 'GUSTAVO LANGUE',
    recipientCity: 'SAO PAULO',
    amount: 50.0,
    isFixed: true,
    description: 'Pagamento Pix do GOV',
    txid: 'GOV100',
    payload: generatePixPayload({
      key: 'gustavolangue@outlook.com',
      name: 'GUSTAVO LANGUE',
      city: 'SAO PAULO',
      amount: 50.0,
      description: 'Pagamento Pix do GOV',
      txid: 'GOV100',
    }),
    createdAt: new Date().toISOString(),
    status: 'active',
    views: 12,
    isGovSecurity: true,
  },
];

export const DEMO_LINKS: PixPaymentLink[] = [
  ...INITIAL_LINKS,
  {
    id: 'link-2',
    slug: 'xy98q1',
    key: '11987654321',
    keyType: 'telefone',
    recipientName: 'GUSTAVO LANGUE',
    recipientCity: 'SAO PAULO',
    amount: 25.0,
    isFixed: false,
    description: 'Contribuição Pix de Segurança',
    txid: 'XY98Q1',
    payload: generatePixPayload({
      key: '11987654321',
      name: 'GUSTAVO LANGUE',
      city: 'SAO PAULO',
      amount: 25.0,
      description: 'Pix de Seguranca',
      txid: 'XY98Q1',
    }),
    createdAt: new Date().toISOString(),
    status: 'active',
    views: 4,
    isGovSecurity: true,
  },
];
