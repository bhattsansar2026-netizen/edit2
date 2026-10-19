/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  UtensilsCrossed,
  Store,
  QrCode,
  ClipboardList,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import { DiningTable, UserProfile } from '../types/restaurant';

interface Props {
  activeSection?: string;
  cartCount: number;
  cartTotal: number;
  ordersCount: number;
  activeTable: string | null;
  user: UserProfile;
  onNavigateHome: () => void;
  onNavigateMenu: () => void;
  onOpenTable: () => void;
  onOpenOrders: () => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const BottomNavBar: React.FC<Props> = ({
  cartCount,
  cartTotal,
  ordersCount,
  activeTable,
  user,
  onNavigateHome,
  onNavigateMenu,
  onOpenTable,
  onOpenOrders,
  onOpenCart,
  onOpenAdmin,
}) => {
  return (
    <nav
      aria-label="Hotel Tablet & Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/98 backdrop-blur-md border-t border-amber-500/30 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] text-stone-100 select-none pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-4xl mx-auto px-1.5 sm:px-4 py-1 sm:py-1.5">
        <div className="grid grid-cols-6 gap-0.5 sm:gap-2 items-center">
          {/* 1. Home */}
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer group"
          >
            <Home className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-300 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight mt-0.5">
              Home
            </span>
          </button>

          {/* 2. Menu */}
          <button
            type="button"
            onClick={onNavigateMenu}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer group"
          >
            <UtensilsCrossed className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-300 group-hover:text-amber-400 transition-colors" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight mt-0.5">
              Menu
            </span>
          </button>

          {/* 3. Table / QR Scan */}
          <button
            type="button"
            onClick={onOpenTable}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer relative group"
          >
            <div className="relative">
              {activeTable ? (
                <Store className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-emerald-400" />
              ) : (
                <QrCode className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-300 group-hover:text-amber-400 transition-colors" />
              )}
              {activeTable && (
                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-stone-950 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight mt-0.5 truncate max-w-full">
              {activeTable ? (activeTable.startsWith('Table') ? activeTable : `T-${activeTable}`) : 'Table'}
            </span>
          </button>

          {/* 4. Orders */}
          <button
            type="button"
            onClick={onOpenOrders}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer relative group"
          >
            <div className="relative">
              <ClipboardList className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-stone-300 group-hover:text-amber-400 transition-colors" />
              {ordersCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-amber-400 text-stone-950 text-[9px] font-mono font-black rounded-full min-w-4 text-center shadow-md">
                  {ordersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight mt-0.5">
              Orders
            </span>
          </button>

          {/* 5. Cart / Bag */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-900/60 active:scale-95 transition-all cursor-pointer relative group"
          >
            <div className="relative">
              <ShoppingBag
                className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${
                  cartCount > 0 ? 'text-amber-400' : 'text-stone-300 group-hover:text-amber-400'
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-emerald-500 text-stone-950 text-[9px] font-mono font-black rounded-full min-w-4 text-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight mt-0.5 truncate max-w-full">
              {cartTotal > 0 ? `₹${cartTotal}` : 'Cart'}
            </span>
          </button>

          {/* 6. Admin Console */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-xl text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 active:scale-95 transition-all cursor-pointer group shadow-xs"
          >
            <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-xs font-bold tracking-tight mt-0.5 uppercase text-amber-300">
              Admin
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
