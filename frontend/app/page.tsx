'use client';

import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Inbox, FolderKanban, Target, CheckSquare, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="text-center max-w-2xl">
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold">
              Your Life Canvas
            </h1>
            <p className="mb-12 text-xl text-gray-400">
              Thoughts, ideas, questions, goals, projects, tasks — a space for everything that matters.
            </p>

            <div className="mb-16 rounded-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold">Getting Things Done Flow</h2>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-base sm:text-lg mb-6">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  <span className="font-medium">Inbox</span>
                  <span className="text-xs text-gray-400">Capture</span>
                </div>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 hidden sm:block" />
                <div className="flex flex-col items-center gap-2">
                  <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                  <span className="font-medium">Project</span>
                  <span className="text-xs text-gray-400">Organize</span>
                </div>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 hidden sm:block" />
                <div className="flex flex-col items-center gap-2">
                  <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                  <span className="font-medium">Task</span>
                  <span className="text-xs text-gray-400">Engage</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                The act of categorizing <span className="text-white font-medium">IS</span> clarity. Everything starts in inbox.
              </p>
            </div>

            {isConnected ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-lg"
                >
                  Open Dashboard
                </Link>
                <Link
                  href="/inbox"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
                >
                  Go to Inbox
                </Link>
              </div>
            ) : (
              <p className="text-lg text-gray-400">
                Connect your wallet to get started
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
