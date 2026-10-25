export interface SiteSettings {
  heroVideoUrl: string;
  heroPosterUrl: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroVideoUrl: '/rolex-watches-video.mp4',
  heroPosterUrl: '/hero-poster.jpg',
};

export function getSettings(): SiteSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  const stored = localStorage.getItem('site-settings');
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<SiteSettings>): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('site-settings', JSON.stringify(updated));
}
