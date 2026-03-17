'use client';

import { Globe, FolderKanban, Target, Flame } from 'lucide-react';

type GoalType = 'domain' | 'project' | 'practice' | 'experiment';

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const config: Record<string, { icon: any; label: string; className: string }> = {
    domain: {
      icon: Globe,
      label: 'Domain',
      className: 'bg-blue-900/50 text-blue-300 border border-blue-800'
    },
    project: {
      icon: FolderKanban,
      label: 'Project',
      className: 'bg-purple-900/50 text-purple-300 border border-purple-800'
    },
    practice: {
      icon: Target,
      label: 'Practice',
      className: 'bg-green-900/50 text-green-300 border border-green-800'
    },
    experiment: {
      icon: Flame,
      label: 'Experiment',
      className: 'bg-orange-900/50 text-orange-300 border border-orange-800'
    }
  };

  const cfg = config[type] || config.project;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${cfg.className}`}>
      <Icon className="w-3 h-3" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
