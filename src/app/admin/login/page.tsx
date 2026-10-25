'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Demo authentication - in production, this would call an API
    // For now, we'll use a simple demo check
    if (email === 'admin@crownix.com' && password === 'admin123') {
      // Store admin session in localStorage (in production, use secure cookies)
      localStorage.setItem('admin-session', 'true');
      router.push('/admin');
    } else {
      setError('Invalid credentials. Use admin@crownix.com / admin123 for demo.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-64 h-32 mx-auto mb-4">
            <img
              src="/logo.png"
              alt="Gandhara Traders Company"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-light text-[#F5F5F5]">
            Admin <span className="font-semibold text-[#C7CBD0]">Login</span>
          </h1>
        </div>

        {/* Login Form */}
        <div className="bg-[#101010] rounded-xl p-8 border border-[#292929]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[#E50920]/10 border border-[#E50920] rounded-lg p-4">
                <p className="text-sm text-[#E50920]">{error}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@crownix.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#A6A6A6]">
              Demo credentials: admin@crownix.com / admin123
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
