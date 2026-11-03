import React, { useEffect, useRef } from 'react';
import { useClub } from '../context/ClubContext';
import { Language } from '../types';

interface WelcomeVoiceAudioProps {
  currentLang: Language;
}

/**
 * Invisible welcome voice player.
 * Plays a warm, welcoming audio message upon entering the application.
 * Fully conforms to browser autoplay policies by attempting initial playback
 * and seamlessly activating on the very first user interaction (touch/tap/click) if blocked.
 * Has no visible UI elements ("qui ne sera pas visible").
 */
export const WelcomeVoiceAudio: React.FC<WelcomeVoiceAudioProps> = ({ currentLang }) => {
  const { clubMeta } = useClub();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Check if voice message is enabled in club settings
    if (!clubMeta.welcomeAudioEnabled) {
      return;
    }

    // Check if already played in this browser session
    const alreadyPlayed = sessionStorage.getItem('rofaqaa_welcome_audio_played');
    if (alreadyPlayed) {
      return;
    }

    const audioSrc =
      currentLang === 'fr'
        ? clubMeta.welcomeAudioUrlFr || '/audio/welcome_fr.mp3'
        : clubMeta.welcomeAudioUrlAr || '/audio/welcome_ar.mp3';

    const audio = audioRef.current || new Audio(audioSrc);
    audioRef.current = audio;
    audio.src = audioSrc;
    audio.volume = Math.max(0, Math.min(1, clubMeta.welcomeAudioVolume ?? 0.9));
    audio.preload = 'auto';

    let interactionListenersAttached = false;

    const markAsPlayed = () => {
      hasTriggeredRef.current = true;
      try {
        sessionStorage.setItem('rofaqaa_welcome_audio_played', 'true');
      } catch {
        // Ignore storage exceptions in private mode
      }
    };

    const attemptPlay = () => {
      if (hasTriggeredRef.current) return;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            markAsPlayed();
            cleanupInteractionListeners();
          })
          .catch((err) => {
            // Autoplay was blocked by browser policy (common in Chrome/Safari before user gesture)
            // Attach a one-time listener to start on the user's first tap/click anywhere
            attachInteractionListeners();
          });
      }
    };

    const onUserInteraction = () => {
      if (hasTriggeredRef.current) return;
      attemptPlay();
    };

    const attachInteractionListeners = () => {
      if (interactionListenersAttached) return;
      interactionListenersAttached = true;
      window.addEventListener('click', onUserInteraction, { once: true, passive: true });
      window.addEventListener('touchstart', onUserInteraction, { once: true, passive: true });
      window.addEventListener('pointerdown', onUserInteraction, { once: true, passive: true });
      window.addEventListener('keydown', onUserInteraction, { once: true, passive: true });
    };

    const cleanupInteractionListeners = () => {
      if (!interactionListenersAttached) return;
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('pointerdown', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      interactionListenersAttached = false;
    };

    // Short timeout to let the DOM settle before initial play attempt
    const timer = setTimeout(() => {
      attemptPlay();
    }, 400);

    return () => {
      clearTimeout(timer);
      cleanupInteractionListeners();
      if (audio) {
        audio.pause();
      }
    };
  }, [clubMeta.welcomeAudioEnabled, clubMeta.welcomeAudioUrlAr, clubMeta.welcomeAudioUrlFr, clubMeta.welcomeAudioVolume, currentLang]);

  // Completely invisible: no DOM element or completely hidden
  return (
    <audio
      ref={audioRef}
      className="hidden"
      aria-hidden="true"
      style={{ display: 'none', position: 'absolute', pointerEvents: 'none' }}
    />
  );
};
