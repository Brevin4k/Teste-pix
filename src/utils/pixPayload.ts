/**
 * Gerador de Payload e QR Code Pix no padrão EMVCo do Banco Central do Brasil (gov.br / BACEN).
 * Especificação: Manual de Padrões para Iniciação do Pix - Banco Central do Brasil
 */

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();
}

/**
 * Cálculo CRC-16/CCITT-FALSE (Polinômio 0x1021, Init 0xFFFF)
 * Padrão oficial do Banco Central do Brasil (gov.br)
 */
function calculateCRC16(str: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    crc ^= code << 8;

    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';

/**
 * Detecta o tipo da chave Pix informada
 */
export function detectPixKeyType(key: string): PixKeyType {
  const clean = key.trim().toLowerCase();
  const digitsOnly = clean.replace(/\D/g, '');

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return 'email';
  }
  if (digitsOnly.length === 14) {
    return 'cnpj';
  }
  if (clean.includes('@')) {
    return 'email';
  }
  if (clean.startsWith('+55') || clean.includes('(') || (digitsOnly.length === 10) || (digitsOnly.length === 11 && clean.includes('-') === false && clean.includes('.') === false && digitsOnly.startsWith('1') || digitsOnly.startsWith('2') || digitsOnly.startsWith('3') || digitsOnly.startsWith('4') || digitsOnly.startsWith('5') || digitsOnly.startsWith('6') || digitsOnly.startsWith('7') || digitsOnly.startsWith('8') || digitsOnly.startsWith('9'))) {
    // Se explicitamente formatado com parênteses ou +55
    if (clean.startsWith('+') || clean.includes('(')) {
      return 'telefone';
    }
  }
  if (digitsOnly.length === 11) {
    // CPF padrão 11 dígitos
    return 'cpf';
  }
  if (digitsOnly.length === 10 || digitsOnly.length === 11) {
    return 'telefone';
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean)) {
    return 'aleatoria';
  }
  return 'aleatoria';
}

/**
 * Sanitiza a chave Pix para o padrão oficial do Banco Central do Brasil (gov.br / Bacen):
 * - CPF: estritamente 11 dígitos numéricos (sem pontuação)
 * - CNPJ: estritamente 14 dígitos numéricos (sem pontuação)
 * - Telefone: formato internacional E.164 iniciado com +55 (ex: +5511999999999)
 * - E-mail: minúsculo sem espaços
 * - Aleatória (EVP): formato UUID padrão (36 caracteres minúsculo)
 */
export function sanitizePixKeyForGovStandard(key: string, explicitType?: PixKeyType): string {
  const clean = key.trim();
  const type = explicitType || detectPixKeyType(clean);

  if (type === 'cpf') {
    return clean.replace(/\D/g, '').slice(0, 11);
  }
  if (type === 'cnpj') {
    return clean.replace(/\D/g, '').slice(0, 14);
  }
  if (type === 'telefone') {
    const digits = clean.replace(/\D/g, '');
    if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
      return `+${digits}`;
    }
    if (digits.length === 10 || digits.length === 11) {
      return `+55${digits}`;
    }
    return clean.startsWith('+') ? clean : `+55${digits}`;
  }
  if (type === 'email') {
    return clean.toLowerCase().replace(/\s+/g, '');
  }
  if (type === 'aleatoria') {
    return clean.toLowerCase().replace(/\s+/g, '');
  }
  return clean;
}

export function formatPixKeyDisplay(key: string, type: PixKeyType): string {
  const digits = key.replace(/\D/g, '');

  if (type === 'cpf' && digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (type === 'cnpj' && digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  if (type === 'telefone' && (digits.length === 11 || digits.length === 10)) {
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return key;
}

export interface PixPayloadParams {
  key: string;
  name?: string;
  city?: string;
  amount?: number | null;
  description?: string;
  txid?: string;
  keyType?: PixKeyType;
}

/**
 * Gera o payload oficial Pix Copia e Cola no padrão BACEN / gov.br (EMVCo BR Code).
 * Este código é lido e reconhecido por todos os aplicativos bancários do Brasil.
 */
export function generatePixPayload({
  key,
  name = 'USUARIO TESTE',
  city = 'SAO PAULO',
  amount,
  description,
  txid = '***',
  keyType,
}: PixPayloadParams): string {
  // Sanitizar chave conforme o padrão exigido pelo Banco Central (gov.br)
  const cleanKey = sanitizePixKeyForGovStandard(key, keyType);

  // Sanitizar nome do beneficiário (max 25 chars, sem acentos, maiúsculo)
  const cleanName = removeAccents(name || 'USUARIO TESTE').slice(0, 25).toUpperCase() || 'USUARIO';

  // Sanitizar cidade (max 15 chars, sem acentos, maiúsculo)
  const cleanCity = removeAccents(city || 'SAO PAULO').slice(0, 15).toUpperCase() || 'SAO PAULO';

  // Sanitizar txid (max 25 chars alfanuméricos)
  const cleanTxid = (txid ? removeAccents(txid).replace(/[^a-zA-Z0-9]/g, '') : '***').slice(0, 25) || '***';

  // 00 - Payload Format Indicator (01)
  let payload = formatField('00', '01');

  // 01 - Point of Initiation Method: 11 (Static / reutilizável)
  payload += formatField('01', '11');

  // 26 - Merchant Account Information (Pix gov.br padrão)
  let mai = formatField('00', 'br.gov.bcb.pix');
  mai += formatField('01', cleanKey);
  if (description && description.trim()) {
    const cleanDesc = removeAccents(description).slice(0, 40);
    if (cleanDesc) {
      mai += formatField('02', cleanDesc);
    }
  }
  payload += formatField('26', mai);

  // 52 - Merchant Category Code
  payload += formatField('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  payload += formatField('53', '986');

  // 54 - Transaction Amount (se houver valor fixo)
  if (amount !== undefined && amount !== null && amount > 0) {
    payload += formatField('54', amount.toFixed(2));
  }

  // 58 - Country Code
  payload += formatField('58', 'BR');

  // 59 - Merchant Name
  payload += formatField('59', cleanName);

  // 60 - Merchant City
  payload += formatField('60', cleanCity);

  // 62 - Additional Data Field Template (txid)
  const additionalData = formatField('05', cleanTxid);
  payload += formatField('62', additionalData);

  // 63 - CRC16 (Calculado sobre toda a string incluindo '6304')
  payload += '6304';
  const crc = calculateCRC16(payload);

  return `${payload}${crc}`;
}
