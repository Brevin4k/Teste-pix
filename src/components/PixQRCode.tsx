import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download } from 'lucide-react';

interface PixQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  allowDownload?: boolean;
  downloadFilename?: string;
}

export const PixQRCode: React.FC<PixQRCodeProps> = ({
  value,
  size = 200,
  className = '',
  allowDownload = false,
  downloadFilename = 'pix-qrcode.png',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // Hi-DPI
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setDataUrl(url);
        setError(false);
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
        setError(true);
      });
  }, [value, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-white text-slate-400 text-xs rounded-xl"
      >
        Erro ao gerar QR
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className="bg-white p-3.5 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border border-white/10"
        style={{ width: size + 28, height: size + 28 }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Pix QR Code"
            style={{ width: size, height: size }}
            className="block select-none"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="animate-pulse bg-slate-100 rounded-lg"
          />
        )}
      </div>

      {allowDownload && dataUrl && (
        <button
          onClick={handleDownload}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          Baixar Imagem PNG
        </button>
      )}
    </div>
  );
};
