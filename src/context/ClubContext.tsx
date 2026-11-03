import React, { createContext, useContext, useState, useEffect } from 'react';
import { CLUB_META as INITIAL_META, CLUB_ACTIVITIES as INITIAL_ACTIVITIES, INITIAL_APPEALS } from '../data/clubData';
import { ActivityItem, UrgentAppeal } from '../types';

export interface PhoneNumberItem {
  label: string;
  raw: string;
  intl: string;
}

export interface ClubMetaState {
  name: string;
  shortName: string;
  location: string;
  addressFull: string;
  headerImage: string;
  logoImage: string;
  pwaIcon: string;
  facebookUrl: string;
  receptionHours: string;
  welcomeIntroAr: string;
  welcomeIntroFr: string;
  howToContributeAr: string;
  howToContributeFr: string;
  welcomeAudioEnabled: boolean;
  welcomeAudioUrlAr: string;
  welcomeAudioUrlFr: string;
  welcomeAudioVolume: number;
}

interface ClubContextType {
  clubMeta: ClubMetaState;
  phoneNumbers: PhoneNumberItem[];
  activities: ActivityItem[];
  appeals: UrgentAppeal[];
  adminPassword: string;
  updateClubMeta: (meta: Partial<ClubMetaState>) => void;
  updatePhoneNumbers: (phones: PhoneNumberItem[]) => void;
  updateActivities: (activities: ActivityItem[]) => void;
  updateAppeals: (appeals: UrgentAppeal[]) => void;
  updateAdminPassword: (newPass: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  META: 'rofaqaa_custom_meta',
  PHONES: 'rofaqaa_custom_phones',
  ACTIVITIES: 'rofaqaa_custom_activities',
  APPEALS: 'rofaqaa_custom_appeals',
  PASSWORD: 'rofaqaa_admin_password',
};

const DEFAULT_META: ClubMetaState = {
  name: INITIAL_META.name,
  shortName: INITIAL_META.shortName,
  location: INITIAL_META.location,
  addressFull: INITIAL_META.addressFull,
  headerImage: INITIAL_META.headerImage,
  logoImage: INITIAL_META.logoImage,
  pwaIcon: INITIAL_META.pwaIcon,
  facebookUrl: INITIAL_META.facebookUrl,
  receptionHours: INITIAL_META.receptionHours,
  welcomeIntroAr: 'نادي رفقاء الخير في بلدية حمادي بولاية بومرداس نادٍ تطوعي يُعنى بالعمل الخيري والإنساني والاجتماعي. يعرّفكم هذا التطبيق بأنشطة النادي وطرق التواصل معه والمساهمة في جهوده.',
  welcomeIntroFr: 'Le club caritatif « Rofaqaa El Kheir » de la commune de Hammadi (Boumerdès) est une association bénévole d\'action humanitaire et sociale. Cette application vous présente les activités du club, comment le contacter et participer à ses actions.',
  howToContributeAr: 'للاستلام والتبرعات، تواصل مع النادي أو توجّه مباشرة إلى مقره في بلدية حمادي.',
  howToContributeFr: 'Pour les dons et dépôts, contactez le club ou rendez-vous directement à son siège situé dans la commune de Hammadi.',
  welcomeAudioEnabled: true,
  welcomeAudioUrlAr: '/audio/welcome_ar.mp3',
  welcomeAudioUrlFr: '/audio/welcome_fr.mp3',
  welcomeAudioVolume: 0.9,
};

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubMeta, setClubMeta] = useState<ClubMetaState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.META);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.facebookUrl || parsed.facebookUrl.includes('facebook.com/search')) {
          parsed.facebookUrl = INITIAL_META.facebookUrl;
        }
        return {
          ...DEFAULT_META,
          ...parsed,
          welcomeAudioEnabled: parsed.welcomeAudioEnabled !== undefined ? parsed.welcomeAudioEnabled : true,
        };
      }
      return DEFAULT_META;
    } catch {
      return DEFAULT_META;
    }
  });

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHONES);
      const list = saved ? JSON.parse(saved) : INITIAL_META.phoneNumbers;
      return list.filter((p: PhoneNumberItem) => p.raw !== '0541384422');
    } catch {
      return INITIAL_META.phoneNumbers;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [appeals, setAppeals] = useState<UrgentAppeal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPEALS);
      return saved ? JSON.parse(saved) : INITIAL_APPEALS;
    } catch {
      return INITIAL_APPEALS;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PASSWORD) || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const updateClubMeta = (metaUpdate: Partial<ClubMetaState>) => {
    setClubMeta((prev) => {
      const next = { ...prev, ...metaUpdate };
      try {
        localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const updatePhoneNumbers = (newPhones: PhoneNumberItem[]) => {
    setPhoneNumbers(newPhones);
    try {
      localStorage.setItem(STORAGE_KEYS.PHONES, JSON.stringify(newPhones));
    } catch (e) {
      console.error(e);
    }
  };

  const updateActivities = (newActivities: ActivityItem[]) => {
    setActivities(newActivities);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(newActivities));
    } catch (e) {
      console.error(e);
    }
  };

  const updateAppeals = (newAppeals: UrgentAppeal[]) => {
    setAppeals(newAppeals);
    try {
      localStorage.setItem(STORAGE_KEYS.APPEALS, JSON.stringify(newAppeals));
    } catch (e) {
      console.error(e);
    }
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, newPass);
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = () => {
    setClubMeta(DEFAULT_META);
    setPhoneNumbers(INITIAL_META.phoneNumbers);
    setActivities(INITIAL_ACTIVITIES);
    setAppeals(INITIAL_APPEALS);
    setAdminPassword('admin123');
    try {
      localStorage.removeItem(STORAGE_KEYS.META);
      localStorage.removeItem(STORAGE_KEYS.PHONES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.APPEALS);
      localStorage.removeItem(STORAGE_KEYS.PASSWORD);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ClubContext.Provider
      value={{
        clubMeta,
        phoneNumbers,
        activities,
        appeals,
        adminPassword,
        updateClubMeta,
        updatePhoneNumbers,
        updateActivities,
        updateAppeals,
        updateAdminPassword,
        resetToDefaults,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
