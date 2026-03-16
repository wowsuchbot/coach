'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { 
  Inbox, 
  FolderKanban, 
  LayoutDashboard, 
  Plus,
  CheckSquare,
  Flag
} from 'lucide-react';

interface CommandPaletteProps {
  onNewTask?: () => void;
  onNewGoal?: () => void;
}

export function CommandPalette({ onNewTask, onNewGoal }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const handleNewTask = useCallback(() => {
    onNewTask?.();
    setOpen(false);
  }, [onNewTask]);

  const handleNewGoal = useCallback(() => {
    onNewGoal?.();
    setOpen(false);
  }, [onNewGoal]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed inset-0 z-50"
      aria-label="Command palette"
    >
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className="relative mx-auto mt-[20vh] max-w-lg px-4">
        <Command className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-2 border-b border-gray-800 pb-2 mb-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Command.Input 
              placeholder="Search or type a command..." 
              className="w-full bg-transparent border-none outline-none text-white text-sm"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-gray-800 rounded">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-64 overflow-auto">
            <Command.Empty className="px-2 py-4 text-center text-gray-400 text-sm">
              No results found
            </Command.Empty>
            
            <Command.Group heading="Navigation" className="px-2">
              <Command.Item
                onSelect={() => navigate('/dashboard')}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
              >
                <LayoutDashboard className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/inbox')}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
              >
                <Inbox className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span>Inbox</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/projects')}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
              >
                <FolderKanban className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span>Projects</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Actions" className="px-2 mt-2">
              {onNewTask && (
                <Command.Item
                  onSelect={handleNewTask}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
                >
                  <Plus className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <span>New Task</span>
                  <kbd className="ml-auto text-xs text-gray-500">N</kbd>
                </Command.Item>
              )}
              {onNewGoal && (
                <Command.Item
                  onSelect={handleNewGoal}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
                >
                  <Flag className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <span>New Goal</span>
                  <kbd className="ml-auto text-xs text-gray-500">G</kbd>
                </Command.Item>
              )}
              <Command.Item
                onSelect={() => navigate('/inbox')}
                className="flex items-center gap-3 px-3 py-2 text-gray-300 rounded-md cursor-pointer aria-selected:bg-gray-800"
              >
                <CheckSquare className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <span>New Check-in</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
          
          <div className="flex items-center justify-between px-2 pt-2 border-t border-gray-800 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd>
              <span>select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">⌘K</kbd>
              <span>toggle</span>
            </span>
          </div>
        </Command>
      </div>
    </Command.Dialog>
  );
}
