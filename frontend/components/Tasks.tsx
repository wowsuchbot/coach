'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { AuthGuard } from '@/components/AuthGuard';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { useFormState } from '@/hooks/useFormState';
import { Plus, Clock, CheckSquare } from 'lucide-react';
import { button, input, card } from '@/lib/design-tokens';

type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'done';

interface Task {
  id: number;
  goal_id: number | null;
  title: string;
  description: string | null;
  priority: number;
  status: TaskStatus;
  created_at: string;
  due_date: string | null;
  completed_at: string | null;
  goal_title: string | null;
}

export function Tasks() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
    errors,
  } = useFormState({
    title: '',
    description: '',
    priority: 2,
    due_date: ''
  }, {
    validate: (data) => {
      const errs: Record<string, string> = {};
      if (!data.title.trim()) errs.title = 'Title is required';
      if (data.title.length > 100) errs.title = 'Title must be 100 characters or less';
      return errs;
    }
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const onSubmit = async (data: typeof formData) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create task');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(onSubmit, () => {
      setShowForm(false);
      fetchTasks();
      showToast('Task created successfully', 'success');
    });
    if (!success && errors._form) {
      showToast(errors._form, 'error');
    }
  };

  return (
    <section className={card.base} aria-labelledby="tasks-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="tasks-heading" className="text-xl font-semibold text-white">Pending Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="task-form"
          aria-label={showForm ? 'Cancel adding task' : 'Add new task'}
          className={`${button.primary} flex items-center gap-2`}
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add Task
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form 
          id="task-form"
          onSubmit={handleFormSubmit} 
          className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-4"
          aria-label="Create new task"
        >
          <div className="grid gap-4">
            <div>
              <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-gray-300">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`${input.base} ${errors.title ? input.error : ''}`}
                placeholder="Task title"
                required
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={input.base}
                rows={3}
                placeholder="Describe your task"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-gray-300">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={formData.priority}
                  onChange={(e) => updateField('priority', parseInt(e.target.value))}
                  className={input.base}
                >
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-due-date" className="mb-1 block text-sm font-medium text-gray-300">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => updateField('due_date', e.target.value)}
                  className={input.base}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={button.primary}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      )}

      <AuthGuard
        loading={<div className="text-center text-gray-400">Loading...</div>}
        fallback={<p className="text-gray-400">Connect your wallet to view your tasks</p>}
      >
        {loading ? (
          <div className="text-center text-gray-400" role="status" aria-live="polite">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="w-8 h-8 text-gray-500" />}
            title="No pending tasks"
            description="Add a task to get started! Tasks help you break down your goals into actionable steps."
            action={{
              label: 'Create your first task',
              onClick: () => setShowForm(true),
            }}
          />
        ) : (
          <ul className="space-y-3" role="list" aria-label="Tasks list">
            {tasks.map((task) => (
              <li key={task.id}>
                <article
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/tasks/${task.id}`)}
                  className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4 hover:bg-gray-800 cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                  aria-label={`Task: ${task.title}, Status: ${task.status.replace('_', ' ')}, Priority: ${task.priority === 1 ? 'high' : task.priority === 2 ? 'medium' : 'low'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white truncate">{task.title}</span>
                      {task.goal_title && (
                        <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300 flex-shrink-0">
                          {task.goal_title}
                        </span>
                      )}
                      <PriorityBadge priority={task.priority} />
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-400 truncate">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={task.status} />
                    <span className="text-gray-500" aria-hidden="true">→</span>
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
