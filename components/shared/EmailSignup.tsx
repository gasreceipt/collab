'use client';

import { useState } from 'react';
import { getTracker } from '@/lib/tracking';

interface EmailSignupProps {
  variant?: 'light' | 'dark';
  formType?: 'email_signup' | 'waitlist' | 'product_interest';
  placeholder?: string;
  buttonText?: string;
}

export default function EmailSignup({
  variant = 'light',
  formType = 'email_signup',
  placeholder = 'Enter your email',
  buttonText = 'Join Waitlist',
}: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      const tracker = getTracker();
      tracker.trackFormSubmission(formType, email);

      setStatus('success');
      setMessage('Thanks for signing up! Check your email.');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-4 py-3 rounded-md border transition-colors ${
            isDark
              ? 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-white/50'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark ? 'focus:ring-white/20' : 'focus:ring-gray-900'
          }`}
          data-track-id="email-input"
        />
        <button
          type="submit"
          className={`px-6 py-3 rounded-md font-medium transition-all transform hover:scale-105 ${
            isDark
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-black text-white hover:bg-gray-800'
          } email-signup cta`}
          data-track-id="email-submit"
        >
          {buttonText}
        </button>
      </form>

      {status !== 'idle' && (
        <p
          className={`mt-3 text-sm ${
            status === 'success'
              ? isDark
                ? 'text-green-400'
                : 'text-green-600'
              : isDark
              ? 'text-red-400'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
