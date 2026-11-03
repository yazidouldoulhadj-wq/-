import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Sparkles, X, RefreshCw } from 'lucide-react';
import { NexusLogoStyle } from './NexusLogo';

interface NexusLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoUpdated?: (customUrl: string | null) => void;
}

export const NexusLogoModal: React.FC<NexusLogoModalProps> = ({
  isOpen,
  onClose,
  onLogoUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [currentCustomLogo, setCurrentCustomLogo] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('nexus_custom_logo');
      setCurrentCustomLogo(saved);
      setPreviewImage(saved);
      setErrorMsg(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle file selection (PNG, JPG, SVG, WebP, etc.)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide (PNG, JPG, SVG, WebP).');
      return;
    }

    // Limit to 5MB to preserve localStorage
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Le fichier est trop volumineux (maximum 5 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
    };
    reader.onerror = () => {
      setErrorMsg('Erreur lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  };

  // Handle URL submit
  const handleApplyUrl = () => {
    setErrorMsg(null);
    if (!urlInput.trim()) {
      setErrorMsg("Veuillez saisir l'URL d'une image.");
      return;
    }

    setPreviewImage(urlInput.trim());
  };

  // Save changes
  const handleSave = () => {
    if (previewImage) {
      try {
        localStorage.setItem('nexus_custom_logo', previewImage);
        window.dispatchEvent(new CustomEvent('nexus_logo_change', { detail: previewImage }));
        if (onLogoUpdated) onLogoUpdated(previewImage);
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setErrorMsg("Impossible d'enregistrer l'image dans le navigateur (taille trop grande).");
      }
    }
  };

  // Remove custom logo and revert to vector
  const handleRemoveCustomLogo = () => {
    localStorage.removeItem('nexus_custom_logo');
    window.dispatchEvent(new CustomEvent('nexus_logo_change', { detail: null }));
    setCurrentCustomLogo(null);
    setPreviewImage(null);
    setUrlInput('');
    if (onLogoUpdated) onLogoUpdated(null);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Select a preset vector style
  const handleSelectPreset = (styleId: NexusLogoStyle) => {
    localStorage.setItem('nexus_logo_style', styleId);
    localStorage.removeItem('nexus_custom_logo');
    window.dispatchEvent(new CustomEvent('nexus_logo_change', { detail: null }));
    window.dispatchEvent(new CustomEvent('nexus_logo_style_change', { detail: styleId }));
    if (onLogoUpdated) onLogoUpdated(null);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E4F6EB] text-[#19CC5B] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Mettre votre propre logo (NEXUS)
              </h3>
              <p className="text-xs text-slate-500">
                Personnalisez le logo de l'agence affiché en bas de page
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mt-4 mb-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Depuis vos fichiers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Lien URL direct</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Préréglages</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Success message */}
        {isSuccess && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-[#19CC5B]" />
            <span>Logo mis à jour avec succès !</span>
          </div>
        )}

        {/* TAB 1: FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-[#19CC5B] bg-emerald-50/40 hover:bg-emerald-50 rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#19CC5B]/20 text-[#158A3F] flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800">
                Cliquez pour choisir votre logo sur votre appareil
              </span>
              <span className="text-[11px] text-slate-500">
                Formats acceptés : PNG, JPG, SVG, WebP (fond transparent conseillé)
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: URL INPUT */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Collez l'adresse web (URL) de votre logo :
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/mon-logo.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#19CC5B]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3.5 py-2 rounded-xl bg-[#19CC5B] text-white text-xs font-bold hover:bg-[#158A3F] transition cursor-pointer"
              >
                Appliquer
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: VECTOR PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-2">
              Ou choisissez l'un des emblèmes vectoriels créés pour NEXUS :
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('cyber')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#19CC5B] bg-slate-50 hover:bg-emerald-50/50 text-left transition cursor-pointer"
              >
                <span className="block font-bold text-xs text-slate-800">Cyber Nexus</span>
                <span className="block text-[10px] text-slate-500">Obsidienne & néon</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('infinity')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#19CC5B] bg-slate-50 hover:bg-emerald-50/50 text-left transition cursor-pointer"
              >
                <span className="block font-bold text-xs text-slate-800">Infinity Node</span>
                <span className="block text-[10px] text-slate-500">Boucles infinies</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('minimal')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#19CC5B] bg-slate-50 hover:bg-emerald-50/50 text-left transition cursor-pointer"
              >
                <span className="block font-bold text-xs text-slate-800">Minimalist</span>
                <span className="block text-[10px] text-slate-500">Monogramme épuré</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('shield')}
                className="p-3 rounded-2xl border border-slate-200 hover:border-[#19CC5B] bg-slate-50 hover:bg-emerald-50/50 text-left transition cursor-pointer"
              >
                <span className="block font-bold text-xs text-slate-800">Shield Crest</span>
                <span className="block text-[10px] text-slate-500">Blason technologique</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Preview Card */}
        {previewImage && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
              Aperçu en direct dans le badge :
            </span>
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-emerald-100 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Aperçu logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-800">
                    CONCEPTION ET CRÉATION PAR NEXUS
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-medium">
                    Prêt à être enregistré
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveCustomLogo}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition cursor-pointer"
                title="Supprimer mon logo et réinitialiser"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {currentCustomLogo ? (
            <button
              type="button"
              onClick={handleRemoveCustomLogo}
              className="text-xs text-red-600 hover:text-red-700 font-bold transition cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">
              Enregistré localement
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Annuler
            </button>

            {previewImage && (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-[#19CC5B] hover:bg-[#158A3F] text-white text-xs font-extrabold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Enregistrer mon logo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
