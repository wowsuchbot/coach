'use client';

import { useAccount } from 'wagmi';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
}

export function AuthGuard({ children, fallback, loading }: AuthGuardProps) {
  const { isConnected, isConnecting } = useAccount();

  if (isConnecting) {
    return (
      <>
        {loading || (
          <div className="animate-pulse text-gray-400 flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Connecting...
          </div>
        )}
      </>
    );
  }

  if (!isConnected) {
    return (
      <>
        {fallback || (
          <div className="text-gray-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect wallet to continue
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
