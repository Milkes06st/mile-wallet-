import React, { useState, useRef, useEffect } from 'react';
import { NetworkId } from '../types';
import { NETWORKS } from '../data/cryptoData';
import { NETWORK_FEES } from '../services/walletService';
import { Layers, ChevronDown, Check, Clock, Zap } from 'lucide-react';

interface NetworkDropdownProps {
  selectedNetwork: NetworkId;
  onSelectNetwork: (networkId: NetworkId) => void;
  availableNetworks?: NetworkId[];
  label?: string;
  showFeeDetails?: boolean;
  className?: string;
  id?: string;
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  selectedNetwork,
  onSelectNetwork,
  availableNetworks,
  label = 'Сеть блокчейна',
  showFeeDetails = true,
  className = '',
  id = 'network-dropdown',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = NETWORKS[selectedNetwork] || NETWORKS.TON;
  const activeFee = NETWORK_FEES[selectedNetwork];

  const networkList: NetworkId[] =
    availableNetworks && availableNetworks.length > 0
      ? availableNetworks
      : (['TON', 'TRC20', 'BEP20', 'ERC20', 'SOL', 'POLYGON', 'ARBITRUM', 'BTC'] as NetworkId[]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (netId: NetworkId) => {
    onSelectNetwork(netId);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef} id={id}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{label}</span>
          </label>
          {showFeeDetails && activeFee && (
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{activeFee.estimatedTime}</span>
            </span>
          )}
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#151c27] hover:bg-[#182130] border rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? 'border-sky-500 ring-1 ring-sky-500/30'
            : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
          </div>

          <div className="truncate">
            <span className="text-sm font-semibold text-white font-mono block leading-tight">
              {activeOption.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Протокол: {activeOption.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${activeOption.badgeColor}`}
          >
            {activeOption.badge}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-sky-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={`${id}-menu`}
          className="absolute z-50 left-0 right-0 mt-1.5 bg-[#121927] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          <div className="p-1.5 max-h-60 overflow-y-auto space-y-1 divide-y divide-slate-800/40">
            {networkList.map((netId) => {
              const opt = NETWORKS[netId];
              if (!opt) return null;
              const fee = NETWORK_FEES[netId];
              const isSelected = netId === selectedNetwork;

              return (
                <button
                  key={netId}
                  type="button"
                  id={`${id}-option-${netId}`}
                  onClick={() => handleSelect(netId)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border border-sky-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isSelected ? 'text-sky-400' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 text-sky-400" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                        <span>{opt.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${opt.badgeColor}`}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      {fee && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span>
                            Комиссия: {fee.feeAmount} {fee.feeCrypto}
                          </span>
                          <span>•</span>
                          <span>{fee.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {fee && fee.feeAmount === 0 && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                      <Zap className="w-3 h-3" /> 0%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
