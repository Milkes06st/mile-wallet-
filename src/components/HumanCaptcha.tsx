import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Cpu, Loader2 } from 'lucide-react';

interface HumanCaptchaProps {
  onVerified: (captchaSolveDurationSeconds: number) => void;
  onReset?: () => void;
  isCompleted?: boolean;
}

export const HumanCaptcha: React.FC<HumanCaptchaProps> = ({
  onVerified,
  onReset,
  isCompleted = false,
}) => {
  // Stages: 'idle' -> 'scanning' -> 'challenge' -> 'verified'
  const [stage, setStage] = useState<'idle' | 'scanning' | 'challenge' | 'verified'>(
    isCompleted ? 'verified' : 'idle'
  );
  const [testProgress, setTestProgress] = useState<number>(0);
  const [testStatusText, setTestStatusText] = useState<string>('Проверка окружения...');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 5-character alphanumeric captcha
  const generateRandomCode = useCallback((): string => {
    // Exclude confusing characters like 0/O, 1/l/I
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Draw code onto canvas with authentic distortion and noise
  const renderCaptchaCanvas = useCallback((code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#131a26');
    grad.addColorStop(1, '#0e131d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Noise curved lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = [
        'rgba(56, 189, 248, 0.35)',
        'rgba(168, 85, 247, 0.35)',
        'rgba(34, 197, 94, 0.3)',
        'rgba(244, 63, 94, 0.3)',
      ][i % 4];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 20, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        width - Math.random() * 20,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with rotation, scaling and varying vibrant colors
    const charPalette = ['#38bdf8', '#a855f7', '#34d399', '#f43f5e', '#fbbf24', '#e2e8f0'];
    const charSpacing = (width - 40) / code.length;

    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = 24 + i * charSpacing;
      const y = height / 2 + (Math.random() * 8 - 4);
      const angle = (Math.random() * 36 - 18) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.font = `bold ${Math.floor(Math.random() * 5 + 24)}px 'Courier New', monospace, sans-serif`;
      ctx.fillStyle = charPalette[i % charPalette.length];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  }, []);

  // When stage switches to 'challenge', generate code & draw canvas
  useEffect(() => {
    if (stage === 'challenge') {
      const newCode = generateRandomCode();
      setCaptchaCode(newCode);
      setStartTime(Date.now());
      setTimeout(() => {
        renderCaptchaCanvas(newCode);
      }, 50);
    }
  }, [stage, generateRandomCode, renderCaptchaCanvas]);

  // Update canvas if code changes
  useEffect(() => {
    if (stage === 'challenge' && captchaCode) {
      renderCaptchaCanvas(captchaCode);
    }
  }, [captchaCode, stage, renderCaptchaCanvas]);

  // Handle clicking "[] Я человек"
  const handleStartVerification = () => {
    if (stage !== 'idle') return;
    setStage('scanning');
    setTestProgress(10);
    setTestStatusText('Анализ аппаратных сигнатур...');

    // Progress through scanning phases
    setTimeout(() => {
      setTestProgress(42);
      setTestStatusText('Проверка браузерной сессии...');
    }, 450);

    setTimeout(() => {
      setTestProgress(78);
      setTestStatusText('Тестирование сетевой энтропии...');
    }, 900);

    setTimeout(() => {
      setTestProgress(100);
      setTestStatusText('Генерация графического ключа...');
    }, 1350);

    setTimeout(() => {
      setStage('challenge');
    }, 1600);
  };

  // Refresh captcha code
  const handleRefreshCode = () => {
    const newCode = generateRandomCode();
    setCaptchaCode(newCode);
    setUserInput('');
    setHasError(false);
    setErrorMessage('');
    renderCaptchaCanvas(newCode);
  };

  // Validate user submission
  const handleValidateCaptcha = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) {
      setHasError(true);
      setErrorMessage('Пожалуйста, введите проверочные символы');
      return;
    }

    // Comparison is case-insensitive for smooth Telegram user experience
    if (userInput.trim().toLowerCase() === captchaCode.toLowerCase()) {
      const durationSeconds = Math.max(1, Math.round(((Date.now() - startTime) / 1000) * 10) / 10);
      setHasError(false);
      setErrorMessage('');
      setStage('verified');
      onVerified(durationSeconds);
    } else {
      setHasError(true);
      setErrorMessage('Неверный код с картинки. Код обновлен, попробуйте еще раз.');
      handleRefreshCode();
    }
  };

  const handleReset = () => {
    setStage('idle');
    setTestProgress(0);
    setUserInput('');
    setHasError(false);
    setErrorMessage('');
    if (onReset) onReset();
  };

  return (
    <div id="captcha-container" className="w-full bg-[#181d28] border border-[#262f40] rounded-2xl p-4 shadow-lg text-white">
      {/* Header Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Проверка безопасности
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Anti-Bot v3.2</span>
      </div>

      {/* STAGE 1: Checkbox "[] Я человек" */}
      {stage === 'idle' && (
        <button
          type="button"
          id="btn-i-am-human"
          onClick={handleStartVerification}
          className="w-full bg-[#11151e] hover:bg-[#141924] active:scale-[0.99] border border-[#2b3548] hover:border-sky-500/50 rounded-xl p-3.5 flex items-center justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md border-2 border-slate-500 group-hover:border-sky-400 flex items-center justify-center transition-colors bg-[#0b0e14]">
              {/* Empty box */}
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-white group-hover:text-sky-300 transition-colors">
                Я человек
              </span>
              <p className="text-[11px] text-slate-400">Нажмите для подтверждения</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-400 text-xs">
            <Cpu className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-[10px] uppercase font-mono">Verify</span>
          </div>
        </button>
      )}

      {/* STAGE 2: Scanning & Testing Animation ("типо теста") */}
      {stage === 'scanning' && (
        <div id="captcha-scanning" className="bg-[#11151e] border border-sky-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
            <span className="text-sm font-medium text-white">{testStatusText}</span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50 mb-2">
            <div
              className="bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${testProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Проверка биометрии и браузера</span>
            <span className="text-sky-400 font-semibold">{testProgress}%</span>
          </div>
        </div>
      )}

      {/* STAGE 3: Distorted Visual Alphanumeric Captcha with Refresh Button */}
      {stage === 'challenge' && (
        <form onSubmit={handleValidateCaptcha} className="space-y-3">
          <div className="bg-[#11151e] border border-[#2b3548] rounded-xl p-3">
            <div className="text-[11px] text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span>Введите символы с картинки:</span>
              <span className="text-[10px] text-slate-400">Буквы и цифры</span>
            </div>

            {/* Canvas Captcha Box + Refresh button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg overflow-hidden border border-slate-700/80 shadow-inner bg-slate-950 flex items-center justify-center relative">
                <canvas
                  ref={canvasRef}
                  width={220}
                  height={56}
                  className="w-full h-14 object-cover"
                />
              </div>

              <button
                type="button"
                id="btn-refresh-captcha"
                onClick={handleRefreshCode}
                title="Обновить код, если он не читаем"
                className="h-14 px-3.5 rounded-lg bg-[#1a2233] hover:bg-[#222d42] active:scale-95 border border-slate-700 text-sky-400 hover:text-sky-300 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-[9px] font-medium leading-tight">Обновить</span>
              </button>
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                id="input-captcha-code"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (hasError) setHasError(false);
                }}
                placeholder="Символы (например 7k9A)"
                className={`w-full bg-[#11151e] text-white font-mono text-base tracking-wider px-3.5 py-2.5 rounded-xl border ${
                  hasError
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                } outline-none placeholder:text-slate-500 transition-colors`}
              />
              <button
                type="submit"
                id="btn-check-captcha"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                Проверить
              </button>
            </div>

            {hasError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </form>
      )}

      {/* STAGE 4: Verified Success State */}
      {stage === 'verified' && (
        <div id="captcha-success" className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-semibold text-emerald-300">Капча успешно пройдена!</div>
              <div className="text-[11px] text-slate-400">Проверка на бота завершена. Можете активировать чек.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Сброс
          </button>
        </div>
      )}
    </div>
  );
};
