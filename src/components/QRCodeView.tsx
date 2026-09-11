import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({ value, size = 180, className = '' }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-white rounded-xl flex items-center justify-center animate-pulse ${className}`}
      >
        <span className="text-xs text-slate-400">Генерация QR...</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`p-2 bg-white rounded-xl shadow-lg flex items-center justify-center ${className}`}
    >
      <img
        src={dataUrl}
        alt="QR Code"
        width={size - 16}
        height={size - 16}
        className="rounded"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
