'use client';

import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Goals } from '@/components/Goals';

export default function ProjectsPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">Connect Your Wallet</h1>
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-gray-400">
            Ongoing projects and long-term initiatives
          </p>
        </div>
        <Goals categoryFilter="projects" />
      </main>
    </div>
  );
}
