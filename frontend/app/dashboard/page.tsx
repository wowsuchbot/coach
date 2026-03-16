'use client';


import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Goals } from '@/components/Goals';
import { Tasks } from '@/components/Tasks';
import { CommandPalette } from '@/components/CommandPalette';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Inbox, FolderKanban, Target, CheckSquare, ArrowRight, Command } from 'lucide-react';

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
                Use the Connect button in the navbar to access your personal dashboard
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
                Track your goals, tasks, and check-ins
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Command className="w-4 h-4" aria-hidden="true" />
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">K</kbd>
              <span>for commands</span>
            </div>
          </div>
        </div>

        {/* GTD Flow */}
        <section className="mb-8 rounded-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6" aria-labelledby="gtd-heading">
          <h2 id="gtd-heading" className="text-lg font-semibold mb-4">Getting Things Done Flow</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-base sm:text-lg">
            <Link 
              href="/inbox" 
              className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              aria-label="Inbox - Capture your thoughts"
            >
              <Inbox className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" aria-hidden="true" />
              <span className="font-medium">Inbox</span>
              <span className="text-xs text-gray-400">Capture</span>
            </Link>
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 hidden sm:block" aria-hidden="true" />
            <Link 
              href="/projects" 
              className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              aria-label="Projects - Organize your work"
            >
              <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" aria-hidden="true" />
              <span className="font-medium">Project</span>
              <span className="text-xs text-gray-400">Organize</span>
            </Link>
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 hidden sm:block" aria-hidden="true" />
            <div className="flex flex-col items-center gap-2">
              <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" aria-hidden="true" />
              <span className="font-medium">Task</span>
              <span className="text-xs text-gray-400">Engage</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-400 text-center">
            The act of categorizing IS the clarity. Everything starts in inbox.
          </p>
        </section>

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
            href="/projects"
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-purple-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Projects</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Active projects</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" aria-hidden="true" />
            </div>
          </Link>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Goals</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Personal & time-bound</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="font-medium flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-400 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Tasks</span>
                </h3>
                <p className="text-sm text-gray-400 truncate">Action items</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Goals categoryFilter="projects" />
          </div>
          <div>
            <Goals categoryFilter="personal" />
          </div>
          <div>
            <Goals categoryFilter="timebound" />
          </div>
        </div>
        <div className="mt-6">
          <Tasks />
        </div>
      </main>
    </div>
  );
}
