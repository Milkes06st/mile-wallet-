import React from 'react';
import { CryptoId } from '../types';

interface CryptoIconProps {
  id: CryptoId | string;
  size?: number;
  className?: string;
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({ id, size = 24, className = '' }) => {
  const normId = id.toUpperCase();

  switch (normId) {
    case 'TON':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
          <path d="M37.56 15.62H18.44C14.93 15.62 12.72 19.42 14.47 22.45L26.31 42.95C27.12 44.35 28.98 44.35 29.79 42.95L41.63 22.45C43.28 19.42 41.07 15.62 37.56 15.62ZM26.33 36.8L23.73 31.8L17.53 20.7C17.13 20 17.63 19.1 18.53 19.1H26.33V36.8ZM38.47 20.7L32.27 31.8L29.67 36.8V19.1H37.47C38.37 19.1 38.87 20 38.47 20.7Z" fill="white"/>
        </svg>
      );

    case 'USDT':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="100" cy="100" r="100" fill="#26A17B"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M106.857 91.5644C131.706 90.7203 150.323 85.5925 150.323 79.4312C150.323 73.084 130.686 67.8105 104.57 67.0945V51H147.247V31H52.7529V51H93.364V67.0945C67.2483 67.8105 47.6111 73.084 47.6111 79.4312C47.6111 85.5925 66.2285 90.7203 91.0772 91.5644V169H106.857V91.5644ZM104.57 78.4311C128.847 77.671 140.686 74.0766 140.686 70.0774C140.686 66.0781 128.847 62.4837 104.57 61.7236V78.4311ZM93.364 61.7236C69.087 62.4837 57.2483 66.0781 57.2483 70.0774C57.2483 74.0766 69.087 77.671 93.364 78.4311V61.7236Z" fill="white"/>
        </svg>
      );
    case 'BTC':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M34.2 20.7C33.7 17.3 31.4 15.6 27.8 15V12H24.8V14.9C24 14.7 23.2 14.5 22.4 14.3V12H19.4V14.9H13.5V18.1H16.2C17.2 18.1 17.7 18.7 17.7 19.4V28.7C17.7 29.3 17.2 29.8 16.2 29.8H13.5V33H19.4V36H22.4V33.1C23.2 33.3 24 33.5 24.8 33.7V36H27.8V33C32.3 32.5 35 30.3 34.6 26.4C34.3 23.5 32.6 22 30.1 21.4C32.3 21 34.4 19.7 34.2 20.7ZM22.4 18.2C23.6 18.2 27.5 17.6 27.5 20.6C27.5 23.5 23.6 22.9 22.4 22.9V18.2ZM22.4 29.8V25C23.8 25 28.6 24.3 28.6 27.4C28.6 30.5 23.8 29.8 22.4 29.8Z"
            fill="#F7931A"
          />
        </svg>
      );

    case 'ETH':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M24 6L12 25.6L24 32.5L36 25.6L24 6Z" fill="#627EEA" fillOpacity="0.75" />
          <path d="M24 6L24 32.5L36 25.6L24 6Z" fill="#889DF7" />
          <path d="M24 34.5L12 27.5L24 43.5L36 27.5L24 34.5Z" fill="#627EEA" fillOpacity="0.75" />
          <path d="M24 34.5L24 43.5L36 27.5L24 34.5Z" fill="#889DF7" />
        </svg>
      );

    case 'DFC':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M13 11H25C31.5 11 36 15.5 36 22C36 26.5 33.5 30 29.5 31.5L36 39H29.5L24.5 32H19.5V39H13V11ZM19.5 26.5H25C28 26.5 30 24.8 30 22C30 19.2 28 17.5 25 17.5H19.5V26.5Z"
            fill="#38BDF8"
          />
          <circle cx="36" cy="12" r="3.5" fill="#38BDF8" />
        </svg>
      );

    case 'NOT':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path d="M24 7L39 37H30L24 24L18 37H9L24 7Z" fill="#FFFFFF" />
        </svg>
      );

    case 'DOGS':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M13 14C10.5 14 8.5 16.5 8.5 20.5C8.5 24.5 11 27 12.5 27C12.5 31 15.5 36 24 36C32.5 36 35.5 31 35.5 27C37 27 39.5 24.5 39.5 20.5C39.5 16.5 37.5 14 35 14C32 14 29 18 24 18C19 18 16 14 13 14Z"
            fill="#FFFFFF"
          />
          <circle cx="18" cy="24" r="2.5" fill="#0A0D14" />
          <circle cx="30" cy="24" r="2.5" fill="#0A0D14" />
          <ellipse cx="24" cy="28.5" rx="3" ry="2" fill="#0A0D14" />
          <path d="M21 31.5C22.5 33 25.5 33 27 31.5" stroke="#0A0D14" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'SOL':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M10 16.5H35.5L39 12H13.5L10 16.5ZM13.5 26H39L35.5 30.5H10L13.5 26ZM10 40H35.5L39 35.5H13.5L10 40Z"
            fill="url(#solana-clean-grad)"
          />
          <defs>
            <linearGradient id="solana-clean-grad" x1="10" y1="12" x2="39" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00FFA3" />
              <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'TRX':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M9 11L40 17.5L29 41L9 11ZM13 15L26.5 36.5L35 20L13 15Z"
            fill="#EF0027"
          />
        </svg>
      );

    case 'BNB':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <path
            d="M24 8L31 15L24 22L17 15L24 8ZM36.5 20.5L43.5 27.5L36.5 34.5L29.5 27.5L36.5 20.5ZM11.5 20.5L18.5 27.5L11.5 34.5L4.5 27.5L11.5 20.5ZM24 33L31 40L24 47L17 40L24 33ZM24 24.5L29 29.5L24 34.5L19 29.5L24 24.5Z"
            fill="#F3BA2F"
          />
        </svg>
      );

    default:
      return (
        <span
          style={{ fontSize: size * 0.4 }}
          className={`font-black tracking-tight text-sky-400 select-none ${className}`}
        >
          {normId.slice(0, 4)}
        </span>
      );
  }
};

export const ReceiptBadgeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M14 8H8" />
      <path d="M16 12H8" />
      <path d="M13 16H8" />
    </svg>
  );
};

export const TelegramVerifiedBadge: React.FC<{ size?: number }> = ({ size = 18 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#f59e0b"
      className="inline-block flex-shrink-0"
    >
      <path d="M12 2L14.7 4.7L18.5 4.6L19.7 8.2L23 10.1L22.5 13.9L24 17.5L20.6 19.3L19.5 23.1L15.7 23.1L13.1 26L10.3 23.3L6.5 23.4L5.3 19.8L2 17.9L2.5 14.1L1 10.5L4.4 8.7L5.5 4.9L9.3 4.9L12 2Z" />
      <path
        d="M9.5 13.5L11.5 15.5L16.5 10.5"
        stroke="#0b0e14"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
