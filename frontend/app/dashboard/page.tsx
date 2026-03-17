'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Domains } from '@/components/Domains';
import { Tasks } from '@/components/Tasks';
import { CommandPalette } from '@/components/CommandPalette';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Inbox, FolderKanban, Target, CheckSquare, ArrowRight, Command, Flame } from 'lucide-react';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  useKeyboardShortcuts({
    'n': () => { },
    'g': () => { },
  }, isConnected);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="mb-4 text-3xl sm:text-4xl font-bold">
                Connect Your Wallet
              </h1>
              <p className="mb-8 text-lg text-gray-400">
                Use Connect button in the navbar to access your personal dashboard
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CommandPalette />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Your Dashboard</h1>
              <p className="mt-2 text-gray-400">
                Your domains, projects, and tasks
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Command className="w-4 h-4" aria-hidden="true" />
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">K</kbd>
              <span>for commands</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <nav className="mb-8 grid gap-4 grid-cols-2 sm:grid-cols-4" aria-label="Quick links">
          <Link
            href="/inbox"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Inbox</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Uncaptured thoughts</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Domains</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Your biggest buckets</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">All Projects</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Active & archived</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
          <Link
            href="/experiments"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Experiments</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Quick explorations</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
        </nav>

        {/* Domains Section */}
        <Domains />

        {/* Tasks Section */}
        <section className="mt-8" aria-labelledby="dashboard-tasks-heading">
          <h2 id="dashboard-tasks-heading" className="text-xl font-bold mb-4">Recent Tasks</h2>
          <Tasks limit={10} />
        </section>
      </main>
    </div>
  );
}
