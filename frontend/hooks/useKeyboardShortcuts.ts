import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>, enabled = true) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = [
      e.metaKey && 'cmd',
      e.ctrlKey && 'ctrl',
      e.shiftKey && 'shift',
      e.altKey && 'alt',
      e.key.toLowerCase(),
    ].filter(Boolean).join('+');

    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key]();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
