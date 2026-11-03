import React, { useState, useEffect } from 'react';
import { Sparkles, Camera } from 'lucide-react';
import { NexusLogoModal } from './NexusLogoModal';

export type NexusLogoStyle = 'cyber' | 'infinity' | 'minimal' | 'shield';

interface NexusLogoProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  onOpenUploader?: () => void;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  className = 'w-6 h-6',
  size = 24,
  interactive = true,
  onOpenUploader,
}) => {
  const [style, setStyle] = useState<NexusLogoStyle>('cyber');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial read
    const savedCustom = localStorage.getItem('nexus_custom_logo');
    setCustomLogo(savedCustom);

    const savedStyle = localStorage.getItem('nexus_logo_style') as NexusLogoStyle;
    if (savedStyle && ['cyber', 'infinity', 'minimal', 'shield'].includes(savedStyle)) {
      setStyle(savedStyle);
    }

    // Event listener for real-time updates across components
    const handleLogoChange = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setCustomLogo(customEvent.detail ?? localStorage.getItem('nexus_custom_logo'));
    };

    const handleStyleChange = (e: Event) => {
      const customEvent = e as CustomEvent<NexusLogoStyle>;
      if (customEvent.detail) setStyle(customEvent.detail);
    };

    window.addEventListener('nexus_logo_change', handleLogoChange);
    window.addEventListener('nexus_logo_style_change', handleStyleChange);

    return () => {
      window.removeEventListener('nexus_logo_change', handleLogoChange);
      window.removeEventListener('nexus_logo_style_change', handleStyleChange);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    if (onOpenUploader) {
      onOpenUploader();
    } else {
      setIsModalOpen(true);
    }
  };

  const renderSvgContent = (currentStyle: NexusLogoStyle, svgSize: number) => {
    switch (currentStyle) {
      case 'cyber':
        return (
          <svg
            viewBox="0 0 64 64"
            width={svgSize}
            height={svgSize}
            className={`${className} shrink-0 transition-transform duration-300 group-hover:scale-105`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cyber-bg-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#051910" />
                <stop offset="50%" stopColor="#0B301D" />
                <stop offset="100%" stopColor="#020B06" />
              </linearGradient>
              <linearGradient id="cyber-blade-1-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="cyber-blade-2-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="50%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
              <linearGradient id="cyber-border-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            <rect
              x="3"
              y="3"
              width="58"
              height="58"
              rx="17"
              fill="url(#cyber-bg-nl)"
              stroke="url(#cyber-border-nl)"
              strokeWidth="2"
            />

            <path
              d="M17 45V19C17 17.3 18.3 16 20 16H23C24.7 16 26 17.3 26 19V38L18.5 45.5C17.7 46.2 17 45.8 17 45Z"
              fill="url(#cyber-blade-1-nl)"
            />

            <path
              d="M23 16.5L42 41.5C43.2 43 45 43.5 46.5 42.5L47 42V45C47 46.5 45.2 47.5 43.8 46.5L20.5 19.5C19.5 18.2 20.2 16.5 21.8 16.5H23Z"
              fill="url(#cyber-blade-2-nl)"
            />

            <path
              d="M47 19V45C47 46.7 45.7 48 44 48H41C39.3 48 38 46.7 38 45V26L45.5 18.5C46.3 17.8 47 18.2 47 19Z"
              fill="url(#cyber-blade-1-nl)"
            />

            <circle cx="32" cy="32" r="3.5" fill="#FFFFFF" />
            <circle cx="32" cy="32" r="2" fill="#22C55E" />
          </svg>
        );

      case 'infinity':
        return (
          <svg
            viewBox="0 0 64 64"
            width={svgSize}
            height={svgSize}
            className={`${className} shrink-0 transition-transform duration-300 group-hover:scale-105`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="inf-grad-1-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="inf-grad-2-nl" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            <circle cx="32" cy="32" r="28" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />

            <path
              d="M20 44V20C20 17 22.5 15 25.5 16.5L38.5 24C41.5 25.5 44 28 44 31V44C44 47 41.5 49 38.5 47.5L25.5 40C22.5 38.5 20 36 20 33Z"
              fill="url(#inf-grad-1-nl)"
              opacity="0.9"
            />
            <path
              d="M44 20V44C44 47 41.5 49 38.5 47.5L25.5 40C22.5 38.5 20 36 20 33V20C20 17 22.5 15 25.5 16.5L38.5 24C41.5 25.5 44 28 44 31Z"
              fill="url(#inf-grad-2-nl)"
              opacity="0.8"
            />
            <circle cx="32" cy="32" r="4" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
          </svg>
        );

      case 'minimal':
        return (
          <svg
            viewBox="0 0 64 64"
            width={svgSize}
            height={svgSize}
            className={`${className} shrink-0 transition-transform duration-300 group-hover:scale-105`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="min-grad-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#19CC5B" />
                <stop offset="100%" stopColor="#0E7032" />
              </linearGradient>
            </defs>
            <rect x="14" y="14" width="9" height="36" rx="4.5" fill="url(#min-grad-nl)" />
            <path
              d="M21 16L43 46C44.5 48 47 47 47 45V18.5C47 16 45 14 42.5 14H40C38 14 36.5 15 35 17L21 16Z"
              fill="url(#min-grad-nl)"
              opacity="0.9"
            />
            <rect x="41" y="14" width="9" height="36" rx="4.5" fill="url(#min-grad-nl)" />
            <circle cx="32" cy="32" r="3.5" fill="#19CC5B" />
          </svg>
        );

      case 'shield':
        return (
          <svg
            viewBox="0 0 64 64"
            width={svgSize}
            height={svgSize}
            className={`${className} shrink-0 transition-transform duration-300 group-hover:scale-105`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="shield-grad-nl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#158A3F" />
                <stop offset="100%" stopColor="#0B5226" />
              </linearGradient>
            </defs>
            <path
              d="M32 6L54 16V34C54 46.5 44.5 56 32 59C19.5 56 10 46.5 10 34V16L32 6Z"
              fill="url(#shield-grad-nl)"
              stroke="#22C55E"
              strokeWidth="2"
            />
            <path
              d="M24 43V21L32 17L40 21V43L32 47L24 43Z"
              fill="#FFFFFF"
              fillOpacity="0.15"
            />
            <path
              d="M26 39V25H29.5L34.5 33.5V25H38V39H34.5L29.5 30.5V39H26Z"
              fill="#FFFFFF"
            />
          </svg>
        );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title={interactive ? 'Cliquer pour mettre votre propre logo ou changer le style' : 'Logo NEXUS'}
        className={`group relative inline-flex items-center justify-center p-0.5 rounded-xl transition-all ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
      >
        {customLogo ? (
          <div
            className="rounded-xl overflow-hidden bg-white shadow-2xs border border-emerald-300 flex items-center justify-center p-0.5"
            style={{ width: size, height: size }}
          >
            <img
              src={customLogo}
              alt="Logo NEXUS personnalisé"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ) : (
          renderSvgContent(style, size)
        )}

        {interactive && (
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xs text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-2 h-2" />
          </span>
        )}
      </button>

      {/* Embedded Modal if used autonomously */}
      {isModalOpen && (
        <NexusLogoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLogoUpdated={(newLogo) => setCustomLogo(newLogo)}
        />
      )}
    </>
  );
};
