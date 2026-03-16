'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { UserInfo } from './UserInfo';
import { Inbox, FolderKanban, Target } from 'lucide-react';

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Coach - Home"
            >
              Coach
            </Link>
            {isConnected && (
              <ul className="flex items-center gap-4 text-sm" role="menubar">
                <li role="none">
                  <Link 
                    href="/inbox" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    role="menuitem"
                  >
                    <Inbox className="w-4 h-4" aria-hidden="true" />
                    <span>Inbox</span>
                  </Link>
                </li>
                <li role="none">
                  <Link 
                    href="/projects" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    role="menuitem"
                  >
                    <FolderKanban className="w-4 h-4" aria-hidden="true" />
                    <span>Projects</span>
                  </Link>
                </li>
                <li role="none">
                  <Link 
                    href="/dashboard" 
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    role="menuitem"
                  >
                    <Target className="w-4 h-4" aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isConnected && <UserInfo />}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
