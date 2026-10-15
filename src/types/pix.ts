export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';

export interface PixKey {
  id: string;
  key: string;
  type: PixKeyType;
  label?: string;
  isDefault?: boolean;
  isGovSecurity?: boolean; // Pix do GOV / Pix de Segurança oficial Gov.br
  govSecurityLevel?: 'ouro' | 'prata' | 'padrao'; // Nível de segurança Gov.br
  createdAt: string;
}

export interface PixPaymentLink {
  id: string;
  slug: string;
  key: string;
  keyType: PixKeyType;
  recipientName: string;
  recipientCity: string;
  amount: number | null;
  isFixed: boolean;
  description?: string;
  txid?: string;
  payload: string;
  createdAt: string;
  status: 'active' | 'paid' | 'expired';
  views: number;
  isGovSecurity?: boolean; // Vinculado a Pix do GOV
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  defaultCity: string;
  defaultName: string;
}
