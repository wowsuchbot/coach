'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { PriorityBadge } from '@/components/StatusBadge';
import { useFormState } from '@/hooks/useFormState';
import { FolderKanban, Target, Clock, Plus, Flag } from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  created_at: string;
  updated_at: string;
  target_date: string | null;
}

interface GoalsProps {
  categoryFilter?: string;
}

export function Goals({ categoryFilter }: GoalsProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
    errors,
  } = useFormState({
    category: categoryFilter || '',
    title: '',
    description: '',
    priority: 1,
    target_date: ''
  }, {
    validate: (data) => {
      const errs: Record<string, string> = {};
      if (!data.title.trim()) errs.title = 'Title is required';
      if (data.title.length > 100) errs.title = 'Title must be 100 characters or less';
      if (data.target_date && new Date(data.target_date) < new Date()) {
        errs.target_date = 'Target date cannot be in the past';
      }
      return errs;
    }
  });

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      if (response.ok) {
        const data = await response.json();
        const filtered = categoryFilter 
          ? data.filter((g: Goal) => g.category === categoryFilter)
          : data;
        setGoals(filtered);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      showToast('Failed to load goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchGoals();
    } else {
      setLoading(false);
    }
  }, [isConnected, categoryFilter]);

  const onSubmit = async (data: typeof formData) => {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create goal');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(onSubmit, () => {
      setShowForm(false);
      fetchGoals();
      showToast('Goal created successfully', 'success');
    });
    if (!success && errors._form) {
      showToast(errors._form, 'error');
    }
  };

  const moveGoal = async (goalId: number, category: string) => {
    try {
      await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      });
      fetchGoals();
      showToast('Goal moved successfully', 'success');
    } catch {
      showToast('Failed to move goal', 'error');
    }
  };

  const title = categoryFilter 
    ? categoryFilter === 'projects' 
      ? 'Projects'
      : categoryFilter === 'personal'
      ? 'Personal'
      : categoryFilter === 'timebound'
      ? 'Time-Bound'
      : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)
    : 'Active Goals';

  return (
    <section className={card.base} aria-labelledby="goals-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="goals-heading" className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="goal-form"
          aria-label={showForm ? 'Cancel adding goal' : 'Add new goal'}
          className={`${button.primary} flex items-center gap-2`}
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Goal
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form 
          id="goal-form" 
          onSubmit={handleFormSubmit} 
          className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4"
          aria-label="Create new goal"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="goal-category" className="mb-1 block text-sm font-medium text-gray-300">
                Category
              </label>
              <input
                id="goal-category"
                type="text"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={`${input.base} ${errors.category ? input.error : ''}`}
                placeholder="e.g., work, personal, health"
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? 'category-error' : undefined}
              />
              {errors.category && (
                <p id="category-error" className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>
            <div>
              <label htmlFor="goal-priority" className="mb-1 block text-sm font-medium text-gray-300">
                Priority
              </label>
              <select
                id="goal-priority"
                value={formData.priority}
                onChange={(e) => updateField('priority', parseInt(e.target.value))}
                className={input.base}
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="goal-title" className="mb-1 block text-sm font-medium text-gray-300">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="goal-title"
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`${input.base} ${errors.title ? input.error : ''}`}
                placeholder="Goal title"
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="goal-description" className="mb-1 block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="goal-description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={input.base}
                rows={3}
                placeholder="Describe your goal"
              />
            </div>
            <div>
              <label htmlFor="goal-target-date" className="mb-1 block text-sm font-medium text-gray-300">
                Target Date
              </label>
              <input
                id="goal-target-date"
                type="date"
                value={formData.target_date}
                onChange={(e) => updateField('target_date', e.target.value)}
                className={`${input.base} ${errors.target_date ? input.error : ''}`}
                aria-invalid={!!errors.target_date}
                aria-describedby={errors.target_date ? 'target-date-error' : undefined}
              />
              {errors.target_date && (
                <p id="target-date-error" className="mt-1 text-sm text-red-400">{errors.target_date}</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={button.primary}
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      )}

      <AuthGuard
        loading={<div className="text-center text-gray-400">Loading...</div>}
        fallback={
          <p className="text-gray-400">Connect your wallet to view your goals</p>
        }
      >
        {loading ? (
          <div className="text-center text-gray-400" role="status" aria-live="polite">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-8 h-8 text-gray-500" />}
            title="No goals yet"
            description="Goals help you stay focused on what matters most. Create your first goal to get started."
            action={{
              label: 'Create your first goal',
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          <ul className="space-y-4" role="list" aria-label="Goals list">
            {goals.map((goal) => (
              <li key={goal.id}>
                <article
                  className="rounded-lg border border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => router.push(`/goals/${goal.id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && router.push(`/goals/${goal.id}`)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View goal: ${goal.title}`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
                          {goal.category || 'uncategorized'}
                        </span>
                        <PriorityBadge priority={goal.priority} />
                      </div>
                      <h3 className="mt-2 font-medium text-white">{goal.title}</h3>
                      {goal.description && (
                        <p className="mt-1 text-sm text-gray-400">{goal.description}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-3 flex-wrap">
                        <span>Created: {new Date(goal.created_at).toLocaleDateString()}</span>
                        {goal.target_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            Target: {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-gray-500 flex flex-col gap-2 items-end">
                      <button
                        onClick={() => router.push(`/goals/${goal.id}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        aria-label={`View details for ${goal.title}`}
                      >
                        View →
                      </button>
                      {!categoryFilter && (
                        <div className="flex gap-1" role="group" aria-label="Move goal to category">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveGoal(goal.id, 'projects'); }}
                            className="text-xs px-2 py-1 rounded bg-purple-900/30 text-purple-300 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Move to Projects"
                            title="Move to Projects"
                          >
                            <FolderKanban className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveGoal(goal.id, 'personal'); }}
                            className="text-xs px-2 py-1 rounded bg-green-900/30 text-green-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label="Move to Personal"
                            title="Move to Personal"
                          >
                            <Target className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveGoal(goal.id, 'timebound'); }}
                            className="text-xs px-2 py-1 rounded bg-orange-900/30 text-orange-300 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            aria-label="Move to Time-Bound"
                            title="Move to Time-Bound"
                          >
                            <Clock className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </AuthGuard>
    </section>
  );
}
