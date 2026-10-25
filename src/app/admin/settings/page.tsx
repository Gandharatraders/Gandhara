'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getSettings, saveSettings } from '@/lib/settings';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState('');
  const [heroPosterUrl, setHeroPosterUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      const settings = getSettings();
      setHeroVideoUrl(settings.heroVideoUrl);
      setHeroPosterUrl(settings.heroPosterUrl);
    }
  }, [router]);

  const handleSave = () => {
    saveSettings({ heroVideoUrl, heroPosterUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
          Store <span className="font-semibold text-[#C7CBD0]">Settings</span>
        </h1>
        <p className="text-[#A6A6A6] mb-8">
          Configure your store settings, hero video, and display options.
        </p>

        <div className="space-y-6">
          {/* Hero Video Settings */}
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <h2 className="text-xl font-light text-[#F5F5F5] mb-4">
              Hero Video
            </h2>
            <div className="space-y-4">
              <div className="bg-[#E50920]/10 border border-[#E50920]/30 rounded-lg p-4">
                <p className="text-sm text-[#E50920]">
                  ⚠️ Note: The current hero video files are placeholders. To see a video, add your video file to the <code className="bg-[#050505] px-2 py-1 rounded">public/</code> folder and update the URL below.
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  value={heroVideoUrl}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="/hero-video.mp4"
                  className="w-full bg-[#050505] border border-[#292929] rounded-lg px-4 py-3 text-[#F5F5F5] focus:outline-none focus:border-[#C7CBD0]"
                />
                <p className="text-xs text-[#666] mt-1">
                  Enter the path to your hero video file (e.g., /hero-video.mp4)
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Poster Image URL
                </label>
                <input
                  type="text"
                  value={heroPosterUrl}
                  onChange={(e) => setHeroPosterUrl(e.target.value)}
                  placeholder="/hero-poster.jpg"
                  className="w-full bg-[#050505] border border-[#292929] rounded-lg px-4 py-3 text-[#F5F5F5] focus:outline-none focus:border-[#C7CBD0]"
                />
                <p className="text-xs text-[#666] mt-1">
                  Enter the path to your poster image (e.g., /hero-poster.jpg)
                </p>
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#C7CBD0] text-[#050505] rounded-lg font-medium hover:bg-[#E5E9ED] transition-colors"
              >
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Additional Settings Placeholder */}
          <div className="bg-[#101010] rounded-xl p-12 border border-[#292929] text-center">
            <p className="text-[#A6A6A6]">Additional settings coming soon.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
