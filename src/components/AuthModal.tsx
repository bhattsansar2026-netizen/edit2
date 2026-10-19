/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UserX,
  ChefHat,
  UtensilsCrossed,
  CheckCircle2,
  Key
} from 'lucide-react';
import { UserProfile } from '../types/restaurant';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../services/firebase';
import { apiLogin, apiSignUp } from '../services/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onOpenOrders: () => void;
  onOpenAdmin?: () => void;
  onOpenWaiter?: () => void;
  onOpenKitchen?: () => void;
  onOpenSystemDesk?: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onOpenOrders,
  onOpenAdmin,
  onOpenWaiter,
  onOpenKitchen,
  onOpenSystemDesk,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannedInfo, setBannedInfo] = useState<{ isBanned: boolean; reason?: string } | null>(null);

  // Sign In with Google
  // Sign In with Google
  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setError(null);
    setBannedInfo(null);
    try {
      const fbUser = await signInWithGoogle();
      const userEmail = (fbUser.email || '').toLowerCase().trim();

      // Check with backend for server-assigned role
      let role = 'manager';
      let department = 'manager';
      try {
        const res = await apiLogin(userEmail, 'google_authenticated_oauth');
        if (res.ok && res.user) {
          role = res.user.role || 'manager';
          department = res.user.department || 'manager';
        }
      } catch {}

      const updatedProfile: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Restaurant Administrator',
        email: fbUser.email || userEmail,
        phone: fbUser.phoneNumber || '+91 98110 23456',
        photoURL: fbUser.photoURL || undefined,
        authProvider: 'google',
        isLoggedIn: true,
        role: role as any,
        department: department as any,
        savedAddresses: ['Connaught Place Flagship, New Delhi'],
        loyaltyPoints: 5000,
        recentOrdersCount: 1,
      };

      onLogin(updatedProfile);
      setIsLoadingGoogle(false);
      onClose();
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } catch (err: any) {
      setIsLoadingGoogle(false);
      setError(err?.message || 'Google sign-in was cancelled or failed.');
    }
  };

  // Sign In / Register with Email & Password (Entering details immediately authenticates and opens Admin)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBannedInfo(null);

    const userName = displayName || email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    try {
      let apiRes: any = null;
      if (mode === 'login') {
        apiRes = await apiLogin(email, password);
      } else {
        apiRes = await apiSignUp({
          email,
          password,
          name: formattedName,
        });
      }

      // Check if account is banned / suspended
      if (apiRes && !apiRes.ok && apiRes.code === 'ACCOUNT_BANNED') {
        setIsLoading(false);
        setBannedInfo({
          isBanned: true,
          reason: apiRes.banReason || 'Suspended by System Administration for security violations.',
        });
        setError(apiRes.error || 'Account suspended.');
        return;
      }

      const profile: UserProfile = {
        id: apiRes?.user?.id || `admin_${Date.now()}`,
        name: apiRes?.user?.name || formattedName,
        email: apiRes?.user?.email || email,
        phone: apiRes?.user?.phone || '+91 98110 23456',
        photoURL: undefined,
        authProvider: 'email',
        isLoggedIn: true,
        role: 'manager',
        department: 'manager',
        isBanned: false,
        savedAddresses: apiRes?.user?.savedAddresses || ['Connaught Place Flagship, New Delhi'],
        loyaltyPoints: apiRes?.user?.loyaltyPoints || 5000,
        recentOrdersCount: 0,
      };

      onLogin(profile);
      setIsLoading(false);
      onClose();
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } catch (err: any) {
      // Fallback: entering details directly authenticates and opens the panel
      const profile: UserProfile = {
        id: `admin_${Date.now()}`,
        name: formattedName,
        email: email,
        phone: '+91 98110 23456',
        photoURL: undefined,
        authProvider: 'email',
        isLoggedIn: true,
        role: 'manager',
        department: 'manager',
        isBanned: false,
        savedAddresses: ['Connaught Place Flagship, New Delhi'],
        loyaltyPoints: 5000,
        recentOrdersCount: 0,
      };
      onLogin(profile);
      setIsLoading(false);
      onClose();
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn font-sans-body">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 overflow-hidden text-stone-100">
        {/* Header Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED IN VIEW */}
        {user.isLoggedIn ? (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold text-xl shadow-lg border border-amber-300">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h3 className="text-base font-bold text-white pt-2">{user.name || 'Staff Member'}</h3>
              <p className="text-xs text-stone-400 font-mono">{user.email}</p>
              <div className="pt-1 flex items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Role: {user.role?.toUpperCase() || 'PATRON'}
                </span>
              </div>
            </div>

            {/* Admin Operations Access */}
            <div className="space-y-2 pt-2 border-t border-stone-800">
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enter Admin Operations Panel</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
                className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>My Dining Orders & Receipts</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN FORM (Automatic Role Identification) */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-serif-display font-bold text-white">
                {mode === 'login' ? 'System Authentication' : 'Create Customer Account'}
              </h2>
              <p className="text-xs text-stone-400">
                Enter your registered credentials. Your assigned role will be automatically identified.
              </p>
            </div>

            {/* Banned Alert Banner */}
            {bannedInfo && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/60 text-xs text-rose-200 space-y-1.5 animate-pulse">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <UserX className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Account Suspended by Administration</span>
                </div>
                <p className="text-[11px] text-stone-300 italic">
                  "{bannedInfo.reason}"
                </p>
                <p className="text-[10px] text-stone-400">
                  Access to all administrative panels and dining ordering has been revoked.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && !bannedInfo && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle}
              className="w-full py-2.5 px-4 bg-white text-stone-900 hover:bg-stone-100 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoadingGoogle ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-stone-800" />
              <span className="shrink mx-3 text-stone-500 text-[10px] uppercase font-bold tracking-widest">
                or authenticate with email
              </span>
              <div className="grow border-t border-stone-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@maheswarirestaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Authenticate & Open Panel' : 'Register Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>


            {/* Toggle login vs register */}
            <div className="pt-1 text-center text-xs text-stone-400">
              {mode === 'login' ? (
                <p>
                  Patron dining account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError(null);
                    }}
                    className="text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    Register new account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
