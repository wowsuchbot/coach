'use client';

import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Goals } from '@/components/Goals';
import { FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="mb-4 text-2xl sm:text-4xl font-bold">Connect Your Wallet</h1>
              <p className="mb-8 text-lg text-gray-400">
                Use the Connect button to access your projects
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-purple-400" aria-hidden="true" />
            Projects
          </h1>
          <p className="mt-2 text-gray-400">
            Ongoing projects and long-term initiatives
          </p>
        </div>
        <Goals categoryFilter="projects" />
      </main>
    </div>
  );
}
