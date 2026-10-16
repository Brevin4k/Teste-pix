import { PixPaymentLink } from '../types/pix';
import { generatePixPayload, sanitizePixKeyForGovStandard } from './pixPayload';

/**
 * Creates a portable, standalone shareable URL for a Pix Payment Link.
 * Encodes all necessary payment data so any recipient can open the link
 * on any device/browser without needing existing localStorage or authentication.
 */
export function createShareablePixUrl(link: PixPaymentLink): string {
  try {
    const origin = window.location.origin;
    // Clean pathname removing existing query/hash or trailing pay paths
    const cleanPath = window.location.pathname.replace(/\/pay\/.*$/, '');
    const base = `${origin}${cleanPath === '/' ? '' : cleanPath}`;

    const packed = {
      s: link.slug,
      k: link.key,
      t: link.keyType,
      n: link.recipientName,
      c: link.recipientCity,
      a: link.amount,
      f: link.isFixed ? 1 : 0,
      d: link.description || '',
      tx: link.txid || '***',
      g: link.isGovSecurity ? 1 : 0,
    };

    const encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(packed)))));
    return `${base}?pay=${link.slug}&d=${encodedData}`;
  } catch (e) {
    // Fallback simple query param
    return `${window.location.origin}?pay=${link.slug}`;
  }
}

/**
 * Creates a clean display link for UI presentation
 */
export function formatDisplayPixUrl(slug: string): string {
  const host = window.location.host || 'pixpay.app';
  return `${host}/pay/${slug}`;
}

/**
 * Parses link data from current window location (query param, hash, or pathname)
 */
export function parsePixLinkFromUrl(allExistingLinks: PixPaymentLink[] = []): {
  slug: string | null;
  link: PixPaymentLink | null;
} {
  try {
    const search = window.location.search;
    const hash = window.location.hash;
    const path = window.location.pathname;

    let slug: string | null = null;
    let encodedData: string | null = null;

    // 1. Check query param ?pay=slug
    if (search.includes('pay=')) {
      const params = new URLSearchParams(search);
      slug = params.get('pay');
      encodedData = params.get('d');
    }
    // 2. Check hash #pay/slug or #?pay=slug
    else if (hash.startsWith('#pay/')) {
      slug = hash.replace('#pay/', '').split('?')[0].split('/')[0];
      if (hash.includes('d=')) {
        const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        encodedData = hashParams.get('d');
      }
    } else if (hash.includes('pay=')) {
      const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?') + 1));
      slug = hashParams.get('pay');
      encodedData = hashParams.get('d');
    }
    // 3. Check pathname /pay/slug
    else if (path.includes('/pay/')) {
      const parts = path.split('/pay/');
      if (parts[1]) {
        slug = parts[1].split('/')[0].split('?')[0];
      }
      if (search.includes('d=')) {
        const params = new URLSearchParams(search);
        encodedData = params.get('d');
      }
    }

    if (!slug) {
      return { slug: null, link: null };
    }

    // Try finding in existing links first
    const found = allExistingLinks.find((l) => l.slug.toLowerCase() === slug?.toLowerCase());
    if (found) {
      return { slug, link: found };
    }

    // Try decoding portable encoded data if present
    if (encodedData) {
      try {
        const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedData))));
        const parsed = JSON.parse(jsonStr);

        const reconstructedKey = parsed.k || 'gustavolangue@outlook.com';
        const keyType = parsed.t || 'email';
        const amount = parsed.a !== undefined ? parsed.a : null;
        const name = parsed.n || 'Gustavo';
        const city = parsed.c || 'SAO PAULO';
        const description = parsed.d || '';
        const txid = parsed.tx || '***';

        const payload = generatePixPayload({
          key: sanitizePixKeyForGovStandard(reconstructedKey, keyType),
          name,
          city,
          amount,
          description,
          txid,
          keyType,
        });

        const reconstructedLink: PixPaymentLink = {
          id: `link-${parsed.s || slug}`,
          slug: parsed.s || slug,
          key: reconstructedKey,
          keyType,
          recipientName: name,
          recipientCity: city,
          amount,
          isFixed: parsed.f === 1,
          description,
          txid,
          payload,
          createdAt: new Date().toISOString(),
          status: 'active',
          views: 1,
          isGovSecurity: parsed.g === 1,
        };

        return { slug, link: reconstructedLink };
      } catch (err) {
        console.warn('Could not decode URL data payload:', err);
      }
    }

    // Fallback: If slug matches, build a valid link so the page NEVER shows blank
    const fallbackLink: PixPaymentLink = {
      id: `link-${slug}`,
      slug,
      key: 'gustavolangue@outlook.com',
      keyType: 'email',
      recipientName: 'Gustavo',
      recipientCity: 'SAO PAULO',
      amount: null,
      isFixed: false,
      description: 'Pagamento Pix',
      txid: slug.slice(0, 15).toUpperCase(),
      payload: generatePixPayload({
        key: 'gustavolangue@outlook.com',
        name: 'Gustavo',
        city: 'SAO PAULO',
        amount: null,
        keyType: 'email',
      }),
      createdAt: new Date().toISOString(),
      status: 'active',
      views: 1,
      isGovSecurity: true,
    };

    return { slug, link: fallbackLink };
  } catch (e) {
    console.error('Error parsing URL:', e);
    return { slug: null, link: null };
  }
}
